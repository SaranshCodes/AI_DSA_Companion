import os
import json
from google import genai
from dotenv import load_dotenv


# Load environment variables from the .env file
load_dotenv()

# The client will automatically pick up GEMINI_API_KEY from the environment
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file.")

def test_connection() -> str:
    """
    A simple function to verify that we can communicate with Gemini using the new SDK.
    """
    try:
        # Initialize the new Google Gen AI client
        client = genai.Client(api_key=api_key)
        
        # We use gemini-2.5-flash as our fast default model
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents="Say 'Hello, DSA Companion is online!' if you can read this."
        )
        
        return response.text
    except Exception as e:
        return f"Connection Failed: {str(e)}"
    
def analyse_problem(problem_text: str) -> dict:
    """
        A simple function to verify that we can communicate with Gemini using the new SDK.
    """
    from prompts.prompt_pattern import PATTERN_ANALYSIS_PROMPT
    try:
        client = genai.Client(api_key=api_key)
        
        formatted_prompt = PATTERN_ANALYSIS_PROMPT.replace("{problem_text}",problem_text)
        response = client.models.generate_content(
            model = 'gemini-2.5-flash',
            contents= formatted_prompt
        )
        
        # Cleaning the response if LLM tries to add markdown code blocks
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:-3].strip()
        elif raw_text.startswith("```"):
            raw_text = raw_text[3:-3].strip()
            
        # Parse the string into a Python dictionary
        analysis_data =json.loads(raw_text)
        return analysis_data
    except json.JSONDecodeError:
        raise ValueError("AI returned malformed JSON. Please try again")
    except Exception as e:
        raise Exception(f'AI analysis failed: {str(e)}')