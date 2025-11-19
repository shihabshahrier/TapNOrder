# TapNOrder Backend - Setup Guide

## Prerequisites

- Python 3.9+
- PostgreSQL database (or Supabase/Neon)
- WhatsApp Business Account with Cloud API access

## Installation

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and fill in your actual values:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `WHATSAPP_PHONE_NUMBER_ID`: From Meta Business Suite
   - `WHATSAPP_ACCESS_TOKEN`: From Meta Business Suite
   - `WHATSAPP_VERIFY_TOKEN`: Create a random string for webhook verification
   - `API_KEY`: Create a secure key for dashboard authentication
   - `FRONTEND_URL`: Your menu web app URL

3. **Initialize the database:**
   ```bash
   python init_db.py
   ```

## Running the Server

### Development Mode
```bash
chmod +x run.sh
./run.sh
```

Or manually:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Menu Endpoints
- `GET /menu` - Get full menu
- `GET /menu/{item_id}` - Get single menu item
- `POST /menu` - Create menu item
- `PATCH /menu/{item_id}` - Update menu item
- `POST /menu/categories` - Create category
- `GET /menu/categories/all` - Get all categories with items

### Order Endpoints
- `POST /orders` - Create new order
- `GET /orders/{order_id}` - Get order details
- `GET /orders` - List all orders
- `PATCH /orders/{order_id}/status` - Update order status

### WhatsApp Webhook
- `GET /webhook/whatsapp` - Webhook verification
- `POST /webhook/whatsapp` - Handle incoming messages

## WhatsApp Setup

1. **Create a Meta Business App**
   - Go to https://developers.facebook.com/
   - Create a new app with WhatsApp product

2. **Configure Webhook**
   - URL: `https://your-domain.com/webhook/whatsapp`
   - Verify Token: Use the value from your `.env` file
   - Subscribe to: `messages` field

3. **Get Credentials**
   - Phone Number ID: From WhatsApp > API Setup
   - Access Token: From WhatsApp > API Setup (temporary or permanent)

## Database Schema

The database includes:
- `menu_categories` - Menu categories
- `menu_items` - Individual menu items
- `orders` - Customer orders
- `order_items` - Items in each order

## Testing

### Test the API
```bash
# Health check
curl http://localhost:8000/health

# Get menu
curl http://localhost:8000/menu

# Create order (example)
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

## Deployment

### Option 1: Render.com
1. Connect your GitHub repository
2. Select "Web Service"
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables from `.env`

### Option 2: Railway
1. Connect repository
2. Add PostgreSQL plugin
3. Configure environment variables
4. Deploy

### Option 3: Docker
```bash
docker build -t tapnorder-backend .
docker run -p 8000:8000 --env-file .env tapnorder-backend
```

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check firewall settings

### WhatsApp Messages Not Sending
- Verify `WHATSAPP_ACCESS_TOKEN` is valid
- Check `WHATSAPP_PHONE_NUMBER_ID` is correct
- Ensure phone numbers include country code (e.g., +1234567890)

### CORS Errors
- Add your frontend URL to `FRONTEND_URL` in `.env`
- Check CORS middleware configuration in `app/main.py`

## Project Structure

```
Backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── database.py          # Database connection
│   ├── models/              # SQLAlchemy models
│   │   ├── menu.py
│   │   └── order.py
│   ├── schemas/             # Pydantic schemas
│   │   ├── menu.py
│   │   └── order.py
│   ├── routers/             # API endpoints
│   │   ├── menu.py
│   │   ├── orders.py
│   │   └── whatsapp.py
│   ├── services/            # Business logic
│   │   ├── whatsapp_service.py
│   │   └── order_service.py
│   └── utils/               # Utilities
│       └── whatsapp_formatter.py
├── init_db.py               # Database initialization
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variables template
└── run.sh                  # Run script
```

## Support

For issues or questions, please check:
- API documentation at `/docs`
- WhatsApp Cloud API docs: https://developers.facebook.com/docs/whatsapp
- FastAPI docs: https://fastapi.tiangolo.com/
