"use client";

import { Task } from "../lib/types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TaskList({ tasks, onUpdateTask, onDeleteTask }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks yet</h3>
        <p className="mt-2 text-gray-600">Get started by creating a new task.</p>
      </div>
    );
  }

  return (
    <ul className="border border-gray-200 rounded-lg overflow-hidden">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onTaskUpdate={onUpdateTask}
          onTaskDelete={onDeleteTask}
        />
      ))}
    </ul>
  );
}