"use client";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { errorMap, ErrorType } from "./types";

export default function AuthErrorPage() {
  const search = useSearchParams();
  const error = search.get("error") as ErrorType;

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Link
        href="/"
        className="relative block max-w-sm rounded-lg p-6 bg-white hover:bg-gray-300"
      >
        <div className="absolute right-4 top-4">
          <ArrowUpRight className="size-4 text-black" />
        </div>
        <h5 className="mb-2 flex flex-row items-center justify-center gap-2 text-xl font-bold tracking-tight text-gray-900">
          {errorMap[error]?.title || "Something went wrong"}
        </h5>
        <div className="font-normal text-gray-700">
          {errorMap[error]?.message ||
            "Please contact us if this error persists."}
        </div>
      </Link>
    </div>
  );
}
