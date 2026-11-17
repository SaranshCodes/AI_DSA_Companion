from pydantic import BaseModel, Field
from typing import List, Optional

class PatternAnalysisRequest(BaseModel):
    problem_text: str

class PatternAnalysisResponse(BaseModel):
    primary_pattern: str
    secondary_patterns: List[str]
    recognition_signals: List[str]
    why_this_pattern: str

class HintRequest(BaseModel):
    problem_text: str
    pattern: str
    hint_level: int

class HintResponse(BaseModel):
    hint: str

class SolutionRequest(BaseModel):
    problem_text: str
    pattern: str

class SolutionResponse(BaseModel):
    approach: str
    code: str
    time_complexity: str
    space_complexity: str