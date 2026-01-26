import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { comparePassword } from "./lib/password";
import { query } from "./lib/db";
import { User } from "./lib/types";
import { JWT } from "next-auth/jwt";
import { DefaultSession } from "next-auth";

// Extend the session type to include the id
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      email?: string;
      name?: string;
    } & DefaultSession["user"];
  }
}

// Extend JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    name?: string;
  }
}

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
        try {
          console.log("AUTHORIZE FUNCTION CALLED WITH CREDENTIALS:", credentials);

          // Validate credentials input
          if (!credentials) {
            console.log("AUTHORIZE: No credentials provided - returning null");
            return null;
          }

          if (!credentials.email || !credentials.password) {
            console.log("AUTHORIZE: Missing email or password in credentials - returning null");
            return null;
          }

          // Validate credentials types and sanitize inputs
          const email = typeof credentials.email === 'string' ? credentials.email.trim() : '';
          const password = typeof credentials.password === 'string' ? credentials.password : '';

          if (!email || !password) {
            console.log("AUTHORIZE: Invalid credential types or empty values - returning null");
            return null;
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            console.log("AUTHORIZE: Invalid email format - returning null");
            return null;
          }

          try {
            // Query the database for the user
            console.log("AUTHORIZE: Querying database for user:", email);
            const result = await query(
              "SELECT id, email, password FROM users WHERE email = $1",
              [email]
            );
            const typedResult = {
              rows: result.rows as Array<{ id: string; email: string; password: string }>
            };

            console.log("AUTHORIZE: Database query result rows count:", typedResult.rows.length);

            if (typedResult.rows.length === 0) {
              console.log("AUTHORIZE: No user found with email:", email);
              return null;
            }

            const dbUser = typedResult.rows[0];
            console.log("AUTHORIZE: User found in database, validating password");

            // Validate that the user object has required fields
            if (!dbUser.id || !dbUser.email) {
              console.error("AUTHORIZE: Database user object missing required fields:", dbUser);
              return null;
            }

            const isValid = await comparePassword(password, dbUser.password);
            console.log("AUTHORIZE: Password validation result:", isValid);

            if (!isValid) {
              console.log("AUTHORIZE: Invalid password for user:", email);
              return null;
            }

            // Create a clean user object to return, ensuring type safety
            const returnUser: User = {
              id: String(dbUser.id),
              email: String(dbUser.email)
            };

            console.log("AUTHORIZE: Successfully authenticated user:", returnUser);
            return returnUser;
          } catch (dbError: any) {
            console.error("AUTHORIZE: Database query error:", dbError?.message || dbError);
            console.error("AUTHORIZE: Full database error stack:", dbError?.stack || 'No stack trace');
            console.error("AUTHORIZE: Error name:", dbError?.name);
            console.error("AUTHORIZE: Error code:", dbError?.code);
            return null;
          }
        } catch (outerError: any) {
          console.error("AUTHORIZE: Outer error in authorize function:", outerError?.message || outerError);
          console.error("AUTHORIZE: Full outer error stack:", outerError?.stack || 'No stack trace');
          console.error("AUTHORIZE: Error name:", outerError?.name);
          console.error("AUTHORIZE: Error type:", typeof outerError);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      try {
        console.log("JWT CALLBACK CALLED - token:", JSON.stringify(token), "user:", JSON.stringify(user));

        if (user) {
          console.log("JWT: Setting token properties from user:", user);

          // Ensure user has required properties before assigning
          if (user.id) {
            token.id = String(user.id);
          }
          if (user.email) {
            token.email = String(user.email);
          }
          if (user.name) {
            token.name = String(user.name);
          }

          console.log("JWT: Updated token:", JSON.stringify(token));
        }

        console.log("JWT: Returning token:", JSON.stringify(token));
        return token;
      } catch (error: any) {
        console.error("JWT CALLBACK ERROR:", error?.message || error);
        console.error("JWT CALLBACK FULL ERROR STACK:", error?.stack || 'No stack trace');
        console.error("JWT CALLBACK ERROR NAME:", error?.name);
        console.error("JWT CALLBACK ERROR TYPE:", typeof error);
        throw error; // Re-throw to ensure the error is visible
      }
    },
    async session({ session, token }) {
      try {
        console.log("SESSION CALLBACK CALLED - session:", JSON.stringify(session), "token:", JSON.stringify(token));

        // Safely assign token properties to session
        if (session.user) {
          session.user.id = token.id ?? session.user.id;
          session.user.email = token.email ?? session.user.email;
          session.user.name = token.name ?? session.user.name;
        }

        console.log("SESSION: Updated session user:", JSON.stringify(session.user));
        console.log("SESSION: Returning session:", JSON.stringify(session));
        return session;
      } catch (error: any) {
        console.error("SESSION CALLBACK ERROR:", error?.message || error);
        console.error("SESSION CALLBACK FULL ERROR STACK:", error?.stack || 'No stack trace');
        console.error("SESSION CALLBACK ERROR NAME:", error?.name);
        console.error("SESSION CALLBACK ERROR TYPE:", typeof error);
        throw error; // Re-throw to ensure the error is visible
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
});