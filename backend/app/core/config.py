import os
from pydantic_settings import BaseSettings
from typing import List, Union, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "CreatorOps AI"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = "development"
    
    # Server configuration
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    CORS_ORIGINS: Union[str, List[str]] = ["http://localhost:5173", "http://localhost:3000", "*"]
    
    # LLM Settings
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL_REASONING: str = "gemini-2.0-flash"
    GEMINI_MODEL_DRAFTING: str = "gemini-2.0-flash"
    GROQ_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    
    # Search API
    TAVILY_API_KEY: Optional[str] = None
    
    # Supabase Settings
    SUPABASE_URL: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    
    # JWT Auth Settings
    JWT_SECRET: str = "creatorops_ai_default_secret_key_change_in_production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"

settings = Settings()
