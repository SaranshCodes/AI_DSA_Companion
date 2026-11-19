from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import Client, ClientOptions, create_client
from app.database.connection import get_supabase
from app.core.config import settings


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
        
async def get_auth_db(credentials: HTTPAuthorizationCredentials = Depends(security))-> Client:
    """
    Creates a Supabase client that acts exactly as the authenticated user.
    This ensures all PostgreSQL RLS policies are strictly enforced.
    """
    token = credentials.credentials
    client = create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_ANON_KEY
    )
    client.postgrest.auth(token)
    return client