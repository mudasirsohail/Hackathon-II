export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export const taskStore = {
  tasks: [] as Task[],
  nextId: 1,
};
