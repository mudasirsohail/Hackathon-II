from sqlmodel import create_engine, Session, SQLModel
from .task import Task
from .conversation import Conversation
from ..core.config import settings


# Create the database engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DB_ECHO,
    pool_pre_ping=True,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
)


def create_db_and_tables():
    """Create database tables."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Get a database session."""
    with Session(engine) as session:
        yield session