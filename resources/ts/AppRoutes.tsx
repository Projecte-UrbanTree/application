import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import Error from '@/pages/Error';

import { useAuth } from '@/hooks/useAuth';

import Preloader from '@/components/Preloader';
import routesConfig from './routes/routesConfig';

const RoutesComponent = () => {
  return useRoutes([
    ...routesConfig,
    {
      path: '*',
      element: <Error icon="tabler:face-id-error" errorCode="404" />,
    },
  ]);
}

const LoaderWrapper = () => {
  const { isLoading } = useAuth();
  if (isLoading) {
    return <Preloader />;
  }
  return <RoutesComponent />;
}

const AppRoutes = () => {
  return (
    <Router>
      <LoaderWrapper />
    </Router>
  );
}

export default AppRoutes;
