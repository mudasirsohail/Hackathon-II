"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Task } from "@/lib/types";
import { getTasks } from "@/lib/api";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchTasks = async () => {
        try {
          setLoading(true);
          const tasksData = await getTasks();
          setTasks(tasksData);
          setError(null);
        } catch (err) {
          console.error("Error fetching tasks:", err);
          setError(err instanceof Error ? err.message : "Failed to load tasks");
        } finally {
          setLoading(false);
        }
      };

      fetchTasks();
    } else {
      setLoading(false);
    }
  }, [status]);

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div id="hero" className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="pb-20 pt-10 sm:pb-24 sm:pt-16">
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Introducing Synapse</span>
              </h1>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Build, collaborate, and achieve more together
              </p>
              <p className="mt-6 text-xl text-gray-500 max-w-3xl mx-auto">
                Synapse combines powerful task management with AI-powered insights. Focus on what matters while we handle the rest.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/tasks"
                  className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get started free
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10 shadow hover:shadow-md transition-all duration-300"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </main>
        </div>
        
        {/* Dashboard Preview Section */}
        <div className="pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                {status === "authenticated" ? (
                  // Actual dashboard for logged-in users
                  <div className="w-full h-64 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                    {loading ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                      </div>
                    ) : error ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-red-500 font-bold text-lg mb-2">Error loading tasks</div>
                          <div className="text-gray-500">{error}</div>
                        </div>
                      </div>
                    ) : tasks.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-indigo-600 font-bold text-lg mb-2">No tasks yet</div>
                          <div className="text-gray-500 max-w-md">Create your first task in the Chat or Tasks section to see them here!</div>
                          <Link 
                            href="/tasks" 
                            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                          >
                            Create Your First Task
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full overflow-y-auto">
                        <div className="mb-4">
                          <h3 className="text-indigo-600 font-bold text-lg">Your Tasks Overview</h3>
                          <div className="flex gap-4 mt-2 text-sm">
                            <div className="bg-white rounded-lg p-2 shadow-sm">
                              <div className="text-gray-500">Total</div>
                              <div className="font-bold text-gray-900">{totalTasks}</div>
                            </div>
                            <div className="bg-white rounded-lg p-2 shadow-sm">
                              <div className="text-gray-500">Completed</div>
                              <div className="font-bold text-green-500">{completedTasks}</div>
                            </div>
                            <div className="bg-white rounded-lg p-2 shadow-sm">
                              <div className="text-gray-500">Pending</div>
                              <div className="font-bold text-yellow-500">{pendingTasks}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {tasks.slice(0, 5).map((task) => (
                            <div 
                              key={task.id} 
                              className={`p-2 rounded-lg flex items-center ${task.completed ? 'bg-green-50' : 'bg-white'}`}
                            >
                              <div className={`h-4 w-4 rounded-full border mr-2 ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}></div>
                              <div className="truncate">
                                <div className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                  {task.title}
                                </div>
                                {task.description && (
                                  <div className="text-xs text-gray-500 truncate">{task.description}</div>
                                )}
                              </div>
                            </div>
                          ))}
                          {tasks.length > 5 && (
                            <div className="text-xs text-gray-500 text-center mt-2">
                              ... and {tasks.length - 5} more tasks
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Static preview for logged-out users
                  <div className="w-full h-64 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-indigo-600 font-bold text-xl mb-2">Synapse Dashboard Preview</div>
                      <div className="text-gray-500">Interactive dashboard showing tasks, analytics, and team collaboration</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}