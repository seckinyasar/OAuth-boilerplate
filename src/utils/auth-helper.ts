import { Account } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "../../prisma";

interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
}
interface RefreshTokenError {
  error: string;
  error_description?: string;
}

//#region //Helper -->  getGoogleAccount
export async function getGoogleAccount(
  userId: string
): Promise<Account | undefined> {
  const [googleAccount] = await prisma.account.findMany({
    where: {
      provider: "google",
      userId: userId,
    },
  });

  if (!googleAccount) {
    return undefined;
  }

  return googleAccount;
}
//#endregion

//#region //Helper -->  checkIfRefreshTokenExists
export function checkIfRefreshTokenExists(googleAccount: Account): boolean {
  return googleAccount.refresh_token !== null;
}
//#endregion

//#region //Helper -->  checkIfTokenExpired
export function checkIfTokenExpired(googleAccount: Account): boolean {
  const currentTime = Math.floor(Date.now() / 1000);
  if (!googleAccount.expires_at) {
    return true;
  }
  return googleAccount.expires_at < currentTime;
}
//#endregion

//#region //Helper -->  handleSessionTokenRefresh
export async function handleSessionTokenRefresh(
  userId: string
): Promise<RefreshTokenError | undefined> {
  try {
    const googleAccount = await getGoogleAccount(userId);

    if (googleAccount && checkIfTokenExpired(googleAccount)) {
      const result = await refreshGoogleAccessToken(googleAccount);

      if (!result.success) return result.error as RefreshTokenError;
    }
    return undefined;
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        error_type: "handleSessionTokenRefresh",
      },
    });
    return error as RefreshTokenError;
  }
}
//#endregion

//#region //Helper -->  refreshGoogleAccessToken
export async function refreshGoogleAccessToken(
  googleAccount: Account
): Promise<{
  success: boolean;
  error?: RefreshTokenError;
  tokens?: RefreshTokenResponse;
}> {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: googleAccount.refresh_token!,
      }),
    });

    const tokensOrError = await response.json();

    if (!response.ok) {
      const error = tokensOrError as RefreshTokenError;
      Sentry.captureException(error, {
        tags: {
          error_type: "refreshGoogleAccessToken",
        },
      });

      // Google API error response'larını handle et
      if (error.error === "invalid_grant") {
        // Refresh token expired veya revoked
        return {
          success: false,
          error: {
            error: "invalid_grant",
            error_description: "Refresh token expired or revoked",
          },
        };
      } else if (error.error === "invalid_client") {
        // Client credentials invalid
        return {
          success: false,
          error: {
            error: "invalid_client",
            error_description: "Invalid client credentials",
          },
        };
      } else {
        // Generic error
        return { success: false, error: error };
      }
    }

    const newTokens = tokensOrError as RefreshTokenResponse;

    //* Update tokens
    await prisma.account.update({
      data: {
        access_token: newTokens.access_token,
        expires_at: Math.floor(Date.now() / 1000) + newTokens.expires_in,
        refresh_token: newTokens.refresh_token ?? googleAccount.refresh_token,
      },
      where: {
        provider_providerAccountId: {
          provider: "google",
          providerAccountId: googleAccount.providerAccountId,
        },
      },
    });

    return { success: true, tokens: newTokens };
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        error_type: "refreshGoogleAccessToken",
      },
    });
    return { success: false, error: error as RefreshTokenError };
  }
}
//#endregion
