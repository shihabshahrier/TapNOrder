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
from .auth_service import auth_service

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
    
    def _format_phone_number(self, phone: str) -> str:
        """Format phone number to international format (assuming BD +880)"""
        # Remove any non-digit characters
        clean_phone = "".join(filter(str.isdigit, phone))
        
        # If it starts with 01, it's likely a local BD number (e.g., 017...)
        if clean_phone.startswith("01"):
            return "880" + clean_phone[1:]
        
        # If it starts with 880, it's already formatted
        if clean_phone.startswith("880"):
            return clean_phone
            
        # If it's just the 10 digits (17...), add 880
        if len(clean_phone) == 10 and clean_phone.startswith("1"):
            return "880" + clean_phone
            
        return clean_phone

    async def send_message(self, to: str, message: str) -> bool:
        """Send a text message via WhatsApp Cloud API"""
        base_url = self.api_url.rstrip('/')
        url = f"{base_url}/{self.phone_number_id}/messages"
        
        formatted_to = self._format_phone_number(to)
        
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "messaging_product": "whatsapp",
            "to": formatted_to,
            "type": "text",
            "text": {
                "body": message
            }
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload, headers=headers)
                response.raise_for_status()
                logger.info(f"Message sent to {formatted_to}: {message[:50]}...")
                return True
        except Exception as e:
            logger.error(f"Failed to send WhatsApp message to {formatted_to}: {str(e)}")
            # Log the response body if available for debugging
            if 'response' in locals() and hasattr(response, 'text'):
                logger.error(f"Response body: {response.text}")
            return False
    
    async def send_welcome_message(self, to: str) -> bool:
        """Send welcome message with secure menu link"""
        # Generate access token for the user
        token = auth_service.create_access_token(data={"sub": to})
        
        # Append token to frontend URL
        secure_url = f"{self.frontend_url}?token={token}"
        
        message = format_welcome_message(self.restaurant_name, secure_url)
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
