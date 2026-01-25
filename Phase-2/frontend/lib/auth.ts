import CredentialsProvider from "next-auth/providers/credentials";
import { type NextAuthConfig } from "next-auth";
import bcrypt from "bcrypt";
import { Pool } from "pg";

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          // Safely get database URL
          const dbUrl = process.env.DATABASE_URL;
          if (!dbUrl) {
            console.error("DATABASE_URL is not set");
            return null;
          }

          // Create pool only when needed to avoid connection at import time
          const pool = new Pool({
            connectionString: dbUrl,
            ssl: { rejectUnauthorized: false },
          });

          const res = await pool.query(
            "SELECT id, email, password FROM users WHERE email = $1",
            [credentials.email]
          );

          const user = res.rows[0];
          if (!user) {
            await pool.end();
            return null;
          }

          const password = credentials.password;
          const userPassword = user.password;

          if (!password || !userPassword) {
            await pool.end();
            return null;
          }

          const valid = await bcrypt.compare(password as string, userPassword as string);

          await pool.end();

          if (!valid) return null;

          // Return full user object with all necessary fields
          return {
            id: user.id,
            email: user.email
          };
        } catch (error) {
          console.error("AUTH AUTHORIZE ERROR:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
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
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
};