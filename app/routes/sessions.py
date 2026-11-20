from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from app.dependencies.auth import get_current_user, get_auth_db
from app.schemas.tracking import SessionCreate

router = APIRouter(
    prefix ="/api/sessions",
    tags = ["Session Tracking"],
    dependencies= [Depends(get_current_user)]
)

@router.post("/")
async def save_session(
    session_data: SessionCreate,
    current_user = Depends(get_current_user),
    db: Client= Depends(get_auth_db)
):
    """
    Saves a problem(upsert) and records the solving session.
    """
    try:
        # 1. Prepare and Upsert the Problem
        problem_payload =session_data.problem_details.model_dump()
        problem_payload['user_id'] = current_user.id
        
        # We use on_conflict="user_id, leetcode_id" to trigger the UNIQUE constraint we made in Phase 1.
        # This prevents duplicate problem entries for the same user.
        problem_response = db.table("problems").upsert(
            problem_payload,
            on_conflict = "user_id, leetcode_id"
        ).execute()
        
        if not problem_response.data:
            raise ValueError("Failed to save the problem data.")
        problem_id = problem_response.data[0]['id']
        
        
        # 2. Prepare and insert the session
        
        session_payload = {
            "user_id": current_user.id,
            "problem_id": problem_id,
            "time_taken_mins": session_data.time_taken_mins,
            "hints_used": session_data.hints_used,
            "approach_requested": session_data.approach_requested,
            "code_requested": session_data.code_requested,
            "hints_used_after_solve": session_data.hints_used_after_solve,
            "approach_requested_after_solve": session_data.approach_requested_after_solve,
            "code_requested_after_solve": session_data.code_requested_after_solve,          
            "status": session_data.status,
            "solved_independently": session_data.solved_independently,
            "confidence": session_data.confidence,
            "struggle_notes": session_data.struggle_notes
        }
        
        session_response = db.table("sessions").insert(session_payload).execute()
        
        return {
            "message": "Session saved successfully",
            "session_id" : session_response.data[0]["id"],
            "problem_id": problem_id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
@router.get("/")
async def get_sessions(
    db:Client = Depends(get_auth_db)
):
    """ 
    Retrieves the authenticated user's session history joined with problem metadata, ordered from newest to oldest."""
    try: 
        response = (
            db.table("sessions").select("*, problems(leetcode_id, title, difficulty, primary_pattern, url)").order("started_at",desc=True).execute()
        )
        return {
            "count": len(response.data),
            "sessions": response.data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail = f"Failed to fetch sessions: {str(e)}")