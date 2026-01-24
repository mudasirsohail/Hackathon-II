"use client";

import { useState } from "react";
import { createTask } from "../lib/api";
import { Task } from "../lib/types";

interface TaskFormProps {
  onTaskCreated: (task: Task) => void;
}

export default function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const newTask = await createTask(title, description);
      onTaskCreated(newTask);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error creating task:", err);
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900"
            placeholder="What needs to be done?"
            required
          />
        </div>

        <div className="md:col-span-1 flex items-end pb-1">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg transition-all duration-300 ${
              isLoading
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:from-indigo-700 hover:to-purple-700'
            }`}
          >
            {isLoading ? 'Creating...' : 'Add Task'}
          </button>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (Optional)
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-900"
          placeholder="Add details..."
        />
      </div>

      {error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
          {error}
        </div>
      )}
    </form>
  );
}