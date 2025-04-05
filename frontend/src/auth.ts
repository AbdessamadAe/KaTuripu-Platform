// src/auth.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { type NextAuthConfig } from "next-auth";

const config: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const allowedUser = {
          email: "admin@katuripu.com",
          password: "AbdessamadNadi",
        };

        if (
          credentials?.email === allowedUser.email &&
          credentials?.password === allowedUser.password
        ) {
          return {
            id: "1",
            name: "Admin",
            email: allowedUser.email,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};

// Export the config and `auth()` function for server/middleware
export const { auth, handlers } = NextAuth(config);