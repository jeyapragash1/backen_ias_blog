// src/pages/Articles.jsx
import React, { useState, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard';
import { motion } from 'framer-motion';
import api from '../services/api';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedArticles();
  }, []);

  const fetchApprovedArticles = async () => {
    try {
      setLoading(true);
      // Fetch only approved articles
      const response = await api.get('/articles/', {
        params: { status: 'approved', limit: 100 }
      });
      setArticles(response.data.items);
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-16 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-extrabold text-slate-800">The Archive</h1>
          <p className="text-lg text-gray-500 mt-4 max-w-xl mx-auto">Explore our complete collection of approved articles, from deep dives into AI to the latest in web technology.</p>
        </motion.div>
        
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A39C] mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-600 text-lg">No approved articles yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {articles.map((article, index) => (
              <ArticleCard key={article.slug} article={article} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Articles;