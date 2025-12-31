import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaFileAlt, FaUsers, FaComments, FaFlag, FaEdit, FaTrash, FaCheck, FaTimes, FaSearch, FaUserCheck, FaUserTimes, FaChartBar, FaDownload, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api, { adminAPI, uploadAPI } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [databaseStats, setDatabaseStats] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  // Reports state (mock data for now)
  const [reports, setReports] = useState([
    {
      id: '1',
      type: 'Comment',
      reported: 'Inappropriate comment',
      reportedBy: 'user1@example.com',
      status: 'Pending',
      date: '2025-12-29',
    },
    {
      id: '2',
      type: 'Article',
      reported: 'Spam article',
      reportedBy: 'user2@example.com',
      status: 'Resolved',
      date: '2025-12-28',
    },
  ]);
  
  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'danger'
  });
  
  // Add user modal state
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    full_name: '',
    is_superuser: false
  });
  const [addingUser, setAddingUser] = useState(false);
  
  // Add article modal state
  const [addArticleModalOpen, setAddArticleModalOpen] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    category: 'Power Systems',
    tags: '',
    shortDescription: '',
    content: '',
    featuredImage: ''
  });
  const [submittingArticle, setSubmittingArticle] = useState(false);
  const [uploadingArticleImage, setUploadingArticleImage] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!user.is_superuser) {
      navigate('/dashboard');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchDashboardStats(),
        fetchAllArticles(),
        fetchAllUsers(),
        fetchAllComments(),
        fetchDatabaseStats(),
        fetchSettings()
      ]);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const data = await adminAPI.getDashboardStats();
      setDashboardStats(data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  const fetchAllArticles = async () => {
    try {
      const data = await adminAPI.getAllArticles();
      setArticles(data.articles);
    } catch (err) {
      console.error('Error fetching articles:', err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const data = await adminAPI.getUsers();
      setUsers(data.users);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchAllComments = async () => {
    try {
      const data = await adminAPI.getAllComments();
      setComments(data.comments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const fetchDatabaseStats = async () => {
    try {
      const data = await adminAPI.getDatabaseStats();
      setDatabaseStats(data);
    } catch (err) {
      console.error('Error fetching database stats:', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const data = await adminAPI.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const handleApprove = async (slug) => {
    try {
      await adminAPI.approveArticle(slug);
      setArticles(articles.map(a => a.slug === slug ? { ...a, status: 'approved' } : a));
      fetchDashboardStats(); // Refresh stats
      showSuccess('Article approved successfully!');
    } catch (err) {
      showError('Failed to approve article. Please try again.');
    }
  };

  const handleReject = async (slug) => {
    try {
      await adminAPI.rejectArticle(slug);
      setArticles(articles.map(a => a.slug === slug ? { ...a, status: 'rejected' } : a));
      fetchDashboardStats(); // Refresh stats
      showSuccess('Article rejected.');
    } catch (err) {
      showError('Failed to reject article. Please try again.');
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
          fetchDashboardStats(); // Refresh stats
          showSuccess('Article deleted successfully.');
        } catch (err) {
          showError('Failed to delete article. Please try again.');
        }
      }
    });
  };

  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      await adminAPI.updateUser(userId, { is_active: !isActive });
      setUsers(users.map(u => u.id === userId ? { ...u, is_active: !isActive } : u));
      showSuccess('User status updated successfully.');
    } catch (err) {
      showError('Failed to update user status. Please try again.');
    }
  };

  const handleDeleteUser = (userId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This will also delete all their articles and comments. This action cannot be undone.',
      type: 'danger',
      onConfirm: async () => {
        try {
          await adminAPI.deleteUser(userId);
          setUsers(users.filter(u => u.id !== userId));
          fetchDashboardStats(); // Refresh stats
          showSuccess('User deleted successfully.');
        } catch (err) {
          showError('Failed to delete user. Please try again.');
        }
      }
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newUser.email || !newUser.password || !newUser.full_name) {
      showWarning('Please fill in all required fields');
      return;
    }
    
    if (newUser.password.length < 6) {
      showWarning('Password must be at least 6 characters');
      return;
    }
    
    try {
      setAddingUser(true);
      const response = await api.post('/api/auth/register', {
        email: newUser.email,
        password: newUser.password,
        full_name: newUser.full_name,
        is_superuser: newUser.is_superuser
      });
      
      showSuccess('User created successfully!');
      setAddUserModalOpen(false);
      setNewUser({ email: '', password: '', full_name: '', is_superuser: false });
      fetchAllUsers(); // Refresh user list
    } catch (err) {
      console.error('Error creating user:', err);
      showError(err.response?.data?.detail || 'Failed to create user. Please try again.');
    } finally {
      setAddingUser(false);
    }
  };

  const uploadFeaturedImage = async (file) => {
    if (!file) return;
    try {
      setUploadingArticleImage(true);
      const data = await uploadAPI.uploadImage(file);
      const url = data.url || data.path || '';
      if (!url) throw new Error('Upload failed');
      setNewArticle(prev => ({ ...prev, featuredImage: url }));
      showSuccess('Image uploaded');
    } catch (err) {
      console.error('Image upload error:', err);
      showError('Failed to upload image. Please try again.');
    } finally {
      setUploadingArticleImage(false);
    }
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
      setSubmittingArticle(true);
      
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

      await api.post('/articles/', articleData);
      
      showSuccess('Article created successfully!');
      setAddArticleModalOpen(false);
      setNewArticle({
        title: '',
        category: 'Power Systems',
        tags: '',
        shortDescription: '',
        content: '',
        featuredImage: ''
      });
      fetchAllArticles(); // Refresh articles list
    } catch (err) {
      console.error('Error creating article:', err);
      showError(err.response?.data?.detail || 'Failed to create article. Please try again.');
    } finally {
      setSubmittingArticle(false);
    }
  };

  // Calculate stats from real data
  const stats = dashboardStats ? [
    { label: 'Total Users', value: dashboardStats.users.total, icon: FaUsers, color: 'from-purple-500 to-purple-600' },
    { label: 'Total Articles', value: dashboardStats.articles.total, icon: FaFileAlt, color: 'from-blue-500 to-blue-600' },
    { label: 'Pending Review', value: dashboardStats.articles.pending, icon: FaFlag, color: 'from-yellow-500 to-yellow-600' },
    { label: 'Total Comments', value: dashboardStats.comments.total, icon: FaComments, color: 'from-green-500 to-green-600' },
  ] : [];

  // Dashboard Tab
  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#00A39C] to-teal-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-teal-100">Welcome back! Here's your platform overview</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
                <span className="text-green-600 font-bold text-sm">{stat.growth}</span>
              </div>
              <h3 className="text-gray-600 text-sm font-semibold mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Articles */}
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
              <div className="text-center py-8 text-slate-600">No articles yet</div>
            ) : (
              articles.slice(0, 5).map((article) => (
                <div key={article._id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 text-sm">{article.title}</h3>
                    <p className="text-xs text-gray-500">{article.author} • {new Date(article.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    article.status === 'approved' ? 'bg-green-100 text-green-700' : 
                    article.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {article.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Users</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-slate-600">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-slate-600">No users yet</div>
            ) : (
              users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00A39C] to-teal-600 flex items-center justify-center text-white font-bold">
                      {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-sm">{user.full_name || 'No name'}</h3>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Article Categories Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-4">Popular Categories</h2>
          <div className="space-y-3">
            {(() => {
              const categoryCount = {};
              articles.forEach(article => {
                categoryCount[article.category] = (categoryCount[article.category] || 0) + 1;
              });
              return Object.entries(categoryCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">{category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#00A39C] rounded-full" 
                          style={{ width: `${(count / articles.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-slate-800 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ));
            })()}
          </div>
        </motion.div>

        {/* User Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-4">User Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-slate-600">Active Users</p>
                <p className="text-2xl font-bold text-slate-800">{users.filter(u => u.is_active).length}</p>
              </div>
              <FaUserCheck className="text-3xl text-blue-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm text-slate-600">Inactive Users</p>
                <p className="text-2xl font-bold text-slate-800">{users.filter(u => !u.is_active).length}</p>
              </div>
              <FaUserTimes className="text-3xl text-red-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm text-slate-600">Superusers</p>
                <p className="text-2xl font-bold text-slate-800">{users.filter(u => u.is_superuser).length}</p>
              </div>
              <FaUsers className="text-3xl text-purple-600" />
            </div>
          </div>
        </motion.div>

        {/* Recent Comments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Comments</h2>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8 text-slate-600">Loading...</div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-slate-600">No comments yet</div>
            ) : (
              comments.slice(0, 4).map((comment) => (
                <div key={comment.id} className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <p className="text-xs text-slate-600 mb-1 line-clamp-2">{comment.content}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{comment.author_email}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );

  // Manage Users Tab
  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Manage Users</h1>
        <button 
          onClick={() => setAddUserModalOpen(true)}
          className="bg-[#00A39C] text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
        >
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-4 top-4 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100 border-b-2 border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-slate-700 font-semibold">Name</th>
              <th className="px-6 py-4 text-left text-slate-700 font-semibold">Email</th>
              <th className="px-6 py-4 text-left text-slate-700 font-semibold">Role</th>
              <th className="px-6 py-4 text-left text-slate-700 font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-slate-700 font-semibold">Joined</th>
              <th className="px-6 py-4 text-left text-slate-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-600">Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-600">No users found</td></tr>
            ) : (
              users.filter(user => 
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (user.full_name && user.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
              ).map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-800 font-medium">{user.full_name || user.email.split('@')[0]}</td>
                  <td className="px-6 py-4 text-slate-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      {user.is_superuser ? 'Admin' : 'Author'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      user.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      {/* Disable status toggle and delete for the main admin user */}
                      {user.email === 'admin@iasuuwu.com' ? (
                        <>
                          <button 
                            disabled
                            className="text-gray-300 p-2 rounded cursor-not-allowed"
                            title="Cannot modify main admin"
                          >
                            <FaUserCheck size={18} />
                          </button>
                          <button 
                            disabled
                            className="text-gray-300 p-2 rounded cursor-not-allowed"
                            title="Cannot delete main admin"
                          >
                            <FaTrash size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                            className={`${user.is_active ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'} p-2 rounded transition-colors`}
                            title={user.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {user.is_active ? <FaUserTimes size={18} /> : <FaUserCheck size={18} />}
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
                            title="Delete user"
                          >
                            <FaTrash size={18} />
                          </button>
                        </>
                      )}
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

  // Manage Articles Tab
  const renderArticles = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Manage Articles</h1>
        <button 
          onClick={() => setAddArticleModalOpen(true)}
          className="bg-[#00A39C] text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
        >
          New Article
        </button>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100 border-b-2 border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-slate-700 font-semibold">Title</th>
              <th className="px-6 py-4 text-left text-slate-700 font-semibold">Author</th>
              <th className="px-6 py-4 text-left text-slate-700 font-semibold">Views</th>
              <th className="px-6 py-4 text-left text-slate-700 font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-slate-700 font-semibold">Date</th>
              <th className="px-6 py-4 text-left text-slate-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-600">Loading articles...</td></tr>
            ) : articles.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-600">No articles yet</td></tr>
            ) : (
              articles.map((article) => (
                <tr key={article._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-800 font-medium">{article.title}</td>
                  <td className="px-6 py-4 text-slate-600">{article.author}</td>
                  <td className="px-6 py-4 text-slate-600">{article.readingTime || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      article.status === 'approved' ? 'bg-green-100 text-green-700' : 
                      article.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{new Date(article.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate(`/article/${article.slug}`)}
                        className="text-[#00A39C] hover:bg-teal-50 p-2 rounded transition-colors"
                        title="View article"
                      >
                        <FaEye size={18} />
                      </button>
                      {article.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(article.slug)}
                            className="text-green-600 hover:bg-green-50 p-2 rounded transition-colors"
                            title="Approve article"
                          >
                            <FaCheck size={18} />
                          </button>
                          <button 
                            onClick={() => handleReject(article.slug)}
                            className="text-yellow-600 hover:bg-yellow-50 p-2 rounded transition-colors"
                            title="Reject article"
                          >
                            <FaTimes size={18} />
                          </button>
                        </>
                      )}
                      {article.status === 'rejected' && (
                        <button 
                          onClick={() => handleApprove(article.slug)}
                          className="text-green-600 hover:bg-green-50 p-2 rounded transition-colors"
                          title="Approve article"
                        >
                          <FaCheck size={18} />
                        </button>
                      )}
                      {article.status === 'approved' && (
                        <button 
                          onClick={() => handleReject(article.slug)}
                          className="text-yellow-600 hover:bg-yellow-50 p-2 rounded transition-colors"
                          title="Reject article"
                        >
                          <FaTimes size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteArticle(article.slug)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
                        title="Delete article"
                      >
                        <FaTrash size={18} />
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

  // Approve a comment
  const handleApproveComment = async (commentId) => {
    try {
      await adminAPI.updateCommentStatus(commentId, { status: 'Approved' });
      setComments(comments.map(c => c.id === commentId ? { ...c, status: 'Approved' } : c));
      showSuccess('Comment approved successfully!');
    } catch (err) {
      showError('Failed to approve comment. Please try again.');
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    try {
      await adminAPI.deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
      showSuccess('Comment deleted successfully!');
    } catch (err) {
      showError('Failed to delete comment. Please try again.');
    }
  };

  // Comments Tab
  const renderComments = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Manage Comments</h1>

      <div className="space-y-4">
        {comments.map((comment) => (
          <motion.div
            key={comment.id || comment._id || comment.date+comment.author}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-slate-800">{comment.author}</h3>
                <p className="text-sm text-gray-500">On: {comment.article}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                comment.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {comment.status}
              </span>
            </div>
            <p className="text-slate-700 mb-4">{comment.text}</p>
            <div className="flex gap-3">
              <button
                className="text-green-600 hover:bg-green-50 p-2 rounded transition-colors flex items-center gap-2"
                onClick={() => handleApproveComment(comment.id)}
                disabled={comment.status === 'Approved'}
              >
                <FaCheck size={16} /> Approve
              </button>
              <button
                className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors flex items-center gap-2"
                onClick={() => handleDeleteComment(comment.id)}
              >
                <FaTimes size={16} /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Reports Tab
  const renderReports = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Reported Content</h1>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100 border-b-2 border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-slate-700 font-semibold">Type</th>
              <th className="px-6 py-4 text-left text-slate-700 font-semibold">Reported Content</th>
              <th className="px-6 py-4 text-left text-slate-700 font-semibold">Reported By</th>
              <th className="px-6 py-4 text-left text-slate-700 font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-slate-700 font-semibold">Date</th>
              <th className="px-6 py-4 text-left text-slate-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {reports.map((report) => (
              <tr key={report.id || report.date+report.reportedBy} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-800 font-medium">{report.type}</td>
                <td className="px-6 py-4 text-slate-600">{report.reported}</td>
                <td className="px-6 py-4 text-slate-600">{report.reportedBy}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    report.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm">{report.date}</td>
                <td className="px-6 py-4">
                  <button className="text-[#00A39C] hover:bg-teal-50 p-2 rounded transition-colors">
                    <FaEdit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Database Tab
  const renderDatabase = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Database Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-4">Database Operations</h2>
          <div className="space-y-3">
            <button className="w-full bg-[#00A39C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center gap-2">
              <FaDownload size={18} /> Backup Database
            </button>
            <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
              <FaChartBar size={18} /> Optimize Tables
            </button>
            <button className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
              Run Integrity Check
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-4">Database Info</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Tables:</span>
              <span className="font-semibold text-slate-800">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Records:</span>
              <span className="font-semibold text-slate-800">15,240</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Database Size:</span>
              <span className="font-semibold text-slate-800">245 MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Backup:</span>
              <span className="font-semibold text-slate-800">Today 2:30 PM</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  // Settings Tab
  const renderSettings = () => (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Admin Settings</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 space-y-6"
      >
        <div className="border-b pb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Platform Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-semibold">Allow User Registration</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#00A39C]" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-semibold">Require Comment Approval</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#00A39C]" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-semibold">Enable Email Notifications</span>
              <input type="checkbox" className="w-5 h-5 accent-[#00A39C]" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Security</h2>
          <div className="space-y-4">
            <button className="w-full bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Clear All Cache
            </button>
            <button className="w-full bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Reset All Sessions
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="bg-[#00A39C] text-white px-8 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors">
            Save Settings
          </button>
          <button className="bg-slate-200 text-slate-800 px-8 py-2 rounded-lg font-semibold hover:bg-slate-300 transition-colors">
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <div className="flex-1 md:ml-72 w-full">
          <motion.main
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 md:p-10 max-w-7xl mx-auto w-full"
          >
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'articles' && renderArticles()}
            {activeTab === 'comments' && renderComments()}
            {activeTab === 'reports' && renderReports()}
            {activeTab === 'database' && renderDatabase()}
            {activeTab === 'settings' && renderSettings()}
          </motion.main>
        </div>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {addUserModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setAddUserModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Add New User</h2>
                <button
                  onClick={() => setAddUserModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={newUser.full_name}
                    onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Enter email address"
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Password *</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Enter password (min 6 characters)"
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none"
                    required
                    minLength={6}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_superuser"
                    checked={newUser.is_superuser}
                    onChange={(e) => setNewUser({ ...newUser, is_superuser: e.target.checked })}
                    className="w-4 h-4 text-[#00A39C] border-slate-300 rounded focus:ring-[#00A39C]"
                  />
                  <label htmlFor="is_superuser" className="text-sm font-semibold text-slate-700">
                    Make this user an administrator
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setAddUserModalOpen(false)}
                    className="flex-1 px-4 py-2 rounded-lg font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingUser}
                    className="flex-1 px-4 py-2 rounded-lg font-semibold text-white bg-[#00A39C] hover:bg-teal-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                  >
                    {addingUser ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Article Modal */}
      <AnimatePresence>
        {addArticleModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setAddArticleModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 my-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Create New Article</h2>
                <button
                  onClick={() => setAddArticleModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleCreateArticle} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Article Title *</label>
                  <input
                    type="text"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    placeholder="Enter article title"
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                    <select
                      value={newArticle.category}
                      onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none"
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
                      value={newArticle.tags}
                      onChange={(e) => setNewArticle({ ...newArticle, tags: e.target.value })}
                      placeholder="e.g., renewable, energy, grid"
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-semibold text-slate-700">Featured Image *</label>
                    {uploadingArticleImage && <span className="text-xs text-slate-500">Uploading...</span>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3">
                    <input
                      type="url"
                      value={newArticle.featuredImage}
                      onChange={(e) => setNewArticle({ ...newArticle, featuredImage: e.target.value })}
                      placeholder="https://example.com/image.jpg or use Upload"
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none"
                      required
                    />
                    <label className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer text-sm font-semibold text-slate-700">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => uploadFeaturedImage(e.target.files?.[0])}
                      />
                      {uploadingArticleImage ? 'Uploading...' : 'Upload Image'}
                    </label>
                  </div>
                  <p className="text-xs text-slate-500">Paste a URL or upload from device. Required for publication.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Short Description *</label>
                  <textarea
                    value={newArticle.shortDescription}
                    onChange={(e) => setNewArticle({ ...newArticle, shortDescription: e.target.value })}
                    placeholder="Brief summary of your article (max 200 characters)"
                    rows="2"
                    maxLength="200"
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none"
                    required
                  ></textarea>
                  <p className="text-xs text-slate-500 mt-1">{newArticle.shortDescription.length}/200 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Article Content *</label>
                  <textarea
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                    placeholder="Write your article content here..."
                    rows="8"
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-[#00A39C] focus:outline-none"
                    required
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setAddArticleModalOpen(false)}
                    className="flex-1 px-4 py-2 rounded-lg font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingArticle}
                    className="flex-1 px-4 py-2 rounded-lg font-semibold text-white bg-[#00A39C] hover:bg-teal-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                  >
                    {submittingArticle ? 'Creating...' : 'Create Article'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

export default AdminDashboard;
