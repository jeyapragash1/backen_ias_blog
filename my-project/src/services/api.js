// Google Auth API
export const googleAuthAPI = {
  login: async (credential) => {
    const response = await api.post('/api/auth/google', { credential });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },
};
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Image upload helper
export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// Public Metrics API
export const metricsAPI = {
  getPublicMetrics: async () => {
    const response = await api.get('/metrics');
    return response.data;
  },
};

// Engagement API (likes, views - no auth required)
export const engagementAPI = {
  toggleLike: async (slug) => {
    const response = await api.post(`/articles/${slug}/like`);
    return response.data;
  },

  recordView: async (slug) => {
    const response = await api.post(`/articles/${slug}/view`);
    return response.data;
  },

  getStats: async (slug) => {
    const response = await api.get(`/articles/${slug}/stats`);
    return response.data;
  },
};

// Articles API calls (engagement: likes, views, stats)
export const articlesAPI = {
  trackView: async (slug) => {
    const response = await api.post(`/articles/${slug}/view`);
    return response.data;
  },

  toggleLike: async (slug, requestIp = null) => {
    const response = await api.post(`/articles/${slug}/like`, { request_ip: requestIp });
    return response.data;
  },

  getArticleStats: async (slug) => {
    const response = await api.get(`/articles/${slug}/stats`);
    return response.data;
  },
};

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (email, password, full_name) => {
    const response = await api.post('/api/auth/register', {
      email,
      password,
      full_name,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Comments API calls
export const commentsAPI = {
  getArticleComments: async (articleId) => {
    const response = await api.get(`/comments/article/${articleId}`);
    return response.data;
  },

  getMyComments: async () => {
    const response = await api.get('/comments/my/comments');
    return response.data;
  },

  createComment: async (articleId, content, author = '', author_email = '') => {
    const response = await api.post('/comments/', {
      article_id: articleId,
      content,
      author,
      author_email,
    });
    return response.data;
  },

  updateComment: async (commentId, content) => {
    const response = await api.put(`/comments/${commentId}`, { content });
    return response.data;
  },

  deleteComment: async (commentId) => {
    await api.delete(`/comments/${commentId}`);
  },
};

// Profile API calls
export const profileAPI = {
  getProfile: async () => {
    const response = await api.get('/profile/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/profile/me', data);
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/profile/me/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },
};

// Admin API calls
export const adminAPI = {
  // Dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  // User management
  getUsers: async (skip = 0, limit = 20, search = '') => {
    const response = await api.get('/admin/users', {
      params: { skip, limit, search },
    });
    return response.data;
  },

  updateUser: async (userId, data) => {
    const response = await api.put(`/admin/users/${userId}`, data);
    return response.data;
  },

  deleteUser: async (userId) => {
    await api.delete(`/admin/users/${userId}`);
  },

  // Article management
  getAllArticles: async (skip = 0, limit = 20, status = null, category = null, search = '') => {
    const response = await api.get('/admin/articles', {
      params: { skip, limit, status, category, search },
    });
    return response.data;
  },

  approveArticle: async (slug) => {
    const response = await api.put(`/admin/articles/${slug}/approve`);
    return response.data;
  },

  rejectArticle: async (slug, reason = '') => {
    const response = await api.put(`/admin/articles/${slug}/reject`, { reason });
    return response.data;
  },

  toggleFeatureArticle: async (slug, isFeatured) => {
    const response = await api.put(`/admin/articles/${slug}/feature`, { is_featured: isFeatured });
    return response.data;
  },

  // Comment moderation
  getAllComments: async (skip = 0, limit = 50, articleId = null) => {
    const response = await api.get('/admin/comments', {
      params: { skip, limit, article_id: articleId },
    });
    return response.data;
  },

  deleteComment: async (commentId) => {
    await api.delete(`/admin/comments/${commentId}`);
  },

  // Database stats
  getDatabaseStats: async () => {
    const response = await api.get('/admin/database/stats');
    return response.data;
  },

  // Settings
  getSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await api.put('/admin/settings', settings);
    return response.data;
  },
};

export default api;
