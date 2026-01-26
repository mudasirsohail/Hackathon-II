"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Header from "@/components/Header";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { Task } from "@/lib/types";
import { getTasks } from "@/lib/api";

export default function TasksDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return; // Wait for session status to resolve

    if (status === "unauthenticated") {
      router.replace('/login');
      return;
    }

    if (status === "authenticated") {
      fetchTasks();
    }
  }, [status, router]);

  const fetchTasks = async () => {
    try {
      setPageLoading(true);
      const tasksData = await getTasks();
      setTasks(tasksData);
      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err instanceof Error ? err.message : "Failed to load tasks");

      // If unauthorized, redirect to login
      if (err instanceof Error && err.message.includes('401')) {
        router.replace('/login');
      }
    } finally {
      setPageLoading(false);
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  if (status === "loading" || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Redirect happens in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />

      <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Manage Your Tasks</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Add, edit, and organize your tasks efficiently. All data is stored securely in your account.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
          <TaskForm onTaskCreated={handleTaskCreated} />

          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Tasks</h2>
            <TaskList
              tasks={tasks}
              onUpdateTask={handleTaskUpdated}
              onDeleteTask={handleTaskDeleted}
            />
          </div>
        </div>
      </main>
    </div>
  );
}