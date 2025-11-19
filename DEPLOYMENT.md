# Deployment Guide

To go live, you need to deploy the three components to the cloud. Here is the step-by-step guide based on your preferred stack: **NeonDB**, **AWS**, and **Cloudflare Pages**.

## 1. Database (NeonDB)

1.  **Create Project**: Log in to [Neon Console](https://console.neon.tech) and create a new project.
2.  **Get Connection String**: Copy the `postgres://...` connection string.
3.  **Save it**: You will need this for the Backend environment variables.

## 2. Backend (AWS App Runner)

We will use **AWS App Runner** because it's the easiest way to deploy the containerized FastAPI app.

### Prerequisites
-   AWS CLI installed and configured.
-   Docker installed.

### Steps
1.  **Create ECR Repository**:
    ```bash
    aws ecr create-repository --repository-name tapnorder-backend
    ```

2.  **Build & Push Docker Image**:
    ```bash
    cd Backend
    # Login to ECR
    aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <your-account-id>.dkr.ecr.us-east-1.amazonaws.com
    
    # Build
    docker build -t tapnorder-backend .
    
    # Tag
    docker tag tapnorder-backend:latest <your-account-id>.dkr.ecr.us-east-1.amazonaws.com/tapnorder-backend:latest
    
    # Push
    docker push <your-account-id>.dkr.ecr.us-east-1.amazonaws.com/tapnorder-backend:latest
    ```

3.  **Deploy to App Runner**:
    -   Go to AWS Console > App Runner > Create Service.
    -   Source: **Container Registry** (Select the image you just pushed).
    -   **Configuration**:
        -   Port: `8000`
        -   **Environment Variables** (Add these):
            -   `DATABASE_URL`: (Your NeonDB string)
            -   `WHATSAPP_PHONE_NUMBER_ID`: (From Meta)
            -   `WHATSAPP_ACCESS_TOKEN`: (From Meta)
            -   `WHATSAPP_VERIFY_TOKEN`: (Create a random string, e.g., "secret123")
            -   `API_KEY`: (Create a secure key for dashboard access)
            -   `FRONTEND_URL`: (Your future Cloudflare URL)
    -   Create & Deploy.
    -   **Copy the Service URL** (e.g., `https://xyz.us-east-1.awsapprunner.com`).

## 3. Frontends (Cloudflare Pages)

You will deploy two separate sites on Cloudflare Pages.

### Customer App (`frontend/`)
1.  Go to Cloudflare Dashboard > Pages > **Connect to Git**.
2.  Select your repository.
3.  **Build Settings**:
    -   **Project Name**: `tapnorder-menu`
    -   **Framework Preset**: Next.js (Static/Export not needed for App Router, but standard Next.js is fine).
    -   **Build Command**: `npm run build`
    -   **Output Directory**: `.next` (Cloudflare usually detects this automatically).
    -   **Root Directory**: `frontend` (IMPORTANT)
4.  **Environment Variables**:
    -   `NEXT_PUBLIC_API_URL`: Your AWS Backend URL (e.g., `https://xyz.us-east-1.awsapprunner.com`)
5.  **Deploy**.

### Dashboard App (`dashboard/`)
1.  Create a **New Project** in Cloudflare Pages.
2.  Select the same repository.
3.  **Build Settings**:
    -   **Project Name**: `tapnorder-dashboard`
    -   **Build Command**: `npm run build`
    -   **Root Directory**: `dashboard` (IMPORTANT)
4.  **Environment Variables**:
    -   `NEXT_PUBLIC_API_URL`: Your AWS Backend URL.
5.  **Deploy**.

## 4. Final Wiring (WhatsApp Webhook)

1.  Go to **Meta Developers Portal** > Your App > WhatsApp > Configuration.
2.  **Edit Webhook**:
    -   **Callback URL**: `https://<YOUR-AWS-BACKEND-URL>/webhook/whatsapp`
    -   **Verify Token**: The `WHATSAPP_VERIFY_TOKEN` you set in AWS.
3.  **Verify & Save**.
4.  **Manage Webhook Fields**: Subscribe to `messages`.

## 5. Go Live Checklist

-   [ ] **Database**: Tables created (App Runner should run `init_db.py` or you can run it locally pointing to NeonDB).
-   [ ] **Backend**: Health check returns `{"status": "healthy"}`.
-   [ ] **WhatsApp**: Sending "Hi" to the bot replies with the Cloudflare Menu URL.
-   [ ] **Frontend**: Menu loads items from the DB.
-   [ ] **Dashboard**: Login works with your API Key.

You are now live! 🚀
