"use client";
import GithubSVG from "@/components/svgs/Github-logo";
import GoogleSVG from "@/components/svgs/Google-logo";
import MetaLogo from "@/components/svgs/Meta-logo";
import { X } from "lucide-react";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

const buttonStyles =
  "h-10 w-full flex items-center justify-center border border-border rounded-md gap-x-2 text-base font-medium hover:bg-border/70 transition-all duration-300 cursor-pointer";

interface SignInModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  useEffect(() => {}, [isOpen]);

  const handleClose = () => {
    onClose?.();
  };

  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="relative flex w-full h-fit max-w-[340px]">
        {/* //* Close button */}
        <div
          onClick={handleClose}
          className="absolute top-3 right-3 flex items-center justify-center hover:bg-border/70 transition-all duration-300 rounded-xl size-10 cursor-pointer"
        >
          <X className="size-4" />
        </div>
        {/* //* Modal content */}
        <div className="flex w-full h-fit max-w-[340px]">
          <section className="flex flex-col flex-1 min-h-[400px] border border-border rounded-2xl py-4 px-6 bg-background">
            {/* //* Logo and title */}
            <div className="flex flex-col grow-8 items-center justify-center pt-4 ">
              <MetaLogo width={70} height={70} fill="white" />
              <h2 className="text-xl mt-8 ">Welcome to Metakorteks</h2>
              <p className="text-lg text-muted-foreground">
                Sign in to your account
              </p>
            </div>
            {/* //* Sign in with Google */}
            <section
              className="flex grow-1 items-center justify-center"
              onClick={() =>
                signIn("google", {
                  callbackUrl: "/",
                  redirect: true,
                })
              }
            >
              <button className={buttonStyles}>
                <GoogleSVG width={18} height={18} fill="white" />
                Continue with Google
              </button>
            </section>
            {/* //* Sign in with Github */}
            <button className="flex grow-1 items-center justify-center">
              <div className={buttonStyles}>
                <GithubSVG width={18} height={18} fill="white" />
                Continue with GitHub
              </div>
            </button>
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
}
