import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaEye, FaFileAlt, FaCheckCircle, FaClock, FaTimesCircle, FaPlus, FaEdit, FaTrash, FaCalendar, FaArrowLeft, FaComment } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api, { commentsAPI, profileAPI, uploadAPI } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [articles, setArticles] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({ full_name: '', bio: '' });
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '', confirm_password: '' });
  
  // Article creation form state
  const [newArticle, setNewArticle] = useState({
    title: '',
    category: 'Power Systems',
    tags: '',
    shortDescription: '',
    content: '',
    featuredImage: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [createImageUploading, setCreateImageUploading] = useState(false);

  // Edit article modal state
  const [editArticleModalOpen, setEditArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState({
    title: '',
    category: 'Power Systems',
    tags: '',
    shortDescription: '',
    content: '',
    featuredImage: ''
  });
  const [editingSlug, setEditingSlug] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [editImageUploading, setEditImageUploading] = useState(false);
  
  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'danger'
  });

  // Fetch user's data from backend
  useEffect(() => {
    // Wait for auth loading to complete
    if (authLoading) {
      return;
    }
    
    if (!user) {
      navigate('/login');
      return;
    }
    setAuthorName(user.full_name || user.email);
    setAuthorEmail(user.email);
    fetchMyArticles();
    fetchMyComments();
    fetchProfile();
  }, [user, authLoading, navigate]);

  const fetchMyArticles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/articles/my/articles');
      const items = response.data.items || [];

      // Enrich with fresh engagement counts (views, likes, comments)
      const itemsWithCounts = await Promise.all(items.map(async (article) => {
        const articleId = article.id || article._id;
        let commentsCount = article.commentsCount || 0;
        try {
          if (articleId) {
            const list = await commentsAPI.getArticleComments(articleId);
            commentsCount = Array.isArray(list) ? list.length : 0;
          }
        } catch (err) {
          console.error('Error fetching comments count:', err);
        }

        return {
          ...article,
          viewCount: article.viewCount || 0,
          likesCount: article.likesCount || 0,
          commentsCount,
        };
      }));

      setArticles(itemsWithCounts);
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = (slug) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Article',
      message: 'Are you sure you want to delete this article? This action cannot be undone.',
      type: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/articles/${slug}`);
          setArticles(articles.filter(a => a.slug !== slug));
          showSuccess('Article deleted successfully.');
        } catch (err) {
          showError('Failed to delete article. Please try again.');
        }
      }
    });
  };

  const openEditArticle = (article) => {
    setEditingSlug(article.slug);
    setEditingArticle({
      title: article.title || '',
      category: article.category || 'Power Systems',
      tags: Array.isArray(article.tags) ? article.tags.join(', ') : (article.tags || ''),
      shortDescription: article.shortDescription || '',
      content: article.content || '',
      featuredImage: article.featuredImage || ''
    });
    setEditArticleModalOpen(true);
  };

  const handleUpdateArticle = async (e) => {
    e.preventDefault();

    if (!editingArticle.title.trim()) {
      showWarning('Please enter article title');
      return;
    }
    if (!editingArticle.shortDescription.trim()) {
      showWarning('Please enter short description');
      return;
    }
    if (!editingArticle.content.trim()) {
      showWarning('Please enter article content');
      return;
    }
      if (!editingArticle.featuredImage.trim()) {
        showWarning('Please upload or provide a featured image');
        return;
      }

    try {
      setUpdating(true);

      const tagsArray = (editingArticle.tags || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const update = {
        title: editingArticle.title,
        category: editingArticle.category,
        tags: tagsArray,
        shortDescription: editingArticle.shortDescription,
        content: editingArticle.content,
          featuredImage: editingArticle.featuredImage?.trim() || null
      };

        if (!update.featuredImage) {
          showWarning('Please upload or provide a featured image');
          setUpdating(false);
          return;
        }
      try {
        await api.put(`/articles/${editingSlug}/`, update);
      } catch (err) {
        // Some backends use PATCH; retry once if PUT not allowed
        if (err.response?.status === 405 || err.response?.status === 404) {
          await api.patch(`/articles/${editingSlug}/`, update);
        } else {
          throw err;
        }
      }

      // Refresh list to reflect any slug or status changes
      await fetchMyArticles();

      showSuccess('Article updated successfully.');
      setEditArticleModalOpen(false);
      setEditingSlug(null);
    } catch (err) {
      console.error('Error updating article:', err.response?.data || err.message);
      const detail = err.response?.data?.detail || err.response?.data?.message;
      showError(detail || 'Failed to update article. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const fetchMyComments = async () => {
    try {
      setCommentsLoading(true);
      const data = await commentsAPI.getMyComments();
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
      showError(err.response?.data?.detail || 'Failed to load comments');
    } finally {
      setCommentsLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const data = await profileAPI.getProfile();
      setProfileData({
        full_name: data.full_name || '',
        bio: data.bio || ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleDeleteComment = (commentId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Comment',
      message: 'Are you sure you want to delete this comment? This action cannot be undone.',
      type: 'danger',
      onConfirm: async () => {
        try {
          await commentsAPI.deleteComment(commentId);
          setComments(comments.filter(c => c.id !== commentId));
          showSuccess('Comment deleted successfully.');
        } catch (err) {
          showError('Failed to delete comment. Please try again.');
        }
      }
    });
  };

  const uploadFeaturedImage = async (file, mode = 'create') => {
    if (!file) return;
    const setFlag = mode === 'edit' ? setEditImageUploading : setCreateImageUploading;
    try {
      setFlag(true);
      const data = await uploadAPI.uploadImage(file);
      const url = data.url || data.path || '';
      if (!url) throw new Error('Upload failed');
      if (mode === 'edit') {
        setEditingArticle(prev => ({ ...prev, featuredImage: url }));
      } else {
        setNewArticle(prev => ({ ...prev, featuredImage: url }));
      }
      showSuccess('Image uploaded');
    } catch (err) {
      console.error('Image upload error:', err);
      showError('Failed to upload image. Please try again.');
    } finally {
      setFlag(false);
    }
  };

  const handleArticleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArticle(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newArticle.title.trim()) {
      showWarning('Please enter article title');
      return;
    }
    if (!newArticle.shortDescription.trim()) {
      showWarning('Please enter short description');
      return;
    }
    if (!newArticle.content.trim()) {
      showWarning('Please enter article content');
      return;
    }
    if (!newArticle.featuredImage.trim()) {
      showWarning('Please upload or provide a featured image');
      return;
    }

    try {
      setSubmitting(true);
      
      // Parse tags from comma-separated string
      const tagsArray = newArticle.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const articleData = {
        title: newArticle.title,
        category: newArticle.category,
        tags: tagsArray,
        shortDescription: newArticle.shortDescription,
        content: newArticle.content,
        featuredImage: newArticle.featuredImage.trim()
      };

      const response = await api.post('/articles/', articleData);
      
      showSuccess('Article submitted successfully! It will be reviewed by admin before publication.');
      
      // Reset form
      setNewArticle({
        title: '',
        category: 'Power Systems',
        tags: '',
        shortDescription: '',
        content: '',
        featuredImage: ''
      });
      
      // Refresh articles list
      fetchMyArticles();
      
      // Switch to articles tab
      setActiveTab('articles');
    } catch (err) {
      console.error('Error creating article:', err);
      showError(err.response?.data?.detail || 'Failed to create article. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await profileAPI.updateProfile(profileData);
      showSuccess('Profile updated successfully!');
      const userData = await profileAPI.getProfile();
      setAuthorName(userData.full_name || userData.email);
    } catch (err) {
      showError('Failed to update profile. Please try again.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      showWarning('New passwords do not match');
      return;
    }
    try {
      await profileAPI.changePassword(passwordData.current_password, passwordData.new_password);
      showSuccess('Password changed successfully!');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to change password');
    }
  };

  // Calculate stats from real data
  const stats = [
    { label: 'Total Articles', value: articles.length, icon: FaFileAlt, color: 'from-blue-500 to-blue-600' },
    { label: 'Approved', value: articles.filter(a => a.status === 'approved').length, icon: FaCheckCircle, color: 'from-green-500 to-green-600' },
    { label: 'Pending', value: articles.filter(a => a.status === 'pending').length, icon: FaClock, color: 'from-amber-400 to-amber-500' },
    { label: 'Rejected', value: articles.filter(a => a.status === 'rejected').length, icon: FaTimesCircle, color: 'from-red-500 to-red-600' },
  ];



  // Overview Tab
  const renderOverview = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#00A39C] to-teal-600 text-white rounded-2xl p-8 shadow-xl"
      >
        <h1 className="text-4xl font-bold mb-2">Welcome back, {authorName}!</h1>
        <p className="text-lg opacity-90">Here's how your articles are performing.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all"
          >
            <div className={`inline-block p-3 rounded-lg bg-gradient-to-r ${stat.color} mb-4`}>
              <stat.icon className="text-2xl text-white" />
            </div>
            <h3 className="text-slate-600 text-sm font-semibold mb-1">{stat.label}</h3>
            <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Pipeline</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-green-500"></span> Approved</span>
              <span>{articles.filter(a => a.status === 'approved').length}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span> Pending</span>
              <span>{articles.filter(a => a.status === 'pending').length}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-red-500"></span> Rejected</span>
              <span>{articles.filter(a => a.status === 'rejected').length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {loading ? (
              <p className="text-slate-500">Loading activity...</p>
            ) : articles.length === 0 ? (
              <p className="text-slate-500">No articles yet.</p>
            ) : (
              articles.slice(0, 4).map((article) => (
                <div key={article._id} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate max-w-xs">{article.title}</p>
                    <p className="text-xs text-slate-500">{article.category} • {new Date(article.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                    article.status === 'approved' ? 'bg-green-100 text-green-700' :
                    article.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {article.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Comments Snapshot</h3>
          <div className="space-y-3 text-sm text-slate-700">
            <div className="flex items-center justify-between font-semibold">
              <span>Total comments</span>
              <span>{comments.length}</span>
            </div>
            <p className="text-slate-500 text-xs">Comments you’ve written across the site.</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Articles</h2>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-slate-600">Loading articles...</div>
          ) : articles.length === 0 ? (
            <div className="text-center py-8 text-slate-600">No articles yet. Create your first article!</div>
          ) : (
            articles.slice(0, 3).map((article) => (
              <div key={article._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 mb-1">{article.title}</h3>
                  <p className="text-sm text-slate-600">{article.category} • {new Date(article.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-6 ml-4">
                  <div className="text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      article.status === 'approved' ? 'bg-green-100 text-green-700' : 
                      article.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {article.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );

  // Articles Tab
  const renderArticles = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">My Articles</h1>
        <button
          onClick={() => setActiveTab('create')}
          className="flex items-center gap-2 bg-[#00A39C] text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold"
        >
          <FaPlus /> New Article
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b-2 border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Views</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Likes</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Comments</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-slate-600">Loading articles...</td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-slate-600">No articles yet. Create your first article!</td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{article.title}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{article.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      article.status === 'approved' ? 'bg-green-100 text-green-700' : 
                      article.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-800 font-semibold">{article.viewCount ?? 0}</td>
                  <td className="px-6 py-4 text-slate-800 font-semibold">{article.likesCount ?? 0}</td>
                  <td className="px-6 py-4 text-slate-800 font-semibold">{article.commentsCount ?? 0}</td>
                  <td className="px-6 py-4 text-slate-600">{new Date(article.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/article/${article.slug}`, { state: { from: 'dashboard' } })}
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button 
                        onClick={() => openEditArticle(article)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteArticle(article.slug)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Create Article Tab
  const renderCreateArticle = () => (
    <div className="max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Create New Article</h1>
        <form onSubmit={handleCreateArticle} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Article Title *</label>
            <input 
              type="text" 
              name="title"
              value={newArticle.title}
              onChange={handleArticleInputChange}
              placeholder="Enter article title" 
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
              <select 
                name="category"
                value={newArticle.category}
                onChange={handleArticleInputChange}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none"
                required
              >
                <option>Power Systems</option>
                <option>IoT</option>
                <option>AI & ML</option>
                <option>Web Dev</option>
                <option>Cybersecurity</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tags (comma separated)</label>
              <input 
                type="text" 
                name="tags"
                value={newArticle.tags}
                onChange={handleArticleInputChange}
                placeholder="e.g., renewable, energy, grid" 
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-slate-700">Featured Image *</label>
              {createImageUploading && <span className="text-xs text-slate-500">Uploading...</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3">
              <input 
                type="url" 
                name="featuredImage"
                value={newArticle.featuredImage}
                onChange={handleArticleInputChange}
                placeholder="https://example.com/image.jpg or use Upload"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none" 
                required
              />
              <label className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer text-sm font-semibold text-slate-700">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => uploadFeaturedImage(e.target.files?.[0], 'create')}
                />
                {createImageUploading ? 'Uploading...' : 'Upload Image'}
              </label>
            </div>
            <p className="text-xs text-slate-500">Paste a URL or upload from your device. Required for publication.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Short Description *</label>
            <textarea 
              name="shortDescription"
              value={newArticle.shortDescription}
              onChange={handleArticleInputChange}
              placeholder="Brief summary of your article (max 200 characters)" 
              rows="3" 
              maxLength="200"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none"
              required
            ></textarea>
            <p className="text-xs text-slate-500 mt-1">{newArticle.shortDescription.length}/200 characters</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Article Content *</label>
            <textarea 
              name="content"
              value={newArticle.content}
              onChange={handleArticleInputChange}
              placeholder="Write your article content here..." 
              rows="10" 
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none"
              required
            ></textarea>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Your article will be submitted for admin review. Once approved, it will be published on the website.
            </p>
          </div>

          <div className="flex gap-4">
            <button 
              type="submit" 
              disabled={submitting}
              className="bg-[#00A39C] text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit for Review'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                setConfirmModal({
                  isOpen: true,
                  title: 'Clear Form',
                  message: 'Are you sure? All unsaved changes will be lost.',
                  type: 'warning',
                  onConfirm: () => {
                    setNewArticle({
                      title: '',
                      category: 'Power Systems',
                      tags: '',
                      shortDescription: '',
                      content: '',
                      featuredImage: ''
                    });
                  }
                });
              }}
              className="bg-slate-200 text-slate-800 px-8 py-3 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
            >
              Clear Form
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );

  // Edit Article Modal
  const renderEditArticleModal = () => (
    <>
      {editArticleModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 md:p-6 overflow-y-auto"
          onClick={() => setEditArticleModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl p-6 md:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEditArticleModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-700"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Edit Article</h2>
              <p className="text-sm text-slate-500 mt-1">Update your article details and save changes.</p>
            </div>

            <form onSubmit={handleUpdateArticle} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                  <select
                    value={editingArticle.category}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none"
                    required
                  >
                    <option>Power Systems</option>
                    <option>IoT</option>
                    <option>AI & ML</option>
                    <option>Web Dev</option>
                    <option>Cybersecurity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={editingArticle.tags}
                    onChange={(e) => setEditingArticle({ ...editingArticle, tags: e.target.value })}
                    placeholder="comma separated"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-slate-700">Featured Image *</label>
                  {editImageUploading && <span className="text-xs text-slate-500">Uploading...</span>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3">
                  <input
                    type="url"
                    value={editingArticle.featuredImage}
                    onChange={(e) => setEditingArticle({ ...editingArticle, featuredImage: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none"
                    required
                  />
                  <label className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer text-sm font-semibold text-slate-700">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => uploadFeaturedImage(e.target.files?.[0], 'edit')}
                    />
                    {editImageUploading ? 'Uploading...' : 'Upload Image'}
                  </label>
                </div>
                <p className="text-xs text-slate-500 mt-1">Paste a URL or upload from your device. Required for publication.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Short Description *</label>
                <textarea
                  rows="3"
                  value={editingArticle.shortDescription}
                  onChange={(e) => setEditingArticle({ ...editingArticle, shortDescription: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Content *</label>
                <textarea
                  rows="8"
                  value={editingArticle.content}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col md:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditArticleModalOpen(false)}
                  className="w-full md:w-1/2 px-4 py-3 rounded-lg font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full md:w-1/2 px-4 py-3 rounded-lg font-semibold text-white bg-[#00A39C] hover:bg-teal-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  {updating ? 'Updating...' : 'Update Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  // Analytics Tab
  const renderAnalytics = () => (

    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Analytics</h1>
      {/* Views by Day calculation and Top Articles */}
      {(() => {
        // Calculate daily views for the current month
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const dailyViews = Array.from({ length: daysInMonth }, (_, i) => ({ day: String(i + 1), views: 0 }));
        articles.forEach(article => {
          if (!article.createdAt || typeof article.viewCount !== 'number') return;
          const created = new Date(article.createdAt);
          if (created.getFullYear() === year && created.getMonth() === month) {
            const day = created.getDate();
            dailyViews[day - 1].views += article.viewCount;
          }
        });

        return (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-slate-800 mb-4">Views This Month</h2>
                <div className="h-64 w-full bg-gradient-to-b from-teal-100 to-teal-50 rounded-lg flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyViews} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" label={{ value: 'Day', position: 'insideBottomRight', offset: -5 }} />
                      <YAxis label={{ value: 'Views', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="views" stroke="#00A39C" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-slate-800 mb-4">Top Articles</h2>
                <div className="space-y-4">
                  {articles.map((article, index) => (
                    <div key={article.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-[#00A39C]">{index + 1}</span>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{article.title}</p>
                          <p className="text-xs text-gray-500">{article.category}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-800">{article.views}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        );
      })()}
    </div>
  );

  // Comments Tab
  const renderComments = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">My Comments</h1>
      
      <div className="space-y-4">
        {commentsLoading ? (
          <div className="text-center py-8 text-slate-600">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <FaComment className="mx-auto text-6xl text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No comments yet</h3>
            <p className="text-slate-500">Your comments on articles will appear here</p>
          </div>
        ) : (
          comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-slate-800">You commented</h3>
                  <p className="text-sm text-gray-500">Article ID: {comment.article_id}</p>
                </div>
                <span className="text-xs text-gray-500">{comment.created_at ? new Date(comment.created_at).toLocaleDateString() : '-'}</span>
              </div>
              <p className="text-slate-700 mb-4">{comment.content}</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );

  // Settings Tab
  const renderSettings = () => (
    <div className="max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 space-y-6"
      >
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>

        <form onSubmit={handleProfileUpdate} className="border-t pt-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input 
                type="text" 
                value={profileData.full_name} 
                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input 
                type="email" 
                value={authorEmail} 
                disabled
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg bg-slate-100 cursor-not-allowed" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
              <textarea 
                placeholder="Tell us about yourself..." 
                rows="4" 
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none"
              ></textarea>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button type="submit" className="bg-[#00A39C] text-white px-8 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors">
              Save Profile
            </button>
          </div>
        </form>

        <form onSubmit={handlePasswordChange} className="border-t pt-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Change Password</h2>
          <div className="space-y-4">
            <input 
              type="password" 
              placeholder="Current password" 
              value={passwordData.current_password}
              onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none" 
            />
            <input 
              type="password" 
              placeholder="New password" 
              value={passwordData.new_password}
              onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none" 
            />
            <input 
              type="password" 
              placeholder="Confirm new password" 
              value={passwordData.confirm_password}
              onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none" 
            />
          </div>
          <div className="flex gap-4 mt-6">
            <button type="submit" className="bg-[#00A39C] text-white px-8 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors">
              Change Password
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A39C] mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 md:ml-64 w-full">
          <motion.main
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 md:p-10 max-w-7xl mx-auto w-full"
          >
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'articles' && renderArticles()}
            {activeTab === 'create' && renderCreateArticle()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'comments' && renderComments()}
            {activeTab === 'settings' && renderSettings()}
          </motion.main>
        </div>
      </div>

      {renderEditArticleModal()}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />
    </div>
  );
};

export default Dashboard;
