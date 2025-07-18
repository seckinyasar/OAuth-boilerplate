import { NextRequest, NextResponse } from "next/server";

import {
  AUTH_ROUTES,
  PUBLIC_ROUTES,
  PROTECTED_ROUTES,
  isAuthenticationRoute,
  isProtectedRoute,
  isPublicRoute,
  isUnauthenticatedOnly,
} from "./middleware/routes-matcher";

export default function middleware(req: NextRequest) {
  const { nextUrl } = req;

  if (isPublicRoute(nextUrl.pathname)) {
    console.log("public route");
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
