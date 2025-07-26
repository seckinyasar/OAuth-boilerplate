"use client";
import { SessionStatus } from "@/components/widgets/Session-status";
import SignInModal from "@/components/widgets/Sign-in-modal";
import SignOut from "@/components/widgets/Sign-out-button";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

const buttonStyles =
  "h-10 w-full max-w-sm flex items-center justify-center border border-border rounded-md hover:bg-border/60 transition-all duration-300 gap-x-1 text-lg cursor-pointer";

export default function Home() {
  const { data: session } = useSession();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  return (
    <main className="flex flex-col h-screen items-center justify-center">
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      />
      <h1 className="text-4xl font-semibold mb-20">Home</h1>
      <div className="flex flex-col w-full gap-y-2 items-center mb-10">
        <button
          className={buttonStyles}
          onClick={() => setIsSignInModalOpen(true)}
        >
          Sign in
          <ArrowRight className="size-4" />
        </button>
        <SignOut />
      </div>
      <section className="flex flex-col border border-border rounded-md w-full max-w-sm items-center group">
        <h2 className="font-medium border-b border-border w-full text-center py-2 group-hover:bg-border/70 transition-all duration-300">
          Active Session
        </h2>
        <div className="flex flex-col justify-center py-2">
          <div className="flex items-center gap-x-2">
            <SessionStatus isActive={!!session?.user?.name} />
            {session?.user?.name || "No name"}
          </div>
          <div className="flex items-center gap-x-2">
            <SessionStatus isActive={!!session?.user?.email} />
            {session?.user?.email || "No email"}
          </div>
        </div>
      </section>
    </main>
  );
}
