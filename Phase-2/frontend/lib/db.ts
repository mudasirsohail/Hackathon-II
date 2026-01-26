import { Pool } from '@neondatabase/serverless';

// Validate DATABASE_URL at runtime when first accessed
const getDatabaseUrl = (): string => {
  const connectionString = process.env.DATABASE_URL;

  console.log('DATABASE_URL in getDatabaseUrl:', connectionString);

  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  // Validate that the connection string looks like a proper PostgreSQL URL
  if (!connectionString.startsWith('postgresql://') && !connectionString.startsWith('postgres://')) {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection string starting with postgresql:// or postgres://');
  }

  // Parse the connection string to inspect its components
  try {
    const url = new URL(connectionString);
    console.log('Connection string parsed in getDatabaseUrl - protocol:', url.protocol, 'hostname:', url.hostname, 'pathname:', url.pathname);
  } catch (parseError) {
    console.error('Error parsing DATABASE_URL in getDatabaseUrl:', parseError);
  }

  return connectionString;
};

// Create a singleton pool instance
let pool: Pool | null = null;

const getPool = (): Pool => {
  if (!pool) {
    const connectionString = getDatabaseUrl();

    console.log('Creating new pool with connection string:', connectionString);

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
    console.log('Executing query:', text);
    const result = await dbPool.query(text, params);
    console.log('Query result:', result.rowCount, 'rows affected');
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    console.error('Error name:', (error as Error).name);
    console.error('Error message:', (error as Error).message);
    console.error('Error stack:', (error as Error).stack);
    // Re-throw the error to be handled by calling functions
    throw error;
  }
};