import axios from 'axios';

import store from '@/store/store';
import { Contract } from '@/types/Contract';

const SELECTED_CONTRACT_KEY = 'selectedContractId';

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

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem(SELECTED_CONTRACT_KEY);
      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
