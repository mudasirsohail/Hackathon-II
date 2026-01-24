import { Task } from './types';

// In-memory storage for tasks
let tasks: Task[] = [];
let nextId = 1;

// Helper function to generate a unique ID
const generateId = (): number => {
  return nextId++;
};

// Get all tasks
export const getTasks = async (): Promise<Task[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...tasks]; // Return a copy to prevent direct mutation
};

// Create a new task
export const createTask = async (title: string, description: string): Promise<Task> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const newTask: Task = {
    id: generateId(),
    title,
    description,
    completed: false,
    user_id: 'in-memory-user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  tasks.push(newTask);
  return { ...newTask }; // Return a copy
};

// Update an existing task
export const updateTask = async (id: number, updates: Partial<Task>): Promise<Task> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }
  
  const updatedTask = {
    ...tasks[taskIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  
  tasks[taskIndex] = updatedTask;
  return { ...updatedTask }; // Return a copy
};

// Delete a task
export const deleteTask = async (id: number): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const initialLength = tasks.length;
  tasks = tasks.filter(task => task.id !== id);
  
  return tasks.length < initialLength;
};

// Toggle task completion status
export const toggleTaskCompletion = async (id: number): Promise<Task> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }
  
  const updatedTask = {
    ...tasks[taskIndex],
    completed: !tasks[taskIndex].completed,
    updated_at: new Date().toISOString(),
  };
  
  tasks[taskIndex] = updatedTask;
  return { ...updatedTask }; // Return a copy
};

// Reset tasks (for testing purposes)
export const resetTasks = (): void => {
  tasks = [];
  nextId = 1;
};