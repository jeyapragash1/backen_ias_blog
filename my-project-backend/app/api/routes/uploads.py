from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import JSONResponse
from app.core.config import settings
import cloudinary
import cloudinary.uploader

router = APIRouter()

ALLOWED_CONTENT_TYPES = {"image/png", "image/jpeg", "image/jpg", "image/webp"}

@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file type")

    # Ensure Cloudinary is configured
    if not (settings.cloudinary_cloud_name and settings.cloudinary_api_key and settings.cloudinary_api_secret):
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Cloudinary is not configured on server")

    # Configure Cloudinary (idempotent)
    cloudinary.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret,
        secure=True,
    )

    # Upload to Cloudinary
    try:
        contents = await file.read()
        upload_result = cloudinary.uploader.upload(
            contents,
            folder="ias-uploads",
            resource_type="image",
            overwrite=False,
        )
        url = upload_result.get("secure_url") or upload_result.get("url")
        if not url:
            raise ValueError("No URL returned from Cloudinary")
        return JSONResponse({"url": url})
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Cloudinary upload failed: {exc}")
