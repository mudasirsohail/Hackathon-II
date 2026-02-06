from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routers import chat, mcp
from .api.routers import task  # Import the task router
from .core.config import settings
from .models.database import create_db_and_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables on startup
    create_db_and_tables()
    yield
    # Cleanup on shutdown if needed


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description=settings.APP_DESCRIPTION,
        lifespan=lifespan
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        # Expose headers for JWT
        expose_headers=["Access-Control-Allow-Origin"]
    )

    # Include API routers
    app.include_router(chat.router, prefix="/api", tags=["chat"])
    app.include_router(task.router, prefix="/api", tags=["tasks"])  # Include task router
    app.include_router(mcp.router, prefix="/mcp", tags=["mcp"])

    @app.get("/health")
    def health_check():
        return {"status": "healthy"}

    return app


app = create_app()