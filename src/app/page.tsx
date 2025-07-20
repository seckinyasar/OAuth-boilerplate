import { SessionStatus } from "@/components/widgets/Session-status";
import SignOut from "@/components/widgets/Sign-out-button";
import { auth } from "@/middleware";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const buttonStyles =
  "h-10 w-full max-w-sm flex items-center justify-center border border-border rounded-md hover:bg-border/60 transition-all duration-300 gap-x-1 text-lg";

export default async function Home() {
  const session = await auth();
  return (
    <main className="flex flex-col  h-screen items-center justify-center">
      <h1 className="text-4xl font-semibold mb-20">Home</h1>
      <div className="flex flex-col w-full gap-y-2 items-center mb-10">
        <Link href="/auth/signin" className={buttonStyles}>
          Sign in
          <ArrowRight className="size-4" />
        </Link>
        <SignOut />
      </div>
      <section className="flex flex-col border border-border rounded-md w-full max-w-sm items-center ">
        <h2 className="font-medium border-b border-border w-full text-center py-2 ">
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
