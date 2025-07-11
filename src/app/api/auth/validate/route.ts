import { NextRequest, NextResponse } from "next/server";
import { validateAccessToken } from "../../../../lib/tokenUtils";

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 }
      );
    }

    const validation = await validateAccessToken(accessToken);

    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error || "Invalid token" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      isValid: true,
      userId: validation.userId,
    });
  } catch (error) {
    console.error("Error validating token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
