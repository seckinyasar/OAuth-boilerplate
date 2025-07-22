import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: "RefreshTokenError" | "ClientError" | "DefaultError";
  }
}

declare module "next-auth" {
  interface DefaultJWT {
    accessToken?: string;
  }
}
//* Augmenting the types
//? first we need to import the next-auth module, otherwise it rewrites the types. With import we can extend the types.
