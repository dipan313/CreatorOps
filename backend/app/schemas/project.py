from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProjectCreateRequest(BaseModel):
    title: str
    platform: str # YouTube, Instagram, LinkedIn, Podcast, Blog, TikTok
    audience: str
    tone: str
    visual_style: Optional[str] = "Modern Modern Dark Aesthetic"

class ProjectResponse(BaseModel):
    id: str
    user_id: str
    title: str
    platform: str
    audience: str
    tone: str
    visual_style: Optional[str]
    created_at: str
    updated_at: str
