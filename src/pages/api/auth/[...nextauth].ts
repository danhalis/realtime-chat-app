import NextAuth from "next-auth/next";

import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "@/lib/data/db";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";

export function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_ID");
  }
  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_SECRET");
  }

  return {
    clientId,
    clientSecret,
  };
}

export const authOptions: NextAuthOptions = {
  // database adapter
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  // custom auth pages
  pages: {
    signIn: "/signin",
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  callbacks: {
    signIn: async ({ account, profile }) => {
      if (!account || !profile) return false;

      if (account.provider === "google") {
        const googleProfile = profile as GoogleProfile;
        return googleProfile.email_verified;
      }
      return true;
    },

    // at sign in success
    // or whenever a session is accessed in the client
    jwt: async ({ token, user }) => {
      const dbUser = (await db.get(`user:${token.id}`)) as User | null;

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      return {
        ...token,
        id: dbUser.id,
      };
    },

    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.image = token.picture;
      }

      return session;
    },

    redirect: () => "/dashboard",
  },
};

export default NextAuth(authOptions);
