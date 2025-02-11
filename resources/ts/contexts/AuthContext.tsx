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
    const token = localStorage.getItem('auth-token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, signIn, signOut, isLoading }}>
      {isAuthenticated ? (
        <div className="absolute top-2 right-2 hidden">
          Authenticated
          <button
            onClick={signOut}
            className="px-4 py-2 rounded bg-red-500 text-white ml-2 cursor-pointer">
            Logout
          </button>
        </div>
      ) : null}
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
