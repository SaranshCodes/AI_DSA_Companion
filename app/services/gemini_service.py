import gc
import json
import logging
import time
from google import genai
from google.genai import types
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

logger = logging.getLogger(__name__)

MODEL_FALLBACK_CHAIN = [
    
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash-lite",
    "gemini-3.8-flash"
]

# Disable AFC reflection overhead to keep RAM usage minimal on Render's 512 MB tier
BASE_CONFIG = types.GenerateContentConfig(
    temperature=0.2,
    automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True),
)


class QuotaExceededError(Exception):
    """Raised when all fallback Gemini models are rate-limited or temporarily unavailable."""


class GeminiSolutionInternal(BaseModel):
    approach: str
    solutions: MultiLanguageCode
    time_complexity: str
    space_complexity: str


try:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
except Exception as e:
    raise ValueError(f"Failed to initialize Gemini Client: {str(e)}")


def _should_fallback(err: Exception) -> bool:
    code = getattr(err, "code", None)
    msg = str(err)
    return code in (429, 503, 500, 504, 404) or any(
        token in msg
        for token in (
            "429",
            "RESOURCE_EXHAUSTED",
            "503",
            "UNAVAILABLE",
            "500",
            "504",
            "404",
            "NOT_FOUND",
        )
    )


def _strip_markdown_fences(raw_text: str) -> str:
    cleaned = raw_text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    return cleaned.strip()


def _generate_with_fallback(contents: str) -> str:
    """Calls Gemini across MODEL_FALLBACK_CHAIN and returns raw response text."""
    last_error = None
    for model_name in MODEL_FALLBACK_CHAIN:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=contents,
                config=BASE_CONFIG,
            )
            text = response.text or ""
            del response
            gc.collect()
            return text
        except Exception as e:
            if _should_fallback(e):
                logger.warning(f"{model_name} unavailable/rate-limited; switching model...")
                last_error = e
                time.sleep(0.3)
                continue
            raise

    raise QuotaExceededError(
        "AI models are temporarily busy or rate-limited. Please try again in a few seconds."
    ) from last_error


def test_connection() -> str:
    """Verifies communication with Gemini."""
    try:
        text = _generate_with_fallback(
            "Say 'Hello, DSA Companion is online!' if you can read this."
        )
        return text.strip()
    except Exception as e:
        return f"Connection Failed: {str(e)}"


def analyse_problem(problem_text: str) -> PatternAnalysisResponse:
    """Analyzes a problem and returns structured pattern data."""
    try:
        formatted_prompt = PATTERN_ANALYSIS_PROMPT.replace("{problem_text}", problem_text)
        raw_text = _generate_with_fallback(formatted_prompt)
        analysis_data = json.loads(_strip_markdown_fences(raw_text))
        return PatternAnalysisResponse(**analysis_data)
    except json.JSONDecodeError:
        raise ValueError("AI returned malformed JSON. Please try again.")
    except QuotaExceededError:
        raise
    except Exception as e:
        raise Exception(f"AI analysis failed: {str(e)}")


def generate_hint(problem_text: str, pattern: str, hint_level: int) -> HintResponse:
    """Requests a specific level of hint from Gemini."""
    try:
        prompt = PROGRESSIVE_HINT_PROMPT.replace("{pattern}", pattern)
        prompt = prompt.replace("{hint_level}", str(hint_level))
        prompt = prompt.replace("{problem_text}", problem_text)

        raw_text = _generate_with_fallback(prompt)
        return HintResponse(hint=raw_text.strip())
    except QuotaExceededError:
        raise
    except Exception as e:
        raise Exception(f"Failed to generate hint: {str(e)}")


def generate_solution(problem_text: str, pattern: str) -> SolutionResponse:
    """Requests the final approach and multi-language code, returned as structured JSON."""
    try:
        prompt = SOLUTION_PROMPT.replace("{pattern}", pattern)
        prompt = prompt.replace("{problem_text}", problem_text)

        raw_text = _generate_with_fallback(prompt)
        solution_data = json.loads(_strip_markdown_fences(raw_text))

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
    except QuotaExceededError:
        raise
    except Exception as e:
        raise Exception(f"Failed to generate solution: {str(e)}")