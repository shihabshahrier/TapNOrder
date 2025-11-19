from sqlalchemy import Column, String, Text, Integer, DECIMAL, TIMESTAMP, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from ..database import Base


class OrderType(str, enum.Enum):
    """Order type enumeration"""
    PICKUP = "pickup"
    DELIVERY = "delivery"


class OrderStatus(str, enum.Enum):
    """Order status enumeration"""
    PENDING = "pending"
    ACCEPTED = "accepted"
    COOKING = "cooking"
    ON_THE_WAY = "on_the_way"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class Order(Base):
    """Order model"""
    __tablename__ = "orders"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    restaurant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    customer_name = Column(String(255), nullable=False)
    customer_phone = Column(String(50), nullable=False)
    delivery_address = Column(Text)
    order_type = Column(SQLEnum(OrderType), nullable=False)
    total = Column(DECIMAL(10, 2), nullable=False)
    status = Column(SQLEnum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    
    # Relationships
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Order(id={self.id}, customer={self.customer_name}, status={self.status})>"


class OrderItem(Base):
    """Order item model"""
    __tablename__ = "order_items"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    item_id = Column(UUID(as_uuid=True), nullable=False)  # Reference to menu item
    name = Column(String(255), nullable=False)  # Snapshot of item name
    quantity = Column(Integer, nullable=False)
    unit_price = Column(DECIMAL(10, 2), nullable=False)
    subtotal = Column(DECIMAL(10, 2), nullable=False)
    
    # Relationships
    order = relationship("Order", back_populates="items")
    
    def __repr__(self):
        return f"<OrderItem(id={self.id}, name={self.name}, quantity={self.quantity})>"
