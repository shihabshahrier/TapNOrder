from .menu import router as menu_router
from .orders import router as orders_router
from .whatsapp import router as whatsapp_router
from .admin import router as admin_router
from .session import router as session_router
from .auth import router as auth_router

__all__ = ["menu_router", "orders_router", "whatsapp_router", "admin_router", "session_router", "auth_router"]
