"use client"
import React, { useState } from "react";
import Button from "../Button";
import Image from "next/image";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl");

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl: callbackUrl ?? "/dashboard",
      });
    } catch (error) {
      toast.error("Something went wrong when signing in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
}

export default GoogleSignInButton;
