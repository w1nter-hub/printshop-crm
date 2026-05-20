"""
Client portal API — read-only access to own orders and profile.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_client_user
from app.core.database import get_db
from app.models.order import Order as OrderModel, OrderItem
from app.models.user import User
from app.schemas.client import Client
from app.schemas.order import Order

router = APIRouter(prefix="/portal", tags=["client-portal"])


@router.get("/me", response_model=Client)
async def get_my_profile(
    current_user: User = Depends(get_current_client_user),
    db: Session = Depends(get_db),
):
    from app.models.client import Client as ClientModel

    client = (
        db.query(ClientModel).filter(ClientModel.id == current_user.client_id).first()
    )
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client profile not found",
        )
    return client


@router.get("/orders", response_model=list[Order])
async def get_my_orders(
    current_user: User = Depends(get_current_client_user),
    db: Session = Depends(get_db),
):
    orders = (
        db.query(OrderModel)
        .options(
            joinedload(OrderModel.client),
            joinedload(OrderModel.items).joinedload(OrderItem.product),
        )
        .filter(OrderModel.client_id == current_user.client_id)
        .order_by(OrderModel.created_at.desc())
        .all()
    )
    return orders


@router.get("/orders/{order_id}", response_model=Order)
async def get_my_order(
    order_id: int,
    current_user: User = Depends(get_current_client_user),
    db: Session = Depends(get_db),
):
    order = (
        db.query(OrderModel)
        .options(
            joinedload(OrderModel.client),
            joinedload(OrderModel.items).joinedload(OrderItem.product),
        )
        .filter(
            OrderModel.id == order_id,
            OrderModel.client_id == current_user.client_id,
        )
        .first()
    )
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    return order
