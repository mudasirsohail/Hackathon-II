from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class ConversationBase(SQLModel):
    """Base model for Conversation with common fields."""
    user_id: str  # Changed from foreign_key="users.id" to plain string
    role: str = Field(max_length=20)  # 'user' or 'assistant'
    content: str


class Conversation(ConversationBase, table=True):
    """Conversation model representing chat messages."""
    id: Optional[int] = Field(default=None, primary_key=True)  # Changed to int for serial
    created_at: datetime = Field(default_factory=datetime.utcnow)  # Changed to match requirements


class ConversationCreate(ConversationBase):
    """Model for creating a new conversation message."""
    pass


class ConversationPublic(ConversationBase):
    """Public representation of a conversation message."""
    id: int  # Changed to int
    created_at: datetime  # Changed to match requirements