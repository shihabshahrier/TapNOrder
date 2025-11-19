from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import List
from decimal import Decimal
from datetime import datetime
import uuid
from ..models.order import OrderType, OrderStatus


class OrderItemCreate(BaseModel):
    """Schema for creating an order item"""
    item_id: uuid.UUID
    quantity: int = Field(..., gt=0)


class OrderItemResponse(BaseModel):
    """Schema for order item response"""
    id: uuid.UUID
    item_id: uuid.UUID
    name: str
    quantity: int
    unit_price: Decimal
    subtotal: Decimal
    
    model_config = ConfigDict(from_attributes=True)


class OrderCreate(BaseModel):
    """Schema for creating an order"""
    session_id: str | None = None  # Optional session ID for validation
    customer_name: str = Field(..., min_length=1, max_length=255)
    customer_phone: str = Field(..., min_length=10, max_length=50)
    delivery_address: str | None = None
    order_type: OrderType
    items: List[OrderItemCreate] = Field(..., min_length=1)
    
    @field_validator('delivery_address')
    @classmethod
    def validate_delivery_address(cls, v, info):
        """Validate that delivery address is provided for delivery orders"""
        # Note: order_type might not be available in info.data during validation
        # This validation will be done in the service layer
        return v


class OrderResponse(BaseModel):
    """Schema for order response"""
    id: uuid.UUID
    restaurant_id: uuid.UUID
    customer_name: str
    customer_phone: str
    delivery_address: str | None
    order_type: OrderType
    total: Decimal
    status: OrderStatus
    created_at: datetime
    items: List[OrderItemResponse]
    
    model_config = ConfigDict(from_attributes=True)


class OrderStatusUpdate(BaseModel):
    """Schema for updating order status"""
    status: OrderStatus


class OrderListResponse(BaseModel):
    """Schema for list of orders"""
    orders: List[OrderResponse]
    total: int
