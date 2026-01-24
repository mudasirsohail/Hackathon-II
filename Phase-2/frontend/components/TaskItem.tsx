"use client";

import { Task } from "../lib/types";
import { updateTask, deleteTask } from "../lib/api";
import { useState } from "react";

interface TaskItemProps {
  task: Task;
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

export default function TaskItem({ task, onTaskUpdate, onTaskDelete }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleCompletion = async () => {
    try {
      const updatedTask = await updateTask(task.id, { completed: !task.completed });
      onTaskUpdate(updatedTask);
    } catch (error) {
      console.error("Error toggling task completion:", error);
      alert("Failed to update task completion status");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete the task "${task.title}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      onTaskDelete(task.id);
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <li className="py-4 flex items-start justify-between border-b border-gray-200 last:border-0">
      <div className="flex items-start">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleCompletion}
          className="h-5 w-5 mt-0.5 text-indigo-600 rounded focus:ring-indigo-500"
        />
        <div className="ml-3">
          <span className={`block text-gray-900 font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </span>
          {task.description && (
            <span className={`block text-sm mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
              {task.description}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`text-sm font-medium px-3 py-1 rounded-md ${
          isDeleting
            ? 'bg-gray-100 text-gray-400'
            : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800'
        }`}
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </li>
  );
}