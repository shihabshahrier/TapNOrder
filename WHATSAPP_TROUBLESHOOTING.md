# WhatsApp Notification Troubleshooting Guide

## Issue
Order confirmation messages not being sent to customers via WhatsApp after order creation.

## Enhanced Logging Added

### Changes Made

#### 1. Order Service (`Backend/app/services/order_service.py`)
Added detailed logging around WhatsApp confirmation:
```python
logger.info(f"Attempting to send WhatsApp confirmation to {order_data.customer_phone}")
success = await whatsapp_service.send_order_confirmation(...)
if success:
    logger.info(f"WhatsApp confirmation sent successfully")
else:
    logger.error(f"Failed to send WhatsApp confirmation")
```

#### 2. WhatsApp Service (`Backend/app/services/whatsapp_service.py`)
Enhanced error handling with specific exception types:
```python
except httpx.HTTPStatusError as e:
    logger.error(f"HTTP error: {e.response.status_code}")
    logger.error(f"Response body: {e.response.text}")
except httpx.TimeoutException as e:
    logger.error(f"Timeout: {str(e)}")
except Exception as e:
    logger.error(f"Failed: {str(e)}")
    logger.error(f"Exception type: {type(e).__name__}")
```

## Debugging Steps

### 1. Check Backend Logs
After placing an order, look for these log messages:

```bash
# Successful flow
2025-11-19 XX:XX:XX - app.services.order_service - INFO - Order created: <uuid> for <customer>
2025-11-19 XX:XX:XX - app.services.order_service - INFO - Attempting to send WhatsApp confirmation to +880...
2025-11-19 XX:XX:XX - app.services.whatsapp_service - INFO - Sending WhatsApp message to 880...
2025-11-19 XX:XX:XX - app.services.whatsapp_service - INFO - Message sent successfully to 880...
2025-11-19 XX:XX:XX - app.services.order_service - INFO - WhatsApp confirmation sent successfully
```

```bash
# Failed flow - look for ERROR messages
2025-11-19 XX:XX:XX - app.services.whatsapp_service - ERROR - HTTP error sending WhatsApp message: 401
2025-11-19 XX:XX:XX - app.services.whatsapp_service - ERROR - Response body: {"error": {...}}
```

### 2. Common Issues & Solutions

#### Issue: 401 Unauthorized
**Cause**: Invalid or expired WhatsApp access token

**Solution**:
```bash
# Check .env file
WHATSAPP_ACCESS_TOKEN=your_token_here

# Get new token from Meta Business Suite:
# 1. Go to https://business.facebook.com
# 2. Select your app
# 3. Go to WhatsApp > API Setup
# 4. Copy the temporary or permanent access token
# 5. Update .env and restart backend
```

#### Issue: 400 Bad Request
**Cause**: Invalid phone number format or missing parameters

**Solution**:
```bash
# Check phone number format in logs
# Should be: 880XXXXXXXXX (for Bangladesh)
# Example: 8801644096025

# Verify customer phone in order:
# Frontend should send: +8801644096025 or 01644096025
# Backend will format to: 8801644096025
```

#### Issue: 403 Forbidden
**Cause**: Phone number not registered in WhatsApp Business

**Solution**:
```bash
# For testing, add phone numbers to WhatsApp Business account:
# 1. Go to Meta Business Suite
# 2. WhatsApp > Phone Numbers
# 3. Add test phone numbers
# 4. Verify them via OTP
```

#### Issue: Timeout
**Cause**: Network issues or WhatsApp API slow response

**Solution**:
```bash
# Check network connectivity
ping graph.facebook.com

# Increase timeout (already set to 30s)
# Check if firewall blocking outbound HTTPS
```

#### Issue: No logs at all
**Cause**: WhatsApp service not being called

**Solution**:
```bash
# Check if order creation is async
# Verify the route is using await:
await order_service.create_order(db, order_data)

# Check if exception is being caught silently
# New logging should show this now
```

### 3. Test WhatsApp API Directly

Use curl to test the WhatsApp API:

```bash
# Replace with your values
PHONE_NUMBER_ID="your_phone_number_id"
ACCESS_TOKEN="your_access_token"
TO_NUMBER="8801644096025"  # Customer's number

curl -X POST \
  "https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "'${TO_NUMBER}'",
    "type": "text",
    "text": {
      "body": "Test message from TapNOrder"
    }
  }'
```

**Expected response**:
```json
{
  "messaging_product": "whatsapp",
  "contacts": [{
    "input": "8801644096025",
    "wa_id": "8801644096025"
  }],
  "messages": [{
    "id": "wamid.XXX"
  }]
}
```

### 4. Verify Environment Variables

```bash
cd Backend

# Check if .env file exists
ls -la .env

# Verify WhatsApp credentials are set
grep WHATSAPP .env

# Should show:
# WHATSAPP_API_URL=https://graph.facebook.com/v18.0
# WHATSAPP_PHONE_NUMBER_ID=913701585150767
# WHATSAPP_ACCESS_TOKEN=EAAI...
# WHATSAPP_VERIFY_TOKEN=your_verify_token
```

### 5. Check Phone Number Format

The backend automatically formats phone numbers:

```python
# Input formats accepted:
"01644096025"      → "8801644096025"  ✓
"+8801644096025"   → "8801644096025"  ✓
"8801644096025"    → "8801644096025"  ✓
"1644096025"       → "8801644096025"  ✓

# Check logs for formatted number:
# "Sending WhatsApp message to 8801644096025"
```

### 6. Test Order Flow

```bash
# 1. Place a test order
curl -X POST http://localhost:8000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Test Customer",
    "customer_phone": "+8801644096025",
    "order_type": "delivery",
    "delivery_address": "Test Address",
    "items": [
      {"item_id": "menu-item-uuid", "quantity": 1}
    ]
  }'

# 2. Check backend logs immediately
tail -f backend.log | grep -i whatsapp

# 3. Check WhatsApp on phone
# Should receive confirmation message within 5 seconds
```

## Expected Log Flow

### Successful Order with WhatsApp Notification

```
1. Order creation starts
   INFO - Creating order for Test Customer

2. Order saved to database
   INFO - Order created: d518434e-d301-4647-9481-7cacdbcd9e1f for Test Customer

3. WhatsApp sending starts
   INFO - Attempting to send WhatsApp confirmation to +8801644096025
   INFO - Sending WhatsApp message to 8801644096025

4. WhatsApp API responds
   INFO - Message sent successfully to 8801644096025: Thank you for your order...
   INFO - WhatsApp confirmation sent successfully to +8801644096025

5. Order creation completes
   POST /orders 201 Created
```

## Quick Fixes

### Fix 1: Restart Backend
```bash
# Sometimes the WhatsApp client needs to be reinitialized
cd Backend
# Stop the server (Ctrl+C)
uvicorn app.main:app --reload
```

### Fix 2: Verify Token
```bash
# Test if token is valid
curl -X GET \
  "https://graph.facebook.com/v18.0/me?access_token=YOUR_ACCESS_TOKEN"

# Should return your app info, not an error
```

### Fix 3: Check Rate Limits
```bash
# WhatsApp has rate limits:
# - 1000 messages per day (free tier)
# - 80 messages per second (burst)

# Check if you've hit limits in Meta Business Suite
```

### Fix 4: Enable Debug Logging
```python
# In Backend/app/main.py, add:
import logging
logging.basicConfig(level=logging.DEBUG)

# This will show DEBUG level logs including payloads
```

## Monitoring

### Set Up Alerts
```bash
# Monitor for WhatsApp errors
tail -f backend.log | grep "ERROR.*WhatsApp"

# Monitor for successful sends
tail -f backend.log | grep "Message sent successfully"
```

### Check Success Rate
```bash
# Count successful vs failed
grep "WhatsApp confirmation sent successfully" backend.log | wc -l
grep "Failed to send WhatsApp confirmation" backend.log | wc -l
```

## Next Steps

1. **Place a test order** and check the logs
2. **Look for the new log messages** added in this update
3. **Identify the specific error** from the logs
4. **Apply the corresponding fix** from this guide
5. **Test again** to verify the fix works

## Support Resources

- **WhatsApp Business API Docs**: https://developers.facebook.com/docs/whatsapp/cloud-api
- **Meta Business Suite**: https://business.facebook.com
- **Error Codes Reference**: https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes

---

**Status**: Enhanced logging added, ready for debugging
**Date**: November 19, 2025
