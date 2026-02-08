import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSql } from '@/lib/db';
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

    // Get todos for the authenticated user from the database using template literals
    const sql = getSql();
    const result = await sql`SELECT * FROM todos WHERE user_id = ${userId} ORDER BY created_at DESC`;
    console.log('Query result received:', result);

    // Handle the result - neon returns an array directly
    const todos: Task[] = Array.isArray(result) ? result as Task[] : [];
    console.log('Number of todos retrieved:', todos.length);

    console.log('Returning todos:', todos);
    return NextResponse.json(todos);
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

    // Create the todo in the database using template literals
    const sql = getSql();
    const result = await sql`INSERT INTO todos (title, description, completed, user_id, created_at, updated_at) VALUES (${title}, ${description || ''}, ${false}, ${session.user.id}, NOW(), NOW()) RETURNING *`;
    console.log('Insert result received:', result);

    // Handle the result - neon returns an array directly
    const newTask: Task = (Array.isArray(result) && result.length > 0 ? result[0] : result) as Task;
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




















