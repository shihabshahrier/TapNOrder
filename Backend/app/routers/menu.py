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


@router.post("", response_model=MenuItemResponse, status_code=status.HTTP_201_CREATED)
async def create_menu_item(
    item_data: MenuItemCreate,
    db: Session = Depends(get_db)
):
    """Create a new menu item (for admin/dashboard)"""
    # Verify category exists
    category = db.query(MenuCategory).filter(
        MenuCategory.id == item_data.category_id
    ).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category {item_data.category_id} not found"
        )
    
    # Create menu item
    menu_item = MenuItem(
        category_id=item_data.category_id,
        name=item_data.name,
        description=item_data.description,
        price=item_data.price,
        image_url=item_data.image_url,
        is_available=item_data.is_available
    )
    
    db.add(menu_item)
    db.commit()
    db.refresh(menu_item)
    
    return menu_item


@router.patch("/{item_id}", response_model=MenuItemResponse)
async def update_menu_item(
    item_id: uuid.UUID,
    item_data: MenuItemUpdate,
    db: Session = Depends(get_db)
):
    """Update menu item details"""
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Menu item {item_id} not found"
        )
    
    # Update fields if provided
    update_data = item_data.model_dump(exclude_unset=True)
    
    # Verify category if being updated
    if "category_id" in update_data:
        category = db.query(MenuCategory).filter(
            MenuCategory.id == update_data["category_id"]
        ).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category {update_data['category_id']} not found"
            )
    
    for field, value in update_data.items():
        setattr(item, field, value)
    
    db.commit()
    db.refresh(item)
    
    return item


@router.post("/categories", response_model=MenuCategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: MenuCategoryCreate,
    db: Session = Depends(get_db)
):
    """Create a new menu category"""
    category = MenuCategory(
        restaurant_id=uuid.UUID(settings.restaurant_id),
        name=category_data.name
    )
    
    db.add(category)
    db.commit()
    db.refresh(category)
    
    return category


@router.get("/categories/all", response_model=List[MenuCategoryWithItems])
async def get_categories_with_items(db: Session = Depends(get_db)):
    """Get all categories with their items"""
    categories = db.query(MenuCategory).filter(
        MenuCategory.restaurant_id == uuid.UUID(settings.restaurant_id)
    ).all()
    
    return categories
