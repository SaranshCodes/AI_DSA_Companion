from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GEMINI_API_KEY: str
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    ALLOWED_ORIGINS: str = "http://localhost:3000, http://localhost:5173, chrome-extension://nmjkhjefieggclkfediipkplkhjckpfn"
    
    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]
    # This tells Pydantic to read variables from the .env file
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
settings = Settings()