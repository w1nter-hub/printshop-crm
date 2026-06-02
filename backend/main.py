"""
Main FastAPI application for PrintShop CRM.

This is the entry point for the PrintShop CRM API application.
It configures the FastAPI app, CORS middleware, and includes all API routers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import init_db
from app.api import auth, clients, products, orders, portal, analytics


# Create FastAPI application instance
app = FastAPI(
    title="PrintShop CRM API",
    description="API для системы управления клиентами полиграфии",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)


# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include API routers
app.include_router(auth.router)
app.include_router(clients.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(portal.router)
app.include_router(analytics.router)


@app.on_event("startup")
async def startup_event():
    """
    Initialize database on application startup.
    
    Creates all database tables if they don't exist.
    In production, use Alembic migrations instead.
    """
    init_db()


@app.get("/")
async def root():
    """
    Root endpoint.
    
    Returns basic API information, status, and available endpoints.
    """
    return {
        "message": "PrintShop CRM API",
        "status": "running",
        "docs_url": "/docs",
        "endpoints": ["/auth", "/clients", "/products", "/orders"]
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    
    Used to verify that the API is up and running.
    """
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
