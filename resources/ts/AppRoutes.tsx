import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import Error from '@/pages/error';

import { useAuth } from '@/hooks/useAuth';

import Preloader from '@/components/Preloader';
import routesConfig from './routes/routesConfig';

export default function AppRoutes() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Preloader />;
  }

  function RoutesComponent() {
    return useRoutes([
      ...routesConfig,
      {
        path: '*',
        element: <Error icon="tabler:face-id-error" errorCode="404" />,
      },
    ]);
  }

  return (
    <Router>
      <RoutesComponent />
    </Router>
  );
}
