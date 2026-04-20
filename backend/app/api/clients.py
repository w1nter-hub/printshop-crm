"""
Client API routes for PrintShop CRM application.

This module provides endpoints for client management.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.client import Client, ClientCreate, ClientUpdate
from app.models.client import Client as ClientModel

router = APIRouter(prefix="/clients", tags=["clients"])


@router.get("/", response_model=List[Client])
async def get_clients(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get list of all clients.
    
    Args:
        skip: Number of records to skip (default: 0)
        limit: Maximum number of records to return (default: 100)
        db: Database session
        
    Returns:
        List of Client objects
    """
    clients = db.query(ClientModel).offset(skip).limit(limit).all()
    return clients


@router.get("/{client_id}", response_model=Client)
async def get_client(
    client_id: int,
    db: Session = Depends(get_db)
):
    """
    Get client by ID.
    
    Args:
        client_id: Client ID
        db: Database session
        
    Returns:
        Client object
        
    Raises:
        HTTPException 404: If client not found
    """
    client = db.query(ClientModel).filter(ClientModel.id == client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    return client


@router.post("/", response_model=Client, status_code=status.HTTP_201_CREATED)
async def create_client(
    client: ClientCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new client.
    
    Args:
        client: ClientCreate schema with client data
        db: Database session
        
    Returns:
        Created Client object
    """
    db_client = ClientModel(**client.model_dump())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client


@router.put("/{client_id}", response_model=Client)
async def update_client(
    client_id: int,
    client_update: ClientUpdate,
    db: Session = Depends(get_db)
):
    """
    Update client information.
    
    Args:
        client_id: Client ID
        client_update: ClientUpdate schema with updated data
        db: Database session
        
    Returns:
        Updated Client object
        
    Raises:
        HTTPException 404: If client not found
    """
    db_client = db.query(ClientModel).filter(ClientModel.id == client_id).first()
    if not db_client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    for key, value in client_update.model_dump(exclude_unset=True).items():
        setattr(db_client, key, value)
    
    db.commit()
    db.refresh(db_client)
    return db_client


@router.delete("/{client_id}")
async def delete_client(
    client_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete client by ID.
    
    Args:
        client_id: Client ID
        db: Database session
        
    Returns:
        Success message
        
    Raises:
        HTTPException 404: If client not found
    """
    db_client = db.query(ClientModel).filter(ClientModel.id == client_id).first()
    if not db_client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    db.delete(db_client)
    db.commit()
    return {"message": "Client deleted successfully"}
