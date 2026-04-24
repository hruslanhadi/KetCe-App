import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const orderAPI = {
  create: (data: any) => api.post('/api/orders', data),
  getAll: (params?: any) => api.get('/api/orders', { params }),
  getById: (id: string) => api.get(`/api/orders/${id}`),
  updateStatus: (id: string, status: string) => api.put(`/api/orders/${id}/status`, { status }),
  getStats: () => api.get('/api/orders/stats'),
  getCustomerOrders: (phone: string) => api.get(`/api/orders/customer/${phone}`),
};

export const productAPI = {
  create: (data: any) => api.post('/api/products', data),
  getAll: () => api.get('/api/products'),
  getById: (id: string) => api.get(`/api/products/${id}`),
  update: (id: string, data: any) => api.put(`/api/products/${id}`, data),
  delete: (id: string) => api.delete(`/api/products/${id}`),
};

export const productGroupAPI = {
  create: (data: any) => api.post('/api/product-groups', data),
  getAll: () => api.get('/api/product-groups'),
  getById: (id: string) => api.get(`/api/product-groups/${id}`),
  update: (id: string, data: any) => api.put(`/api/product-groups/${id}`, data),
  delete: (id: string) => api.delete(`/api/product-groups/${id}`),
};

export const authAPI = {
  login: (email: string, password: string) => api.post('/api/auth/login', { email, password }),
  register: (data: any) => api.post('/api/auth/register', data),
};

export default api;
