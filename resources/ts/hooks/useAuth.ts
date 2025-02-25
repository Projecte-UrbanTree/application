import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/contexts/store/store';
import { PassThrough } from 'stream';
import { UserData } from '@/types/user';
import { log } from 'console';
import { clearUserData, setUserData } from '@/contexts/store/slice/userSlice';
import axios from 'axios';

export function useAuth() {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const isAuthenticated = Boolean(user.id);
    const isLoading = !user.id && localStorage.getItem('authToken') !== null;

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token && !user.id) {
            fetchUser();
        }
    }, [user.id]);

    const fetchUser = async () => {
        try {
            const response = await axios.get('/user');
            console.log('RESPONSE fetchUser: ', { response });

            dispatch(setUserData(response.data));
        } catch (error) {
            console.error(error);
            logout();
        }
    };

    const login = (token: string, userData: UserData) => {
        if (userData !== null) {
            console.log('USERDATA: ', { token, userData });
            dispatch(setUserData(userData));
        }
    };

    const logout = () => {
        console.log('LOGOUT');
        dispatch(clearUserData());
    };

    return { isLoading, isAuthenticated, user, login, logout: logout };
}
