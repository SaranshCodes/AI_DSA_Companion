import os
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