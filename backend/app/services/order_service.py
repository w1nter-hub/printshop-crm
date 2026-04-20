"""
Order service for PrintShop CRM application.

This module provides business logic for order management.
"""

from sqlalchemy.orm import Session
from typing import List

from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate, OrderItemCreate


def calculate_order_total(items: List[OrderItemCreate]) -> float:
    """
    Calculate total price for order items.
    
    Args:
        items: List of OrderItemCreate objects
        
    Returns:
        Total price calculated as sum of (quantity * price) for all items
        
    Example:
        >>> items = [
        ...     OrderItemCreate(product_id=1, quantity=100, price=5.0, specifications="A4"),
        ...     OrderItemCreate(product_id=2, quantity=50, price=10.0, specifications="A3")
        ... ]
        >>> total = calculate_order_total(items)
        >>> print(total)
        1000.0
    """
    total = sum(item.quantity * item.price for item in items)
    return total


def create_order_with_items(db: Session, order_data: OrderCreate) -> Order:
    """
    Create a new order with order items.
    
    Args:
        db: Database session
        order_data: OrderCreate schema with order and items data
        
    Returns:
        Created Order object with items
        
    Example:
        >>> order_data = OrderCreate(
        ...     client_id=1,
        ...     items=[OrderItemCreate(product_id=1, quantity=100, price=5.0)]
        ... )
        >>> order = create_order_with_items(db, order_data)
    """
    from sqlalchemy.orm import joinedload
    
    total_price = calculate_order_total(order_data.items)
    
    db_order = Order(
        client_id=order_data.client_id,
        status=order_data.status,
        total_price=total_price,
        notes=order_data.notes,
        deadline=order_data.deadline
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    for item in order_data.items:
        item_total = item.quantity * item.price
        db_item = OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price,
            total=item_total,
            specifications=item.specifications
        )
        db.add(db_item)
    
    db.commit()
    
    # Reload order with relationships
    db_order = db.query(Order).options(
        joinedload(Order.client),
        joinedload(Order.items)
    ).filter(Order.id == db_order.id).first()
    
    return db_order


def update_order_total(db: Session, order_id: int):
    """
    Recalculate and update total price for an order.
    
    Args:
        db: Database session
        order_id: Order ID
        
    Example:
        >>> update_order_total(db, order_id=1)
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        return
    
    items = db.query(OrderItem).filter(OrderItem.order_id == order_id).all()
    
    total_price = sum(item.total for item in items)
    
    order.total_price = total_price
    db.commit()
