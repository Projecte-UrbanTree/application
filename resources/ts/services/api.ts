import { getAuthToken } from '@/utils/authHelpers';
import axios from 'axios';

// Create an axios instance
const api = axios.create({
  // Set the base URL
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost/api',
  headers: {
    // Define the content type
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error),
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.history.back();
    }

    return Promise.reject(error);
  },
);

export default api;
