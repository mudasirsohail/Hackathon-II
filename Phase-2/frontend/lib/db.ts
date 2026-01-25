import { Pool } from 'pg';

// Initialize pool lazily to prevent server crashes during cold starts
let pool: Pool | null = null;

const getPool = (): Pool => {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    pool = new Pool({
      connectionString,
      ...(process.env.NODE_ENV === 'production' && {
        ssl: {
          rejectUnauthorized: false // Required for many production DB providers like Neon, Supabase
        }
      })
    });
  }

  return pool;
};

export const query = async (text: string, params?: any[]) => {
  const dbPool = getPool();
  return await dbPool.query(text, params);
};