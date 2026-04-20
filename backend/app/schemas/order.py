"""
Order and OrderItem schemas for PrintShop CRM application.

This module defines Pydantic schemas for Order and OrderItem models validation and serialization.
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

from app.models.order import OrderStatus
from app.schemas.client import Client as ClientSchema


class OrderItemBase(BaseModel):
    """
    Base schema for OrderItem with common attributes.
    
    Attributes:
        product_id: ID of the product
        quantity: Quantity of the product (must be greater than 0)
        price: Price per unit at the time of order (must be greater than 0)
        specifications: Product specifications (format, circulation, color mode, etc.)
    """
    product_id: int
    quantity: int = Field(..., gt=0)
    price: float = Field(..., gt=0)
    specifications: Optional[str] = None


class OrderItemCreate(OrderItemBase):
    """
    Schema for creating a new order item.
    
    Inherits all fields from OrderItemBase.
    """
    pass


class OrderItemInDB(OrderItemBase):
    """
    Schema for OrderItem as stored in database.
    
    Includes database fields like id, order_id, and calculated total.
    """
    id: int
    order_id: int
    total: float
    
    class Config:
        from_attributes = True


class OrderItemWithProduct(OrderItemInDB):
    """
    Schema for OrderItem with product details.
    
    Includes the related product information.
    """
    product: Optional[dict] = None


class OrderBase(BaseModel):
    """
    Base schema for Order with common attributes.
    
    Attributes:
        client_id: ID of the client
        status: Order status (default: NEW)
        notes: Additional notes about the order
        deadline: Order completion deadline
    """
    client_id: int
    status: OrderStatus = OrderStatus.NEW
    notes: Optional[str] = None
    deadline: Optional[datetime] = None


class OrderCreate(OrderBase):
    """
    Schema for creating a new order.
    
    Includes a list of order items.
    """
    items: List[OrderItemCreate] = []


class OrderUpdate(BaseModel):
    """
    Schema for updating order information.
    
    All fields are optional to allow partial updates.
    """
    status: Optional[OrderStatus] = None
    notes: Optional[str] = None
    deadline: Optional[datetime] = None


class OrderInDB(OrderBase):
    """
    Schema for Order as stored in database.
    
    Includes all database fields like id, total_price, and timestamps.
    """
    id: int
    total_price: float
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class Order(OrderInDB):
    """
    Schema for Order response.
    
    Includes order items and client information.
    """
    items: List[OrderItemInDB] = []
    client: Optional[ClientSchema] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
