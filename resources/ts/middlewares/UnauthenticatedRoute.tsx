import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

export default function UnauthenticatedRoute() {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Outlet />;
    }

    if (!user || !user.role) {
        return <Navigate to="/" replace />;
    }

    const roleRoutes: Record<string, string> = {
        admin: '/admin/dashboard',
        worker: '/worker',
        customer: '/customer',
    };

    return <Navigate to={roleRoutes[user.role] || '/'} replace />;
}
