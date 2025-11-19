# Local Testing Guide

To test the WhatsApp integration locally, the Meta servers need to reach your local backend. Since `localhost` isn't accessible from the internet, we use a tool like **ngrok**.

## 1. Exposing Local Backend (ngrok)

1.  **Install ngrok**: [Download and install ngrok](https://ngrok.com/download).
2.  **Start ngrok**: Run this command in your terminal (assuming backend is on port 8000):
    ```bash
    ngrok http 8000
    ```
3.  **Copy URL**: ngrok will give you a forwarding URL like `https://a1b2-c3d4.ngrok-free.app`.

## 2. WhatsApp Webhook Configuration

In the Meta App Dashboard:
*   **Callback URL**: `https://a1b2-c3d4.ngrok-free.app/webhook/whatsapp`
    *(Replace `https://a1b2-c3d4.ngrok-free.app` with your actual ngrok URL)*
*   **Verify Token**: The value you set in your `.env` (e.g., `secret123`).

## 3. Environment Variables (`.env`)

Here is how to configure your `.env` for local testing:

```bash
# ... database and whatsapp credentials ...

# Dashboard Security
# Pick any password you want. You will use this to log in to the Dashboard.
API_KEY=my-secret-password-123

# Frontend URL
# For local testing, point this to your local frontend (Menu App).
# This is the link sent to customers in WhatsApp.
FRONTEND_URL=http://localhost:3000

# Restaurant Details
# These appear in the WhatsApp messages.
RESTAURANT_NAME=Kacchi King Local
RESTAURANT_PHONE=+8801712345678
```

## 4. Testing Flow

1.  Start Backend: `uvicorn app.main:app --reload`
2.  Start ngrok: `ngrok http 8000`
3.  Update Meta Webhook URL with ngrok link.
4.  Send "Hi" to your WhatsApp test number.
5.  Backend receives webhook -> Sends reply with `http://localhost:3000` link.
6.  Click link -> Opens local Menu App.
