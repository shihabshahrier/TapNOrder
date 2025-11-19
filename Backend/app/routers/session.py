from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ..database import get_db
from ..services.session_service import session_service

router = APIRouter(prefix="/session", tags=["session"])


class SessionResponse(BaseModel):
    """Response schema for session creation"""
    session_id: str
    expires_in_hours: int = 24


@router.post("", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(db: Session = Depends(get_db)):
    """
    Create a new customer session for menu access
    This is called when a customer opens the menu link
    """
    session = session_service.create_session(db)
    
    return SessionResponse(
        session_id=session.session_id,
        expires_in_hours=24
    )


@router.get("/validate/{session_id}")
async def validate_session(session_id: str, db: Session = Depends(get_db)):
    """Validate if a session is still active"""
    is_valid, error_message = session_service.validate_session(db, session_id)
    
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=error_message
        )
    
    return {"valid": True, "message": "Session is active"}
