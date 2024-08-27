import Image from "next/image";
import LoginForm from "./loginForm";

const LogIn = () => {
  return (
    <>
      <div className="grow"></div>
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            alt="Uncovered Vibes Logo"
            priority
            src="/next.svg"
            className="mx-auto h-6 w-auto brightness-0"
            width={118}
            height={24}
          />
          <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-800">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <LoginForm />
          {/* <p className="mt-10 text-center text-sm text-gray-800">
            Not a member?{' '}
            <Link href="/" className="font-semibold leading-6 text-purple-500 hover:text-purple-400">
              Start a 14 day free trial
            </Link>
          </p> */}
        </div>
      </div>
      <div className="grow"></div>
    </>
  );
}
export default LogIn
