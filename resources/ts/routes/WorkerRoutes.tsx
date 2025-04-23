import { RouteObject } from 'react-router-dom';

import WorkerLayout from '@/layouts/WorkerLayout';
import AuthenticatedRoute from '@/middlewares/AuthenticatedRoute';
import Index from '@/pages/Worker/Index';
import { Roles } from '@/types/Role';
import { InventoryWorker } from '@/pages/Worker/InventoryWorker';

const WorkerRoutes: RouteObject[] = [
  {
    element: <AuthenticatedRoute allowedRoles={[Roles.worker]} />,
    children: [
      {
        path: '/worker',
        children: [
          {
            index: true,
            element: (
              <WorkerLayout titleI18n="Dashboard">
                <Index />
              </WorkerLayout>
            ),
          },
        ],
      },
      {
        path: '/worker/inventory',
        children: [
          {
            index: true,
            element: (
              <WorkerLayout titleI18n='Inventory'>
                <InventoryWorker />
              </WorkerLayout>
            )
          }
        ]
      }
    ],
  },
];

export default WorkerRoutes;
