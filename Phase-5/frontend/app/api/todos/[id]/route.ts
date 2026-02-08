import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getSql } from '@/lib/db';
import { Task } from '@/lib/types';

export const runtime = 'nodejs';

// PUT /api/todos/:id - Update a specific todo
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params before accessing params.id
    const { id } = await params;

    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, description, completed } = await request.json();

    // Update the todo in the database using template literals
    const sql = getSql();
    const result = await sql`UPDATE todos SET title = ${title}, description = ${description}, completed = ${completed}, updated_at = NOW() WHERE id = ${id} AND user_id = ${session.user.id} RETURNING *`;

    if (Array.isArray(result) && result.length === 0) {
      return NextResponse.json(
        { error: 'Todo not found or does not belong to user' },
        { status: 404 }
      );
    }

    const updatedTask: Task = (Array.isArray(result) && result.length > 0 ? result[0] : result) as Task;

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error('Update todo error:', error);
    console.error('Error name:', (error as Error).name);
    console.error('Error message:', (error as Error).message);
    console.error('Error stack:', (error as Error).stack);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// PATCH /api/todos/:id - Update a specific todo (for toggling completion, etc.)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params before accessing params.id
    const { id } = await params;

    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const updates = await request.json();

    // Build dynamic update query using template literals
    const sql = getSql();

    // Handle different update scenarios with proper template literals
    if (updates.title !== undefined && updates.description !== undefined && updates.completed !== undefined) {
      // All three fields are being updated
      const result = await sql`UPDATE todos SET title = ${updates.title}, description = ${updates.description}, completed = ${updates.completed}, updated_at = NOW() WHERE id = ${id} AND user_id = ${session.user.id} RETURNING *`;

      if (Array.isArray(result) && result.length === 0) {
        return NextResponse.json(
          { error: 'Todo not found or does not belong to user' },
          { status: 404 }
        );
      }

      const updatedTask: Task = (Array.isArray(result) && result.length > 0 ? result[0] : result) as Task;
      return NextResponse.json(updatedTask, { status: 200 });
    } else if (updates.title !== undefined && updates.description !== undefined) {
      // Title and description are being updated
      const result = await sql`UPDATE todos SET title = ${updates.title}, description = ${updates.description}, updated_at = NOW() WHERE id = ${id} AND user_id = ${session.user.id} RETURNING *`;

      if (Array.isArray(result) && result.length === 0) {
        return NextResponse.json(
          { error: 'Todo not found or does not belong to user' },
          { status: 404 }
        );
      }

      const updatedTask: Task = (Array.isArray(result) && result.length > 0 ? result[0] : result) as Task;
      return NextResponse.json(updatedTask, { status: 200 });
    } else if (updates.title !== undefined && updates.completed !== undefined) {
      // Title and completed are being updated
      const result = await sql`UPDATE todos SET title = ${updates.title}, completed = ${updates.completed}, updated_at = NOW() WHERE id = ${id} AND user_id = ${session.user.id} RETURNING *`;

      if (Array.isArray(result) && result.length === 0) {
        return NextResponse.json(
          { error: 'Todo not found or does not belong to user' },
          { status: 404 }
        );
      }

      const updatedTask: Task = (Array.isArray(result) && result.length > 0 ? result[0] : result) as Task;
      return NextResponse.json(updatedTask, { status: 200 });
    } else if (updates.description !== undefined && updates.completed !== undefined) {
      // Description and completed are being updated
      const result = await sql`UPDATE todos SET description = ${updates.description}, completed = ${updates.completed}, updated_at = NOW() WHERE id = ${id} AND user_id = ${session.user.id} RETURNING *`;

      if (Array.isArray(result) && result.length === 0) {
        return NextResponse.json(
          { error: 'Todo not found or does not belong to user' },
          { status: 404 }
        );
      }

      const updatedTask: Task = (Array.isArray(result) && result.length > 0 ? result[0] : result) as Task;
      return NextResponse.json(updatedTask, { status: 200 });
    } else if (updates.title !== undefined) {
      // Only title is being updated
      const result = await sql`UPDATE todos SET title = ${updates.title}, updated_at = NOW() WHERE id = ${id} AND user_id = ${session.user.id} RETURNING *`;

      if (Array.isArray(result) && result.length === 0) {
        return NextResponse.json(
          { error: 'Todo not found or does not belong to user' },
          { status: 404 }
        );
      }

      const updatedTask: Task = (Array.isArray(result) && result.length > 0 ? result[0] : result) as Task;
      return NextResponse.json(updatedTask, { status: 200 });
    } else if (updates.description !== undefined) {
      // Only description is being updated
      const result = await sql`UPDATE todos SET description = ${updates.description}, updated_at = NOW() WHERE id = ${id} AND user_id = ${session.user.id} RETURNING *`;

      if (Array.isArray(result) && result.length === 0) {
        return NextResponse.json(
          { error: 'Todo not found or does not belong to user' },
          { status: 404 }
        );
      }

      const updatedTask: Task = (Array.isArray(result) && result.length > 0 ? result[0] : result) as Task;
      return NextResponse.json(updatedTask, { status: 200 });
    } else if (updates.completed !== undefined) {
      // Only completed is being updated
      const result = await sql`UPDATE todos SET completed = ${updates.completed}, updated_at = NOW() WHERE id = ${id} AND user_id = ${session.user.id} RETURNING *`;

      if (Array.isArray(result) && result.length === 0) {
        return NextResponse.json(
          { error: 'Todo not found or does not belong to user' },
          { status: 404 }
        );
      }

      const updatedTask: Task = (Array.isArray(result) && result.length > 0 ? result[0] : result) as Task;
      return NextResponse.json(updatedTask, { status: 200 });
    } else {
      // No updates provided
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Patch todo error:', error);
    console.error('Error name:', (error as Error).name);
    console.error('Error message:', (error as Error).message);
    console.error('Error stack:', (error as Error).stack);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE /api/todos/:id - Delete a specific todo
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params before accessing params.id
    const { id } = await params;

    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete the todo from the database using template literals
    const sql = getSql();
    const result = await sql`DELETE FROM todos WHERE id = ${id} AND user_id = ${session.user.id} RETURNING *`;

    if (Array.isArray(result) && result.length === 0) {
      return NextResponse.json(
        { error: 'Todo not found or does not belong to user' },
        { status: 404 }
      );
    }

    const deletedTask: Task = (Array.isArray(result) && result.length > 0 ? result[0] : result) as Task;

    return NextResponse.json({ message: 'Todo deleted successfully', task: deletedTask }, { status: 200 });
  } catch (error) {
    console.error('Delete todo error:', error);
    console.error('Error name:', (error as Error).name);
    console.error('Error message:', (error as Error).message);
    console.error('Error stack:', (error as Error).stack);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// GET /api/todos/:id - Get a specific todo
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params before accessing params.id
    const { id } = await params;

    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the todo from the database using template literals
    const sql = getSql();
    const result = await sql`SELECT * FROM todos WHERE id = ${id} AND user_id = ${session.user.id}`;

    if (Array.isArray(result) && result.length === 0) {
      return NextResponse.json(
        { error: 'Todo not found or does not belong to user' },
        { status: 404 }
      );
    }

    const task: Task = (Array.isArray(result) && result.length > 0 ? result[0] : result) as Task;

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error('Get todo error:', error);
    console.error('Error name:', (error as Error).name);
    console.error('Error message:', (error as Error).message);
    console.error('Error stack:', (error as Error).stack);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}



























