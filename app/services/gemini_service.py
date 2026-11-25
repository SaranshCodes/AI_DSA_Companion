import json
from google import genai
from pydantic import BaseModel
from app.core.config import settings
from app.schemas.analysis import (
    PatternAnalysisResponse,
    HintResponse,
    SolutionResponse,
    MultiLanguageCode,
)
from app.services.prompts.prompt_pattern import PATTERN_ANALYSIS_PROMPT
from app.services.prompts.hint_prompt import PROGRESSIVE_HINT_PROMPT, SOLUTION_PROMPT

# Internal response schema for Gemini output
class GeminiSolutionInternal(BaseModel):
    approach: str
    solutions: MultiLanguageCode
    time_complexity: str
    space_complexity: str

# Initialize the client once using the validated setting
try:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
except Exception as e:
    raise ValueError(f"Failed to initialize Gemini Client: {str(e)}")

def test_connection() -> str:
    """Verifies communication with Gemini."""
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents="Say 'Hello, DSA Companion is online!' if you can read this."
        )
        return response.text.strip()
    except Exception as e:
        return f"Connection Failed: {str(e)}"

def analyse_problem(problem_text: str) -> PatternAnalysisResponse:
    """Analyzes a problem and returns structured pattern data."""
    try:
        formatted_prompt = PATTERN_ANALYSIS_PROMPT.replace("{problem_text}", problem_text)
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=formatted_prompt
        )
        
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:-3].strip()
        elif raw_text.startswith("```"):
            raw_text = raw_text[3:-3].strip()
            
        analysis_data = json.loads(raw_text)
        
        # Pass the dictionary into the Pydantic model for validation
        return PatternAnalysisResponse(**analysis_data)
        
    except json.JSONDecodeError:
        raise ValueError("AI returned malformed JSON. Please try again.")
    except Exception as e:
        raise Exception(f'AI analysis failed: {str(e)}')

def generate_hint(problem_text: str, pattern: str, hint_level: int) -> HintResponse:
    """Requests a specific level of hint from Gemini."""
    try:
        prompt = PROGRESSIVE_HINT_PROMPT.replace("{pattern}", pattern)
        prompt = prompt.replace("{hint_level}", str(hint_level))
        prompt = prompt.replace("{problem_text}", problem_text)
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        return HintResponse(hint=response.text.strip())
        
    except Exception as e:
        raise Exception(f"Failed to generate hint: {str(e)}")

def generate_solution(problem_text: str, pattern: str) -> SolutionResponse:
    """Requests the final approach and multi-language code, returned as structured JSON."""
    try:
        prompt = SOLUTION_PROMPT.replace("{pattern}", pattern)
        prompt = prompt.replace("{problem_text}", problem_text)
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:-3].strip()
        elif raw_text.startswith("```"):
            raw_text = raw_text[3:-3].strip()
            
        solution_data = json.loads(raw_text)
        
        if "solutions" in solution_data and isinstance(solution_data["solutions"], dict):
            parsed = GeminiSolutionInternal(**solution_data)
            return SolutionResponse(
                approach=parsed.approach,
                code=parsed.solutions.python,
                solutions=parsed.solutions,
                time_complexity=parsed.time_complexity,
                space_complexity=parsed.space_complexity,
            )
        elif "code" in solution_data:
            python_code = solution_data["code"]
            fallback_sols = MultiLanguageCode(python=python_code, cpp="", java="")
            return SolutionResponse(
                approach=solution_data.get("approach", ""),
                code=python_code,
                solutions=fallback_sols,
                time_complexity=solution_data.get("time_complexity", ""),
                space_complexity=solution_data.get("space_complexity", ""),
            )
        else:
            return SolutionResponse(**solution_data)
        
    except json.JSONDecodeError:
        raise ValueError("AI returned malformed JSON for the solution.")
    except Exception as e:
        raise Exception(f"Failed to generate solution: {str(e)}")
