from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from ..database import get_db
from ..schemas.order import (
    OrderCreate,
    OrderResponse,
    OrderStatusUpdate,
    OrderListResponse
)
from ..services.order_service import order_service

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db)
):
    """Create a new order"""
    try:
        order = await order_service.create_order(db, order_data)
        return order
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create order: {str(e)}"
        )


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """Get order details by ID"""
    try:
        order = order_service.get_order(db, order_id)
        return order
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.get("", response_model=OrderListResponse)
async def get_orders(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get list of all orders for dashboard"""
    orders = order_service.get_orders(db, skip=skip, limit=limit)
    return OrderListResponse(
        orders=orders,
        total=len(orders)
    )


@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: uuid.UUID,
    status_data: OrderStatusUpdate,
    db: Session = Depends(get_db)
):
    """Update order status (triggers WhatsApp notification)"""
    try:
        order = await order_service.update_order_status(
            db,
            order_id,
            status_data.status
        )
        return order
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update order status: {str(e)}"
        )
