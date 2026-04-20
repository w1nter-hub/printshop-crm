"""
Order API routes for PrintShop CRM application.

This module provides endpoints for order management.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from app.core.database import get_db
from app.schemas.order import Order, OrderCreate, OrderUpdate
from app.models.order import Order as OrderModel, OrderStatus
from app.services.order_service import create_order_with_items

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("/", response_model=List[Order])
async def get_orders(
    skip: int = 0,
    limit: int = 100,
    status: Optional[OrderStatus] = None,
    db: Session = Depends(get_db)
):
    """
    Get list of all orders.
    
    Args:
        skip: Number of records to skip (default: 0)
        limit: Maximum number of records to return (default: 100)
        status: Filter by order status (optional)
        db: Database session
        
    Returns:
        List of Order objects with client and items loaded
    """
    query = db.query(OrderModel).options(
        joinedload(OrderModel.client),
        joinedload(OrderModel.items)
    )
    
    if status:
        query = query.filter(OrderModel.status == status)
    
    orders = query.offset(skip).limit(limit).all()
    return orders


@router.get("/{order_id}", response_model=Order)
async def get_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    """
    Get order by ID.
    
    Args:
        order_id: Order ID
        db: Database session
        
    Returns:
        Order object with client and items loaded
        
    Raises:
        HTTPException 404: If order not found
    """
    order = db.query(OrderModel).options(
        joinedload(OrderModel.client),
        joinedload(OrderModel.items)
    ).filter(OrderModel.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    return order


@router.post("/", response_model=Order, status_code=status.HTTP_201_CREATED)
async def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new order with items.
    
    Args:
        order: OrderCreate schema with order and items data
        db: Database session
        
    Returns:
        Created Order object
    """
    new_order = create_order_with_items(db, order)
    return new_order


@router.put("/{order_id}", response_model=Order)
async def update_order(
    order_id: int,
    order_update: OrderUpdate,
    db: Session = Depends(get_db)
):
    """
    Update order information.
    
    Args:
        order_id: Order ID
        order_update: OrderUpdate schema with updated data (status, notes, deadline)
        db: Database session
        
    Returns:
        Updated Order object
        
    Raises:
        HTTPException 404: If order not found
    """
    db_order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not db_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    for key, value in order_update.model_dump(exclude_unset=True).items():
        setattr(db_order, key, value)
    
    db.commit()
    db.refresh(db_order)
    return db_order


@router.delete("/{order_id}")
async def delete_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete order by ID.
    
    Args:
        order_id: Order ID
        db: Database session
        
    Returns:
        Success message
        
    Raises:
        HTTPException 404: If order not found
    """
    db_order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not db_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    db.delete(db_order)
    db.commit()
    return {"message": "Order deleted successfully"}
