import UnauthenticatedRoute from '@/middlewares/UnauthenticatedRoute';
import React from 'react';

import AuthLayout from '@/layouts/AuthLayout';
import Login from '@/pages/Login';
import Logout from '@/pages/Logout';

import { RouteObject } from 'react-router-dom';

export default [
  {
    element: <UnauthenticatedRoute />,
    children: [
      {
        path: '/login',
        element: (
          <AuthLayout>
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
] as RouteObject[];
