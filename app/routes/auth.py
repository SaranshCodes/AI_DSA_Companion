from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from supabase import Client
from app.database.connection import get_supabase
from app.dependencies.auth import get_current_user

router = APIRouter(prefix = "/api/auth", tags = ['Authentication'])

# Schema for the login request body
class LoginRequest(BaseModel):
    email:str
    password:str
    
@router.post("/login")
async def login(credentials: LoginRequest, db:Client = Depends(get_supabase)):
    """
    Temporary endpoint to get a Supabase JWT for testing in Swagger UI.
    """
    try:
        response = db.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })
        return {
            "access_token": response.session.access_token,
            "token_type":"bearer",
            "message": 'Copy the access_token to use in protected routes!'
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail = str(e))
    
@router.get("/me")
async def get_my_profile(current_user = Depends(get_current_user)):
    return {
        "message": "You are securely authenticated!",
        "user_id": current_user.id,
        "email": current_user.email
    }
    