from pydantic import BaseModel, EmailStr
from typing import Optional

class UserSignupRequest(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = "Creator User"

class UserLoginRequest(BaseModel):
    email: str
    password: str

class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict
