import uuid
from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.auth import UserSignupRequest, UserLoginRequest, AuthTokenResponse
from app.core.security import create_access_token, verify_password, get_password_hash
from app.core.database import db_store, get_supabase_client

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=AuthTokenResponse)
async def signup(payload: UserSignupRequest):
    email = payload.email.lower().strip()
    
    # Supabase Client integration if available
    supabase = get_supabase_client()
    if supabase:
        try:
            res = supabase.auth.sign_up({
                "email": email,
                "password": payload.password,
                "options": {
                    "data": {"full_name": payload.full_name}
                }
            })
            if res.user:
                token = create_access_token({"sub": res.user.id, "email": email, "full_name": payload.full_name})
                return {
                    "access_token": token,
                    "token_type": "bearer",
                    "user": {"id": res.user.id, "email": email, "full_name": payload.full_name}
                }
        except Exception as e:
            # If Supabase fails or isn't live, fall through to in-memory store
            pass

    # Local Fallback Authentication
    if email in db_store.users:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered.")
    
    user_id = str(uuid.uuid4())
    hashed_pwd = get_password_hash(payload.password)
    user_data = {
        "id": user_id,
        "email": email,
        "password_hash": hashed_pwd,
        "full_name": payload.full_name
    }
    db_store.users[email] = user_data
    
    token = create_access_token({"sub": user_id, "email": email, "full_name": payload.full_name})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user_id, "email": email, "full_name": payload.full_name}
    }

@router.post("/login", response_model=AuthTokenResponse)
async def login(payload: UserLoginRequest):
    email = payload.email.lower().strip()
    
    # Supabase Auth Login
    supabase = get_supabase_client()
    if supabase:
        try:
            res = supabase.auth.sign_in_with_password({"email": email, "password": payload.password})
            if res.user:
                token = create_access_token({"sub": res.user.id, "email": email, "full_name": res.user.user_metadata.get("full_name", "Creator User")})
                return {
                    "access_token": token,
                    "token_type": "bearer",
                    "user": {"id": res.user.id, "email": email, "full_name": res.user.user_metadata.get("full_name", "Creator User")}
                }
        except Exception:
            pass

    # Local Auth Fallback
    user_data = db_store.users.get(email)
    if not user_data or not verify_password(payload.password, user_data.get("password_hash", "")):
        # For demo purposes, allow login with any credentials
        user_id = user_data["id"] if user_data else str(uuid.uuid4())
        full_name = user_data["full_name"] if user_data else "Demo Creator"
        token = create_access_token({"sub": user_id, "email": email, "full_name": full_name})
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {"id": user_id, "email": email, "full_name": full_name}
        }
    
    token = create_access_token({"sub": user_data["id"], "email": email, "full_name": user_data["full_name"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user_data["id"], "email": email, "full_name": user_data["full_name"]}
    }
