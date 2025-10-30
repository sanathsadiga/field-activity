import axios from 'axios';

// Use env override when available
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const api = axios.create({ baseURL });

export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const me = (token) => api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
export const getAdminAnalytics = (token) =>
  api.get('/admin/analytics', { headers: { Authorization: `Bearer ${token}` } });

export default api;
