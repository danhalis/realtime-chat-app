import React from "react";
import { Toaster } from "react-hot-toast";

interface Props {
  children: React.ReactNode;
}

function Providers({ children }: Props) {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </>
  );
}

export default Providers;
