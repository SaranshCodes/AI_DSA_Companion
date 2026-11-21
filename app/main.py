from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import Client
from app.database.connection import get_supabase
from app.routes.auth import router as auth_router
from app.routes.analysis import router as analysis_router
from app.routes.sessions import router as sessions_router
from app.routes.dashboard import router as  dashboard_router
from app.routes.recommendation import router as recommendations_router


app = FastAPI(
    title = 'AI DSA Companion API',
    description = 'Backend API for the AI DSA Companion V2',
    version = "2.0.0"
)
app.add_middleware(CORSMiddleware,
                   allow_origins=["*"],
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers= ["*"]
                   )

app.include_router(auth_router)
app.include_router(analysis_router)
app.include_router(sessions_router)
app.include_router(dashboard_router)
app.include_router(recommendations_router)

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
    
