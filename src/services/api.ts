import axios from 'axios';

const api = axios.create({
  baseURL: 'https://nex-digital-challenge-backend.onrender.com/api',
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
