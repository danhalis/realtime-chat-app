"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";

function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl: callbackUrl ?? "/dashboard"
      });
    } catch (error) {
      toast.error("Something went wrong when signing in.");
    } finally {
      setIsLoading(false);
    }
  };

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
        <Button
          className="w-full max-w-sm mx-auto space-x-1"
          isLoading={isLoading}
          onClick={signInWithGoogle}
        >
          {isLoading ? null : (
            <Image src="/google.png" alt="Google icon" width={20} height={20} />
          )}
          <span>Google</span>
        </Button>
      </div>
    </div>
  );
}

export default SignInPage;
