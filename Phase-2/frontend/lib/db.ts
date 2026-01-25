import { Pool } from 'pg';

// Validate DATABASE_URL at runtime when first accessed
const getDatabaseUrl = (): string => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  // Validate that the connection string looks like a proper PostgreSQL URL
  if (!connectionString.startsWith('postgresql://') && !connectionString.startsWith('postgres://')) {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection string starting with postgresql:// or postgres://');
  }

  return connectionString;
};

// Create a singleton pool instance
let pool: Pool | null = null;

const getPool = (): Pool => {
  if (!pool) {
    const connectionString = getDatabaseUrl();

    pool = new Pool({
      connectionString,
      // Always enable SSL for Neon (works both locally and in production)
      ssl: {
        rejectUnauthorized: false
      }
    });
  }

  return pool;
};

export const query = async (text: string, params?: any[]) => {
  try {
    const dbPool = getPool();
    return await dbPool.query(text, params);
  } catch (error) {
    console.error('Database query error:', error);
    // Re-throw the error to be handled by calling functions
    throw error;
  }
};