from fastapi import APIRouter, Request, Query, HTTPException, status
from typing import Optional
import logging

from ..services.whatsapp_service import whatsapp_service

router = APIRouter(prefix="/webhook", tags=["webhook"])
logger = logging.getLogger(__name__)


@router.get("/whatsapp")
async def verify_webhook(
    mode: str = Query(alias="hub.mode"),
    token: str = Query(alias="hub.verify_token"),
    challenge: str = Query(alias="hub.challenge")
):
    """Verify WhatsApp webhook subscription"""
    result = whatsapp_service.verify_webhook(mode, token, challenge)
    
    if result:
        return int(result)
    
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Webhook verification failed"
    )


@router.post("/whatsapp")
async def handle_webhook(request: Request):
    """Handle incoming WhatsApp webhook events"""
    try:
        body = await request.json()
        
        # Log the webhook payload
        logger.info(f"Received webhook: {body}")
        
        # Extract message data
        if "entry" in body:
            for entry in body["entry"]:
                if "changes" in entry:
                    for change in entry["changes"]:
                        if change.get("field") == "messages":
                            value = change.get("value", {})
                            
                            # Process messages
                            if "messages" in value:
                                for message in value["messages"]:
                                    result = await whatsapp_service.process_webhook_message(message)
                                    logger.info(f"Message processed: {result}")
        
        # Always return 200 to acknowledge receipt
        return {"status": "ok"}
        
    except Exception as e:
        logger.error(f"Error handling webhook: {str(e)}")
        # Still return 200 to prevent WhatsApp from retrying
        return {"status": "error", "message": str(e)}
