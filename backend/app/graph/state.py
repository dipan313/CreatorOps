from typing import TypedDict, Optional, Dict, Any, List

class AgentState(TypedDict):
    generation_id: str
    project_id: str
    user_id: str
    idea_prompt: str
    platform: str
    audience: str
    tone: str
    visual_style: Optional[str]
    
    # Execution Tracking
    current_agent: str
    status: str
    retry_count: int
    quality_score: int
    quality_feedback: Optional[str]
    completed_agents: List[str]
    
    # Agent Outputs
    creative_direction: Optional[Dict[str, Any]]
    planner_outline: Optional[Dict[str, Any]]
    research_data: Optional[Dict[str, Any]]
    content_draft: Optional[Dict[str, Any]]
    quality_review: Optional[Dict[str, Any]]
    growth_strategy: Optional[Dict[str, Any]]
    
    error_message: Optional[str]
