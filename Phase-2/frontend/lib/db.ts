import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is missing');
}

export const pool = new Pool({
  connectionString,
  ...(process.env.NODE_ENV === 'production' && {
    ssl: {
      rejectUnauthorized: false // Required for many production DB providers like Neon, Supabase
    }
  })
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};