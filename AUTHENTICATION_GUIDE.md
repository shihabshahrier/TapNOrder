# Authentication & Security Guide

## Overview

TapNOrder now uses a dual authentication system:
- **Session-based authentication** for customer menu access and orders (no JWT required)
- **JWT-based authentication** for admin dashboard and management operations

## Customer Flow (Session-Based)

### How It Works

1. **Menu Access**: When a customer opens the menu (via WhatsApp link or direct URL), the frontend automatically creates a temporary session
2. **Session Storage**: Session ID is stored in browser localStorage
3. **Order Placement**: Session ID is included with order submission for validation and rate limiting
4. **No Authentication Required**: Customers don't need to log in or authenticate

### Session Features

- **Auto-generation**: Sessions are created automatically on first visit
- **24-hour expiry**: Sessions last for 24 hours
- **Rate limiting**: Max 10 requests per minute per session
- **Server-side validation**: All session checks happen on the backend

### API Endpoints (Public)

```
POST /session              - Create new session
GET  /session/validate/:id - Validate session
GET  /menu                 - Get menu (public)
POST /orders               - Create order (with session_id)
GET  /orders/:id           - Get order details
```

## Admin Flow (JWT-Based)

### How It Works

1. **Login**: Admin logs in with username and password
2. **JWT Token**: Backend returns JWT access token
3. **Token Storage**: Token stored in browser state
4. **Protected Routes**: All admin routes require valid JWT in Authorization header

### Admin Credentials

For prototype/development:
- **Username**: `admin`
- **Password**: Your `API_KEY` from `.env` file

In production, implement proper user management with hashed passwords.

### API Endpoints (Admin Only)

```
POST   /auth/login              - Admin login
POST   /admin/menu              - Create menu item
PATCH  /admin/menu/:id          - Update menu item
DELETE /admin/menu/:id          - Delete menu item
POST   /admin/menu/categories   - Create category
GET    /orders                  - List all orders
PATCH  /orders/:id/status       - Update order status
```

### JWT Token Format

```
Authorization: Bearer <token>
```

## WhatsApp Integration

### Interactive Button Message

Instead of sending plain text URLs, the system now sends WhatsApp interactive CTA buttons:

```json
{
  "type": "interactive",
  "interactive": {
    "type": "cta_url",
    "body": {
      "text": "Welcome to Kacchi King! 🍽️\n\nTap the button below to view our menu."
    },
    "action": {
      "name": "cta_url",
      "parameters": {
        "display_text": "View Menu",
        "url": "https://your-domain.vercel.app"
      }
    }
  }
}
```

### Benefits

- Opens menu in WhatsApp in-app browser
- Better user experience
- No token in URL (cleaner, more secure)
- Works with any HTTPS domain

## Security Features

### For Customers

1. **Session-based**: No sensitive tokens in URLs
2. **Rate limiting**: Prevents abuse (10 req/min per session)
3. **Server-side validation**: All checks happen on backend
4. **Automatic expiry**: Sessions expire after 24 hours
5. **Item validation**: Backend validates menu items and prices

### For Admins

1. **JWT authentication**: Secure token-based auth
2. **Protected routes**: All admin endpoints require valid JWT
3. **Token expiration**: Tokens expire after 24 hours
4. **Role-based**: Only admin role can access management routes

## Migration from Old System

### What Changed

**Before:**
- JWT tokens for all users (customers + admins)
- Tokens in URL query parameters
- AuthProvider checked for tokens

**After:**
- Sessions for customers (auto-generated)
- JWT only for admins
- No authentication required for menu/checkout
- Cleaner URLs

### Frontend Changes

1. **AuthProvider**: Now creates sessions automatically, no token checking
2. **Order Creation**: Includes session_id from localStorage
3. **Dashboard Login**: Uses username/password instead of API key only

### Backend Changes

1. **New Models**: `CustomerSession` table
2. **New Services**: `SessionService` for session management
3. **New Middleware**: `verify_admin_token` for JWT validation
4. **New Routers**: `/admin/*` for protected routes, `/session` for session management
5. **Updated Routes**: Menu routes are public, order status updates require admin auth

## Environment Variables

Required in `.env`:

```bash
# Existing
DATABASE_URL=postgresql://...
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
WHATSAPP_ACCESS_TOKEN=your_token
WHATSAPP_VERIFY_TOKEN=your_verify_token
API_KEY=your_secure_api_key
FRONTEND_URL=https://your-domain.vercel.app
RESTAURANT_NAME=Kacchi King
RESTAURANT_PHONE=+880...

# No new variables needed!
```

## Testing

### Test Customer Flow

1. Open frontend URL directly (no token needed)
2. Browse menu
3. Add items to cart
4. Checkout and place order
5. Check browser console for session_id in localStorage

### Test Admin Flow

1. Go to dashboard URL
2. Login with:
   - Username: `admin`
   - Password: `<your API_KEY>`
3. Manage orders and menu items
4. Check Network tab for `Authorization: Bearer <token>` header

### Test WhatsApp Flow

1. Send "hi" or "menu" to WhatsApp number
2. Receive interactive button message
3. Click "View Menu" button
4. Opens in WhatsApp in-app browser
5. Session auto-created, can browse and order

## Database Migration

Run this to create the new `customer_sessions` table:

```bash
# Backend will auto-create on startup via SQLAlchemy
# Or manually run:
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

## Deployment Checklist

- [ ] Update backend with new code
- [ ] Run database migrations (auto-created on startup)
- [ ] Update frontend with new code
- [ ] Set `FRONTEND_URL` to production Vercel URL
- [ ] Test WhatsApp button opens correct URL
- [ ] Test admin login with username/password
- [ ] Test customer can order without authentication
- [ ] Verify rate limiting works
- [ ] Check session cleanup (optional cron job)

## Rate Limiting

Current limits per session:
- **10 requests per minute**
- Applies to order creation and session validation
- Returns 401 error when exceeded

To adjust, modify in `session_service.py`:
```python
RATE_LIMIT_WINDOW = 60  # seconds
MAX_REQUESTS_PER_WINDOW = 10  # requests
```

## Session Cleanup (Optional)

Sessions auto-expire after 24 hours. To manually clean up:

```python
from app.services.session_service import session_service
from app.database import SessionLocal

db = SessionLocal()
deleted = session_service.cleanup_expired_sessions(db)
print(f"Cleaned up {deleted} expired sessions")
```

Consider adding a cron job for production:
```bash
# Daily at 3 AM
0 3 * * * cd /path/to/backend && python -c "from app.services.session_service import session_service; from app.database import SessionLocal; db = SessionLocal(); session_service.cleanup_expired_sessions(db)"
```

## Troubleshooting

### Customer can't place order
- Check if session_id exists in localStorage
- Verify session hasn't expired (24 hours)
- Check rate limit (10 req/min)

### Admin can't login
- Verify username is "admin"
- Verify password matches API_KEY in .env
- Check backend logs for authentication errors

### WhatsApp button doesn't work
- Verify FRONTEND_URL is HTTPS (required by WhatsApp)
- Check WhatsApp API credentials
- Verify interactive message format in logs

### Session not created
- Check browser console for errors
- Verify /session endpoint is accessible
- Check CORS settings in backend
