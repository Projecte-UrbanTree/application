import { getAuthToken } from '@/utils/auth';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    let { data, headers } = config;

    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    data = {
      app_name: import.meta.env.VITE_APP_NAME || 'web',
      ...data,
    };

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
