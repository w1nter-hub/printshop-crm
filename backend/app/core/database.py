"""
Database configuration module for PrintShop CRM application.

This module sets up SQLAlchemy engine, session, and base class for models.
It provides database connection management for PostgreSQL/Supabase.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator

from app.core.config import settings


# Create SQLAlchemy engine for Supabase/PostgreSQL.
engine = create_engine(
    settings.sqlalchemy_database_url,
    pool_pre_ping=True,
)

# Create SessionLocal class for database sessions
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Create Base class for declarative models
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """
    Database session dependency.
    
    Creates a new database session for each request and closes it after the request is complete.
    Use this function with FastAPI's Depends() to inject database sessions into route handlers.
    
    Yields:
        Session: SQLAlchemy database session
        
    Example:
        @app.get("/items")
        def read_items(db: Session = Depends(get_db)):
            return db.query(Item).all()
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _ensure_schema_updates() -> None:
    """Apply lightweight schema updates for existing PostgreSQL databases."""
    if not settings.sqlalchemy_database_url.startswith("postgresql"):
        return

    from sqlalchemy import text

    with engine.connect() as connection:
        connection.execute(
            text(
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS client_id INTEGER "
                "REFERENCES clients(id)"
            )
        )
        connection.commit()


def init_db() -> None:
    """
    Initialize database by creating all tables.
    
    This function creates all tables defined in SQLAlchemy models.
    Should be called on application startup or during initial setup.
    
    Note:
        In production, use Alembic migrations instead of this function.
    """
    Base.metadata.create_all(bind=engine)
    _ensure_schema_updates()
