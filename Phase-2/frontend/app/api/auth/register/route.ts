import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/password';
import { query } from '@/lib/db';
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
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    const typedExistingUser = {
      rows: existingUser.rows as Array<{ id: string }>
    };

    if (typedExistingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user with a UUID
    const userId = uuidv4();
    const result = await query(
      'INSERT INTO users (id, email, password) VALUES ($1, $2, $3) RETURNING id',
      [userId, email, hashedPassword]
    );
    const typedResult = {
      rows: result.rows as Array<{ id: string }>
    };

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: { id: typedResult.rows[0].id, email }
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