import useAuth from '@/hooks/useAuth';
import { RootState, store } from '@/redux/store';
import { getAuthToken } from '@/utils/auth';
import axios from 'axios';
import { useSelector } from 'react-redux';

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
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const state = store.getState();
    const currentContract = state.auth.user?.selected_contract_id;
    if (currentContract) {
      config.headers['X-Contract-Id'] = currentContract;
    }

    data = {
      app_name: import.meta.env.VITE_APP_NAME || 'web',
      ...data,
    };

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
