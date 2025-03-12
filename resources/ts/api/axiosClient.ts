import { defaultContract } from '@/components/Admin/Dashboard/AdminDashboardWrapper';
import store, { RootState } from '@/store/store';
import { Contract } from '@/types/contract';
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost/api',
    headers: {
        'Content-Type': 'application/json',
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
