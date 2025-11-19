# Deployment Checklist - Session Authentication Update

## 📋 Pre-Deployment Checklist

### Backend Preparation
- [ ] All new files committed to git
- [ ] Database migrations tested locally
- [ ] Environment variables documented
- [ ] API endpoints tested with Postman/curl
- [ ] Rate limiting tested
- [ ] Session creation/validation tested
- [ ] Admin JWT authentication tested
- [ ] WhatsApp integration tested

### Frontend Preparation
- [ ] Session auto-creation tested
- [ ] localStorage session_id verified
- [ ] Order submission with session_id tested
- [ ] No authentication gate on menu
- [ ] Build succeeds without errors
- [ ] TypeScript compilation successful

### Dashboard Preparation
- [ ] Login form tested with username/password
- [ ] JWT token storage verified
- [ ] Admin routes protected
- [ ] Menu management endpoints updated to `/admin/*`
- [ ] Build succeeds without errors
- [ ] TypeScript compilation successful

---

## 🚀 Deployment Steps

### Step 1: Backend Deployment

```bash
# 1. Navigate to backend
cd Backend

# 2. Ensure dependencies are installed
pip install -r requirements.txt

# 3. Test locally first
uvicorn app.main:app --reload

# 4. Verify endpoints
curl http://localhost:8000/
curl http://localhost:8000/menu
curl -X POST http://localhost:8000/session

# 5. Deploy to production (Railway/Render/etc.)
# Database migrations will run automatically on startup

# 6. Verify production deployment
curl https://your-backend-url.com/
curl https://your-backend-url.com/health
```

**Verification:**
- [ ] Backend is accessible
- [ ] `/health` endpoint returns 200
- [ ] `/menu` endpoint returns menu data
- [ ] `/session` endpoint creates sessions
- [ ] Database tables created (check `customer_sessions`)

### Step 2: Frontend Deployment

```bash
# 1. Navigate to frontend
cd frontend

# 2. Update environment variables
# .env.local or Vercel environment variables
NEXT_PUBLIC_API_URL=https://your-backend-url.com

# 3. Test build locally
npm run build
npm start

# 4. Deploy to Vercel
vercel --prod

# 5. Note the deployed URL
# Example: https://tapnorder.vercel.app
```

**Verification:**
- [ ] Frontend loads successfully
- [ ] Session auto-created (check localStorage)
- [ ] Menu displays correctly
- [ ] Cart functionality works
- [ ] Checkout includes session_id
- [ ] Orders can be placed

### Step 3: Dashboard Deployment

```bash
# 1. Navigate to dashboard
cd dashboard

# 2. Update environment variables
NEXT_PUBLIC_API_URL=https://your-backend-url.com

# 3. Test build locally
npm run build
npm start

# 4. Deploy to Vercel
vercel --prod

# 5. Note the deployed URL
# Example: https://tapnorder-dashboard.vercel.app
```

**Verification:**
- [ ] Dashboard loads successfully
- [ ] Login form displays
- [ ] Can login with admin credentials
- [ ] JWT token stored
- [ ] Orders list loads
- [ ] Can update order status
- [ ] Can manage menu items

### Step 4: Backend Configuration Update

```bash
# Update Backend/.env with production URLs
FRONTEND_URL=https://tapnorder.vercel.app

# Restart backend service
# Railway: Automatic restart
# Render: Manual restart or redeploy
```

**Verification:**
- [ ] WhatsApp messages use production URL
- [ ] CORS allows frontend domain
- [ ] Interactive buttons work

### Step 5: WhatsApp Integration

```bash
# 1. Test WhatsApp webhook
curl -X GET "https://your-backend-url.com/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=YOUR_VERIFY_TOKEN&hub.challenge=test"

# 2. Send test message
# Send "hi" or "menu" to WhatsApp Business number

# 3. Verify interactive button received
# Should show "View Menu" button

# 4. Click button and verify
# Should open production frontend URL
```

**Verification:**
- [ ] Webhook verification works
- [ ] Test message triggers response
- [ ] Interactive button appears
- [ ] Button opens correct URL
- [ ] URL opens in WhatsApp browser
- [ ] Session auto-created
- [ ] Can place order through WhatsApp

---

## ✅ Post-Deployment Verification

### Customer Flow Testing
```bash
# 1. Open frontend URL
open https://tapnorder.vercel.app

# 2. Check browser console
# Should see session_id in localStorage

# 3. Browse menu
# Should load without authentication

# 4. Add items to cart
# Should work normally

# 5. Complete checkout
# Should include session_id in request

# 6. Verify order created
# Check dashboard or database
```

**Checklist:**
- [ ] Menu loads without errors
- [ ] Session created automatically
- [ ] Can browse all categories
- [ ] Can add items to cart
- [ ] Cart persists on refresh
- [ ] Checkout form works
- [ ] Order submission successful
- [ ] Confirmation page displays

### Admin Flow Testing
```bash
# 1. Open dashboard URL
open https://tapnorder-dashboard.vercel.app

# 2. Login
Username: admin
Password: <API_KEY from .env>

# 3. Verify JWT token
# Check browser DevTools > Application > State

# 4. Test order management
# View orders, update status

# 5. Test menu management
# Create, update, delete items
```

**Checklist:**
- [ ] Login page loads
- [ ] Can login with credentials
- [ ] JWT token stored
- [ ] Orders list displays
- [ ] Can update order status
- [ ] Status update triggers WhatsApp
- [ ] Can create menu items
- [ ] Can update menu items
- [ ] Can delete menu items
- [ ] Unauthorized requests return 401

### WhatsApp Flow Testing
```bash
# 1. Send message to WhatsApp
Message: "hi"

# 2. Receive interactive button
# Should see "View Menu" button

# 3. Click button
# Should open frontend URL

# 4. Place order
# Complete full order flow

# 5. Verify notifications
# Should receive order confirmation
```

**Checklist:**
- [ ] WhatsApp receives message
- [ ] Bot responds with button
- [ ] Button text is "View Menu"
- [ ] Button opens correct URL
- [ ] URL opens in WhatsApp browser
- [ ] Can browse menu
- [ ] Can place order
- [ ] Receive order confirmation
- [ ] Admin can update status
- [ ] Customer receives status updates

---

## 🔍 Monitoring & Validation

### Database Checks
```sql
-- Check customer_sessions table exists
SELECT * FROM customer_sessions LIMIT 5;

-- Check session count
SELECT COUNT(*) FROM customer_sessions;

-- Check expired sessions
SELECT COUNT(*) FROM customer_sessions WHERE expires_at < NOW();

-- Check recent orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;
```

**Checklist:**
- [ ] `customer_sessions` table exists
- [ ] Sessions are being created
- [ ] Sessions have expiry times
- [ ] Orders include all fields
- [ ] Order items linked correctly

### API Health Checks
```bash
# Public endpoints
curl https://your-backend-url.com/health
curl https://your-backend-url.com/menu
curl -X POST https://your-backend-url.com/session

# Admin endpoints (should return 401 without token)
curl https://your-backend-url.com/orders
curl https://your-backend-url.com/admin/menu

# Admin login
curl -X POST https://your-backend-url.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YOUR_API_KEY"}'
```

**Checklist:**
- [ ] Health endpoint returns 200
- [ ] Menu endpoint returns data
- [ ] Session endpoint creates sessions
- [ ] Admin endpoints require auth
- [ ] Login returns JWT token
- [ ] Invalid credentials return 401

### Performance Checks
```bash
# Test rate limiting
for i in {1..15}; do
  curl -X POST https://your-backend-url.com/session
  echo "Request $i"
done

# Should see rate limit error after 10 requests
```

**Checklist:**
- [ ] Rate limiting works
- [ ] Sessions expire after 24h
- [ ] JWT tokens expire after 24h
- [ ] Response times acceptable
- [ ] No memory leaks

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: Sessions not being created
```bash
# Check backend logs
# Verify /session endpoint is accessible
# Check CORS settings
# Verify database connection
```

**Issue**: Admin can't login
```bash
# Verify username is "admin"
# Verify password matches API_KEY in .env
# Check backend logs for auth errors
# Verify JWT secret is set
```

**Issue**: WhatsApp button not working
```bash
# Verify FRONTEND_URL is HTTPS
# Check WhatsApp API credentials
# Verify interactive message format
# Check backend logs for WhatsApp API errors
```

**Issue**: Rate limiting too strict
```bash
# Adjust in session_service.py:
MAX_REQUESTS_PER_WINDOW = 20  # Increase from 10

# Redeploy backend
```

**Issue**: CORS errors
```bash
# Update Backend/app/main.py:
allow_origins=[
    settings.frontend_url,
    "https://tapnorder.vercel.app",  # Add production URL
    "https://tapnorder-dashboard.vercel.app"
]

# Redeploy backend
```

---

## 📊 Success Criteria

### Must Have ✅
- [ ] Customers can access menu without authentication
- [ ] Sessions auto-created on first visit
- [ ] Orders can be placed with session validation
- [ ] Admins can login with username/password
- [ ] Admin routes protected with JWT
- [ ] WhatsApp sends interactive buttons
- [ ] Rate limiting prevents abuse
- [ ] All tests passing

### Nice to Have 🎯
- [ ] Session cleanup cron job
- [ ] Redis session storage
- [ ] Enhanced monitoring
- [ ] Performance metrics
- [ ] Error tracking (Sentry)

---

## 📝 Rollback Plan

If issues occur, rollback steps:

### 1. Backend Rollback
```bash
# Revert to previous version
git revert HEAD
git push

# Or redeploy previous version
# Railway/Render: Use previous deployment
```

### 2. Frontend Rollback
```bash
# Vercel: Use previous deployment
vercel rollback

# Or redeploy previous version
git checkout previous-version
vercel --prod
```

### 3. Database Rollback
```sql
-- Drop new table if needed
DROP TABLE IF EXISTS customer_sessions;

-- No changes to existing tables
-- Orders and menu items unaffected
```

---

## 🎉 Deployment Complete

Once all checks pass:

- [ ] Update documentation with production URLs
- [ ] Notify team of deployment
- [ ] Monitor logs for 24 hours
- [ ] Schedule session cleanup (optional)
- [ ] Plan next enhancements

---

## 📞 Support Contacts

- **Backend Issues**: Check Railway/Render logs
- **Frontend Issues**: Check Vercel logs
- **Database Issues**: Check database provider logs
- **WhatsApp Issues**: Check Meta Business Suite

---

**Deployment Date**: _________________

**Deployed By**: _________________

**Production URLs**:
- Backend: _________________
- Frontend: _________________
- Dashboard: _________________

**Status**: ⬜ Pending | ⬜ In Progress | ⬜ Complete | ⬜ Rolled Back
