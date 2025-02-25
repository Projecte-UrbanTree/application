import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/contexts/store/store';
import { setUserData, clearUserData } from '@/contexts/store/slice/userSlice';
import axiosClient from '@/api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { UserData } from '@/types/user';

export function useAuth() {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = Boolean(user.id);

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (token && !user.id) {
            fetchUser();
        } else {
            setIsLoading(false);
        }
    }, [user.id]);

    const fetchUser = async (navigate?: (path: string) => void) => {
        try {
            const response = await axiosClient.get('/user', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            console.log('RESPONSE fetchUser: ', response.data);

            dispatch(setUserData(response.data));

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
