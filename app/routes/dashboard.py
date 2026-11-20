from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from app.dependencies.auth import get_current_user, get_auth_db
from app.services import analytics_service

router = APIRouter(
    prefix= "/api/dashboard",
    tags = ["Dashboard & Analytics"],
    dependencies= [Depends(get_current_user)]
)

@router.get("/")
async def get_dashboard_overview(db: Client = Depends(get_auth_db)):
    """ 
    Returns overall learning statistics for the authenticated user.
    """
    try:
        response = db.table("sessions").select("*").execute()
        return analytics_service.calculate_overall_stats(response.data)
    except Exception as e:
        raise HTTPException(status_code=500, detail = f"Failed to compute dashboard stats: {str(e)}")
    
@router.get("/patterns")
async def get_pattern_analytics(db: Client = Depends(get_auth_db)):
    """ 
    Returns pattern-wise performance metrics and flags struggling patterns.
    """
    try: 
        response = (
            db.table("sessions").select(
                "status, time_taken_mins, confidence, hints_used, approach_requested, code_requested, problems(primary_pattern)")
            .execute()
        )
        return analytics_service.calculate_pattern_stats(response.data)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=  f"Failed to compute pattern analytics: {str(e)}")
    