from sqlalchemy.orm import Session
from typing import List
from decimal import Decimal
import uuid
from ..models.order import Order, OrderItem, OrderStatus
from ..models.menu import MenuItem
from ..schemas.order import OrderCreate, OrderItemCreate
from .whatsapp_service import whatsapp_service
from ..config import settings
import logging

logger = logging.getLogger(__name__)


class OrderService:
    """Service for order business logic"""
    
    @staticmethod
    async def create_order(db: Session, order_data: OrderCreate) -> Order:
        """Create a new order with items"""
        
        # Validate delivery address for delivery orders
        if order_data.order_type.value == "delivery" and not order_data.delivery_address:
            raise ValueError("Delivery address is required for delivery orders")
        
        # Calculate total and create order items
        total = Decimal("0.00")
        order_items = []
        
        for item_data in order_data.items:
            # Fetch menu item
            menu_item = db.query(MenuItem).filter(MenuItem.id == item_data.item_id).first()
            if not menu_item:
                raise ValueError(f"Menu item {item_data.item_id} not found")
            
            if not menu_item.is_available:
                raise ValueError(f"Menu item '{menu_item.name}' is not available")
            
            # Calculate subtotal
            subtotal = menu_item.price * item_data.quantity
            total += subtotal
            
            # Create order item
            order_item = OrderItem(
                item_id=menu_item.id,
                name=menu_item.name,
                quantity=item_data.quantity,
                unit_price=menu_item.price,
                subtotal=subtotal
            )
            order_items.append(order_item)
        
        # Create order
        order = Order(
            restaurant_id=uuid.UUID(settings.restaurant_id),
            customer_name=order_data.customer_name,
            customer_phone=order_data.customer_phone,
            delivery_address=order_data.delivery_address,
            order_type=order_data.order_type,
            total=total,
            status=OrderStatus.PENDING,
            items=order_items
        )
        
        db.add(order)
        db.commit()
        db.refresh(order)
        
        # Send order confirmation via WhatsApp
        await whatsapp_service.send_order_confirmation(
            order_data.customer_phone,
            str(order.id)
        )
        
        logger.info(f"Order created: {order.id} for {order.customer_name}")
        return order
    
    @staticmethod
    async def update_order_status(db: Session, order_id: uuid.UUID, new_status: OrderStatus) -> Order:
        """Update order status and send WhatsApp notification"""
        
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise ValueError(f"Order {order_id} not found")
        
        # Update status
        old_status = order.status
        order.status = new_status
        db.commit()
        db.refresh(order)
        
        # Send status update via WhatsApp (skip for pending status)
        if new_status != OrderStatus.PENDING:
            await whatsapp_service.send_status_update(
                order.customer_phone,
                new_status
            )
        
        logger.info(f"Order {order_id} status updated: {old_status} -> {new_status}")
        return order
    
    @staticmethod
    def get_order(db: Session, order_id: uuid.UUID) -> Order:
        """Get order by ID"""
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise ValueError(f"Order {order_id} not found")
        return order
    
    @staticmethod
    def get_orders(db: Session, restaurant_id: str = None, skip: int = 0, limit: int = 100) -> List[Order]:
        """Get list of orders"""
        query = db.query(Order)
        
        if restaurant_id:
            query = query.filter(Order.restaurant_id == uuid.UUID(restaurant_id))
        else:
            # Default to configured restaurant
            query = query.filter(Order.restaurant_id == uuid.UUID(settings.restaurant_id))
        
        return query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()


# Global instance
order_service = OrderService()
