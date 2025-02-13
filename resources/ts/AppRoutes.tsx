import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import Error from '@/pages/Error';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/hooks/useAuth';

import Preloader from '@/components/Preloader';
import routesConfig from './routes/routesConfig';

export default function AppRoutes() {
  const { isLoading } = useAuth();
  if (isLoading) {
    return <Preloader />;
  }

  function RoutesComponent() {
    const { t } = useTranslation();
    return useRoutes([
      ...routesConfig,
      {
        path: '*',
        element: <Error errorCode="404" />,
      },
    ]);
  }

  return (
    <Router>
      <RoutesComponent />
    </Router>
  );
}
