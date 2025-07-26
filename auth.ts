import authConfig from "@/lib/auth.config";
import {
  checkIfRefreshTokenExists,
  getGoogleAccount,
  handleSessionTokenRefresh,
} from "@/utils/auth-helper";
import { PrismaAdapter } from "@auth/prisma-adapter";
import * as Sentry from "@sentry/nextjs";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  pages: {
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      const userId = token?.sub;
      if (!userId) {
        session.error = "DefaultError";
        return session;
      }

      const googleAccount = await getGoogleAccount(userId);
      if (!googleAccount) {
        session.error = "DefaultError";
        return session;
      }

      if (!checkIfRefreshTokenExists(googleAccount)) {
        const result = await handleSessionTokenRefresh(userId);
        //? returns undefined if success.
        if (result) {
          session.error = "DefaultError";
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async signIn({ user, account }) {
      if (user && account) {
        try {
          const updatedAccount = await prisma.account.update({
            data: {
              access_token: account.access_token,
              expires_at: account.expires_at,
              refresh_token: account.refresh_token,
              scope: account.scope,
              token_type: account.token_type,
              id_token: account.id_token,
            },
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });
        } catch (error) {
          Sentry.captureException(error, {
            tags: {
              error_type: "signIn",
            },
          });
        }
      }
      return true;
    },
  },
  debug: process.env.NODE_ENV !== "production",
  useSecureCookies: process.env.NODE_ENV === "production",
});
