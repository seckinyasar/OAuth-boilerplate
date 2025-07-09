import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  //? if we use correct naming on .env file, we can use just Google, no need to pass clientId and clientSecret.
  providers: [Google],
  basePath: "/api/auth",
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  trustHost: true,
  session: {
    //? If you use an `adapter` however, we default it to `"database"` instead.
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, account, user }) {
      return token;
    },
    async session({ session, token }) {
      console.log("session", session);
      return session;
    },
  },
});
