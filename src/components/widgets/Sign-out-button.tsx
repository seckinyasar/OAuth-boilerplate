"use client";
import { ArrowRight } from "lucide-react";
import { signOut } from "next-auth/react";

const buttonStyles =
  "h-10 w-full max-w-sm flex items-center justify-center border border-border rounded-md hover:bg-border/60 transition-all duration-300 gap-x-1 text-lg cursor-pointer";
export default function SignOut() {
  return (
    <button
      onClick={() => signOut({ redirectTo: "/", redirect: true })}
      className={buttonStyles}
    >
      Sign out
      <ArrowRight className="size-4" />
    </button>
  );
}
