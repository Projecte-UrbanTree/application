import axios from 'axios';

import store from '@/store/store';
import { Contract } from '@/types/Contract';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    const currentContract: Contract = store.getState().contract
      .currentContract ?? { id: 0 };

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['X-Contract-Id'] = currentContract.id;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosClient;
