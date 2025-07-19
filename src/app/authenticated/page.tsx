import React from "react";
import { auth } from "../../../auth";
export default async function Page() {
  const session = await auth();
  console.log(session);

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center text-2xl font-bold">
      Authenticated Page
    </div>
  );
}
