import axiosClient from '@/api/axiosClient';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const signIn = () => setIsAuthenticated(true);
  const signOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('auth-token');
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('auth-token');
      if (token) {
        setIsAuthenticated(true);
        try {
          const response = await axiosClient.get('/user');
          console.log(response.data);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };

    setIsLoading(false);
    fetchUser(); // debug, remove after react skeleton is implemented completely
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
