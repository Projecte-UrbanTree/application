import ProtectedRoute from '@/components/Routes/Protected';
import UnauthenticatedRoute from '@/components/Routes/Unauthenticated';
import AppLayout from '@/layouts/AppLayout';
import AuthLayout from '@/layouts/AuthLayout';
import Account from '@/pages/Account';
import Login from '@/pages/Login';
import Logout from '@/pages/Logout';
import { RouteObject } from 'react-router-dom';

export default [
  {
    path: '/account',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: (
          <AppLayout>
            <Account />
          </AppLayout>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: <UnauthenticatedRoute />,
    children: [
      {
        index: true,
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
    element: <Logout />,
  },
] as RouteObject[];
