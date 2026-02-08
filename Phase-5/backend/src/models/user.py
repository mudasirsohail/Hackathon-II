from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    """Base model for User with common fields."""
    email: str = Field(unique=True, max_length=255)
    password: Optional[str] = Field(default=None, max_length=255)  # Can be None for OAuth users


class User(UserBase, table=True):
    """User model representing a registered user."""
    id: Optional[str] = Field(default=None, primary_key=True)  # Using string ID to match NextAuth
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserCreate(UserBase):
    """Model for creating a new user."""
    email: str
    password: Optional[str] = None  # Password can be None for OAuth users


class UserUpdate(SQLModel):
    """Model for updating an existing user."""
    email: Optional[str] = None
    password: Optional[str] = None


class UserPublic(UserBase):
    """Public representation of a user (without sensitive data)."""
    id: str
    created_at: datetime