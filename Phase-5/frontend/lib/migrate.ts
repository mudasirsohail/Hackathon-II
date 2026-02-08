import { neon } from '@neondatabase/serverless';

// Initialize PostgreSQL pool
const getDatabaseUrl = (): string => {
  // First try the environment variable, then fallback to the .env.local file
  let connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    // Try to read from .env.local file directly
    try {
      const fs = require('fs');
      const path = require('path');
      const envPath = path.resolve(__dirname, '../.env.local');
      
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const dbUrlMatch = envContent.match(/^DATABASE_URL=(.*)$/m);
        if (dbUrlMatch) {
          connectionString = dbUrlMatch[1].trim().replace(/^["']|["']$/g, '');
        }
      }
    } catch (error) {
      console.log('Could not read .env.local file:', error);
    }
  }

  console.log('DATABASE_URL in migrate.ts:', connectionString);

  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in environment variables or .env.local file');
  }

  if (!connectionString.startsWith('postgresql://') && !connectionString.startsWith('postgres://')) {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection string starting with postgresql:// or postgres://');
  }

  // Parse the connection string to inspect its components
  try {
    const url = new URL(connectionString);
    console.log('Connection string parsed in migrate.ts - protocol:', url.protocol, 'hostname:', url.hostname, 'pathname:', url.pathname);
  } catch (parseError) {
    console.error('Error parsing DATABASE_URL in migrate.ts:', parseError);
  }

  return connectionString;
};

// Create a singleton sql client instance
let sqlInstance: ReturnType<typeof neon> | null = null;

const getSqlClient = () => {
  if (!sqlInstance) {
    const connectionString = getDatabaseUrl();
    console.log('Creating new neon client for migrations with connection string:', connectionString);
    sqlInstance = neon(connectionString);
  }

  return sqlInstance;
};

export const runMigrations = async () => {
  try {
    console.log('Running database migrations...');
    const sql = getSqlClient();

    // Create users table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT now()
      )
    `;

    // Create todos table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        completed BOOLEAN DEFAULT false,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      )
    `;
    
    console.log('Database migrations completed successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
};

if (require.main === module) {
  // This allows us to run the migration directly with ts-node
  runMigrations().catch(console.error);
}