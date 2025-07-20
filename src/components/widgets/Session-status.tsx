"use client";
import { cn } from "@/lib/tw-utils";

interface SessionStatusProps {
  isActive: boolean;
}
export const SessionStatus = ({ isActive }: SessionStatusProps) => {
  return (
    <>
      <span className="relative flex size-2.5">
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full bg-gray-200 opacity-75",
            isActive && "bg-sky-400"
          )}
        ></span>
        <span
          className={cn(
            "relative inline-flex size-2.5 rounded-full bg-gray-600",
            isActive && "bg-sky-500"
          )}
        ></span>
      </span>
    </>
  );
};
