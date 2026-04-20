"""
Product model for PrintShop CRM application.

This module defines the Product model for managing printing services and products.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime
from sqlalchemy.orm import relationship

from app.core.database import Base


class Product(Base):
    """
    Product model for printing services and products.
    
    Attributes:
        id: Primary key
        name: Product/service name (e.g., "Визитки")
        description: Detailed description of the product
        base_price: Base price per unit
        unit: Unit of measurement (e.g., "шт", "м²", "лист")
        is_active: Whether the product is currently available
        created_at: Timestamp when product was created
        updated_at: Timestamp when product was last updated
    """
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    base_price = Column(Float, nullable=False)
    unit = Column(String(50), nullable=False, default="шт")
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        """String representation of Product."""
        return f"<Product(id={self.id}, name='{self.name}', base_price={self.base_price}, unit='{self.unit}', active={self.is_active})>"
