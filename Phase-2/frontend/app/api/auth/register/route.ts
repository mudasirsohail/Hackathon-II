import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/password';
import { getSql } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

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

    // Check if user already exists
    const sql = getSql();
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`;

    if (Array.isArray(existingUser) && existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user with a UUID
    const userId = uuidv4();
    const result = await sql`INSERT INTO users (id, email, password) VALUES (${userId}, ${email}, ${hashedPassword}) RETURNING id`;

    const newUser: { id: string } = (Array.isArray(result) && result.length > 0 ? result[0] : result) as { id: string };

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: { id: newUser.id, email }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}