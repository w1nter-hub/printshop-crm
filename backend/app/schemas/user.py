"""
User schemas for PrintShop CRM application.

This module defines Pydantic schemas for User model validation and serialization.
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field

from app.models.user import UserRole


class UserBase(BaseModel):
    """
    Base schema for User with common attributes.
    
    Attributes:
        email: User's email address
        full_name: User's full name (optional)
        role: User role (default: CLIENT)
    """
    email: EmailStr
    full_name: Optional[str] = None
    role: UserRole = UserRole.CLIENT


class UserCreate(UserBase):
    """
    Schema for creating a new user.
    
    Attributes:
        password: User's password (minimum 6 characters)
    """
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    """
    Schema for updating user information.
    
    All fields are optional to allow partial updates.
    """
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None


class UserInDB(UserBase):
    """
    Schema for User as stored in database.
    
    Includes all database fields like id and timestamps.
    """
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class User(UserInDB):
    """
    Schema for User response.
    
    Inherits from UserInDB and used for API responses.
    """
    pass


class Token(BaseModel):
    """
    Schema for JWT token response.
    
    Attributes:
        access_token: JWT access token
        token_type: Token type (usually "bearer")
    """
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """
    Schema for decoded JWT token data.
    
    Attributes:
        username: Username from token
        user_id: User ID from token
    """
    username: Optional[str] = None
    user_id: Optional[int] = None
