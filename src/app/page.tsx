"use client";
import { Button, Input } from "@/components/ui";
import GithubIcon from "../../public/github_icon.svg";
import GoogleIcon from "../../public/google_icon.svg";

export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="w-full max-w-md h-fit">
        <div className="h-fit rounded-[5px]">
          <section className="flex flex-col p-2 px-8">
            <section className="flex flex-col gap-6">
              {/* //* Magic Link Icons */}
              <div className="flex gap-4">
                <button className="flex items-center justify-center bg-[#222222] h-13 grow rounded-[10px] cursor-pointer">
                  <GithubIcon className="size-7 " />
                </button>
                <button className="flex items-center justify-center bg-[#222222] h-13 grow rounded-[10px] cursor-pointer">
                  <GoogleIcon className="size-7" />
                </button>
              </div>
              {/* //* OR */}
              <section className="text-center text-muted-foreground">
                or
              </section>
              <section className="flex flex-col gap-4">
                <Input className="" type="email" />
                <Button
                  className="text-lg font-normal bg-white opacity-50 text-black hover:opacity-100 cursor-pointer"
                  size="lg"
                >
                  Sign-in
                </Button>
              </section>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}
