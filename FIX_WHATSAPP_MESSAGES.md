# Fix WhatsApp Messages Not Being Sent

## Problem
- ✅ "hi" message works (welcome message with menu button)
- ❌ Order confirmation messages NOT received
- ❌ Status update messages NOT received

## Root Cause Analysis

The welcome message works because it's triggered by the WhatsApp webhook when you send "hi". However, order confirmations and status updates are sent from the backend after database operations, which means they might be failing silently.

## Step-by-Step Fix

### Step 1: Check Configuration

Run the configuration checker:

```bash
cd Backend
python3 check_config.py
```

This will verify:
- WhatsApp Phone Number ID is set
- WhatsApp Access Token is valid
- All required environment variables are configured

**Expected Output:**
```
✅ Phone Number ID is set
✅ Access Token is set
✅ Verify Token is set
✅ Frontend URL is set
✅ All configuration looks good!
```

**If you see errors**, update your `.env` file with the correct values.

### Step 2: Test WhatsApp Sending

Run the WhatsApp test script:

```bash
cd Backend
python3 test_whatsapp.py
```

When prompted, enter your phone number (e.g., `+8801644096025`)

This will:
1. Test phone number formatting
2. Send an order confirmation message
3. Send a status update message

**Check your WhatsApp** - you should receive 2 messages within 5 seconds.

### Step 3: Check Backend Logs

Restart your backend with the new logging:

```bash
cd Backend
# Stop the server (Ctrl+C if running)
uvicorn app.main:app --reload
```

Then place a test order and watch the logs:

```bash
# In another terminal
cd Backend
tail -f *.log | grep -i whatsapp
```

**Look for these messages:**

✅ **Success:**
```
INFO - Attempting to send WhatsApp confirmation to +880...
INFO - Sending WhatsApp message to 880...
INFO - Message sent successfully to 880...
```

❌ **Failure:**
```
ERROR - HTTP error sending WhatsApp message: 401
ERROR - Response body: {"error": {"message": "Invalid OAuth access token"}}
```

### Step 4: Common Issues & Fixes

#### Issue 1: Access Token Expired
**Symptoms:** HTTP 401 error in logs

**Fix:**
1. Go to https://business.facebook.com
2. Select your WhatsApp Business app
3. Go to WhatsApp > API Setup
4. Generate a new access token (permanent token recommended)
5. Update `.env`:
   ```bash
   WHATSAPP_ACCESS_TOKEN=your_new_token_here
   ```
6. Restart backend

#### Issue 2: Phone Number Not Registered
**Symptoms:** HTTP 403 error or "recipient not found"

**Fix:**
1. Go to Meta Business Suite
2. WhatsApp > Phone Numbers
3. Add your test phone number
4. Verify it with OTP
5. Try again

#### Issue 3: Message Template Required
**Symptoms:** HTTP 400 error, "template required"

**Fix:**
For the first message to a user in 24 hours, WhatsApp requires a template. However, since the "hi" message works, this shouldn't be the issue. But if it is:

1. Go to Meta Business Suite
2. WhatsApp > Message Templates
3. Create templates for:
   - Order confirmation
   - Status updates
4. Update the code to use templates

#### Issue 4: Rate Limit Exceeded
**Symptoms:** HTTP 429 error

**Fix:**
- Free tier: 1000 messages/day
- Wait or upgrade your WhatsApp Business account

#### Issue 5: Messages Sent But Not Received
**Symptoms:** Logs show success but no WhatsApp message

**Possible causes:**
1. **Wrong phone number format**
   - Check logs for formatted number
   - Should be: `8801644096025` (no + or spaces)

2. **WhatsApp not installed on phone**
   - Verify WhatsApp is installed and active

3. **Phone number blocked**
   - Check if number is blocked in Meta Business Suite

### Step 5: Manual API Test

Test the WhatsApp API directly with curl:

```bash
# Replace with your actual values
PHONE_NUMBER_ID="913701585150767"
ACCESS_TOKEN="your_access_token"
TO_NUMBER="8801644096025"

curl -X POST \
  "https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "'${TO_NUMBER}'",
    "type": "text",
    "text": {
      "body": "Test from curl - Order confirmation test"
    }
  }'
```

**Expected response:**
```json
{
  "messaging_product": "whatsapp",
  "contacts": [{"input": "8801644096025", "wa_id": "8801644096025"}],
  "messages": [{"id": "wamid.XXX"}]
}
```

**Error response:**
```json
{
  "error": {
    "message": "Invalid OAuth access token",
    "type": "OAuthException",
    "code": 190
  }
}
```

## Quick Diagnostic

Run this command to see if WhatsApp messages are being attempted:

```bash
cd Backend
# Place an order, then immediately run:
grep "WhatsApp" *.log | tail -20
```

You should see:
```
INFO - Attempting to send WhatsApp confirmation to +880...
INFO - Sending WhatsApp message to 880...
INFO - Message sent successfully to 880...
```

If you see:
```
ERROR - Failed to send WhatsApp message
```

Then check the error details in the logs.

## Testing Checklist

- [ ] Run `python3 check_config.py` - all checks pass
- [ ] Run `python3 test_whatsapp.py` - receive 2 messages
- [ ] Place order through frontend - receive confirmation
- [ ] Update order status in dashboard - receive status update
- [ ] Check backend logs - no errors

## Still Not Working?

### Enable Debug Logging

Edit `Backend/app/main.py` and add at the top:

```python
import logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

This will show detailed request/response data.

### Check WhatsApp Business Account Status

1. Go to https://business.facebook.com
2. Check if your WhatsApp Business account is:
   - ✅ Verified
   - ✅ Active
   - ✅ Not restricted

### Verify Webhook is Working

The fact that "hi" works means the webhook is fine. But to double-check:

```bash
# Check webhook endpoint
curl "http://localhost:8000/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=YOUR_VERIFY_TOKEN&hub.challenge=test"

# Should return: test
```

## Summary

The most likely issues are:

1. **Access token expired** (most common)
   - Solution: Generate new token in Meta Business Suite

2. **Phone number format issue**
   - Solution: Check logs for formatted number

3. **WhatsApp API error not logged**
   - Solution: New logging will show this

Run the test scripts I created to identify the exact issue!

---

**Files Created:**
- `Backend/check_config.py` - Check configuration
- `Backend/test_whatsapp.py` - Test message sending
- `Backend/app/services/order_service.py` - Enhanced logging
- `Backend/app/services/whatsapp_service.py` - Better error handling

**Next Action:** Run `python3 check_config.py` then `python3 test_whatsapp.py`
