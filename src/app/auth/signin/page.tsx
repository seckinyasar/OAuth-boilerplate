import GithubIcon from "@/components/svgs/GithubSVG";
import SignIn from "@/components/widgets/Sign-in-button";

const SigninPage = () => {
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="w-full max-w-md h-fit">
        <div className="h-fit rounded-[5px]">
          <section className="flex flex-col p-2 px-8 ">
            <section className="flex flex-col gap-6">
              {/* //* Magic Link Icons */}
              <div className="flex gap-4">
                <button className="flex items-center justify-center bg-[#222222] h-13 grow rounded-[10px] cursor-pointer">
                  <GithubIcon className="size-7" />
                </button>
                <SignIn />
              </div>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
};

export default SigninPage;
