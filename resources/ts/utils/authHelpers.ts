// src/utils/authHelpers.ts

// Check if the user is authenticated by checking the auth token
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('auth_token');
  return token !== null; // Returns true if the token exists
};

// Get the authentication token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Store the authentication token in localStorage (or sessionStorage)
export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

// Remove the authentication token from localStorage (or sessionStorage)
export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

// Redirect to the login page if not authenticated
import { useNavigate } from 'react-router-dom';
export const redirectToLogin = (): void => {
  const navigate = useNavigate();
  navigate('/login');
};

// Get user data from localStorage
export const getUserData = (): any => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

// Store user data after a successful login
export const setUserData = (userData: any): void => {
  localStorage.setItem('user_data', JSON.stringify(userData));
};
