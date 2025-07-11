import { useSession } from "next-auth/react";
import { useCallback } from "react";

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const useTokens = () => {
  const { data: session, update } = useSession();

  const refreshTokens = useCallback(async (): Promise<TokenResponse | null> => {
    if (!session?.refreshToken) {
      return null;
    }

    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: session.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh tokens");
      }

      const newTokens = await response.json();

      // Update the session with new tokens
      await update({
        ...session,
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      });

      return newTokens;
    } catch (error) {
      console.error("Error refreshing tokens:", error);
      return null;
    }
  }, [session, update]);

  const validateToken = useCallback(async (): Promise<boolean> => {
    if (!session?.accessToken) {
      return false;
    }

    try {
      const response = await fetch("/api/auth/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: session.accessToken,
        }),
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      return result.isValid;
    } catch (error) {
      console.error("Error validating token:", error);
      return false;
    }
  }, [session?.accessToken]);

  const revokeTokens = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/revoke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error revoking tokens:", error);
      return false;
    }
  }, []);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (!session?.accessToken) {
      return null;
    }

    // First try to validate the current token
    const isValid = await validateToken();

    if (isValid) {
      return session.accessToken;
    }

    // If current token is invalid, try to refresh
    const newTokens = await refreshTokens();
    return newTokens?.accessToken || null;
  }, [session?.accessToken, validateToken, refreshTokens]);

  return {
    accessToken: session?.accessToken,
    refreshToken: session?.refreshToken,
    refreshTokens,
    validateToken,
    revokeTokens,
    getAccessToken,
  };
};
