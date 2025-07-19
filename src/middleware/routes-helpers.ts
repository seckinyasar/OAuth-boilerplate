import {
  AUTH_ROUTES,
  PUBLIC_ROUTES,
  AUTHENTICATED_ONLY_ROUTES,
  UNAUTHENTICATED_ONLY_ROUTES,
} from "./routes-matcher";

//? This one is for apis and authentication routes.
export const isAuthenticationRoute = (path: string) => {
  return AUTH_ROUTES.includes(path);
};
export const isPublicRoute = (path: string) => {
  return PUBLIC_ROUTES.includes(path);
};
export const isAuthenticatedOnlyRoute = (path: string) => {
  return AUTHENTICATED_ONLY_ROUTES.includes(path);
};
export const isUnauthenticatedOnlyRoute = (path: string) => {
  return UNAUTHENTICATED_ONLY_ROUTES.includes(path);
};
