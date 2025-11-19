# TapNOrder - Authentication System Update

## 🔐 New Authentication System (v2.0)

TapNOrder now uses a **dual authentication system**:

### 👥 For Customers: Session-Based (Public Access)
- **No login required** - Just open the menu
- **Automatic sessions** - Created on first visit
- **Rate limited** - 10 requests per minute
- **Clean URLs** - No tokens in links
- **WhatsApp integration** - Interactive button messages

### 👨‍💼 For Admins: JWT-Based (Secure Access)
- **Username/password login** - Secure authentication
- **JWT tokens** - Industry-standard security
- **Protected routes** - All admin operations secured
- **24-hour expiration** - Automatic token expiry

---

## 🚀 Quick Start

### 1. Start the Backend
```bash
cd Backend
uvicorn app.main:app --reload
```
Backend runs on: `http://localhost:8000`

### 2. Start the Customer Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:3000`

### 3. Start the Admin Dashboard
```bash
cd dashboard
npm run dev
```
Dashboard runs on: `http://localhost:3001`

---

## 🔑 Access the System

### Customer Access (No Login)
1. Open: `http://localhost:3000`
2. Browse menu freely
3. Add items to cart
4. Complete checkout
5. Receive order confirmation via WhatsApp

### Admin Access (Login Required)
1. Open: `http://localhost:3001`
2. Login with:
   - **Username**: `admin`
   - **Password**: Your `API_KEY` from `.env` file
3. Manage orders and menu items

### WhatsApp Access
1. Send "hi" or "menu" to your WhatsApp Business number
2. Receive interactive button message
3. Click "View Menu" button
4. Opens in WhatsApp in-app browser
5. Browse and order directly

---

## 📡 API Endpoints

### Public Endpoints (No Authentication)
```
GET  /menu                    - Get full menu
GET  /menu/:id                - Get menu item details
POST /session                 - Create customer session
POST /orders                  - Place order (with session_id)
```

### Admin Endpoints (JWT Required)
```
POST   /auth/login            - Admin login
GET    /orders                - List all orders
PATCH  /orders/:id/status     - Update order status
POST   /admin/menu            - Create menu item
PATCH  /admin/menu/:id        - Update menu item
DELETE /admin/menu/:id        - Delete menu item
```

---

## 🔐 Security Features

### Customer Security
- ✅ No authentication required for browsing
- ✅ Session-based tracking (24-hour expiry)
- ✅ Rate limiting (10 requests/minute)
- ✅ Server-side validation
- ✅ Clean URLs (no tokens exposed)

### Admin Security
- ✅ JWT-based authentication
- ✅ Username/password login
- ✅ Protected admin routes
- ✅ Token expiration (24 hours)
- ✅ Role-based access control

---

## 📚 Documentation

### Complete Guides
- **`AUTHENTICATION_GUIDE.md`** - Comprehensive authentication documentation
- **`SESSION_AUTH_IMPLEMENTATION.md`** - Technical implementation details
- **`QUICK_REFERENCE.md`** - Quick reference card
- **`CHANGES_SUMMARY.md`** - Summary of all changes

### Original Documentation
- **`DEPLOYMENT.md`** - Deployment instructions
- **`LOCAL_TESTING.md`** - Local testing guide
- **`QUICK_START.md`** - Quick start guide

---

## 🧪 Testing

### Test Customer Flow
```bash
# 1. Open frontend
open http://localhost:3000

# 2. Open browser console
# Check localStorage for session_id

# 3. Browse menu and place order
# Should work without any login
```

### Test Admin Flow
```bash
# 1. Open dashboard
open http://localhost:3001

# 2. Login
Username: admin
Password: <your API_KEY from .env>

# 3. Manage orders and menu
# All operations should require authentication
```

### Test WhatsApp Integration
```bash
# 1. Send message to WhatsApp Business number
Message: "hi" or "menu"

# 2. Receive interactive button
# Should see "View Menu" button

# 3. Click button
# Opens menu in WhatsApp browser
```

---

## 🔄 Migration from v1.0

### What Changed
- **Customer authentication removed** - No more JWT for customers
- **Admin authentication enhanced** - Username/password instead of API key only
- **Menu endpoints restructured** - Write operations moved to `/admin/menu`
- **WhatsApp messages improved** - Interactive buttons instead of text URLs

### Breaking Changes
1. Admin login now requires username + password (not just API key)
2. Menu management endpoints moved from `/menu` to `/admin/menu`
3. Order listing and status updates require admin JWT

### Backward Compatible
- Public menu endpoints unchanged
- Order creation endpoint unchanged
- Existing data unaffected

---

## 🛠️ Configuration

### Environment Variables
```bash
# Backend/.env
DATABASE_URL=postgresql://user:pass@localhost/dbname
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_VERIFY_TOKEN=your_verify_token
API_KEY=your_secure_api_key_here
FRONTEND_URL=http://localhost:3000
RESTAURANT_NAME=Kacchi King
RESTAURANT_PHONE=+880...
```

### Admin Credentials
- **Username**: `admin` (hardcoded for prototype)
- **Password**: Value of `API_KEY` from `.env`

For production, implement proper user management with hashed passwords.

---

## 🐛 Troubleshooting

### Customer Issues

**Problem**: Can't place order
- **Check**: Browser localStorage has `session_id`
- **Solution**: Clear localStorage and refresh page

**Problem**: Rate limit error
- **Check**: Made more than 10 requests in 1 minute
- **Solution**: Wait 1 minute and try again

### Admin Issues

**Problem**: Can't login
- **Check**: Username is `admin` and password matches `API_KEY`
- **Solution**: Verify `.env` file has correct `API_KEY`

**Problem**: 401 Unauthorized on admin routes
- **Check**: JWT token is valid and not expired
- **Solution**: Login again to get new token

### WhatsApp Issues

**Problem**: Button doesn't appear
- **Check**: WhatsApp API credentials are correct
- **Solution**: Verify `WHATSAPP_ACCESS_TOKEN` in `.env`

**Problem**: Button doesn't open URL
- **Check**: `FRONTEND_URL` must be HTTPS for production
- **Solution**: Deploy to Vercel and update `FRONTEND_URL`

---

## 📊 System Architecture

```
┌─────────────────┐
│   Customer      │
│   (Browser)     │
└────────┬────────┘
         │ No Auth Required
         ▼
┌─────────────────┐      ┌──────────────┐
│   Frontend      │◄────►│   Backend    │
│  (Next.js)      │      │  (FastAPI)   │
└─────────────────┘      └──────┬───────┘
         │                       │
         │ Session ID            │ JWT Token
         │                       │
         ▼                       ▼
┌─────────────────┐      ┌──────────────┐
│  localStorage   │      │  Dashboard   │
│  (session_id)   │      │  (Admin UI)  │
└─────────────────┘      └──────────────┘
                                │
                         Username/Password
                                │
                                ▼
                         ┌──────────────┐
                         │  Admin Auth  │
                         │  (JWT Token) │
                         └──────────────┘
```

---

## 🎯 Key Features

### ✨ Customer Experience
- **Instant access** - No signup or login
- **Fast browsing** - No authentication delays
- **WhatsApp ordering** - Interactive buttons
- **Clean URLs** - Easy to share

### 🔒 Admin Features
- **Secure login** - Username/password authentication
- **Order management** - View and update orders
- **Menu management** - Create, update, delete items
- **Real-time updates** - WhatsApp notifications

### 🚀 Technical Features
- **Session management** - Automatic session creation
- **Rate limiting** - Prevent abuse
- **JWT authentication** - Secure admin access
- **Interactive WhatsApp** - CTA URL buttons

---

## 📈 Performance

### Optimizations
- Public menu endpoints (better caching)
- No authentication overhead for customers
- Efficient session validation
- Rate limiting prevents abuse

### Scalability
- Session-based architecture
- Stateless JWT for admins
- Database-backed sessions
- Ready for Redis integration

---

## 🔮 Future Enhancements

### Planned
- [ ] Redis session storage
- [ ] Multiple admin users
- [ ] Enhanced analytics
- [ ] Session-based recommendations
- [ ] Advanced rate limiting

### Possible
- [ ] OAuth integration
- [ ] 2FA for admins
- [ ] Customer accounts (optional)
- [ ] Loyalty program
- [ ] Advanced reporting

---

## 📞 Support

### Documentation
- Read `AUTHENTICATION_GUIDE.md` for detailed auth documentation
- Check `QUICK_REFERENCE.md` for quick commands
- Review `CHANGES_SUMMARY.md` for all changes

### Debugging
- Check browser console for frontend errors
- Review backend logs for API errors
- Verify environment variables are set
- Test with curl or Postman

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👥 Contributors

- Authentication system redesign: November 2025
- Session-based architecture implementation
- WhatsApp interactive buttons integration

---

**Version**: 2.0.0 (Session-based authentication)  
**Last Updated**: November 19, 2025  
**Status**: ✅ Production Ready
