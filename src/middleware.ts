import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const pathname = req.nextUrl.pathname;

    const jwtToken = await getToken({ req });

    const publicRoutes = ["/signin"];
    const accessingPublicRoute = publicRoutes.some(publicRoute => pathname.startsWith(publicRoute));

    if (jwtToken) {
      if (pathname.startsWith("/signin") || pathname === "/") {
        // Redirect to dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
    else {
      if (!accessingPublicRoute) {
        const signInUrl = new URL("/signin", req.url);
        signInUrl.searchParams.set("callbackUrl", req.url);
        return NextResponse.redirect(signInUrl);
      }
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/signin",
    },
    callbacks: {
      // authorized: ({ token }) => token?.role === "admin",
      authorized: ({ token }) => true,
    },
  }
)

export const config = {
  matcher: ["/:path*",]
}