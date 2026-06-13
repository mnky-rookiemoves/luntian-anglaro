/**
 * 🌿 LUNTIAN ANGLARO — API Client
 * Centralized Axios instance with interceptors.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',  // Vite proxy handles this → localhost:8000/api
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ──────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Future: Add JWT token here
    // const token = localStorage.getItem('luntian_token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ─────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.warn('🔒 Unauthorized — redirect to login');
      } else if (status === 404) {
        console.warn('🔍 Resource not found');
      } else if (status >= 500) {
        console.error('🔥 Server error:', error.response.data);
      }
    } else if (error.request) {
      console.error('🌐 Network error — is the Django server running?');
    }
    return Promise.reject(error);
  }
);

export default api;