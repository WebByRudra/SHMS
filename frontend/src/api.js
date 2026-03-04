import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Health Data APIs
export const healthAPI = {
  add: (data) => api.post('/health/add', data),
  getLatest: () => api.get('/health/latest'),
  getHistory: (days = 7) => api.get(`/health/history?days=${days}`),
  getStats: (days = 7) => api.get(`/health/stats?days=${days}`),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getThresholds: () => api.get('/users/thresholds'),
  updateThresholds: (data) => api.put('/users/thresholds', data),
};

// Alert APIs
export const alertAPI = {
  getAlerts: (unreadOnly = false) => api.get(`/alerts/list?unread_only=${unreadOnly}`),
  markAsRead: (alertId) => api.put(`/alerts/${alertId}/read`),
  markAllAsRead: () => api.put('/alerts/read-all'),
};

export default api;
