from typing import Optional, List
from fastapi import APIRouter, HTTPException, Query, Depends
from app.db.mongo import get_db
from app.core.config import settings
from app.schemas.article import ArticleCreate, ArticleUpdate, ArticleOut
from app.api.dependencies import get_current_active_user, get_current_superuser
from app.schemas.user import UserInDB
from bson import ObjectId
from datetime import datetime
import re

router = APIRouter()

COLLECTION = lambda: get_db()[settings.articles_collection]


def serialize(doc: dict) -> dict:
    if not doc:
        return doc
    doc["_id"] = str(doc.get("_id"))
    return doc

def generate_slug(title: str) -> str:
    """Generate URL-friendly slug from title"""
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    return slug

def calculate_reading_time(content: str) -> str:
    """Calculate estimated reading time (200 words per minute)"""
    word_count = len(content.split())
    minutes = max(1, round(word_count / 200))
    return f"{minutes} min read"

@router.get("/", response_model=dict)
async def list_articles(
    category: Optional[str] = Query(default=None),
    featured: Optional[bool] = Query(default=None),
    status: Optional[str] = Query(default="approved"),  # Default show only approved
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    """List articles (public sees approved only, admins can see all)"""
    filt = {}
    if category and category != "All":
        filt["category"] = category
    if featured is not None:
        filt["isFeatured"] = featured
    if status:
        filt["status"] = status

    cursor = COLLECTION().find(filt).skip(skip).limit(limit).sort("createdAt", -1)
    items = [serialize(doc) async for doc in cursor]
    return {"items": items, "count": len(items)}


@router.get("/{slug}")
async def get_article(slug: str):
    doc = await COLLECTION().find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Article not found")
    return serialize(doc)


@router.post("/", response_model=ArticleOut, status_code=201)
async def create_article(
    payload: ArticleCreate,
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Create a new article (requires authentication)"""
    # Generate slug from title
    base_slug = generate_slug(payload.title)
    slug = base_slug
    
    # Ensure unique slug
    counter = 1
    while await COLLECTION().find_one({"slug": slug}):
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    # Calculate reading time
    reading_time = calculate_reading_time(payload.content)
    
    # Create article document
    now = datetime.utcnow()
    article_dict = {
        "slug": slug,
        "title": payload.title,
        "author": current_user.full_name or current_user.email.split('@')[0],
        "authorEmail": current_user.email,
        "authorId": current_user.id,
        "category": payload.category,
        "tags": payload.tags,
        "readingTime": reading_time,
        "featuredImage": str(payload.featuredImage) if payload.featuredImage else None,
        "shortDescription": payload.shortDescription,
        "content": payload.content,
        "status": "pending",  # All articles start as pending
        "isFeatured": False,
        "viewCount": 0,
        "likesCount": 0,
        "likes": [],  # Track likers by IP/session
        "createdAt": now,
        "updatedAt": now
    }
    
    res = await COLLECTION().insert_one(article_dict)
    created = await COLLECTION().find_one({"_id": res.inserted_id})
    created["id"] = str(created.pop("_id"))
    
    return ArticleOut(**created)


@router.get("/my/articles", response_model=dict)
async def get_my_articles(
    current_user: UserInDB = Depends(get_current_active_user),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    """Get current user's submitted articles"""
    # Debug: print user info
    print(f"DEBUG - Current user ID: {current_user.id}, Email: {current_user.email}")
    
    # Try to find articles by authorId OR authorEmail as fallback
    filt = {
        "$or": [
            {"authorId": current_user.id},
            {"authorEmail": current_user.email}
        ]
    }
    cursor = COLLECTION().find(filt).skip(skip).limit(limit).sort("createdAt", -1)
    items = [serialize(doc) async for doc in cursor]
    
    # Debug: print articles found
    print(f"DEBUG - Found {len(items)} articles")
    if items:
        print(f"DEBUG - First article authorId: {items[0].get('authorId')}, authorEmail: {items[0].get('authorEmail')}")
    
    return {"items": items, "count": len(items)}

@router.put("/{slug}")
async def update_article(
    slug: str,
    payload: ArticleUpdate,
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Update an article (author can edit own articles, admin can edit any)"""
    article = await COLLECTION().find_one({"slug": slug})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Check permissions
    if not current_user.is_superuser and article.get("authorId") != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this article")
    
    update = {k: v for k, v in payload.model_dump(exclude_unset=True).items()}

    # Convert Pydantic URL types to plain strings for Mongo compatibility
    if "featuredImage" in update and update["featuredImage"] is not None:
        update["featuredImage"] = str(update["featuredImage"])
    if not update:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    update["updatedAt"] = datetime.utcnow()
    
    res = await COLLECTION().find_one_and_update(
        {"slug": slug},
        {"$set": update},
        return_document=True,
    )
    return serialize(res)

@router.delete("/{slug}")
async def delete_article(
    slug: str,
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Delete an article (author can delete own articles, admin can delete any)"""
    article = await COLLECTION().find_one({"slug": slug})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Check permissions
    if not current_user.is_superuser and article.get("authorId") != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this article")
    
    res = await COLLECTION().delete_one({"slug": slug})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"deleted": True}

@router.patch("/{slug}/approve")
async def approve_article(
    slug: str,
    current_user: UserInDB = Depends(get_current_superuser)
):
    """Approve an article (admin only)"""
    res = await COLLECTION().find_one_and_update(
        {"slug": slug},
        {"$set": {"status": "approved", "updatedAt": datetime.utcnow()}},
        return_document=True,
    )
    if not res:
        raise HTTPException(status_code=404, detail="Article not found")
    return serialize(res)

@router.patch("/{slug}/reject")
async def reject_article(
    slug: str,
    current_user: UserInDB = Depends(get_current_superuser)
):
    """Reject an article (admin only)"""
    res = await COLLECTION().find_one_and_update(
        {"slug": slug},
        {"$set": {"status": "rejected", "updatedAt": datetime.utcnow()}},
        return_document=True,
    )
    if not res:
        raise HTTPException(status_code=404, detail="Article not found")
    return serialize(res)


@router.post("/{slug}/view")
async def track_view(slug: str):
    """Track article view (increment view count)"""
    article = await COLLECTION().find_one({"slug": slug})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    res = await COLLECTION().find_one_and_update(
        {"slug": slug},
        {"$inc": {"viewCount": 1}},
        return_document=True,
    )
    if not res:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"viewCount": res.get("viewCount", 0)}


@router.post("/{slug}/like")
async def toggle_like(slug: str, request_ip: str = None):
    """Toggle like on article (guest-friendly, tracked by IP/session)"""
    article = await COLLECTION().find_one({"slug": slug})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Use session-based identifier (IP or unique session ID)
    liker_id = request_ip or "anonymous"
    likes = article.get("likes", [])
    
    if liker_id in likes:
        # Unlike
        await COLLECTION().find_one_and_update(
            {"slug": slug},
            {"$pull": {"likes": liker_id}, "$inc": {"likesCount": -1}},
            return_document=True,
        )
        return {"liked": False, "likesCount": max(0, article.get("likesCount", 1) - 1)}
    else:
        # Like
        await COLLECTION().find_one_and_update(
            {"slug": slug},
            {"$push": {"likes": liker_id}, "$inc": {"likesCount": 1}},
            return_document=True,
        )
        return {"liked": True, "likesCount": article.get("likesCount", 0) + 1}


@router.get("/{slug}/stats")
async def get_article_stats(slug: str):
    """Get article stats (views, likes)"""
    article = await COLLECTION().find_one({"slug": slug})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    return {
        "viewCount": article.get("viewCount", 0),
        "likesCount": article.get("likesCount", 0),
    }
