from supabase import create_client, Client
from app.core.config import settings

supabase: Client = create_client(settings.SUPABASE_URL,settings.SUPABASE_ANON_KEY)

def get_supabase() -> Client:
    """
    Dependency function to inject the Supabase client into our FastAPI routes.
    """
    return supabase