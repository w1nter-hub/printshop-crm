"""
Authentication schemas for PrintShop CRM application.

This module defines Pydantic schemas for authentication requests and responses.
"""

from typing import Optional
from pydantic import BaseModel, EmailStr, Field

from app.models.user import UserRole


class Token(BaseModel):
    """
    Schema for JWT token response.
    
    Attributes:
        access_token: JWT access token string
        token_type: Token type (default: "bearer")
    """
    access_token: str
    token_type: str = "bearer"


class AuthUser(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str] = None
    role: UserRole
    client_id: Optional[int] = None

    class Config:
        from_attributes = True


class LoginResponse(Token):
    user: AuthUser


class TokenData(BaseModel):
    """
    Schema for decoded JWT token data.
    
    Attributes:
        email: User's email address from token
    """
    email: Optional[str] = None


class LoginRequest(BaseModel):
    """
    Schema for user login request.
    
    Attributes:
        email: User's email address
        password: User's password (minimum 6 characters)
    """
    email: EmailStr
    password: str = Field(..., min_length=6)


class RegisterRequest(BaseModel):
    """
    Schema for user registration request.
    
    Attributes:
        email: User's email address
        password: User's password (minimum 6 characters)
        full_name: User's full name (optional)
    """
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None
