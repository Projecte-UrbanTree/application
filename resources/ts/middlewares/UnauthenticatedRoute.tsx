import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { Roles } from '@/types/Role';

export default function UnauthenticatedRoute() {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Outlet />;
    }

    if (!user || !user.role) {
        return <Navigate to="/" replace />;
    }

    const roleRoutes: Record<Roles, string> = {
        [Roles.admin]: '/admin/dashboard',
        [Roles.worker]: '/worker',
        [Roles.customer]: '/customer',
    };

    return <Navigate to={roleRoutes[user.role] || '/'} replace />;
}
