import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://cashtrack-57np.onrender.com'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cashtrack_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
