# TapNOrder Backend - Quick Reference

## 🚀 Quick Start Commands

```bash
# Setup
cp .env.example .env          # Configure environment
pip install -r requirements.txt
python init_db.py             # Seed database

# Run
./run.sh                      # Start server
# OR
uvicorn app.main:app --reload

# Test
python test_api.py            # Test endpoints
curl http://localhost:8000/health

# Docker
docker-compose up -d          # Start with PostgreSQL
```

## 📡 API Endpoints

### Menu
```bash
GET    /menu                  # Full menu
GET    /menu/{id}             # Single item
POST   /menu                  # Create item
PATCH  /menu/{id}             # Update item
POST   /menu/categories       # Create category
GET    /menu/categories/all   # All categories
```

### Orders
```bash
POST   /orders                # Create order
GET    /orders/{id}           # Get order
GET    /orders                # List orders
PATCH  /orders/{id}/status    # Update status
```

### WhatsApp
```bash
GET    /webhook/whatsapp      # Verify webhook
POST   /webhook/whatsapp      # Handle messages
```

## 📝 Example Requests

### Create Order
```bash
curl -X POST http://localhost:8000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "customer_phone": "+1234567890",
    "delivery_address": "123 Main St",
    "order_type": "delivery",
    "items": [
      {"item_id": "uuid-here", "quantity": 2}
    ]
  }'
```

### Update Order Status
```bash
curl -X PATCH http://localhost:8000/orders/{order_id}/status \
  -H "Content-Type: application/json" \
  -d '{"status": "cooking"}'
```

### Create Menu Item
```bash
curl -X POST http://localhost:8000/menu \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": "uuid-here",
    "name": "Pizza",
    "description": "Delicious pizza",
    "price": 12.99,
    "is_available": true
  }'
```

## 🔧 Environment Variables

```bash
DATABASE_URL=postgresql://user:pass@host/db
WHATSAPP_PHONE_NUMBER_ID=your_id
WHATSAPP_ACCESS_TOKEN=your_token
WHATSAPP_VERIFY_TOKEN=your_verify_token
API_KEY=your_api_key
FRONTEND_URL=https://your-app.com
RESTAURANT_NAME=Your Restaurant
RESTAURANT_PHONE=+1234567890
ENVIRONMENT=development
```

## 📊 Order Status Flow

```
pending → accepted → cooking → on_the_way → delivered
                                          ↘ cancelled
```

Each status change triggers a WhatsApp notification.

## 🗄️ Database Models

### MenuCategory
- id (UUID)
- restaurant_id (UUID)
- name (String)
- created_at (Timestamp)

### MenuItem
- id (UUID)
- category_id (UUID)
- name (String)
- description (Text)
- price (Decimal)
- image_url (Text)
- is_available (Boolean)
- created_at (Timestamp)

### Order
- id (UUID)
- restaurant_id (UUID)
- customer_name (String)
- customer_phone (String)
- delivery_address (Text)
- order_type (Enum: pickup/delivery)
- total (Decimal)
- status (Enum: pending/accepted/cooking/on_the_way/delivered/cancelled)
- created_at (Timestamp)

### OrderItem
- id (UUID)
- order_id (UUID)
- item_id (UUID)
- name (String)
- quantity (Integer)
- unit_price (Decimal)
- subtotal (Decimal)

## 📱 WhatsApp Messages

### Welcome
```
Welcome to {restaurant_name} 🍽️
Tap to view our menu: {menu_url}
```

### Order Confirmation
```
Your order (#{order_id}) has been received.
You'll get updates here 🚀
```

### Status Updates
- **Accepted**: "Your order has been accepted! 🎉"
- **Cooking**: "Your food is being cooked 🍳"
- **On the way**: "Rider is on the way 🚴‍♂️"
- **Delivered**: "Order delivered ✔️ Enjoy!"

## 🐳 Docker Commands

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build
```

## 🧪 Testing

```bash
# Run test script
python test_api.py

# Manual tests
curl http://localhost:8000/health
curl http://localhost:8000/menu
```

## 📚 Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🔍 Troubleshooting

### Database Connection Error
```bash
# Check DATABASE_URL in .env
# Ensure PostgreSQL is running
```

### WhatsApp Not Sending
```bash
# Verify WHATSAPP_ACCESS_TOKEN
# Check WHATSAPP_PHONE_NUMBER_ID
# Ensure phone numbers have country code
```

### CORS Error
```bash
# Add frontend URL to FRONTEND_URL in .env
# Check CORS settings in app/main.py
```

## 📁 Project Structure

```
Backend/
├── app/
│   ├── main.py              # FastAPI app
│   ├── config.py            # Settings
│   ├── database.py          # DB setup
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── routers/             # API endpoints
│   ├── services/            # Business logic
│   └── utils/               # Helpers
├── init_db.py               # DB seeder
├── test_api.py              # Tests
├── run.sh                   # Start script
├── Dockerfile               # Container
├── docker-compose.yml       # Local dev
└── requirements.txt         # Dependencies
```

## 🎯 Key Files

- `app/main.py` - Application entry point
- `app/routers/orders.py` - Order endpoints
- `app/services/whatsapp_service.py` - WhatsApp integration
- `init_db.py` - Sample data seeder
- `SETUP.md` - Detailed setup guide

## ⚡ Performance Tips

- Use connection pooling (configured in database.py)
- Enable caching for menu data
- Use async/await for I/O operations
- Monitor database query performance
- Set up proper indexes in production

## 🔒 Security Notes

- API key authentication for dashboard (prototype level)
- Validate WhatsApp webhook signatures in production
- Use HTTPS in production
- Sanitize user inputs (handled by Pydantic)
- Rate limit webhook endpoint

---

**Need help?** Check SETUP.md for detailed instructions.
