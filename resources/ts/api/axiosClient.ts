import { defaultContract } from '@/components/Admin/Dashboard/AdminDashboardWrapper';
import store from '@/store/store';
import { Contract } from '@/types/Contract';
import axios from 'axios';

const API_BASE_URL = `http://api_urbantree.alumnat.iesmontsia.org`;
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'X-API-Key': import.meta.env.VITE_API_KEY,
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    const currentContract: Contract =
      store.getState().contract.currentContract ?? defaultContract;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['X-Contract-Id'] = currentContract.id;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosClient;
