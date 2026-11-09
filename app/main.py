from fastapi import FastAPI, Depends, HTTPException
from supabase import Client
from app.database.connection import get_supabase
from app.routes.auth import router as auth_router


app = FastAPI(
    title = 'AI DSA Companion API',
    description = 'Backend API for the AI DSA Companion V2',
    version = "2.0.0"
)
app.include_router(auth_router)
@app.get("/")
async def root():
    return {'status':"success",
            "message":"AI DSA Companion API is running smoothly"}
    
@app.get("/health")
async def health_check(db: Client = Depends(get_supabase)):
    """
    Verify that the API can successfully communicate with Supabase.
    """
    try:
        response = db.table('problems').select('id').limit(1).execute()
        return {
            "status":"healthy",
            "database_connection": "successful",
            "data":response.data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database Connection failed: {str(e)}")
    
