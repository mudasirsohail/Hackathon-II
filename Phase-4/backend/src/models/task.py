from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class TaskBase(SQLModel):
    """Base model for Task with common fields."""
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default="", max_length=1000)
    completed: bool = Field(default=False)
    user_id: str  # Foreign key reference to users table


class Task(TaskBase, table=True):
    """Task model representing a user's todo item."""
    __tablename__ = "todos"  # Explicitly set table name to match existing database
    id: Optional[int] = Field(default=None, primary_key=True)  # Changed to int for serial
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TaskCreate(TaskBase):
    """Model for creating a new task."""
    pass


class TaskUpdate(SQLModel):
    """Model for updating an existing task."""
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = None


class TaskPublic(TaskBase):
    """Public representation of a task (without internal fields)."""
    id: int  # Changed to int
    created_at: datetime
    updated_at: datetime