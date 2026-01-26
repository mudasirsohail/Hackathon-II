import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    
    if (!dbUrl) {
      console.error('DATABASE_URL is not set');
      return NextResponse.json({ 
        success: false, 
        error: 'DATABASE_URL is not set' 
      });
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}