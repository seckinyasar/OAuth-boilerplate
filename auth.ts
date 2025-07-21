import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/lib/auth.config";
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
      // JWT strategy'de user undefined olabilir, token kullan
      const userId = user?.id || token?.sub;

      if (userId) {
        //? get the google account from the database
        const [googleAccount] = await prisma.account.findMany({
          where: {
            provider: "google",
            userId: userId,
          },
        });

        if (googleAccount?.expires_at) {
          const currentTime = Math.floor(Date.now() / 1000);

          if (googleAccount.expires_at < currentTime) {
            //TODO buraya loglama servisi eklenebilir.
            try {
              const response = await fetch(
                "https://oauth2.googleapis.com/token",
                {
                  method: "POST",
                  body: new URLSearchParams({
                    client_id: process.env.GOOGLE_CLIENT_ID!,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                    grant_type: "refresh_token",
                    refresh_token: googleAccount.refresh_token!,
                  }),
                }
              );

              const tokensOrError = await response.json();
              if (!response.ok) throw tokensOrError;

              const newTokens = tokensOrError as {
                access_token: string;
                expires_in: number;
                refresh_token?: string;
              };

              await prisma.account.update({
                data: {
                  access_token: newTokens.access_token,
                  expires_at:
                    Math.floor(Date.now() / 1000) + newTokens.expires_in,
                  refresh_token:
                    newTokens.refresh_token ?? googleAccount.refresh_token,
                },
                where: {
                  provider_providerAccountId: {
                    provider: "google",
                    providerAccountId: googleAccount.providerAccountId,
                  },
                },
              });
            } catch (error) {
              console.error("Error refreshing access token", error);
              //? if it fails, return error so we can handle it in the client
              session.error = "RefreshTokenError";
            }
          }
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
