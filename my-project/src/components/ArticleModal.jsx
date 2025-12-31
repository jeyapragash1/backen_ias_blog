// src/components/ArticleModal.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { commentsAPI } from '../services/api';

const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalVariants = {
  hidden: { y: "50%", opacity: 0 },
  visible: { y: "0%", opacity: 1, transition: { type: 'spring', stiffness: 150, damping: 25 } },
};

const ArticleModal = ({ article, onClose }) => {
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      if (!article) return;
      const articleId = article.id || article._id;
      if (!articleId) {
        setComments([]);
        return;
      }
      try {
        setCommentsLoading(true);
        const data = await commentsAPI.getArticleComments(articleId);
        setComments(data || []);
      } catch (err) {
        console.error('Error loading comments:', err);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [article]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !article) return;
    const articleId = article.id || article._id;
    if (!articleId) return;
    try {
      const created = await commentsAPI.createComment(
        articleId,
        newComment.trim(),
        'Guest',
        undefined,
      );
      setComments([created, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Error creating comment:', err);
    }
  };

  if (!article) return null;
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 w-full h-full flex items-center justify-center z-50 p-4"
      variants={backdropVariants} initial="hidden" animate="visible" exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img src={article.featuredImage} alt={article.title} className="w-full h-80 object-cover rounded-t-2xl" />
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black transition-colors z-10">
            <FaTimes size={20} />
          </button>
        </div>
        <div className="p-8 md:p-12">
          <p className="font-semibold text-[#00A39C] mb-2">{article.category}</p>
          <h1 className="text-4xl font-extrabold text-slate-800 mb-4">{article.title}</h1>
          <p className="text-gray-500 mb-8">By <strong>{article.author}</strong> • Published on {article.date}</p>
          <div className="prose lg:prose-xl max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />

          <div className="mt-12 border-t border-slate-200 pt-8">
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
                  <div key={c.id || c._id} className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-slate-800">{c.author || 'Guest'}</p>
                      <span className="text-xs text-slate-500">{c.created_at || c.createdAt ? new Date(c.created_at || c.createdAt).toLocaleString() : ''}</span>
                    </div>
                    <p className="text-slate-700 whitespace-pre-wrap">{c.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default ArticleModal;