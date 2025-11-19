from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from ..database import get_db
from ..models.menu import MenuCategory, MenuItem
from ..schemas.menu import (
    MenuCategoryCreate,
    MenuCategoryResponse,
    MenuItemCreate,
    MenuItemUpdate,
    MenuItemResponse,
    MenuCategoryWithItems,
    MenuResponse
)
from ..config import settings

router = APIRouter(prefix="/menu", tags=["menu"])


@router.get("", response_model=MenuResponse)
async def get_full_menu(db: Session = Depends(get_db)):
    """Get full menu grouped by category"""
    categories = db.query(MenuCategory).filter(
        MenuCategory.restaurant_id == uuid.UUID(settings.restaurant_id)
    ).all()
    
    return MenuResponse(
        categories=categories,
        restaurant_name=settings.restaurant_name
    )


@router.get("/{item_id}", response_model=MenuItemResponse)
async def get_menu_item(item_id: uuid.UUID, db: Session = Depends(get_db)):
    """Get single menu item by ID"""
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Menu item {item_id} not found"
        )
    return item


# Admin operations moved to /admin/menu routes


@router.get("/categories/all", response_model=List[MenuCategoryWithItems])
async def get_categories_with_items(db: Session = Depends(get_db)):
    """Get all categories with their items"""
    categories = db.query(MenuCategory).filter(
        MenuCategory.restaurant_id == uuid.UUID(settings.restaurant_id)
    ).all()
    
    return categories


# Delete operation moved to /admin/menu routes
