import React from 'react';
import UnauthenticatedRoute from '@/middlewares/UnauthenticatedRoute';

import AuthLayout from '@/layouts/AuthLayout';
import Login from '@/pages/Login';
import Logout from '@/pages/Logout';

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
  {
    path: '/logout',
    element: React.createElement(Logout),
  },
];

export default AuthRoutes;
