import logging
from typing import Optional, Dict, Any, List
from supabase import create_client, Client
from app.core.config import settings

logger = logging.getLogger(__name__)

supabase_client: Optional[Client] = None

if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
    try:
        supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
        logger.info("Successfully connected to Supabase Client.")
    except Exception as e:
        logger.warning(f"Failed to initialize Supabase client: {e}. Falling back to in-memory db manager.")
else:
    logger.info("Supabase URL or Anon key not set. Using in-memory db fallback for local development.")

def get_supabase_client() -> Optional[Client]:
    return supabase_client

# In-memory Store Fallback Manager for Zero-Config Local Testing
class InMemoryDatabase:
    def __init__(self):
        self.users: Dict[str, Dict[str, Any]] = {}
        self.projects: Dict[str, Dict[str, Any]] = {}
        self.generations: Dict[str, Dict[str, Any]] = {}
        self.agent_runs: Dict[str, List[Dict[str, Any]]] = {} # generation_id -> list
        self.final_packages: Dict[str, Dict[str, Any]] = {} # generation_id -> pkg
        self.exports: Dict[str, Dict[str, Any]] = {}

db_store = InMemoryDatabase()
