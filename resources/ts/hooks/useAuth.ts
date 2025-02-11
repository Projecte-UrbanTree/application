import { useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';

export function useAuth() {
	const { isAuthenticated, signIn, signOut } = useAuthContext();

	useEffect(() => {
		const token = localStorage.getItem('auth-token');
		if (token && !isAuthenticated) {
			signIn();
		}
	}, [isAuthenticated, signIn]);

	const login = (token: string) => {
		localStorage.setItem('auth-token', token);
		signIn();
	};

	const logout = () => {
		localStorage.removeItem('auth-token');
		signOut();
	};

	return { isAuthenticated, login, logout };
}
