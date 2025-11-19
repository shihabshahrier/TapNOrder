import httpx
from typing import Optional
from ..config import settings
from ..utils.whatsapp_formatter import (
    format_welcome_message,
    format_order_confirmation,
    format_status_update
)
from ..models.order import OrderStatus
import logging

logger = logging.getLogger(__name__)


class WhatsAppService:
    """Service for WhatsApp Cloud API integration"""
    
    def __init__(self):
        self.api_url = settings.whatsapp_api_url
        self.phone_number_id = settings.whatsapp_phone_number_id
        self.access_token = settings.whatsapp_access_token
        self.verify_token = settings.whatsapp_verify_token
        self.frontend_url = settings.frontend_url
        self.restaurant_name = settings.restaurant_name
    
    async def send_message(self, to: str, message: str) -> bool:
        """Send a text message via WhatsApp Cloud API"""
        base_url = self.api_url.rstrip('/')
        url = f"{base_url}/{self.phone_number_id}/messages"
        
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "messaging_product": "whatsapp",
            "to": to,
            "type": "text",
            "text": {
                "body": message
            }
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload, headers=headers)
                response.raise_for_status()
                logger.info(f"Message sent to {to}: {message[:50]}...")
                return True
        except Exception as e:
            logger.error(f"Failed to send WhatsApp message to {to}: {str(e)}")
            return False
    
    async def send_welcome_message(self, to: str) -> bool:
        """Send welcome message with menu link"""
        message = format_welcome_message(self.restaurant_name, self.frontend_url)
        return await self.send_message(to, message)
    
    async def send_order_confirmation(self, to: str, order_id: str) -> bool:
        """Send order confirmation message"""
        message = format_order_confirmation(order_id)
        return await self.send_message(to, message)
    
    async def send_status_update(self, to: str, status: OrderStatus) -> bool:
        """Send order status update message"""
        message = format_status_update(status)
        return await self.send_message(to, message)
    
    def verify_webhook(self, mode: str, token: str, challenge: str) -> Optional[str]:
        """Verify webhook subscription"""
        if mode == "subscribe" and token == self.verify_token:
            logger.info("Webhook verified successfully")
            return challenge
        logger.warning("Webhook verification failed")
        return None
    
    async def process_webhook_message(self, message_data: dict) -> dict:
        """Process incoming webhook message"""
        try:
            # Extract message details
            from_number = message_data.get("from")
            message_type = message_data.get("type")
            
            if message_type == "text":
                text = message_data.get("text", {}).get("body", "").lower()
                
                # Simple command processing
                if text in ["hi", "hello", "menu", "start"]:
                    await self.send_welcome_message(from_number)
                    return {"status": "processed", "action": "welcome_sent"}
                else:
                    # For other messages, send menu link
                    await self.send_welcome_message(from_number)
                    return {"status": "processed", "action": "menu_sent"}
            
            return {"status": "ignored", "reason": "unsupported_message_type"}
            
        except Exception as e:
            logger.error(f"Error processing webhook message: {str(e)}")
            return {"status": "error", "error": str(e)}


# Global instance
whatsapp_service = WhatsAppService()
