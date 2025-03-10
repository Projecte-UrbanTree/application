import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

export default function AdminProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>; // Puedes mejorar esto con un <Preloader />
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
