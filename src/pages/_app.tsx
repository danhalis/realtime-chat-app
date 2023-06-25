import type { AppProps } from "next/app";

import { SessionProvider, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

// https://next-auth.js.org/getting-started/client#custom-client-session-handling
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const pageAuth = Component.auth;
  return (
    <SessionProvider session={session}>
      {pageAuth ? (
        <Auth signInRoute={pageAuth.redirect} loading={pageAuth.loading}>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}

function Auth({
  signInRoute,
  loading,
  children,
}: {
  signInRoute?: string;
  loading?: React.ReactNode;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { status } = useSession({
    required: true, // if `{ required: true }`, `status` can only be "loading" or "authenticated"
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      if (signInRoute) {
        router.push({
          pathname: signInRoute,
          query: {
            callbackUrl: router.pathname,
          },
        });
      } else {
        // Redirect to default sign in page
        signIn();
      }
    },
  });

  if (status === "loading") {
    return loading;
  }

  return children;
}
