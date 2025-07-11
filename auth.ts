import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { JWT } from "next-auth/jwt";

// Type declarations for extended session and token
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    userId?: string;
    error?: string;
  }
}

// Token utility functions
const generateAccessToken = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const generateRefreshToken = (): string => {
  return (
    Math.random().toString(36).substring(2) +
    Date.now().toString(36) +
    Math.random().toString(36).substring(2)
  );
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  basePath: "/api/auth",
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  trustHost: true,
  session: {
    strategy: "jwt", // Changed to JWT for better token management
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, account, user, trigger, session }) {
      // Initial sign in
      if (account && user) {
        const accessToken = generateAccessToken();
        const refreshToken = generateRefreshToken();

        // Store tokens in the JWT
        token.accessToken = accessToken;
        token.refreshToken = refreshToken;
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;

        // Store refresh token in database
        await prisma.session.updateMany({
          where: { userId: user.id },
          data: {
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
        });

        return token;
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.exp as number)) {
        return token;
      }

      // Access token has expired, try to update it
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user.id = token.userId || "";
      session.user.email = token.email || "";
      session.user.name = token.name;
      session.user.image = token.picture;

      return session;
    },
  },
});

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    // Check if refresh token exists in database
    const session = await prisma.session.findFirst({
      where: {
        userId: token.userId,
        refreshToken: token.refreshToken,
      },
    });

    if (!session) {
      throw new Error("Refresh token not found");
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken();
    const newRefreshToken = generateRefreshToken();

    // Update tokens in database
    await prisma.session.update({
      where: { sessionToken: session.sessionToken },
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });

    // Update JWT token
    return {
      ...token,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);

    // Return token with error flag
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// Export token utility functions for external use
export { generateAccessToken, generateRefreshToken, refreshAccessToken };
