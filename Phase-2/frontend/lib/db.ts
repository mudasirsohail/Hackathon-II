import { neon } from '@neondatabase/serverless';

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

// Create a singleton query function instance
let sql: ReturnType<typeof neon> | null = null;

const getSqlClient = () => {
  if (!sql) {
    const connectionString = getDatabaseUrl();
    console.log('Creating new neon client with connection string:', connectionString);

    sql = neon(connectionString);
  }

  return sql;
};

// Export the neon client function for direct use with template literals
export const getSql = getSqlClient;

// Helper function to execute queries with parameters
export const query = async (text: string, params?: any[]) => {
  try {
    const sqlClient = getSqlClient();
    console.log('Executing query:', text);

    // For neon, we need to handle parameterized queries differently
    // Since neon uses template literals, we'll need to adapt the approach
    // For now, we'll handle the most common cases directly

    if (params && params.length > 0) {
      // Handle the specific queries used in the application
      if (text.includes('WHERE email = $1')) {
        // This is the user lookup query from auth.ts
        const [email] = params;
        const result = await sqlClient`SELECT id, email, password FROM users WHERE email = ${email}`;
        console.log('Query result:', result);
        // Handle the return type properly - neon returns different structures
        const rows = Array.isArray(result) ? result : [];
        return { rows, rowCount: rows.length };
      } else if (text.includes('INSERT INTO todos')) {
        // Handle INSERT queries
        const [title, description, userId] = params;
        const result = await sqlClient`INSERT INTO todos (title, description, user_id) VALUES (${title}, ${description}, ${userId}) RETURNING *`;
        console.log('Query result:', result);
        // Handle the return type properly - neon returns different structures
        const rows = Array.isArray(result) ? result : [];
        return { rows, rowCount: rows.length };
      } else if (text.includes('UPDATE todos SET')) {
        // Handle UPDATE queries
        const [title, description, completed, id, userId] = params;
        const result = await sqlClient`UPDATE todos SET title = ${title}, description = ${description}, completed = ${completed} WHERE id = ${id} AND user_id = ${userId} RETURNING *`;
        console.log('Query result:', result);
        // Handle the return type properly - neon returns different structures
        const rows = Array.isArray(result) ? result : [];
        return { rows, rowCount: rows.length };
      } else if (text.includes('DELETE FROM todos')) {
        // Handle DELETE queries
        const [id, userId] = params;
        const result = await sqlClient`DELETE FROM todos WHERE id = ${id} AND user_id = ${userId} RETURNING *`;
        console.log('Query result:', result);
        // Handle the return type properly - neon returns different structures
        const rows = Array.isArray(result) ? result : [];
        return { rows, rowCount: rows.length };
      } else {
        // For other queries, we'll need to implement them individually as needed
        throw new Error(`Unsupported dynamic query: ${text}`);
      }
    } else {
      // For queries without parameters, execute directly using template literal syntax
      // Since the query is passed as a string, we'll use a template literal with the string
      // This is a workaround to execute static queries
      const result = await sqlClient`${text}`;
      console.log('Query result:', result);
      // Handle the return type properly - neon returns different structures
      const rows = Array.isArray(result) ? result : [];
      return { rows, rowCount: rows.length };
    }
  } catch (error) {
    console.error('Database query error:', error);
    console.error('Error name:', (error as Error).name);
    console.error('Error message:', (error as Error).message);
    console.error('Error stack:', (error as Error).stack);
    // Re-throw the error to be handled by calling functions
    throw error;
  }
};