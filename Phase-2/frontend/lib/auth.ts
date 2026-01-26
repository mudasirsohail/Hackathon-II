// import CredentialsProvider from "next-auth/providers/credentials";
// import { type NextAuthConfig } from "next-auth";
// import bcrypt from "bcrypt";
// import { Pool } from "pg";

// export const authOptions: NextAuthConfig = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         try {
//           if (!credentials?.email || !credentials?.password) return null;

//           // Safely get database URL
//           const dbUrl = process.env.DATABASE_URL;
//           if (!dbUrl) {
//             console.error("DATABASE_URL is not set");
//             return null;
//           }

//           // Create pool only when needed to avoid connection at import time
//           const pool = new Pool({
//             connectionString: dbUrl,
//             ssl: { rejectUnauthorized: false },
//           });

//           const res = await pool.query(
//             "SELECT id, email, password FROM users WHERE email = $1",
//             [credentials.email]
//           );

//           const user = res.rows[0];
//           if (!user) {
//             await pool.end();
//             return null;
//           }

//           const password = credentials.password;
//           const userPassword = user.password;

//           if (!password || !userPassword) {
//             await pool.end();
//             return null;
//           }

//           const valid = await bcrypt.compare(password as string, userPassword as string);

//           await pool.end();

//           if (!valid) return null;

//           // Return full user object with all necessary fields
//           return {
//             id: user.id,
//             email: user.email
//           };
//         } catch (error) {
//           console.error("AUTH AUTHORIZE ERROR:", error);
//           return null;
//         }
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//         session.user.email = token.email as string;
//       }
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   trustHost: true,
// };





















import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
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
          console.log("Authorize function called with:", {
            hasEmail: !!credentials?.email,
            hasPassword: !!credentials?.password,
            email: credentials?.email
          });

          if (!credentials?.email || !credentials?.password) {
            console.error("Missing credentials in authorize function");
            throw new Error("Missing credentials");
          }

          const dbUrl = process.env.DATABASE_URL;
          if (!dbUrl) {
            console.error("DATABASE_URL is not set in environment");
            throw new Error("DATABASE_URL is not set");
          }

          const email = (credentials.email as string).toLowerCase().trim();
          console.log("Attempting to find user with email:", email);

          const pool = new Pool({
            connectionString: dbUrl,
            ssl: { rejectUnauthorized: false },
          });

          const res = await pool.query(
            "SELECT id, email, password FROM users WHERE email = $1",
            [email]
          );

          console.log("Database query result:", {
            rowCount: res.rowCount,
            hasRows: res.rows.length > 0
          });

          const user = res.rows[0];

          if (!user) {
            console.error("User not found in database for email:", email);
            await pool.end();
            throw new Error("User not found");
          }

          console.log("User found in database, checking password...");

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          console.log("Password validation result:", isValid);

          if (!isValid) {
            console.error("Invalid password for user:", email);
            await pool.end();
            throw new Error("Invalid password");
          }

          console.log("User authenticated successfully:", user.id);

          // CRITICAL: RETURN ONLY THIS
          return {
            id: user.id.toString(),
            email: user.email
          };
        } catch (error) {
          console.error("AUTHORIZE ERROR:", error);
          throw error;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT callback called", { hasUser: !!user, tokenSub: token.sub });
      if (user) {
        token.id = user.id;
        token.email = user.email;
        console.log("JWT token updated with user info");
      }
      return token;
    },

    async session({ session, token }) {
      console.log("Session callback called", { hasToken: !!token, tokenHasId: !!token.id });
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        console.log("Session updated with user info");
      }
      return session;
    },
  },

  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
};