import { prisma } from "../../prisma";
import { generateAccessToken, generateRefreshToken } from "../../auth";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface TokenValidationResult {
  isValid: boolean;
  userId?: string;
  error?: string;
}

/**
 * Generate a new token pair
 */
export const createTokenPair = (): TokenPair => {
  return {
    accessToken: generateAccessToken(),
    refreshToken: generateRefreshToken(),
  };
};

export const validateAccessToken = async (
  accessToken: string
): Promise<TokenValidationResult> => {
  try {
    const session = await prisma.session.findFirst({
      where: { accessToken },
      include: { user: true },
    });

    if (!session) {
      return { isValid: false, error: "Token not found" };
    }

    // Check if session is expired
    if (session.expires < new Date()) {
      return { isValid: false, error: "Session expired" };
    }

    return { isValid: true, userId: session.userId };
  } catch (error) {
    console.error("Error validating access token:", error);
    return { isValid: false, error: "Validation failed" };
  }
};

/**
 * Refresh tokens using a refresh token
 */
export const refreshTokens = async (
  refreshToken: string
): Promise<TokenPair | null> => {
  try {
    const session = await prisma.session.findFirst({
      where: { refreshToken },
    });

    if (!session) {
      return null;
    }

    // Generate new tokens
    const newTokens = createTokenPair();

    // Update session with new tokens
    await prisma.session.update({
      where: { sessionToken: session.sessionToken },
      data: {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      },
    });

    return newTokens;
  } catch (error) {
    console.error("Error refreshing tokens:", error);
    return null;
  }
};

/**
 * Revoke all tokens for a user
 */
export const revokeUserTokens = async (userId: string): Promise<boolean> => {
  try {
    await prisma.session.updateMany({
      where: { userId },
      data: {
        accessToken: null,
        refreshToken: null,
      },
    });
    return true;
  } catch (error) {
    console.error("Error revoking user tokens:", error);
    return false;
  }
};

/**
 * Get user sessions with tokens
 */
export const getUserSessions = async (userId: string) => {
  try {
    return await prisma.session.findMany({
      where: { userId },
      select: {
        sessionToken: true,
        expires: true,
        accessToken: true,
        refreshToken: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error("Error getting user sessions:", error);
    return [];
  }
};
