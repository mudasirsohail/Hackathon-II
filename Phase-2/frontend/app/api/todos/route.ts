import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { query } from '@/lib/db';
import { Task } from '@/lib/types';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/todos - Starting request');

    const session = await auth();
    console.log('Session retrieved:', !!session, 'User ID:', session?.user?.id);

    if (!session || !session.user?.id) {
      console.log('Unauthorized access - no session or user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    console.log('Fetching todos for user_id:', userId);

    // Get todos for the authenticated user from the database
    const getQuery = `
      SELECT *
      FROM todos
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const values = [userId];

    console.log('Executing query with params:', { query: getQuery, values });

    const result = await query(getQuery, values);
    console.log('Query result received:', result);

    const typedResult = {
      rows: result.rows as Task[]
    };
    console.log('Number of todos retrieved:', typedResult.rows.length);

    console.log('Returning todos:', typedResult.rows);
    return NextResponse.json(typedResult.rows);
  } catch (error) {
    console.error('Get todos error:', error);
    console.error('Error name:', (error as Error).name);
    console.error('Error message:', (error as Error).message);
    console.error('Error stack:', (error as Error).stack);
    return NextResponse.json({ error: 'Internal server error', details: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/todos - Starting request');

    const session = await auth();
    console.log('Session retrieved:', !!session, 'User ID:', session?.user?.id);

    if (!session || !session.user?.id) {
      console.log('Unauthorized access - no session or user ID');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, description } = await request.json();
    console.log('Received todo data:', { title, description });

    // Validate input
    if (!title) {
      console.log('Title validation failed');
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
    console.log('Executing insert query with params:', { query: insertQuery, values });

    const result = await query(insertQuery, values);
    console.log('Insert result received:', result);

    const typedResult = {
      rows: result.rows as Task[]
    };
    const newTask: Task = typedResult.rows[0];
    console.log('New task created:', newTask);

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Create todo error:', error);
    console.error('Error name:', (error as Error).name);
    console.error('Error message:', (error as Error).message);
    console.error('Error stack:', (error as Error).stack);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}




















