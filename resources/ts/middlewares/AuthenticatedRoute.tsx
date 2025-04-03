import Preloader from '@/components/Preloader';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router';
import { Roles } from '@/types/Role';
import { getRouteByRole } from '@/utils/roleRoutes';

export default function AuthenticatedRoute({
  allowedRoles,
  redirectPath,
}: {
  allowedRoles?: Roles[];
  redirectPath?: string;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Preloader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectPath ?? getRouteByRole(user.role)} replace />;
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
