import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { comparePassword } from "./lib/password";
import { query } from "./lib/db";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Query the database for the user
          const result = await query(
            "SELECT id, email, password FROM users WHERE email = $1",
            [credentials.email]
          );

          if (result.rows.length === 0) return null;

          const user = result.rows[0];
          const isValid = await comparePassword(credentials.password as string, user.password);

          if (!isValid) return null;

          return { id: user.id, email: user.email };
        } catch (error) {
          console.error("AUTHORIZE ERROR:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
});