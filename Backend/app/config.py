from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application configuration settings"""
    
    # Database
    database_url: str
    
    # WhatsApp Cloud API
    whatsapp_api_url: str = "https://graph.facebook.com/v18.0"
    whatsapp_phone_number_id: str
    whatsapp_access_token: str
    whatsapp_verify_token: str
    
    # Application
    api_key: str
    frontend_url: str
    restaurant_name: str = "Kacchi King"
    restaurant_phone: str
    environment: str = "development"
    
    # Restaurant ID (for prototype, using a fixed UUID)
    restaurant_id: str = "00000000-0000-0000-0000-000000000001"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
