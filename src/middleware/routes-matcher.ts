const publicRoutes = ["/"];

export const PUBLIC_ROUTES = ["/", "/signin", "/signout"];
export const AUTH_ROUTES = ["/api/auth"];
export const PROTECTED_ROUTES = ["/authenticated"];

//? helper functions
export const isPublicRoute = (path: string) => {
  return PUBLIC_ROUTES.includes(path);
};
export const isAuthenticationRoute = (path: string) => {
  return AUTH_ROUTES.includes(path);
};
export const isProtectedRoute = (path: string) => {
  return PROTECTED_ROUTES.includes(path);
};
export const isUnauthenticatedOnly = (path: string) => {
  return !isPublicRoute(path) && !isAuthenticationRoute(path);
};
