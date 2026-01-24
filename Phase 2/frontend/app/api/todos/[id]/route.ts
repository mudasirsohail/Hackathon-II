import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { query } from '@/lib/db';
import { Task } from '@/lib/types';

// PUT /api/todos/:id - Update a specific todo
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params before accessing params.id
    const { id } = await params;

    // Get token from cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify the token
    const payload = verifyToken(token);

    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { title, description, completed } = await request.json();

    // Update the todo in the database
    const updateQuery = `
      UPDATE todos
      SET title = $1, description = $2, completed = $3, updated_at = NOW()
      WHERE id = $4 AND user_id = $5
      RETURNING *
    `;
    const values = [title, description, completed, id, payload.userId];

    const result = await query(updateQuery, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Todo not found or does not belong to user' },
        { status: 404 }
      );
    }

    const updatedTask: Task = result.rows[0];

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error('Update todo error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/todos/:id - Update a specific todo (for toggling completion, etc.)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params before accessing params.id
    const { id } = await params;

    // Get token from cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify the token
    const payload = verifyToken(token);

    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const updates = await request.json();

    // Build dynamic update query
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.title !== undefined) {
      updateFields.push(`title = $${paramIndex}`);
      values.push(updates.title);
      paramIndex++;
    }
    if (updates.description !== undefined) {
      updateFields.push(`description = $${paramIndex}`);
      values.push(updates.description);
      paramIndex++;
    }
    if (updates.completed !== undefined) {
      updateFields.push(`completed = $${paramIndex}`);
      values.push(updates.completed);
      paramIndex++;
    }

    // Add updated_at field
    updateFields.push(`updated_at = NOW()`);

    // Add id and userId to values
    values.push(id, payload.userId);
    const idParamIndex = paramIndex;
    const userIdParamIndex = paramIndex + 1;

    // Construct the query
    const updateQuery = `
      UPDATE todos
      SET ${updateFields.join(', ')}
      WHERE id = $${idParamIndex} AND user_id = $${userIdParamIndex}
      RETURNING *
    `;

    const result = await query(updateQuery, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Todo not found or does not belong to user' },
        { status: 404 }
      );
    }

    const updatedTask: Task = result.rows[0];

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error('Patch todo error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/todos/:id - Delete a specific todo
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params before accessing params.id
    const { id } = await params;

    // Get token from cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify the token
    const payload = verifyToken(token);

    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Delete the todo from the database
    const deleteQuery = `
      DELETE FROM todos
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
    const values = [id, payload.userId];

    const result = await query(deleteQuery, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Todo not found or does not belong to user' },
        { status: 404 }
      );
    }

    const deletedTask: Task = result.rows[0];

    return NextResponse.json({ message: 'Todo deleted successfully', task: deletedTask }, { status: 200 });
  } catch (error) {
    console.error('Delete todo error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/todos/:id - Get a specific todo
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params before accessing params.id
    const { id } = await params;

    // Get token from cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify the token
    const payload = verifyToken(token);

    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get the todo from the database
    const getQuery = `
      SELECT *
      FROM todos
      WHERE id = $1 AND user_id = $2
    `;
    const values = [id, payload.userId];

    const result = await query(getQuery, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Todo not found or does not belong to user' },
        { status: 404 }
      );
    }

    const task: Task = result.rows[0];

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error('Get todo error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



























