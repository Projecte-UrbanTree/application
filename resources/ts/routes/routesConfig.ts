import AuthRoutes from "./AuthRoutes";
import AdminRoutes from "./AdminRoutes";

const routesConfig = [
  ...AuthRoutes,
  ...AdminRoutes,
];

export default routesConfig;
