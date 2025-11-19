#!/usr/bin/env python3
"""
Test script to verify WhatsApp message sending
Run this to test if WhatsApp API is working
"""
import asyncio
import sys
from app.services.whatsapp_service import whatsapp_service
from app.utils.whatsapp_formatter import format_order_confirmation, format_status_update
from app.models.order import OrderStatus

async def test_whatsapp():
    """Test WhatsApp message sending"""
    
    # Test phone number (replace with your actual test number)
    test_phone = input("Enter test phone number (e.g., +8801644096025): ").strip()
    
    if not test_phone:
        print("No phone number provided, using default: +8801644096025")
        test_phone = "+8801644096025"
    
    print(f"\n{'='*60}")
    print("WhatsApp Service Test")
    print(f"{'='*60}\n")
    
    # Test 1: Phone number formatting
    print("Test 1: Phone Number Formatting")
    print("-" * 60)
    formatted = whatsapp_service._format_phone_number(test_phone)
    print(f"Input:  {test_phone}")
    print(f"Output: {formatted}")
    print()
    
    # Test 2: Order confirmation message
    print("Test 2: Order Confirmation Message")
    print("-" * 60)
    test_order_id = "d518434e-d301-4647-9481-7cacdbcd9e1f"
    confirmation_msg = format_order_confirmation(test_order_id)
    print(f"Message:\n{confirmation_msg}")
    print()
    
    # Test 3: Send order confirmation
    print("Test 3: Sending Order Confirmation")
    print("-" * 60)
    print("Attempting to send...")
    success = await whatsapp_service.send_order_confirmation(test_phone, test_order_id)
    if success:
        print("✅ Order confirmation sent successfully!")
    else:
        print("❌ Failed to send order confirmation")
        print("Check the logs above for error details")
    print()
    
    # Test 4: Status update message
    print("Test 4: Status Update Message")
    print("-" * 60)
    status_msg = format_status_update(OrderStatus.ACCEPTED)
    print(f"Message: {status_msg}")
    print()
    
    # Test 5: Send status update
    print("Test 5: Sending Status Update")
    print("-" * 60)
    print("Attempting to send...")
    success = await whatsapp_service.send_status_update(test_phone, OrderStatus.ACCEPTED)
    if success:
        print("✅ Status update sent successfully!")
    else:
        print("❌ Failed to send status update")
        print("Check the logs above for error details")
    print()
    
    print(f"{'='*60}")
    print("Test Complete")
    print(f"{'='*60}\n")
    
    # Check your WhatsApp for messages
    print("📱 Check your WhatsApp for 2 messages:")
    print("   1. Order confirmation (#{order_number})")
    print("   2. Status update (Order accepted)")
    print()

if __name__ == "__main__":
    try:
        asyncio.run(test_whatsapp())
    except KeyboardInterrupt:
        print("\n\nTest cancelled by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
