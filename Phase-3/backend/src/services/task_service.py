from typing import List, Optional
from sqlmodel import Session, select
from ..models.task import Task, TaskCreate, TaskUpdate


class TaskService:
    """Service class for handling task operations."""

    @staticmethod
    def create_task(session: Session, user_id: str, task_create: TaskCreate) -> Task:
        """Create a new task for a user."""
        task = Task(user_id=user_id, **task_create.model_dump())
        session.add(task)
        session.commit()
        session.refresh(task)
        return task

    @staticmethod
    def get_tasks(session: Session, user_id: str, status: Optional[str] = None) -> List[Task]:
        """Get all tasks for a user, optionally filtered by status."""
        query = select(Task).where(Task.user_id == user_id)

        if status:
            if status.lower() == "completed":
                query = query.where(Task.completed == True)
            elif status.lower() == "pending":
                query = query.where(Task.completed == False)

        return session.exec(query).all()

    @staticmethod
    def get_task_by_id(session: Session, user_id: str, task_id: int) -> Optional[Task]:  # Changed to int
        """Get a specific task by ID for a user."""
        query = select(Task).where(Task.user_id == user_id, Task.id == task_id)
        return session.exec(query).first()

    @staticmethod
    def update_task(session: Session, user_id: str, task_id: int, task_update: TaskUpdate) -> Optional[Task]:  # Changed to int
        """Update an existing task for a user."""
        task = TaskService.get_task_by_id(session, user_id, task_id)
        if not task:
            return None

        update_data = task_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)

        session.add(task)
        session.commit()
        session.refresh(task)
        return task

    @staticmethod
    def complete_task(session: Session, user_id: str, task_id: int) -> Optional[Task]:  # Changed to int
        """Mark a task as completed."""
        task = TaskService.get_task_by_id(session, user_id, task_id)
        if not task:
            return None

        task.completed = True
        session.add(task)
        session.commit()
        session.refresh(task)
        return task

    @staticmethod
    def delete_task(session: Session, user_id: str, task_id: int) -> bool:  # Changed to int
        """Delete a task for a user."""
        task = TaskService.get_task_by_id(session, user_id, task_id)
        if not task:
            return False

        session.delete(task)
        session.commit()
        return True