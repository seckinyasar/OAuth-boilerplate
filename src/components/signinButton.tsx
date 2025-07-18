"use client";
import GoogleIcon from "@/components/svgs/GoogleSVG";
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <button
      onClick={() => signIn("google", { redirectTo: "/signin" })}
      className="flex items-center justify-center bg-[#222222] h-13 grow rounded-[10px] cursor-pointer"
    >
      <GoogleIcon className="size-7" />
    </button>
  );
}
