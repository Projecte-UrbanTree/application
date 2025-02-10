import { useEffect } from 'react';
import { useAuth as useAuthContext } from '../contexts/AuthContext';

export function useAuth() {
	const { isAuthenticated, login: contextLogin, logout: contextLogout } = useAuthContext();

	useEffect(() => {
		const token = localStorage.getItem('auth-token');
		if (token && !isAuthenticated) {
			contextLogin();
		}
	}, [isAuthenticated, contextLogin]);

	const login = () => {
		localStorage.setItem('auth-token', 'dummy-token');
		contextLogin();
	};

	const logout = () => {
		localStorage.removeItem('auth-token');
		contextLogout();
	};

	return { isAuthenticated, login, logout };
}
