from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from app.dependencies.auth import get_current_user, get_auth_db
from app.schemas.recommendation import RecommendationResponse
from app.services import recommendation_service

router = APIRouter(
    prefix = '/api/recommendations',
    tags = ['Recommendations'],
    dependencies=[Depends(get_current_user)]
)

@router.get("/", response_model= RecommendationResponse)
async def get_recommendations( db: Client = Depends(get_auth_db)):
    """ 
    Returns ranked weak algorithmic patterns, a spaced-repetition revision queue, and a suggested next action for the authenticated user.
    """
    try: 
        response= (
        db.table("sessions").select(
            "problem_id, status, confidence, hints_used, approach_requested, code_requested, started_at, "
            "problems( leetcode_id,title, difficulty, primary_pattern,url)"
        ).execute()
    )
        return recommendation_service.generate_recommendations(response.data)
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail = f"Failed to generate recommendations: {str(e)}"
        )