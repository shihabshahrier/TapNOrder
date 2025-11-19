import asyncio
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.menu import MenuCategory, MenuItem
from app.models.order import Order
import uuid

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

def seed_data():
    db: Session = SessionLocal()
    try:
        # Clear existing data
        print("Clearing existing data...")
        db.query(MenuItem).delete()
        db.query(MenuCategory).delete()
        db.commit()

        # Get Restaurant ID from env or generate new
        import os
        from dotenv import load_dotenv
        load_dotenv()
        
        env_id = os.getenv("RESTAURANT_ID")
        if env_id:
            restaurant_id = uuid.UUID(env_id)
            print(f"Using configured Restaurant ID: {restaurant_id}")
        else:
            restaurant_id = uuid.uuid4()
            print(f"Generated new Restaurant ID: {restaurant_id}")

        # Categories
        cat_popular = MenuCategory(restaurant_id=restaurant_id, name="Popular")
        cat_biryani = MenuCategory(restaurant_id=restaurant_id, name="Biryani")
        cat_drinks = MenuCategory(restaurant_id=restaurant_id, name="Drinks")
        
        db.add_all([cat_popular, cat_biryani, cat_drinks])
        db.flush() # Flush to get IDs

        # Items
        items = [
            MenuItem(
                category_id=cat_popular.id,
                name="Kacchi Biryani (Full)",
                description="Traditional basmati rice cooked with tender mutton pieces and potatoes.",
                price=450.00,
                image_url="https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&q=80",
                is_available=True
            ),
            MenuItem(
                category_id=cat_biryani.id,
                name="Chicken Roast",
                description="Juicy chicken roast with rich gravy.",
                price=180.00,
                image_url="https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=800&q=80",
                is_available=True
            ),
            MenuItem(
                category_id=cat_drinks.id,
                name="Borhani",
                description="Spicy yogurt drink, perfect digestion aid.",
                price=60.00,
                image_url="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80",
                is_available=True
            ),
            MenuItem(
                category_id=cat_drinks.id,
                name="Coca Cola",
                description="Chilled 250ml bottle.",
                price=30.00,
                image_url="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80",
                is_available=True
            )
        ]

        db.add_all(items)
        db.commit()
        print("✅ Database seeded successfully!")

    except Exception as e:
        print(f"❌ Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
