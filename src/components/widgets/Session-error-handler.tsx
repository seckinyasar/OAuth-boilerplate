// src/components/widgets/Session-error-handler.tsx
"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export function SessionErrorHandler() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshTokenError") {
      // Force re-authentication
      signIn("google", {
        callbackUrl: window.location.pathname,
        redirect: true,
      });
    }
  }, [session?.error]);

  return null;
}
