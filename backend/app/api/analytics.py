from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.order import Order, OrderStatus
from app.models.client import Client

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/dashboard")
async def get_dashboard_stats(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not start_date:
        start_date = datetime.now() - timedelta(days=30)
    if not end_date:
        end_date = datetime.now()
    
    total_orders = db.query(func.count(Order.id)).filter(
        Order.created_at.between(start_date, end_date)
    ).scalar()
    
    total_revenue = db.query(func.sum(Order.total_price)).filter(
        Order.created_at.between(start_date, end_date),
        Order.status == "completed"
    ).scalar() or 0
    
    total_clients = db.query(func.count(Client.id)).scalar()
    
    pending_orders = db.query(func.count(Order.id)).filter(
        Order.status == "new"
    ).scalar()
    
    return {
        "total_orders": total_orders,
        "total_revenue": float(total_revenue),
        "total_clients": total_clients,
        "pending_orders": pending_orders,
        "period": {
            "start": start_date,
            "end": end_date
        }
    }


@router.get("/orders-by-status")
async def get_orders_by_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    results = db.query(
        Order.status,
        func.count(Order.id).label("count")
    ).group_by(Order.status).all()
    
    return [{"status": status, "count": count} for status, count in results]


@router.get("/revenue-trend")
async def get_revenue_trend(
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    start_date = datetime.now() - timedelta(days=days)
    
    results = db.query(
        func.date(Order.created_at).label("date"),
        func.sum(Order.total_price).label("revenue")
    ).filter(
        Order.created_at >= start_date,
        Order.status == "completed"
    ).group_by(func.date(Order.created_at)).all()
    
    return [{"date": str(date), "revenue": float(revenue or 0)} for date, revenue in results]


@router.get("/top-clients")
async def get_top_clients(
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    results = db.query(
        Client.id,
        Client.full_name,
        func.count(Order.id).label("order_count"),
        func.sum(Order.total_price).label("total_spent")
    ).join(Order).group_by(Client.id, Client.full_name).order_by(
        func.sum(Order.total_price).desc()
    ).limit(limit).all()

    return [
        {
            "client_id": client_id,
            "name": full_name,
            "order_count": order_count,
            "total_spent": float(total_spent or 0)
        }
        for client_id, full_name, order_count, total_spent in results
    ]


@router.get("/monthly-stats")
async def get_monthly_stats(
    months: int = Query(12, ge=1, le=24),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Revenue and order counts grouped by month for the last N months."""
    start_date = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    # go back `months` months from the start of the current month
    for _ in range(months - 1):
        start_date = (start_date - timedelta(days=1)).replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    results = db.query(
        extract("year", Order.created_at).label("year"),
        extract("month", Order.created_at).label("month"),
        func.count(Order.id).label("order_count"),
        func.sum(Order.total_price).label("revenue"),
        func.sum(
            func.case((Order.status == OrderStatus.COMPLETED, Order.total_price), else_=0)
        ).label("completed_revenue"),
    ).filter(
        Order.created_at >= start_date
    ).group_by("year", "month").order_by("year", "month").all()

    MONTH_NAMES = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн",
                   "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"]

    return [
        {
            "month": MONTH_NAMES[int(month) - 1],
            "year": int(year),
            "label": f"{MONTH_NAMES[int(month) - 1]} {int(year)}",
            "order_count": order_count,
            "revenue": float(revenue or 0),
            "completed_revenue": float(completed_revenue or 0),
        }
        for year, month, order_count, revenue, completed_revenue in results
    ]
