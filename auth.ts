import authConfig from "@/lib/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "./prisma";
import { handleSessionTokenRefresh } from "@/utils/auth-helper";

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
    async session({ session, user, token }) {
      //? JWT strategy'de user undefined olabilir, token kullan
      const userId = user?.id || token?.sub;

      if (userId) {
        const result = await handleSessionTokenRefresh(userId);
        if (result) {
          // session.error = result.error;
          session.error = "DefaultError";
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      // İlk girişte user bilgilerini token'a ekle
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  debug: process.env.NODE_ENV !== "production",
  useSecureCookies: process.env.NODE_ENV === "production",
});

//? error handling --> session = await auth() ----> if session.error is "RefreshTokenError" --> signIn()   ----> force signIn
