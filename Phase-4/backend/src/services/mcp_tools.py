from typing import Dict, Any, List
from pydantic import BaseModel, Field
from sqlmodel import Session
from .task_service import TaskService
from ..models.database import get_session
from ..models.task import TaskCreate, TaskUpdate


class AddTaskParams(BaseModel):
    user_id: str
    title: str
    description: str = Field(default="")


class ListTasksParams(BaseModel):
    user_id: str
    status: str = Field(default="all")  # "all", "pending", "completed"


class CompleteTaskParams(BaseModel):
    user_id: str
    task_id: int


class DeleteTaskParams(BaseModel):
    user_id: str
    task_id: int


class UpdateTaskParams(BaseModel):
    user_id: str
    task_id: int
    title: str = Field(default="")
    description: str = Field(default="")


class MCPTaskTools:
    """Class containing all MCP task tools."""
    
    @staticmethod
    def add_task(params: AddTaskParams) -> Dict[str, Any]:
        """Add a new task for a user."""
        try:
            # Create a session and add the task
            for session in get_session():
                task_create = TaskCreate(
                    title=params.title,
                    description=params.description if params.description else None
                )
                task = TaskService.create_task(session, params.user_id, task_create)
                
                return {
                    "success": True,
                    "task": {
                        "id": task.id,
                        "title": task.title,
                        "description": task.description,
                        "completed": task.completed,
                        "user_id": task.user_id,
                        "created_at": task.created_at.isoformat(),
                        "updated_at": task.updated_at.isoformat()
                    }
                }
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to add task: {str(e)}"
            }
    
    @staticmethod
    def list_tasks(params: ListTasksParams) -> Dict[str, Any]:
        """List tasks for a user, optionally filtered by status."""
        try:
            for session in get_session():
                tasks = TaskService.get_tasks(session, params.user_id, params.status if params.status != "all" else None)
                
                return {
                    "success": True,
                    "tasks": [
                        {
                            "id": task.id,
                            "title": task.title,
                            "description": task.description,
                            "completed": task.completed,
                            "user_id": task.user_id,
                            "created_at": task.created_at.isoformat(),
                            "updated_at": task.updated_at.isoformat()
                        }
                        for task in tasks
                    ]
                }
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to list tasks: {str(e)}"
            }
    
    @staticmethod
    def complete_task(params: CompleteTaskParams) -> Dict[str, Any]:
        """Mark a task as completed."""
        try:
            for session in get_session():
                task = TaskService.complete_task(session, params.user_id, params.task_id)

                if task:
                    return {
                        "success": True,
                        "task": {
                            "id": task.id,
                            "title": task.title,
                            "description": task.description,
                            "completed": task.completed,
                            "user_id": task.user_id,
                            "created_at": task.created_at.isoformat(),
                            "updated_at": task.updated_at.isoformat()
                        }
                    }
                else:
                    return {
                        "success": False,
                        "error": f"Task with ID {params.task_id} not found for user {params.user_id}"
                    }
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to complete task: {str(e)}"
            }

    @staticmethod
    def delete_task(params: DeleteTaskParams) -> Dict[str, Any]:
        """Delete a task for a user."""
        try:
            for session in get_session():
                success = TaskService.delete_task(session, params.user_id, params.task_id)

                if success:
                    return {
                        "success": True,
                        "message": f"Task with ID {params.task_id} deleted successfully"
                    }
                else:
                    return {
                        "success": False,
                        "error": f"Task with ID {params.task_id} not found for user {params.user_id}"
                    }
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to delete task: {str(e)}"
            }

    @staticmethod
    def update_task(params: UpdateTaskParams) -> Dict[str, Any]:
        """Update a task for a user."""
        try:
            for session in get_session():
                # Prepare update data
                update_data = {}
                if params.title:
                    update_data["title"] = params.title
                if params.description:
                    update_data["description"] = params.description

                if not update_data:
                    return {
                        "success": False,
                        "error": "At least one field (title or description) must be provided for update"
                    }

                task_update = TaskUpdate(**update_data)
                task = TaskService.update_task(session, params.user_id, params.task_id, task_update)

                if task:
                    return {
                        "success": True,
                        "task": {
                            "id": task.id,
                            "title": task.title,
                            "description": task.description,
                            "completed": task.completed,
                            "user_id": task.user_id,
                            "created_at": task.created_at.isoformat(),
                            "updated_at": task.updated_at.isoformat()
                        }
                    }
                else:
                    return {
                        "success": False,
                        "error": f"Task with ID {params.task_id} not found for user {params.user_id}"
                    }
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to update task: {str(e)}"
            }