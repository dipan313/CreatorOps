import time
import logging
from typing import Dict, Any
from langgraph.graph import StateGraph, END
from app.graph.state import AgentState
from app.agents.creative_director import CreativeDirectorAgent
from app.agents.planner import PlannerAgent
from app.agents.research_analyst import ResearchAnalystAgent
from app.agents.content_creator import ContentCreatorAgent
from app.agents.quality_director import QualityDirectorAgent
from app.agents.growth_strategist import GrowthStrategistAgent
from app.schemas.agent_outputs import (
    CreativeDirectorOutput, PlannerOutput, ResearchAnalystOutput,
    ContentCreatorOutput, QualityDirectorOutput, GrowthStrategistOutput
)
from app.core.database import db_store, get_supabase_client

logger = logging.getLogger(__name__)

# Initialize agent instances
creative_agent = CreativeDirectorAgent()
planner_agent = PlannerAgent()
research_agent = ResearchAnalystAgent()
content_agent = ContentCreatorAgent()
quality_agent = QualityDirectorAgent()
growth_agent = GrowthStrategistAgent()

def record_agent_run(generation_id: str, agent_name: str, status: str, input_json: Dict, output_json: Dict, execution_time_ms: int):
    run_entry = {
        "id": f"run_{agent_name}_{int(time.time()*1000)}",
        "generation_id": generation_id,
        "agent_name": agent_name,
        "status": status,
        "input_json": input_json,
        "output_json": output_json,
        "execution_time_ms": execution_time_ms,
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ")
    }
    if generation_id not in db_store.agent_runs:
        db_store.agent_runs[generation_id] = []
    db_store.agent_runs[generation_id].append(run_entry)

    # Supabase insert if connected
    supabase = get_supabase_client()
    if supabase:
        try:
            supabase.table("agent_runs").insert({
                "generation_id": generation_id,
                "agent_name": agent_name,
                "status": status,
                "input_json": input_json,
                "output_json": output_json,
                "execution_time_ms": execution_time_ms
            }).execute()
        except Exception as e:
            logger.warning(f"Failed to record agent run in Supabase: {e}")

# Nodes
async def node_creative_director(state: AgentState) -> Dict[str, Any]:
    t0 = time.time()
    state["current_agent"] = "Creative Director"
    output = await creative_agent.run(
        {"idea_prompt": state["idea_prompt"], "platform": state["platform"], "audience": state["audience"], "tone": state["tone"]},
        CreativeDirectorOutput
    )
    t_ms = int((time.time() - t0) * 1000)
    record_agent_run(state["generation_id"], "Creative Director", "completed", state, output, t_ms)
    
    completed = state.get("completed_agents", [])
    if "Creative Director" not in completed:
        completed.append("Creative Director")

    return {
        "creative_direction": output,
        "current_agent": "Planner",
        "completed_agents": completed
    }

async def node_planner(state: AgentState) -> Dict[str, Any]:
    t0 = time.time()
    state["current_agent"] = "Planner"
    output = await planner_agent.run(
        {"platform": state["platform"], "creative_direction": state.get("creative_direction", {})},
        PlannerOutput
    )
    t_ms = int((time.time() - t0) * 1000)
    record_agent_run(state["generation_id"], "Planner", "completed", state, output, t_ms)
    
    completed = state.get("completed_agents", [])
    if "Planner" not in completed:
        completed.append("Planner")

    return {
        "planner_outline": output,
        "current_agent": "Research Analyst",
        "completed_agents": completed
    }

async def node_research_analyst(state: AgentState) -> Dict[str, Any]:
    t0 = time.time()
    state["current_agent"] = "Research Analyst"
    output = await research_agent.run(
        {"idea_prompt": state["idea_prompt"], "platform": state["platform"]},
        ResearchAnalystOutput
    )
    t_ms = int((time.time() - t0) * 1000)
    record_agent_run(state["generation_id"], "Research Analyst", "completed", state, output, t_ms)
    
    completed = state.get("completed_agents", [])
    if "Research Analyst" not in completed:
        completed.append("Research Analyst")

    return {
        "research_data": output,
        "current_agent": "Content Creator",
        "completed_agents": completed
    }

async def node_content_creator(state: AgentState) -> Dict[str, Any]:
    t0 = time.time()
    state["current_agent"] = "Content Creator"
    output = await content_agent.run(
        {
            "idea_prompt": state["idea_prompt"],
            "platform": state["platform"],
            "creative_direction": state.get("creative_direction"),
            "planner_outline": state.get("planner_outline"),
            "research_data": state.get("research_data"),
            "quality_feedback": state.get("quality_feedback"),
            "retry_count": state.get("retry_count", 0)
        },
        ContentCreatorOutput
    )
    t_ms = int((time.time() - t0) * 1000)
    record_agent_run(state["generation_id"], "Content Creator", "completed", state, output, t_ms)
    
    completed = state.get("completed_agents", [])
    if "Content Creator" not in completed:
        completed.append("Content Creator")

    return {
        "content_draft": output,
        "current_agent": "Quality Director",
        "completed_agents": completed
    }

async def node_quality_director(state: AgentState) -> Dict[str, Any]:
    t0 = time.time()
    state["current_agent"] = "Quality Director"
    retry_cnt = state.get("retry_count", 0)
    output = await quality_agent.run(
        {
            "content_draft": state.get("content_draft"),
            "retry_count": retry_cnt
        },
        QualityDirectorOutput
    )
    t_ms = int((time.time() - t0) * 1000)
    record_agent_run(state["generation_id"], "Quality Director", "completed", state, output, t_ms)
    
    score = output.get("overall_score", 90)
    passes = output.get("passes_quality_gate", True)
    feedback = output.get("actionable_feedback", "")

    completed = state.get("completed_agents", [])
    if "Quality Director" not in completed:
        completed.append("Quality Director")

    new_retry_count = retry_cnt + (0 if passes else 1)

    return {
        "quality_review": output,
        "quality_score": score,
        "quality_feedback": feedback,
        "retry_count": new_retry_count,
        "completed_agents": completed
    }

def route_quality_check(state: AgentState) -> str:
    """Quality Loop Router: If score < 90 and retries < 3, return to content_creator."""
    score = state.get("quality_score", 90)
    retries = state.get("retry_count", 0)
    
    if score < 90 and retries < 3:
        logger.info(f"Quality score {score} < 90. Routing back to Content Creator for revision (Retry {retries}/3).")
        return "content_creator"
    
    logger.info(f"Quality score {score} passed or max retries reached. Routing to Growth Strategist.")
    return "growth_strategist"

async def node_growth_strategist(state: AgentState) -> Dict[str, Any]:
    t0 = time.time()
    state["current_agent"] = "Growth Strategist"
    output = await growth_agent.run(
        {"idea_prompt": state["idea_prompt"], "platform": state["platform"], "content_draft": state.get("content_draft")},
        GrowthStrategistOutput
    )
    t_ms = int((time.time() - t0) * 1000)
    record_agent_run(state["generation_id"], "Growth Strategist", "completed", state, output, t_ms)
    
    completed = state.get("completed_agents", [])
    if "Growth Strategist" not in completed:
        completed.append("Growth Strategist")

    # Assemble Final Package
    final_pkg = {
        "generation_id": state["generation_id"],
        "project_id": state["project_id"],
        "user_id": state["user_id"],
        "creative_direction_json": state.get("creative_direction"),
        "planner_outline_json": state.get("planner_outline"),
        "research_json": state.get("research_data"),
        "script_markdown": state.get("content_draft", {}).get("script_markdown", ""),
        "seo_metadata_json": {
            "viral_titles": output.get("viral_title_options"),
            "meta_description": output.get("meta_description"),
            "tags": output.get("hashtags_and_tags"),
            "posting_times": output.get("best_posting_times")
        },
        "thumbnail_prompts_json": output.get("thumbnail_visual_prompts"),
        "quality_review_json": state.get("quality_review"),
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ")
    }

    db_store.final_packages[state["generation_id"]] = final_pkg

    # Update generation status in db_store
    if state["generation_id"] in db_store.generations:
        db_store.generations[state["generation_id"]]["status"] = "completed"
        db_store.generations[state["generation_id"]]["current_agent"] = "Finished"
        db_store.generations[state["generation_id"]]["quality_score"] = state.get("quality_score", 90)

    # Supabase update if connected
    supabase = get_supabase_client()
    if supabase:
        try:
            supabase.table("final_packages").insert(final_pkg).execute()
            supabase.table("generations").update({
                "status": "completed",
                "current_agent": "Finished",
                "quality_score": state.get("quality_score", 90)
            }).eq("id", state["generation_id"]).execute()
        except Exception as e:
            logger.warning(f"Failed to save final package to Supabase: {e}")

    return {
        "growth_strategy": output,
        "status": "completed",
        "current_agent": "Finished",
        "completed_agents": completed
    }

# Build LangGraph Workflow
workflow_graph = StateGraph(AgentState)

# Add Nodes
workflow_graph.add_node("creative_director", node_creative_director)
workflow_graph.add_node("planner", node_planner)
workflow_graph.add_node("research_analyst", node_research_analyst)
workflow_graph.add_node("content_creator", node_content_creator)
workflow_graph.add_node("quality_director", node_quality_director)
workflow_graph.add_node("growth_strategist", node_growth_strategist)

# Set Entry Point
workflow_graph.set_entry_point("creative_director")

# Add Edges
workflow_graph.add_edge("creative_director", "planner")
workflow_graph.add_edge("planner", "research_analyst")
workflow_graph.add_edge("research_analyst", "content_creator")
workflow_graph.add_edge("content_creator", "quality_director")

# Add Quality Loop Conditional Edge
workflow_graph.add_conditional_edges(
    "quality_director",
    route_quality_check,
    {
        "content_creator": "content_creator",
        "growth_strategist": "growth_strategist"
    }
)

workflow_graph.add_edge("growth_strategist", END)

# Compile Graph
compiled_app_graph = workflow_graph.compile()
