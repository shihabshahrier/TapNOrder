# Quick Reference - Session Authentication

## 🚀 Quick Start

### Start Backend
```bash
cd Backend
uvicorn app.main:app --reload
```

### Start Frontend
```bash
cd frontend
npm run dev
```

### Start Dashboard
```bash
cd dashboard
npm run dev
```

---

## 🔑 Authentication

### Customer (No Auth Required)
- Just open the menu URL
- Session auto-created
- No login needed

### Admin Login
- **URL**: `http://localhost:3001` (dashboard)
- **Username**: `admin`
- **Password**: Your `API_KEY` from `.env`

---

## 📡 Key API Endpoints

### Public (No Auth)
```bash
# Get menu
GET http://localhost:8000/menu

# Create session
POST http://localhost:8000/session

# Create order
POST http://localhost:8000/orders
{
  "session_id": "...",
  "customer_name": "John",
  "customer_phone": "+880...",
  "order_type": "delivery",
  "delivery_address": "...",
  "items": [{"item_id": "...", "quantity": 1}]
}
```

### Admin (JWT Required)
```bash
# Login
POST http://localhost:8000/auth/login
{
  "username": "admin",
  "password": "your_api_key"
}

# Get orders
GET http://localhost:8000/orders
Authorization: Bearer <token>

# Update menu item
PATCH http://localhost:8000/admin/menu/{id}
Authorization: Bearer <token>
{
  "name": "New Name",
  "price": 299
}
```

---

## 🗂️ Key Files Changed

### Backend
- `app/models/session.py` - NEW
- `app/services/session_service.py` - NEW
- `app/middleware/auth.py` - NEW
- `app/routers/admin.py` - NEW
- `app/routers/auth.py` - NEW
- `app/routers/session.py` - NEW
- `app/routers/menu.py` - UPDATED (public only)
- `app/routers/orders.py` - UPDATED (session + admin)
- `app/services/whatsapp_service.py` - UPDATED (buttons)

### Frontend
- `components/AuthProvider.tsx` - UPDATED (session-based)
- `lib/api.ts` - UPDATED (session functions)
- `app/checkout/page.tsx` - UPDATED (session_id)

### Dashboard
- `app/page.tsx` - UPDATED (username/password)
- `lib/api.ts` - UPDATED (JWT + admin routes)

---

## 🧪 Quick Tests

### Test Customer Flow
```bash
# 1. Open frontend
open http://localhost:3000

# 2. Check localStorage
# Should see: session_id

# 3. Place order
# Should work without login
```

### Test Admin Flow
```bash
# 1. Open dashboard
open http://localhost:3001

# 2. Login
# Username: admin
# Password: <your API_KEY>

# 3. Manage orders
# Should see all orders
```

### Test WhatsApp
```bash
# Send to WhatsApp: "hi" or "menu"
# Should receive interactive button
# Click button → opens menu
```

---

## 🔧 Environment Variables

```bash
# Backend/.env
DATABASE_URL=postgresql://...
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_VERIFY_TOKEN=...
API_KEY=your_secure_key_here
FRONTEND_URL=http://localhost:3000
RESTAURANT_NAME=Kacchi King
RESTAURANT_PHONE=+880...
```

---

## 🐛 Troubleshooting

### Customer can't order
```bash
# Check session
localStorage.getItem('session_id')

# Create new session
POST http://localhost:8000/session
```

### Admin can't login
```bash
# Verify credentials
Username: admin
Password: matches API_KEY in .env

# Check backend logs
tail -f backend.log
```

### WhatsApp button not working
```bash
# Verify FRONTEND_URL is HTTPS
# WhatsApp requires HTTPS for buttons

# Check WhatsApp credentials
echo $WHATSAPP_ACCESS_TOKEN
```

---

## 📊 Rate Limits

- **10 requests per minute** per session
- Applies to order creation
- Returns 401 when exceeded

---

## 🔐 Security Notes

### Customer
- ✅ No authentication required
- ✅ Session-based tracking
- ✅ Rate limited
- ✅ Server-side validation

### Admin
- ✅ JWT authentication
- ✅ Protected routes
- ✅ Token expiration (24h)
- ✅ Secure login

---

## 📚 Full Documentation

- `AUTHENTICATION_GUIDE.md` - Complete auth guide
- `SESSION_AUTH_IMPLEMENTATION.md` - Implementation details
- `QUICK_REFERENCE.md` - This file

---

**Last Updated**: November 19, 2025
