"""
Client schemas for PrintShop CRM application.

This module defines Pydantic schemas for Client model validation and serialization.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, model_validator


class ClientBase(BaseModel):
    """
    Base schema for Client with common attributes.
    
    Attributes:
        full_name: Client's full name (required, 1-255 characters)
        phone: Client's phone number (required, 10-50 characters)
        email: Client's email address (optional)
        company: Company name (optional)
        address: Client's address (optional)
        notes: Additional notes about the client (optional)
    """
    full_name: str = Field(..., min_length=1, max_length=255)
    phone: str = Field(..., min_length=10, max_length=50)
    email: Optional[EmailStr] = None
    company: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None


class ClientCreate(ClientBase):
    """
    Schema for creating a new client.
    
    Optional portal account lets the client log in and view their orders.
    """
    create_portal_account: bool = False
    portal_password: Optional[str] = Field(None, min_length=6)

    @model_validator(mode="after")
    def validate_portal_fields(self):
        if self.create_portal_account:
            if not self.email:
                raise ValueError("Email обязателен для доступа в личный кабинет")
            if not self.portal_password:
                raise ValueError("Укажите пароль для личного кабинета")
        return self


class ClientUpdate(BaseModel):
    """
    Schema for updating client information.
    
    All fields are optional to allow partial updates.
    """
    full_name: Optional[str] = Field(None, min_length=1, max_length=255)
    phone: Optional[str] = Field(None, min_length=10, max_length=50)
    email: Optional[EmailStr] = None
    company: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None


class ClientInDB(ClientBase):
    """
    Schema for Client as stored in database.
    
    Includes all database fields like id and timestamps.
    """
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class Client(ClientInDB):
    """
    Schema for Client response.
    
    Inherits from ClientInDB and used for API responses.
    """
    has_portal_account: bool = False
