import UnauthenticatedRoute from '@/middlewares/UnauthenticatedRoute';

import AuthLayout from '@/layouts/AuthLayout';
import Login from '@/pages/Login';

import { RouteObject } from 'react-router-dom';

const AuthRoutes: RouteObject[] = [
  {
    element: <UnauthenticatedRoute />,
    children: [
      {
        path: '/login',
        element: (
          <AuthLayout title="Login">
            <Login />
          </AuthLayout>
        ),
      },
    ],
  },
];

export default AuthRoutes;
