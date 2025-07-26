import Image from "next/image";
import { auth } from "../../../auth";
const SignedInSuccess = async () => {
  const session = await auth();

  return (
    <div className="flex items-center justify-center h-screen flex-1">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Signed in successfully</h1>
        <p className="text-lg ">{"User Name: " + session?.user?.name}</p>
        <p className="text-lg">{"User Email: " + session?.user?.email}</p>
        <Image
          src={session?.user?.image ?? "https://i.pravatar.cc/300"}
          alt="user image"
          width={100}
          height={100}
          className="rounded-full w-40 h-40 object-contain"
        />
      </div>
    </div>
  );
};

export default SignedInSuccess;
