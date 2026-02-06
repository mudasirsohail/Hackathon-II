from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sqlmodel import Session, select

from ...models.task import Task, TaskCreate, TaskUpdate
from ...models.user import User, UserCreate
from ...models.database import get_session
from ...services.task_service import TaskService

router = APIRouter()


class TaskRequest(BaseModel):
    title: str
    description: Optional[str] = None
    user_id: str  # Added user_id to match the requirement


@router.post("/tasks")
async def create_task(task_request: TaskRequest, session: Session = Depends(get_session)):
    """
    Create a new task for a user.
    """
    print(f"=== POST /api/tasks called ===")
    print(f"Request data: {task_request}")
    print(f"User ID: {task_request.user_id}")
    print(f"Title: {task_request.title}")
    print(f"Description: {task_request.description}")
    
    try:
        # Ensure the user exists in the database
        print(f"Ensuring user exists: {task_request.user_id}")
        user = session.get(User, task_request.user_id)
        if not user:
            print(f"User {task_request.user_id} not found, creating user record")
            # Create a new user record
            user = User(
                id=task_request.user_id,
                email="unknown@example.com",  # Placeholder - in a real app, you'd get this from the session
                password=None  # OAuth users don't have passwords
            )
            session.add(user)
            session.commit()
            print(f"Created user record for: {task_request.user_id}")
        else:
            print(f"User {task_request.user_id} already exists in database")
        
        print(f"Creating task: {task_request.title} for user: {task_request.user_id}")

        # Create Task object directly with user_id
        task = Task(
            title=task_request.title,
            description=task_request.description,
            user_id=task_request.user_id
        )
        
        session.add(task)
        session.commit()
        session.refresh(task)

        print(f"Task created successfully with ID: {task.id}")
        return task
    except Exception as e:
        print(f"Error creating task: {str(e)}")
        import traceback
        print(f"Full traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Error creating task: {str(e)}")


@router.get("/tasks")
async def get_tasks(user_id: str, status: Optional[str] = None, session: Session = Depends(get_session)):
    """
    Get all tasks for a user, optionally filtered by status.
    """
    try:
        print(f"Getting tasks for user: {user_id}, status: {status}")
        
        tasks = TaskService.get_tasks(session, user_id, status)
        print(f"Found {len(tasks)} tasks")
        
        return tasks
    except Exception as e:
        print(f"Error getting tasks: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting tasks: {str(e)}")


@router.put("/tasks/{task_id}")
async def update_task(task_id: int, task_update: TaskUpdate, user_id: str, session: Session = Depends(get_session)):
    """
    Update an existing task for a user.
    """
    try:
        print(f"Updating task {task_id} for user: {user_id}")
        
        task = TaskService.update_task(session, user_id, task_id, task_update)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        return task
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating task: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error updating task: {str(e)}")


@router.patch("/tasks/{task_id}/complete")
async def complete_task(task_id: int, user_id: str, session: Session = Depends(get_session)):
    """
    Mark a task as completed.
    """
    try:
        print(f"Completing task {task_id} for user: {user_id}")
        
        task = TaskService.complete_task(session, user_id, task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        return task
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error completing task: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error completing task: {str(e)}")


@router.delete("/tasks/{task_id}")
async def delete_task(task_id: int, user_id: str, session: Session = Depends(get_session)):
    """
    Delete a task for a user.
    """
    try:
        print(f"Deleting task {task_id} for user: {user_id}")
        
        success = TaskService.delete_task(session, user_id, task_id)
        if not success:
            raise HTTPException(status_code=404, detail="Task not found")
        
        return {"message": "Task deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting task: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting task: {str(e)}")