import ProtectedRoute from '@/components/Routes/Protected';
import AppLayout from '@/layouts/AppLayout';
import Map from '@/pages/Map';
import WorkOrders from '@/pages/Worker/WorkOrders';
import { Roles } from '@/types/Role';
import { type RouteObject } from 'react-router-dom';

export default [
  {
    path: '/app',
    element: <ProtectedRoute allowedRoles={[Roles.worker, Roles.customer]} />,
    children: [
      {
        index: true,
        element: (
          <AppLayout>
            <Map />
          </AppLayout>
        ),
      },
      {
        path: 'work-orders',
        element: <ProtectedRoute allowedRoles={[Roles.worker]} />,
        children: [
          {
            index: true,
            element: (
              <AppLayout>
                <WorkOrders />
              </AppLayout>
            ),
          },
        ],
      },
    ],
  },
] as RouteObject[];
