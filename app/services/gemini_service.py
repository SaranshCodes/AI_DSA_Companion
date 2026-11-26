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

# Ordered fallback chain: each model maintains an independent Free Tier quota bucket
MODEL_FALLBACK_CHAIN = [
    "gemini-3.8-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash-lite",
]


class QuotaExceededError(Exception):
    """Raised when all fallback Gemini models are rate-limited or temporarily unavailable."""


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


def _should_fallback(err: Exception) -> bool:
    """Returns True for quota limits (429), transient demand spikes (503/500/504), or unavailable model IDs (404)."""
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
            "INTERNAL",
            "504",
            "DEADLINE_EXCEEDED",
            "404",
            "NOT_FOUND",
        )
    )


def _generate_with_fallback(
    contents: str,
    config: types.GenerateContentConfig | None = None,
):
    """Calls Gemini across MODEL_FALLBACK_CHAIN, failing over automatically on 429 quota or 503 demand spikes."""
    last_error = None
    for model_name in MODEL_FALLBACK_CHAIN:
        try:
            return client.models.generate_content(
                model=model_name,
                contents=contents,
                config=config,
            )
        except Exception as e:
            if _should_fallback(e):
                logger.warning(f"{model_name} unavailable or rate-limited ({e}); switching to next model...")
                last_error = e
                time.sleep(0.4)
                continue
            raise

    raise QuotaExceededError(
        "AI models are currently busy or rate-limited. Please try again in a few seconds."
    ) from last_error


def test_connection() -> str:
    """Verifies communication with Gemini."""
    try:
        response = _generate_with_fallback(
            contents="Say 'Hello, DSA Companion is online!' if you can read this."
        )
        return response.text.strip()
    except Exception as e:
        return f"Connection Failed: {str(e)}"


def analyse_problem(problem_text: str) -> PatternAnalysisResponse:
    """Analyzes a problem and returns structured pattern data."""
    try:
        formatted_prompt = PATTERN_ANALYSIS_PROMPT.replace("{problem_text}", problem_text)

        response = _generate_with_fallback(
            contents=formatted_prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=PatternAnalysisResponse,
                temperature=0.2,
            ),
        )

        return PatternAnalysisResponse.model_validate_json(response.text)

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

        response = _generate_with_fallback(contents=prompt)
        return HintResponse(hint=response.text.strip())

    except QuotaExceededError:
        raise
    except Exception as e:
        raise Exception(f"Failed to generate hint: {str(e)}")


def generate_solution(problem_text: str, pattern: str) -> SolutionResponse:
    """Requests the final approach and multi-language code, returned as structured JSON."""
    try:
        prompt = SOLUTION_PROMPT.replace("{pattern}", pattern)
        prompt = prompt.replace("{problem_text}", problem_text)

        response = _generate_with_fallback(
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=GeminiSolutionInternal,
                temperature=0.2,
            ),
        )

        parsed = GeminiSolutionInternal.model_validate_json(response.text)

        return SolutionResponse(
            approach=parsed.approach,
            code=parsed.solutions.python,  # Backward compatibility for Chrome Extension
            solutions=parsed.solutions,
            time_complexity=parsed.time_complexity,
            space_complexity=parsed.space_complexity,
        )

    except QuotaExceededError:
        raise
    except Exception as e:
        raise Exception(f"Failed to generate solution: {str(e)}")