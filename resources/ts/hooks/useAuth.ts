import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setUserData, clearUserData } from '@/store/slice/userSlice';
import axiosClient from '@/api/axiosClient';
import { useContracts } from './useContracts';

export function useAuth() {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = Boolean(user.id);
    const { fetchContracts } = useContracts();
    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (token && !user.id) {
            fetchUser();
        } else {
            setIsLoading(false);
        }
    }, []);

    const fetchUser = async (navigate?: (path: string) => void) => {
        try {
            const response = await axiosClient.get('/user', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            console.log('RESPONSE fetchUser: ', response.data);

            dispatch(setUserData(response.data));

            await fetchContracts();

            if (navigate) {
                const userRole = response.data.role;
                navigate(userRole === 'admin' ? '/admin/dashboard' : '/');
            }
        } catch (error) {
            console.error('Error fetching user:', error);

            if (navigate) {
                logout(navigate);
            } else {
                logout();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (token: string, navigate?: (path: string) => void) => {
        if (!token) {
            console.error('Error: No se recibió un token válido');
            return;
        }

        try {
            localStorage.setItem('authToken', token);
            axiosClient.defaults.headers.Authorization = `Bearer ${token}`;

            await fetchUser(navigate);
        } catch (error) {
            console.error('Error al intentar iniciar sesión:', error);
        }
    };

    const logout = (navigate?: (path: string) => void) => {
        localStorage.removeItem('authToken');
        dispatch(clearUserData());
    };

    return { isLoading, isAuthenticated, user, login, logout, fetchUser };
}
