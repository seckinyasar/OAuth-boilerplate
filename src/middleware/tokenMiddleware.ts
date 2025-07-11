import { NextRequest, NextResponse } from "next/server";
import { validateAccessToken } from "../lib/tokenUtils";

export async function tokenMiddleware(request: NextRequest) {
  // Skip middleware for auth routes
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Check for Authorization header
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Authorization header required" },
      { status: 401 }
    );
  }

  const accessToken = authHeader.substring(7); // Remove "Bearer " prefix

  try {
    const validation = await validateAccessToken(accessToken);

    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error || "Invalid token" },
        { status: 401 }
      );
    }

    // Add user ID to request headers for downstream handlers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", validation.userId || "");

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Token middleware error:", error);
    return NextResponse.json(
      { error: "Token validation failed" },
      { status: 500 }
    );
  }
}

// Helper function to get user ID from request headers
export function getUserIdFromRequest(request: NextRequest): string | null {
  return request.headers.get("x-user-id");
}
