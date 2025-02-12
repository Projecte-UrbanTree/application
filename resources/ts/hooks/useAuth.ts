import { useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';

export function useAuth() {
	const { isLoading, isAuthenticated, signIn, signOut, user, setUser, setIsLoading } = useAuthContext();

	useEffect(() => {
		const token = localStorage.getItem('authToken');
		if (token && !isAuthenticated) {
			signIn();
		}
	}, [isAuthenticated, signIn]);

	const login = (token: string, user: any) => {
		localStorage.setItem('authToken', token);
		signIn();
		setUser(user);
	};

	const logout = () => {
		localStorage.removeItem('authToken');
		signOut();
		setUser(null);
	};

	return { isLoading, isAuthenticated, user, login, logout, setIsLoading };
}
