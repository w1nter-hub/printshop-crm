"""
Product API routes for PrintShop CRM application.

This module provides endpoints for product/service management.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.product import Product, ProductCreate, ProductUpdate
from app.models.product import Product as ProductModel

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/", response_model=List[Product])
async def get_products(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """
    Get list of all products.
    
    Args:
        skip: Number of records to skip (default: 0)
        limit: Maximum number of records to return (default: 100)
        active_only: Show only active products (default: True)
        db: Database session
        
    Returns:
        List of Product objects
    """
    query = db.query(ProductModel)
    if active_only:
        query = query.filter(ProductModel.is_active == True)
    
    products = query.offset(skip).limit(limit).all()
    return products


@router.get("/{product_id}", response_model=Product)
async def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """
    Get product by ID.
    
    Args:
        product_id: Product ID
        db: Database session
        
    Returns:
        Product object
        
    Raises:
        HTTPException 404: If product not found
    """
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product


@router.post("/", response_model=Product, status_code=status.HTTP_201_CREATED)
async def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new product.
    
    Args:
        product: ProductCreate schema with product data
        db: Database session
        
    Returns:
        Created Product object
    """
    db_product = ProductModel(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@router.put("/{product_id}", response_model=Product)
async def update_product(
    product_id: int,
    product_update: ProductUpdate,
    db: Session = Depends(get_db)
):
    """
    Update product information.
    
    Args:
        product_id: Product ID
        product_update: ProductUpdate schema with updated data
        db: Database session
        
    Returns:
        Updated Product object
        
    Raises:
        HTTPException 404: If product not found
    """
    db_product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    for key, value in product_update.model_dump(exclude_unset=True).items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product


@router.delete("/{product_id}")
async def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """
    Deactivate product by ID (soft delete).
    
    Args:
        product_id: Product ID
        db: Database session
        
    Returns:
        Success message
        
    Raises:
        HTTPException 404: If product not found
    """
    db_product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    db_product.is_active = False
    db.commit()
    return {"message": "Product deactivated successfully"}
