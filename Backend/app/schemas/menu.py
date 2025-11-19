from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from decimal import Decimal
from datetime import datetime
import uuid


class MenuCategoryBase(BaseModel):
    """Base schema for menu category"""
    name: str = Field(..., min_length=1, max_length=255)


class MenuCategoryCreate(MenuCategoryBase):
    """Schema for creating a menu category"""
    pass


class MenuCategoryResponse(MenuCategoryBase):
    """Schema for menu category response"""
    id: uuid.UUID
    restaurant_id: uuid.UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class MenuItemBase(BaseModel):
    """Base schema for menu item"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    price: Decimal = Field(..., gt=0)
    image_url: Optional[str] = None
    is_available: bool = True


class MenuItemCreate(MenuItemBase):
    """Schema for creating a menu item"""
    category_id: uuid.UUID


class MenuItemUpdate(BaseModel):
    """Schema for updating a menu item"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, gt=0)
    image_url: Optional[str] = None
    is_available: Optional[bool] = None
    category_id: Optional[uuid.UUID] = None


class MenuItemResponse(MenuItemBase):
    """Schema for menu item response"""
    id: uuid.UUID
    category_id: uuid.UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class MenuCategoryWithItems(MenuCategoryResponse):
    """Schema for menu category with items"""
    items: List[MenuItemResponse] = []
    
    model_config = ConfigDict(from_attributes=True)


class MenuResponse(BaseModel):
    """Schema for full menu response"""
    categories: List[MenuCategoryWithItems]
    restaurant_name: str
