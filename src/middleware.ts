import authConfig from "@/lib/auth.config";
import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedOnlyRoute } from "./middleware/routes-helpers";

//? create auth instance for middleware without adapter.
export const { auth } = NextAuth(authConfig);

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const session = await auth();

  //? redirect to https in production.
  if (
    process.env.NODE_ENV === "production" &&
    !req.nextUrl.hostname.includes("localhost") &&
    req.nextUrl.protocol !== "https:"
  ) {
    return NextResponse.redirect(
      new URL(`https://${req.nextUrl.host}${req.nextUrl.pathname}`)
    );
  }

  //? check for error in url.
  const errorParam = nextUrl.searchParams.get("error");
  if (errorParam && nextUrl.pathname !== "/auth/error") {
    const errorUrl = new URL("/auth/error", nextUrl);
    errorUrl.searchParams.set("error", errorParam);
    return NextResponse.redirect(errorUrl);
  }

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
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
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
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
