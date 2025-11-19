from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import secrets
import logging
from ..models.session import CustomerSession
from ..config import settings

logger = logging.getLogger(__name__)


class SessionService:
    """Service for managing customer sessions"""
    
    SESSION_EXPIRE_HOURS = 24  # Sessions expire after 24 hours
    RATE_LIMIT_WINDOW = 60  # 60 seconds
    MAX_REQUESTS_PER_WINDOW = 10  # Max 10 requests per minute
    
    @staticmethod
    def generate_session_id() -> str:
        """Generate a secure random session ID"""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def create_session(db: Session, phone_number: str = None) -> CustomerSession:
        """Create a new customer session"""
        session_id = SessionService.generate_session_id()
        expires_at = datetime.utcnow() + timedelta(hours=SessionService.SESSION_EXPIRE_HOURS)
        
        session = CustomerSession(
            session_id=session_id,
            phone_number=phone_number,
            expires_at=expires_at,
            request_count=0
        )
        
        db.add(session)
        db.commit()
        db.refresh(session)
        
        logger.info(f"Created session: {session_id[:8]}... for phone: {phone_number}")
        return session
    
    @staticmethod
    def get_session(db: Session, session_id: str) -> CustomerSession:
        """Get session by session_id"""
        return db.query(CustomerSession).filter(
            CustomerSession.session_id == session_id
        ).first()
    
    @staticmethod
    def validate_session(db: Session, session_id: str) -> tuple[bool, str]:
        """
        Validate session and check rate limits
        Returns: (is_valid, error_message)
        """
        if not session_id:
            return False, "Session ID is required"
        
        session = SessionService.get_session(db, session_id)
        
        if not session:
            return False, "Invalid session"
        
        # Check if session is expired
        if datetime.utcnow() > session.expires_at:
            return False, "Session expired"
        
        # Check rate limiting
        now = datetime.utcnow()
        
        if session.last_request_at:
            time_since_last_request = (now - session.last_request_at).total_seconds()
            
            # Reset counter if outside the window
            if time_since_last_request > SessionService.RATE_LIMIT_WINDOW:
                session.request_count = 0
            elif session.request_count >= SessionService.MAX_REQUESTS_PER_WINDOW:
                return False, "Rate limit exceeded. Please try again later."
        
        # Update session
        session.request_count += 1
        session.last_request_at = now
        db.commit()
        
        return True, ""
    
    @staticmethod
    def cleanup_expired_sessions(db: Session) -> int:
        """Remove expired sessions from database"""
        deleted = db.query(CustomerSession).filter(
            CustomerSession.expires_at < datetime.utcnow()
        ).delete()
        db.commit()
        logger.info(f"Cleaned up {deleted} expired sessions")
        return deleted


# Global instance
session_service = SessionService()
