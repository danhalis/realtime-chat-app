import React, { ButtonHTMLAttributes, useState } from 'react'
import Button from './Button';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Loader2, LogOut } from 'lucide-react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

function SignOutButton(props: Props) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  return (
    <Button {...props} variant="ghost" onClick={async() => {
      setIsSigningOut(true);
      try {
        await signOut();
      } catch (error) {
        toast.error("An error has occurred.");
      } finally {
        setIsSigningOut(false);
      }
    }}>
      {isSigningOut ? (
        <Loader2 className="animate-spin w-4 h-4" />
      ) : (
        <LogOut className="w-4 h-4"/>
      )}
    </Button>
  )
}

export default SignOutButton