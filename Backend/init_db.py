"""
Database initialization script
Creates sample menu data for testing
"""
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.menu import MenuCategory, MenuItem
from app.config import settings
import uuid

def init_db():
    """Initialize database with sample data"""
    
    # Create tables
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if data already exists
        existing_categories = db.query(MenuCategory).count()
        if existing_categories > 0:
            print("Database already has data. Skipping initialization.")
            return
        
        print("Adding sample menu data...")
        
        # Create categories
        appetizers = MenuCategory(
            restaurant_id=uuid.UUID(settings.restaurant_id),
            name="Appetizers"
        )
        main_courses = MenuCategory(
            restaurant_id=uuid.UUID(settings.restaurant_id),
            name="Main Courses"
        )
        desserts = MenuCategory(
            restaurant_id=uuid.UUID(settings.restaurant_id),
            name="Desserts"
        )
        beverages = MenuCategory(
            restaurant_id=uuid.UUID(settings.restaurant_id),
            name="Beverages"
        )
        
        db.add_all([appetizers, main_courses, desserts, beverages])
        db.commit()
        
        # Create menu items
        items = [
            # Appetizers
            MenuItem(
                category_id=appetizers.id,
                name="Spring Rolls",
                description="Crispy vegetable spring rolls with sweet chili sauce",
                price=5.99,
                is_available=True
            ),
            MenuItem(
                category_id=appetizers.id,
                name="Chicken Wings",
                description="Spicy buffalo wings with ranch dressing",
                price=8.99,
                is_available=True
            ),
            
            # Main Courses
            MenuItem(
                category_id=main_courses.id,
                name="Kacchi Biryani",
                description="Traditional mutton biryani with aromatic spices",
                price=15.99,
                is_available=True
            ),
            MenuItem(
                category_id=main_courses.id,
                name="Chicken Tikka Masala",
                description="Grilled chicken in creamy tomato sauce",
                price=12.99,
                is_available=True
            ),
            MenuItem(
                category_id=main_courses.id,
                name="Beef Burger",
                description="Juicy beef patty with cheese, lettuce, and tomato",
                price=10.99,
                is_available=True
            ),
            
            # Desserts
            MenuItem(
                category_id=desserts.id,
                name="Chocolate Cake",
                description="Rich chocolate cake with ganache",
                price=6.99,
                is_available=True
            ),
            MenuItem(
                category_id=desserts.id,
                name="Ice Cream",
                description="Vanilla ice cream with chocolate sauce",
                price=4.99,
                is_available=True
            ),
            
            # Beverages
            MenuItem(
                category_id=beverages.id,
                name="Mango Lassi",
                description="Sweet yogurt drink with mango",
                price=3.99,
                is_available=True
            ),
            MenuItem(
                category_id=beverages.id,
                name="Coca Cola",
                description="Chilled soft drink",
                price=2.99,
                is_available=True
            ),
        ]
        
        db.add_all(items)
        db.commit()
        
        print(f"✅ Successfully created {len(items)} menu items in 4 categories")
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
