from sqlalchemy import Column, String, TIMESTAMP, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from ..database import Base


class CustomerSession(Base):
    """Customer session model for temporary access"""
    __tablename__ = "customer_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(String(255), unique=True, nullable=False, index=True)
    phone_number = Column(String(50), nullable=True)  # Optional, for tracking
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    expires_at = Column(TIMESTAMP, nullable=False)
    request_count = Column(Integer, default=0)  # For rate limiting
    last_request_at = Column(TIMESTAMP, nullable=True)
    
    def __repr__(self):
        return f"<CustomerSession(id={self.id}, session_id={self.session_id[:8]}...)>"
