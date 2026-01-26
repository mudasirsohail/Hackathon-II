import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import TasksDashboardClient from './TasksDashboardClient';

export default async function TasksDashboard() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  return <TasksDashboardClient />;
}