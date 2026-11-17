from fastapi import APIRouter, Depends, HTTPException
from app.dependencies.auth import get_current_user
from app.schemas.analysis import  (PatternAnalysisRequest, PatternAnalysisResponse,
                                   HintRequest, HintResponse,
                                   SolutionRequest, SolutionResponse)
from app.services import gemini_service

router = APIRouter(prefix="/api/analysis",
                   tags = ['AI Analysis'],dependencies= [Depends(get_current_user)])

@router.post("/pattern", response_model= PatternAnalysisResponse)
async def analyze_patterns(request: PatternAnalysisRequest):
    '''Analyzes the problem text and returns the required algorithmic patterns.'''
    try: 
        return gemini_service.analyse_problem(request.problem_text)
    except Exception as e:
        raise HTTPException(status_code =500, detail = str(e))
    
@router.post("/hint",response_model = HintResponse)
async def get_hint(request: HintRequest):
    """
    Generates progressive hint based on the requested level.
    """
    try: 
        return gemini_service.generate_hint(
            problem_text= request.problem_text,
            pattern = request.pattern,
            hint_level = request.hint_level
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/solution", response_model=SolutionResponse)
async def get_solution(request: SolutionRequest):
    """
    Generates the final approach and code solution.
    """
    try:
        return gemini_service.generate_solution(
            problem_text=request.problem_text,
            pattern = request.pattern
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail= str(e))
