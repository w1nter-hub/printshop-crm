"""
Authentication API routes for PrintShop CRM application.

This module provides endpoints for user authentication and authorization.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.auth import Token, LoginRequest, RegisterRequest, LoginResponse, AuthUser
from app.schemas.user import User as UserSchema, UserCreate
from app.api.deps import get_current_active_user
from app.models.user import User, UserRole
from app.services.auth_service import (
    authenticate_user,
    create_user,
    get_user_by_email,
    create_user_token,
)

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
async def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):
    """
    Register a new user.
    
    Args:
        request: RegisterRequest with email, password, and optional full_name
        db: Database session
        
    Returns:
        Created User object
        
    Raises:
        HTTPException 400: If email is already registered
    """
    existing_user = get_user_by_email(db, request.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user_data = UserCreate(
        email=request.email,
        password=request.password,
        full_name=request.full_name,
        role=UserRole.MANAGER,
    )
    
    new_user = create_user(db, user_data, role=UserRole.MANAGER)
    return new_user


@router.get("/me", response_model=AuthUser)
async def get_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@router.post("/login", response_model=LoginResponse)
async def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Login user and return JWT token.
    
    Args:
        request: LoginRequest with email and password
        db: Database session
        
    Returns:
        Token object with access_token and token_type
        
    Raises:
        HTTPException 401: If email or password is incorrect
    """
    user = authenticate_user(db, request.email, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token_data = create_user_token(user)
    return {
        **token_data,
        "user": AuthUser.model_validate(user),
    }
