"""
Client model for PrintShop CRM application.

This module defines the Client model for managing customer information.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class Client(Base):
    """
    Client model for customer management.
    
    Attributes:
        id: Primary key
        full_name: Client's full name
        phone: Client's phone number
        email: Client's email address (optional)
        company: Company name (optional)
        address: Client's address (optional)
        notes: Additional notes about the client (optional)
        created_at: Timestamp when client was created
        updated_at: Timestamp when client was last updated
    """
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    email = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    address = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    orders = relationship("Order", back_populates="client")

    def __repr__(self) -> str:
        """String representation of Client."""
        return f"<Client(id={self.id}, full_name='{self.full_name}', phone='{self.phone}', company='{self.company}')>"
