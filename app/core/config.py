from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GEMINI_API_KEY: str
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    
    # This tells Pydantic to read variables from the .env file
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
settings = Settings()