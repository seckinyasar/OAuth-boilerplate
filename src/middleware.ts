import authConfig from "@/lib/auth.config";
import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {
  isAuthenticatedOnlyRoute,
  isUnauthenticatedOnlyRoute,
} from "./middleware/routes-helpers";

//? create auth instance for middleware without adapter.
export const { auth } = NextAuth(authConfig);
export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const session = await auth();
  console.log(session);

  //? check for api routes.
  if (nextUrl.pathname.startsWith("/api")) {
    if (nextUrl.pathname.startsWith("/api/auth")) {
      return NextResponse.next();
    }
    //? ask for session if it's not an auth route.
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    return NextResponse.next();
  }

  if (isAuthenticatedOnlyRoute(nextUrl.pathname)) {
    if (!session) {
      console.log("no session, redirecting to signin");
      return NextResponse.redirect(new URL("/signin", nextUrl));
    }
  }

  if (isUnauthenticatedOnlyRoute(nextUrl.pathname)) {
    if (session) {
      console.log("session, redirecting to authenticated");
      return NextResponse.redirect(new URL("/", nextUrl));
    }
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
