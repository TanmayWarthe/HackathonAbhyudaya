import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  signup: async (data) => {
    const response = await api.post('/auth/signup', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (data) => {
    const response = await api.post('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Complaints API calls
export const complaintsAPI = {
  create: async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('description', data.description);
    formData.append('location', data.location);
    formData.append('urgency', data.urgency);
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await api.post('/complaints', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.urgency) params.append('urgency', filters.urgency);

    const response = await api.get(`/complaints?${params.toString()}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/complaints/${id}/status`, { status });
    return response.data;
  },

  assign: async (id, data) => {
    const response = await api.put(`/complaints/${id}/assign`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/complaints/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/complaints/stats/dashboard');
    return response.data;
  },
};

// Feedback API calls
export const feedbackAPI = {
  submit: async (data) => {
    const response = await api.post('/feedback', data);
    return response.data;
  },

  getByComplaintId: async (complaintId) => {
    const response = await api.get(`/feedback/${complaintId}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/feedback/stats/average');
    return response.data;
  },
};

export default api;
