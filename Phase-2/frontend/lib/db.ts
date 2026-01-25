import { Pool } from 'pg';

// Initialize pool without checking at import time to prevent server crashes during cold starts
let pool: Pool;

if (!pool) {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('DATABASE_URL is missing');
    // In production, this will cause issues, but we don't throw to prevent server crashes
    // Instead, we'll handle the error at runtime when queries are made
    pool = new Pool();
  } else {
    pool = new Pool({
      connectionString,
      ...(process.env.NODE_ENV === 'production' && {
        ssl: {
          rejectUnauthorized: false // Required for many production DB providers like Neon, Supabase
        }
      })
    });
  }
}

export { pool };

export const query = async (text: string, params?: any[]) => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  return await pool.query(text, params);
};