// frontend/lib/api.ts
import { Task } from './types';
import { signIn, signOut as nextAuthSignOut } from 'next-auth/react';

const getBaseUrl = () => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';

  // Get the NEXT_PUBLIC_APP_URL environment variable
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;

  // Validate the environment URL to prevent invalid hostnames like 'base'
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '' && !envUrl.includes('base')) {
    try {
      // Attempt to parse the URL to validate it
      const urlObj = new URL(envUrl);
      return urlObj.href.replace(/\/$/, ''); // Remove trailing slash if present
    } catch (e) {
      // If URL parsing fails, fall back to default behavior
      console.warn('Invalid NEXT_PUBLIC_APP_URL detected, falling back to default behavior');
    }
  }

  // For browser environment, use current origin
  if (isBrowser) {
    return '';
  }

  // For server environment, return empty string (will use relative paths)
  return '';
};

const API_BASE_URL = `${getBaseUrl()}/api`;

// AUTHENTICATION API FUNCTIONS
export const signup = async (email: string, password: string) => {
  try {
    // For signup, we'll make a direct API call to create the user
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // After successful signup, try to sign in
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      return { success: !!signInResult?.ok, data: signInResult };
    }

    return { success: false, data };
  } catch (error) {
    return { success: false, data: { error: 'Network error' } };
  }
};

export const login = async (email: string, password: string) => {
  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return { success: !!result?.ok, data: result };
  } catch (error) {
    return { success: false, data: { error: 'Network error' } };
  }
};

export const logout = async () => {
  await nextAuthSignOut({ redirect: false });
  return true;
};

// TASK API FUNCTIONS
export const getTasks = async (): Promise<Task[]> => {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: 'GET',
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized: Please log in again');
    }
    throw new Error(`Failed to fetch tasks: ${response.status}`);
  }

  return await response.json();
};

export const createTask = async (title: string, description: string): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized: Please log in again');
    }
    throw new Error(`Failed to create task: ${response.status}`);
  }

  return await response.json();
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized: Please log in again');
    }
    throw new Error(`Failed to update task: ${response.status}`);
  }

  return await response.json();
};

export const deleteTask = async (id: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized: Please log in again');
    }
    throw new Error(`Failed to delete task: ${response.status}`);
  }

  return true;
};

// Check if user is authenticated by making a test request
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'GET',
    });
    return response.status !== 401;
  } catch (error) {
    return false;
  }
};



