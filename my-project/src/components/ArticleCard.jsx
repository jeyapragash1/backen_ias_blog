// src/components/ArticleCard.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaEye, FaComment } from 'react-icons/fa';
import { engagementAPI, commentsAPI } from '../services/api';

const ArticleCard = ({ article, index, onClick }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(article.likesCount || 0);
  const [viewCount, setViewCount] = useState(article.viewCount || 0);
  const [commentsCount, setCommentsCount] = useState(article.commentsCount || 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Refresh engagement counts for cards so they show latest numbers
    const fetchCounts = async () => {
      try {
        const stats = await engagementAPI.getStats(article.slug);
        if (stats?.viewCount !== undefined) setViewCount(stats.viewCount);
        if (stats?.likesCount !== undefined) setLikesCount(stats.likesCount);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }

      try {
        const articleId = article.id || article._id;
        if (!articleId) return;
        const list = await commentsAPI.getArticleComments(articleId);
        setCommentsCount(Array.isArray(list) ? list.length : 0);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    fetchCounts();
  }, [article]);

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const result = await engagementAPI.toggleLike(article.slug);
      setLiked(result.liked);
      setLikesCount(result.likesCount);
    } catch (err) {
      console.error('Error toggling like:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async () => {
    try {
      // Record a view when opening from the card modal
      const viewRes = await engagementAPI.recordView(article.slug);
      if (viewRes?.viewCount !== undefined) setViewCount(viewRes.viewCount);
    } catch (err) {
      console.error('Error recording view:', err);
    }

    onClick(article);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={handleOpen}
      className="cursor-pointer"
    >
      <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:shadow-[#00A39C]/20 hover:-translate-y-2">
        <div className="relative overflow-hidden">
          <img src={article.featuredImage} alt={article.title} className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <img src={article.authorImage} alt={article.author} className="w-8 h-8 rounded-full object-cover" />
            <div className="text-sm">
              <p className="font-semibold text-slate-700">{article.author}</p>
              <p className="text-gray-500">{article.date}</p>
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-[#00A39C] transition-colors h-14">{article.title}</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map(tag => (
              <span key={tag} className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">{tag}</span>
            ))}
          </div>
          
          {/* Engagement stats and like button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <FaEye size={14} />
                <span>{viewCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaComment size={14} />
                <span>{commentsCount}</span>
              </div>
            </div>
            <button
              onClick={handleLikeClick}
              disabled={loading}
              className="flex items-center gap-1 text-sm font-semibold transition-colors"
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
      </div>
    </motion.div>
  );
};
export default ArticleCard;