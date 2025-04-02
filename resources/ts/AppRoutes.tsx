import Preloader from '@/components/Preloader';
import useAuth from '@/hooks/useAuth';
import Error from '@/pages/Error';
import { useEffect } from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import routesConfig from './routes/routesConfig';

export default function AppRoutes() {
  const { loading, fetchUser } = useAuth();

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <Preloader bg_white={true} />;

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
