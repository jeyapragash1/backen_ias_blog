// src/pages/SingleArticle.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaEye, FaComment } from 'react-icons/fa';
import api, { engagementAPI, commentsAPI } from '../services/api';

const SingleArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/articles/${slug}`);
        setArticle(response.data);
        setLikesCount(response.data.likesCount || 0);
        setViewCount(response.data.viewCount || 0);
        
        // Load comments
        const articleId = response.data.id || response.data._id;
        if (articleId) {
          try {
            setCommentsLoading(true);
            const commentsData = await commentsAPI.getArticleComments(articleId);
            setComments(commentsData || []);
          } catch (err) {
            console.error('Error loading comments:', err);
          } finally {
            setCommentsLoading(false);
          }
        }
        
        // Track view on page load
        try {
          const viewResult = await engagementAPI.recordView(slug);
          setViewCount(viewResult.viewCount);
        } catch (err) {
          console.error('Error recording view:', err);
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(err.response?.status === 404 ? 'Article not found' : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    try {
      const result = await engagementAPI.toggleLike(slug);
      setLiked(result.liked);
      setLikesCount(result.likesCount);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const articleId = article?.id || article?._id;
      if (!articleId) return;
      const created = await commentsAPI.createComment(
        articleId,
        newComment.trim(),
        'Guest',
        undefined
      );
      setComments([created, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Error creating comment:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A39C] mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">404 - Article Not Found</h1>
          <p className="text-slate-600 mb-6">{error || 'The article you are looking for does not exist.'}</p>
          <button 
            onClick={() => navigate(location.state?.from === 'dashboard' ? '/dashboard' : '/')}
            className="bg-[#00A39C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-16 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <button 
            onClick={() => navigate(location.state?.from === 'dashboard' ? '/dashboard' : '/')}
            className="text-[#00A39C] hover:text-teal-700 font-semibold mb-4 flex items-center gap-2"
          >
            ← Back to {location.state?.from === 'dashboard' ? 'Dashboard' : 'Home'}
          </button>
          
          <p className="font-semibold text-[#00A39C] mb-2">{article.category}</p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 mb-4 leading-tight">{article.title}</h1>
          
          <div className="flex items-center gap-4 text-gray-500 mb-8 border-b border-gray-200 pb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00A39C] to-teal-600 flex items-center justify-center text-white font-bold">
              {article.author?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="font-semibold text-slate-700">{article.author || 'Anonymous'}</p>
              <p className="text-sm">{new Date(article.createdAt).toLocaleDateString()} • {article.readingTime || '5 min read'}</p>
            </div>
            
            {/* Engagement stats */}
            <div className="ml-auto flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <FaEye size={14} />
                <span>{viewCount}</span>
              </div>
              <button
                onClick={handleLikeClick}
                className="flex items-center gap-1 font-semibold transition-colors"
              >
                {liked ? (
                  <>
                    <FaHeart size={16} className="text-red-500" />
                    <span className="text-red-500">{likesCount}</span>
                  </>
                ) : (
                  <>
                    <FaRegHeart size={16} className="text-gray-400 hover:text-red-500" />
                    <span className="text-gray-600">{likesCount}</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {article.featuredImage && (
            <img 
              src={article.featuredImage} 
              alt={article.title} 
              className="w-full h-auto max-h-[500px] object-cover rounded-lg mb-12 shadow-lg" 
            />
          )}
        </motion.div>
        
        {/* Short Description */}
        {article.shortDescription && (
          <div className="text-xl text-slate-600 mb-8 pb-8 border-b border-gray-200 italic">
            {article.shortDescription}
          </div>
        )}
        
        {/* Article Content */}
        <div className="prose lg:prose-xl max-w-none text-slate-700 whitespace-pre-wrap">
          {article.content}
        </div>
        
        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Author Info */}
        <div className="mt-16 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">About the Author</h3>
          <div className="flex items-center gap-4 bg-slate-100 p-6 rounded-lg">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00A39C] to-teal-600 flex items-center justify-center text-white font-bold text-2xl">
              {article.author?.charAt(0) || 'A'}
            </div>
            <div>
              <h4 className="font-bold text-xl text-slate-800">{article.author || 'Anonymous'}</h4>
              <p className="text-gray-500">{article.authorEmail || 'A passionate contributor to the IAS UWU Blog.'}</p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-16 border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Comments</h3>

          <form onSubmit={handleSubmitComment} className="space-y-4 mb-8">
            <textarea
              placeholder="Write your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-[#00A39C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Post Comment
            </button>
          </form>

          {commentsLoading ? (
            <p className="text-slate-600">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-slate-600">Be the first to comment.</p>
          ) : (
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-slate-800">{c.author || 'Guest'}</p>
                    <span className="text-xs text-slate-500">{new Date(c.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-700 whitespace-pre-wrap">{c.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SingleArticle;