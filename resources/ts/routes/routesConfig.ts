import AdminRoutes from './AdminRoutes';
import AppRoutes from './AppRoutes';
import AuthRoutes from './AuthRoutes';

const routesConfig = [...AuthRoutes, ...AdminRoutes, ...AppRoutes];

export default routesConfig;
