from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from ..database import get_db
from ..middleware.auth import verify_admin_token
from ..models.menu import MenuCategory, MenuItem
from ..schemas.menu import (
    MenuCategoryCreate,
    MenuCategoryResponse,
    MenuItemCreate,
    MenuItemUpdate,
    MenuItemResponse,
)
from ..config import settings

router = APIRouter(prefix="/admin", tags=["admin"])


# Menu Management Routes (Admin Only)

@router.post("/menu", response_model=MenuItemResponse, status_code=status.HTTP_201_CREATED)
async def create_menu_item(
    item_data: MenuItemCreate,
    db: Session = Depends(get_db),
    admin: dict = Depends(verify_admin_token)
):
    """Create a new menu item (admin only)"""
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


@router.patch("/menu/{item_id}", response_model=MenuItemResponse)
async def update_menu_item(
    item_id: uuid.UUID,
    item_data: MenuItemUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(verify_admin_token)
):
    """Update menu item details (admin only)"""
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


@router.delete("/menu/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_menu_item(
    item_id: uuid.UUID,
    db: Session = Depends(get_db),
    admin: dict = Depends(verify_admin_token)
):
    """Delete a menu item (admin only)"""
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Menu item {item_id} not found"
        )
    
    db.delete(item)
    db.commit()
    
    return None


@router.post("/menu/categories", response_model=MenuCategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: MenuCategoryCreate,
    db: Session = Depends(get_db),
    admin: dict = Depends(verify_admin_token)
):
    """Create a new menu category (admin only)"""
    category = MenuCategory(
        restaurant_id=uuid.UUID(settings.restaurant_id),
        name=category_data.name
    )
    
    db.add(category)
    db.commit()
    db.refresh(category)
    
    return category
