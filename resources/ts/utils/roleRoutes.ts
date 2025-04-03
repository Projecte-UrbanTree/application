import { Roles } from '@/types/Role';

export const getRouteByRole = (role: Roles): string => {
  switch (role) {
    case Roles.admin:
      return '/admin/dashboard';
    case Roles.worker:
      return '/worker';
    case Roles.customer:
      return '/customer';
    default:
      return '/';
  }
}
