import authConfig from "@/lib/auth.config";
import {
  checkIfRefreshTokenExists,
  getGoogleAccount,
  handleSessionTokenRefresh,
} from "@/utils/auth-helper";
import { PrismaAdapter } from "@auth/prisma-adapter";
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
  },
  debug: process.env.NODE_ENV !== "production",
  useSecureCookies: process.env.NODE_ENV === "production",
});
