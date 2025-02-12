import axiosClient from '@/api/axiosClient';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  company: string;
  dni: string;
  email_verified_at: string;
  role: string;
  created_at: string;
  updated_at: string;
}
interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const signIn = () => {
    setIsAuthenticated(true);
  };
  const signOut = () => {
    setIsAuthenticated(false);
  };

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await axiosClient.get('/user');
          setUser(response.data);
          setIsAuthenticated(true);
          setTimeout(() => setIsLoading(false), 2000);
          console.log('Authenticated user:', response.data);
        } catch (error) {
          setIsAuthenticated(false);
          localStorage.removeItem('authToken');
          setIsLoading(false);
        }
      } else setIsLoading(false);
    };

    fetchUser(); // debug, remove after react skeleton is implemented completely
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        signIn,
        signOut,
        user,
        setUser,
        setIsLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
