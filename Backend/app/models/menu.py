from sqlalchemy import Column, String, Text, Boolean, DECIMAL, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from ..database import Base


class MenuCategory(Base):
    """Menu category model"""
    __tablename__ = "menu_categories"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    restaurant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    
    # Relationships
    items = relationship("MenuItem", back_populates="category", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<MenuCategory(id={self.id}, name={self.name})>"


class MenuItem(Base):
    """Menu item model"""
    __tablename__ = "menu_items"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category_id = Column(UUID(as_uuid=True), ForeignKey("menu_categories.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(DECIMAL(10, 2), nullable=False)
    image_url = Column(Text)
    is_available = Column(Boolean, default=True, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    
    # Relationships
    category = relationship("MenuCategory", back_populates="items")
    
    def __repr__(self):
        return f"<MenuItem(id={self.id}, name={self.name}, price={self.price})>"
