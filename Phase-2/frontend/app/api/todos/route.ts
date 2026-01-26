import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';
import { Task } from '@/lib/types';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get todos for the authenticated user from the database
    const getQuery = `
      SELECT *
      FROM todos
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const values = [session.user.id];

    const result = await query(getQuery, values);
    const typedResult = {
      rows: result.rows as Task[]
    };

    return NextResponse.json(typedResult.rows);
  } catch (error) {
    console.error('Get todos error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, description } = await request.json();

    // Validate input
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Create the todo in the database
    const insertQuery = `
      INSERT INTO todos (title, description, completed, user_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *
    `;
    const values = [title, description || '', false, session.user.id];

    const result = await query(insertQuery, values);
    const typedResult = {
      rows: result.rows as Task[]
    };
    const newTask: Task = typedResult.rows[0];

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Create todo error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




















