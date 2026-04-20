"""
Schemas package for PrintShop CRM application.

This package contains all Pydantic schemas for request/response validation.
"""

from app.schemas.user import User, UserCreate, UserUpdate, UserInDB
from app.schemas.client import Client, ClientCreate, ClientUpdate, ClientInDB
from app.schemas.product import Product, ProductCreate, ProductUpdate, ProductInDB
from app.schemas.order import (
    Order, 
    OrderCreate, 
    OrderUpdate, 
    OrderInDB,
    OrderItemCreate,
    OrderItemInDB,
    OrderItemWithProduct
)

__all__ = [
    "User",
    "UserCreate",
    "UserUpdate",
    "UserInDB",
    "Client",
    "ClientCreate",
    "ClientUpdate",
    "ClientInDB",
    "Product",
    "ProductCreate",
    "ProductUpdate",
    "ProductInDB",
    "Order",
    "OrderCreate",
    "OrderUpdate",
    "OrderInDB",
    "OrderItemCreate",
    "OrderItemInDB",
    "OrderItemWithProduct",
]