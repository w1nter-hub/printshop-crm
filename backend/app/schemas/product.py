"""
Product schemas for PrintShop CRM application.

This module defines Pydantic schemas for Product model validation and serialization.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    """
    Base schema for Product with common attributes.
    
    Attributes:
        name: Product/service name (required, 1-255 characters)
        description: Detailed product description (optional)
        base_price: Base price per unit (required, must be greater than 0)
        unit: Unit of measurement (default: "шт", max 50 characters)
        is_active: Whether the product is currently available (default: True)
    """
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    base_price: float = Field(..., gt=0)
    unit: str = Field(default="шт", max_length=50)
    is_active: bool = True


class ProductCreate(ProductBase):
    """
    Schema for creating a new product.
    
    Inherits all fields from ProductBase.
    """
    pass


class ProductUpdate(BaseModel):
    """
    Schema for updating product information.
    
    All fields are optional to allow partial updates.
    """
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    base_price: Optional[float] = Field(None, gt=0)
    unit: Optional[str] = Field(None, max_length=50)
    is_active: Optional[bool] = None


class ProductInDB(ProductBase):
    """
    Schema for Product as stored in database.
    
    Includes all database fields like id and timestamps.
    """
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class Product(ProductInDB):
    """
    Schema for Product response.
    
    Inherits from ProductInDB and used for API responses.
    """
    pass
