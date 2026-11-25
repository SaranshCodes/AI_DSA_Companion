from pydantic import BaseModel, Field, model_validator
from typing import List, Optional, Any

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

class MultiLanguageCode(BaseModel):
    python: str
    cpp: str
    java: str

class SolutionResponse(BaseModel):
    approach: str
    code: str = ""
    solutions: MultiLanguageCode
    time_complexity: str
    space_complexity: str

    @model_validator(mode="before")
    @classmethod
    def ensure_code_and_solutions(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if not data.get("code") and "solutions" in data:
                sols = data["solutions"]
                if isinstance(sols, dict):
                    data["code"] = sols.get("python", "")
                elif hasattr(sols, "python"):
                    data["code"] = sols.python
            elif data.get("code") and not data.get("solutions"):
                data["solutions"] = {
                    "python": data["code"],
                    "cpp": "",
                    "java": ""
                }
        return data
