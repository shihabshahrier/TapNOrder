#!/usr/bin/env python3
"""
Check WhatsApp configuration
Run this to verify your .env settings are correct
"""
from app.config import settings

print("="*60)
print("WhatsApp Configuration Check")
print("="*60)
print()

# Check WhatsApp settings
print("WhatsApp API Configuration:")
print("-" * 60)
print(f"API URL:          {settings.whatsapp_api_url}")
print(f"Phone Number ID:  {settings.whatsapp_phone_number_id}")
print(f"Access Token:     {settings.whatsapp_access_token[:20]}...{settings.whatsapp_access_token[-10:] if len(settings.whatsapp_access_token) > 30 else ''}")
print(f"Verify Token:     {settings.whatsapp_verify_token[:10]}..." if len(settings.whatsapp_verify_token) > 10 else settings.whatsapp_verify_token)
print()

print("Application Configuration:")
print("-" * 60)
print(f"Frontend URL:     {settings.frontend_url}")
print(f"Restaurant Name:  {settings.restaurant_name}")
print(f"Restaurant Phone: {settings.restaurant_phone}")
print(f"Restaurant ID:    {settings.restaurant_id}")
print()

# Validate settings
print("Validation:")
print("-" * 60)

issues = []

if not settings.whatsapp_phone_number_id or settings.whatsapp_phone_number_id == "your_phone_number_id":
    issues.append("❌ WHATSAPP_PHONE_NUMBER_ID not set properly")
else:
    print("✅ Phone Number ID is set")

if not settings.whatsapp_access_token or settings.whatsapp_access_token == "your_access_token":
    issues.append("❌ WHATSAPP_ACCESS_TOKEN not set properly")
else:
    print("✅ Access Token is set")

if not settings.whatsapp_verify_token or settings.whatsapp_verify_token == "your_webhook_verify_token":
    issues.append("❌ WHATSAPP_VERIFY_TOKEN not set properly")
else:
    print("✅ Verify Token is set")

if not settings.frontend_url or "your-menu-app" in settings.frontend_url:
    issues.append("⚠️  FRONTEND_URL might not be set to production URL")
else:
    print("✅ Frontend URL is set")

print()

if issues:
    print("Issues Found:")
    print("-" * 60)
    for issue in issues:
        print(issue)
    print()
    print("Please update your .env file with correct values")
    print("See .env.example for reference")
else:
    print("✅ All configuration looks good!")
    print()
    print("Next steps:")
    print("1. Run: python3 test_whatsapp.py")
    print("2. Check if messages are received")
    print("3. If not, check backend logs for errors")

print()
print("="*60)
