import { encode as defaultEncode } from "next-auth/jwt";
import NextAuth from "next-auth";
import { drizzleAdapter } from "@/lib/drizzleAdapter";
import { v4 as uuidv4 } from "uuid";
import authConfig from "@/lib/authConfig";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  debug: process.env.NODE_ENV != "production" && true,
  adapter: drizzleAdapter,
  ...authConfig,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider == "credentials") {
        token.Credentials = true;
      }

      if (user) {
        token.id = user.id;
        token.role = `${user.role}`;
      }
      return token;
    },

    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
    async signIn() {
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        // console.log(token, "loggin in user");
        return true;
      } else {
        // Return false to display a default error message
        // return false;
        // Or you can return a URL to redirect to:
        return "/unauthorized";
      }
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: "database",
    // maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxAge: 9 * 60 * 60,
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.Credentials) {
        const sessionToken = uuidv4();

        if (!params.token.sub) {
          throw new Error("No User Id found");
        }

        const createdSession = await drizzleAdapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.id as string,
          // expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          expires: new Date(Date.now() + 9 * 60 * 60 * 1000),
        });

        if (!createdSession) {
          throw new Error("Failed to create a session");
        }

        return sessionToken;
      }

      return defaultEncode(params);
    },
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 9 * 60 * 60, // 9 hours 2026-02-05T15:42:55.909Z
      },
    },
  },
});
