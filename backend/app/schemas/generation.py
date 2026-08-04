from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class GenerationCreateRequest(BaseModel):
    project_id: str
    idea_prompt: str
    platform_override: Optional[str] = None
    audience_override: Optional[str] = None
    tone_override: Optional[str] = None

class AgentRunOutput(BaseModel):
    agent_name: str
    status: str
    output_json: Dict[str, Any]
    execution_time_ms: int
    created_at: str

class GenerationProgressResponse(BaseModel):
    generation_id: str
    status: str # pending, running, completed, failed
    current_agent: str
    quality_score: int
    retry_count: int
    completed_agents: List[str]
    latest_agent_runs: List[AgentRunOutput]
    error_message: Optional[str] = None

class GenerationDetailResponse(BaseModel):
    id: str
    project_id: str
    user_id: str
    idea_prompt: str
    status: str
    current_agent: str
    quality_score: int
    retry_count: int
    agent_runs: List[AgentRunOutput]
    final_package: Optional[Dict[str, Any]] = None
    created_at: str
