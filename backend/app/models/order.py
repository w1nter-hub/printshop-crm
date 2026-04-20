"""
Order and OrderItem models for PrintShop CRM application.

This module defines the Order and OrderItem models for managing customer orders.
"""

from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship

from app.core.database import Base


class OrderStatus(str, PyEnum):
    """Order status enumeration."""
    NEW = "new"
    IN_PROGRESS = "in_progress"
    READY = "ready"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Order(Base):
    """
    Order model for customer orders.
    
    Attributes:
        id: Primary key
        client_id: Foreign key to Client
        status: Current order status
        total_price: Total price of the order
        notes: Additional notes about the order
        created_at: Timestamp when order was created
        updated_at: Timestamp when order was last updated
        deadline: Order completion deadline
        client: Relationship to Client
        items: Relationship to OrderItem (order items)
    """
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.NEW, nullable=False)
    total_price = Column(Float, default=0.0, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    deadline = Column(DateTime, nullable=True)

    # Relationships
    client = relationship("Client", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        """String representation of Order."""
        return f"<Order(id={self.id}, client_id={self.client_id}, status='{self.status.value}', total_price={self.total_price})>"


class OrderItem(Base):
    """
    OrderItem model for individual items in an order.
    
    Attributes:
        id: Primary key
        order_id: Foreign key to Order
        product_id: Foreign key to Product
        quantity: Quantity of the product
        price: Price per unit at the time of order
        total: Total price (quantity * price)
        specifications: Product specifications (format, circulation, color mode, etc.)
        product: Relationship to Product
    """
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    specifications = Column(Text, nullable=True)

    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product")

    def __repr__(self) -> str:
        """String representation of OrderItem."""
        return f"<OrderItem(id={self.id}, order_id={self.order_id}, product_id={self.product_id}, quantity={self.quantity}, total={self.total})>"
