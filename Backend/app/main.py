from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from .routers import menu_router, orders_router, whatsapp_router, admin_router, session_router, auth_router
from .database import Base, engine
from .config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="TapNOrder API",
    description="WhatsApp-Integrated Food Ordering System",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(menu_router)
app.include_router(orders_router)
app.include_router(whatsapp_router)
app.include_router(admin_router)
app.include_router(session_router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "TapNOrder API",
        "version": "1.0.0",
        "restaurant": settings.restaurant_name
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
