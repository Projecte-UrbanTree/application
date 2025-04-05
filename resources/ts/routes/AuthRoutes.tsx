import React from 'react';
import { RouteObject } from 'react-router-dom';

import AuthLayout from '@/layouts/AuthLayout';
import UnauthenticatedRoute from '@/middlewares/UnauthenticatedRoute';
import Login from '@/pages/Login/Index';
import Logout from '@/pages/Logout';

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
  {
    path: '/logout',
    element: React.createElement(Logout),
  },
];

export default AuthRoutes;
