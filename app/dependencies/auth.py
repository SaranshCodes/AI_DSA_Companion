from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import Client
from app.database.connection import get_supabase

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials =Depends(security),
    db: Client= Depends(get_supabase)
):
    """
    Validates the Supabase JWT token and returns the authenticated user object.
    """
    token = credentials.credentials
    try:
        user_response = db.auth.get_user(token)
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code= status.HTTP_401_UNAUTHORIZED,
                detail ="Invalid or expired token",
            )
            
        return user_response.user
    except Exception as e:
        raise HTTPException(
            status_code =status.HTTP_401_UNAUTHORIZED,
            detail = f"Authentication failed: {str(e)}",
        )