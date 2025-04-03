import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { getRouteByRole } from '@/utils/roleRoutes';

export default function UnauthenticatedRoute() {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Outlet />;
    }

    if (!user || !user.role) {
        return <Navigate to="/" replace />;
    }

    return <Navigate to={getRouteByRole(user.role)} replace />;
}
