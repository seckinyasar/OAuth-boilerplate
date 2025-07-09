"use client";
import GoogleIcon from "../../public/google_icon.svg";

import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <button onClick={() => signIn("google", { redirectTo: "/signin" })}>
      <GoogleIcon className="size-7" />
    </button>
  );
}
