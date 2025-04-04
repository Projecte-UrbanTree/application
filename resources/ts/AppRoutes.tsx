import React from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import Error from '@/pages/Error';
import routesConfig from './routes/routesConfig';

const RoutesComponent = () => {
  return useRoutes([
    ...routesConfig,
    {
      path: '*',
      element: <Error icon="tabler:face-id-error" errorCode="404" />,
    },
  ]);
};

const AppRoutes = () => {
  return (
    <Router>
      <RoutesComponent />
    </Router>
  );
};

export default AppRoutes;
