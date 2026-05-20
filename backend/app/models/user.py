"""
User model for PrintShop CRM application.

This module defines the User model with role-based access control.
"""

from enum import Enum as PyEnum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class UserRole(str, PyEnum):
    """User role enumeration."""
    ADMIN = "admin"
    MANAGER = "manager"
    CLIENT = "client"


class User(Base):
    """
    User model for authentication and authorization.
    
    Attributes:
        id: Primary key
        email: User email address (unique)
        password_hash: Hashed password
        full_name: User's full name
        role: User role (admin, manager, or client)
        is_active: Whether the user account is active
        created_at: Timestamp when user was created
        updated_at: Timestamp when user was last updated
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(Enum(UserRole), default=UserRole.CLIENT, nullable=False)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=True, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    client = relationship("Client", back_populates="portal_user", uselist=False)

    def __repr__(self) -> str:
        """String representation of User."""
        return f"<User(id={self.id}, email='{self.email}', role='{self.role.value}', active={self.is_active})>"
