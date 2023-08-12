
import React from "react";
import GoogleSignInButton from "@/components/ui/auth/GoogleSignInButton";

function SignInPage() {
  return (
    <div
      className="flex min-h-full
      items-center justify-center
      px-4 py-12
      sm:px-6 lg:px-8"
    >
      <div
        className="w-full max-w-md
        flex flex-col items-center
        space-y-8"
      >
        <div
          className="flex flex-col items-center
          text-3xl text-gray-900 font-bold tracking-tight"
        >
          logo
          <h2 className="">Sign in to your account</h2>
        </div>
        <GoogleSignInButton />
      </div>
    </div>
  );
}

export default SignInPage;
