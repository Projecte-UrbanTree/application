import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import Error from '@/pages/Error';

import { useAuth } from '@/hooks/useAuth';

import Preloader from '@/components/Preloader';
import routesConfig from './routes/routesConfig';

function RoutesComponent() {
  return useRoutes([
    ...routesConfig,
    {
      path: '*',
      element: <Error icon="tabler:face-id-error" errorCode="404" />,
    },
  ]);
}

function AuthWrapper() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Preloader />;
  }

  return <RoutesComponent />;
}

export default function AppRoutes() {
  return (
    <Router>
      <AuthWrapper />
    </Router>
  );
}
