import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL;

    console.log('DATABASE_URL environment variable:', dbUrl);

    if (!dbUrl) {
      console.error('DATABASE_URL is not set');
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL is not set'
      });
    }

    // Parse the connection string to inspect its components
    try {
      const url = new URL(dbUrl);
      console.log('Connection string parsed - protocol:', url.protocol, 'hostname:', url.hostname, 'pathname:', url.pathname);
    } catch (parseError) {
      console.error('Error parsing DATABASE_URL:', parseError);
    }

    const pool = new Pool({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
    });

    // Test the connection
    const result = await pool.query('SELECT NOW() as now');

    console.log('Database connection test successful:', result.rows[0]);

    await pool.end();

    return NextResponse.json({
      success: true,
      timestamp: result.rows[0].now,
      message: 'Database connection successful'
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    console.error('Error type:', typeof error);
    console.error('Error name:', (error as Error).name);
    console.error('Error stack:', (error as Error).stack);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}