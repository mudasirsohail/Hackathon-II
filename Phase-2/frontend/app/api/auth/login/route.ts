import { NextRequest, NextResponse } from 'next/server';
import { comparePassword } from '@/lib/password';
import { query } from '@/lib/db';
import { generateToken } from '@/lib/jwt';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find the user by email
    const result = await query('SELECT id, password FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Compare the provided password with the hashed password
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Create response and set the token in an HTTP-only cookie
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: { id: user.id, email }
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Will be true on Vercel which serves over HTTPS
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);

    // More specific error handling for database connection issues
    if (error.code === 'ENOTFOUND' || error.message.includes('getaddrinfo ENOTFOUND')) {
      return NextResponse.json(
        { error: 'Database connection error: Unable to connect to the database server' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}