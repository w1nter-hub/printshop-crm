"""
Shared API dependencies for authentication and authorization.
"""

from typing import Callable, Iterable

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, UserRole


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def require_roles(*roles: UserRole) -> Callable:
    allowed = set(roles)

    async def _checker(current_user: User = Depends(get_current_active_user)) -> User:
        if current_user.role not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions",
            )
        return current_user

    return _checker


require_staff = require_roles(UserRole.ADMIN, UserRole.MANAGER)


async def get_current_client_user(
    current_user: User = Depends(get_current_active_user),
) -> User:
    if current_user.role != UserRole.CLIENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Client account required",
        )
    if not current_user.client_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Client profile is not linked to this account",
        )
    return current_user
