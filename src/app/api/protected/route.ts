import { NextRequest, NextResponse } from "next/server";
import {
  tokenMiddleware,
  getUserIdFromRequest,
} from "../../../middleware/tokenMiddleware";

export async function GET(request: NextRequest) {
  // Apply token middleware
  const middlewareResponse = await tokenMiddleware(request);

  if (middlewareResponse.status !== 200) {
    return middlewareResponse;
  }

  // Get user ID from the middleware
  const userId = getUserIdFromRequest(request);

  return NextResponse.json({
    message: "This is a protected endpoint",
    userId: userId,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  // Apply token middleware
  const middlewareResponse = await tokenMiddleware(request);

  if (middlewareResponse.status !== 200) {
    return middlewareResponse;
  }

  const userId = getUserIdFromRequest(request);
  const body = await request.json();

  return NextResponse.json({
    message: "Data received successfully",
    userId: userId,
    data: body,
    timestamp: new Date().toISOString(),
  });
}
