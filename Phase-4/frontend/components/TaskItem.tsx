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
    <div className="bg-gray-50 rounded-lg p-3 flex items-start justify-between">
      <div className="flex items-start">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleCompletion}
          className={`h-5 w-5 mt-0.5 rounded focus:ring-green-500 accent-green-50 ${task.completed ? 'text-green-500 bg-green-50' : 'text-gray-300'}`}
        />
        <div className="ml-3 flex-1 min-w-0">
          <span className={`block font-medium truncate ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.title}
          </span>
          {task.description && (
            <span className={`block text-xs mt-1 truncate ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
              {task.description}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`text-xs font-medium px-3 py-1.5 rounded-md ml-2 flex-shrink-0 ${
          isDeleting
            ? 'bg-gray-200 text-gray-400'
            : 'bg-red-100 text-red-600 hover:bg-red-200'
        } transition-colors`}
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}