import { useCallback, useMemo } from 'react';
import { Navigate, Outlet } from 'react-router';

import { useAuth } from '@/hooks/useAuth';
import { getRouteByRole } from '@/utils/roleRoutes';

export default function UnauthenticatedRoute() {
  const { isAuthenticated, user } = useAuth();

  const redirectRoute = useMemo(() => {
    if (!isAuthenticated) {
      return null;
    }

    if (!user?.role) {
      return '/';
    }

    return getRouteByRole(user.role);
  }, [isAuthenticated, user?.role]);

  const handleRedirect = useCallback(() => {
    if (!redirectRoute) {
      return <Outlet />;
    }

    return <Navigate to={redirectRoute} replace />;
  }, [redirectRoute]);

  return handleRedirect();
}
