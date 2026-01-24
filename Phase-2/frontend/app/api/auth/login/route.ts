// import { NextRequest, NextResponse } from 'next/server';
// import { comparePassword } from '@/lib/password';
// import { query } from '@/lib/db';
// import { generateToken } from '@/lib/jwt';

// // Verify JWT_SECRET exists
// const JWT_SECRET = process.env.JWT_SECRET;
// if (!JWT_SECRET) {
//   throw new Error('JWT_SECRET is not defined in environment variables');
// }

// export async function POST(request: NextRequest) {
//   try {
//     const { email, password } = await request.json();

//     // Validate input
//     if (!email || !password) {
//       return NextResponse.json(
//         { error: 'Email and password are required' },
//         { status: 400 }
//       );
//     }

//     // Find the user by email
//     const result = await query('SELECT id, password FROM users WHERE email = $1', [email]);

//     if (result.rows.length === 0) {
//       return NextResponse.json(
//         { error: 'Invalid email or password' },
//         { status: 401 }
//       );
//     }

//     const user = result.rows[0];

//     // Compare the provided password with the hashed password
//     const isValidPassword = await comparePassword(password, user.password);

//     if (!isValidPassword) {
//       return NextResponse.json(
//         { error: 'Invalid email or password' },
//         { status: 401 }
//       );
//     }

//     // Generate JWT token
//     const token = generateToken(user.id);

//     // Create response and set the token in an HTTP-only cookie
//     const response = NextResponse.json(
//       {
//         message: 'Login successful',
//         user: { id: user.id, email }
//       },
//       { status: 200 }
//     );

//     response.cookies.set('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 60 * 60 * 24, // 24 hours
//       sameSite: 'lax',
//       path: '/',
//     });

//     return response;
//   } catch (error) {
//     console.error('Login error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }





























import type { NextApiRequest, NextApiResponse } from "next";
import { comparePassword } from "@/lib/password";
import { query } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import cookie from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const result = await query(
      "SELECT id, password FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      })
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}