from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from ..services.auth_service import auth_service
from ..config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    """Login request schema"""
    username: str
    password: str


class LoginResponse(BaseModel):
    """Login response schema"""
    access_token: str
    token_type: str = "bearer"


@router.post("/login", response_model=LoginResponse)
async def admin_login(credentials: LoginRequest):
    """
    Admin login endpoint
    For prototype: username=admin, password=API_KEY from settings
    In production, use proper user management with hashed passwords
    """
    # Simple authentication for prototype
    # In production, use proper user database with hashed passwords
    if credentials.username == "admin" and credentials.password == settings.api_key:
        # Generate JWT token
        token = auth_service.create_access_token(
            data={"sub": credentials.username, "role": "admin"}
        )
        return LoginResponse(access_token=token)
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
