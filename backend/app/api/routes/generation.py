import uuid
import time
import asyncio
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, status
from fastapi.responses import StreamingResponse
from app.schemas.generation import GenerationCreateRequest, GenerationProgressResponse, GenerationDetailResponse
from app.core.security import get_current_user
from app.core.database import db_store, get_supabase_client
from app.graph.workflow import get_app_graph

router = APIRouter(prefix="", tags=["Generation"])

async def execute_generation_pipeline(state: Dict[str, Any]):
    """Background worker executing the LangGraph agent pipeline."""
    gen_id = state["generation_id"]
    try:
        db_store.generations[gen_id]["status"] = "running"
        
        # Invoke LangGraph Workflow (graph is compiled lazily on first call)
        graph = get_app_graph()
        final_state = await graph.ainvoke(state)
        
        db_store.generations[gen_id]["status"] = final_state.get("status", "completed")
        db_store.generations[gen_id]["current_agent"] = "Finished"
        db_store.generations[gen_id]["quality_score"] = final_state.get("quality_score", 90)
    except Exception as e:
        db_store.generations[gen_id]["status"] = "failed"
        db_store.generations[gen_id]["error_message"] = str(e)

@router.post("/generate", status_code=status.HTTP_202_ACCEPTED)
async def start_generation(payload: GenerationCreateRequest, background_tasks: BackgroundTasks, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    gen_id = str(uuid.uuid4())
    now_str = time.strftime("%Y-%m-%dT%H:%M:%SZ")

    # Fetch parent project
    project = db_store.projects.get(payload.project_id)
    if not project:
        # Fallback default project
        project = {
            "id": payload.project_id,
            "title": "Default Campaign",
            "platform": payload.platform_override or "YouTube",
            "audience": payload.audience_override or "Tech Creators",
            "tone": payload.tone_override or "Engaging",
            "visual_style": "Modern Dark"
        }

    gen_record = {
        "id": gen_id,
        "project_id": payload.project_id,
        "user_id": user_id,
        "idea_prompt": payload.idea_prompt,
        "status": "running",
        "current_agent": "Creative Director",
        "quality_score": 0,
        "retry_count": 0,
        "error_message": None,
        "created_at": now_str,
        "updated_at": now_str
    }

    db_store.generations[gen_id] = gen_record
    db_store.agent_runs[gen_id] = []

    # State for LangGraph
    initial_state = {
        "generation_id": gen_id,
        "project_id": payload.project_id,
        "user_id": user_id,
        "idea_prompt": payload.idea_prompt,
        "platform": payload.platform_override or project.get("platform", "YouTube"),
        "audience": payload.audience_override or project.get("audience", "Creators"),
        "tone": payload.tone_override or project.get("tone", "Informative"),
        "visual_style": project.get("visual_style"),
        "current_agent": "Creative Director",
        "status": "running",
        "retry_count": 0,
        "quality_score": 0,
        "completed_agents": [],
        "quality_feedback": None,
        "creative_direction": None,
        "planner_outline": None,
        "research_data": None,
        "content_draft": None,
        "quality_review": None,
        "growth_strategy": None,
        "error_message": None
    }

    # Dispatch to background task
    background_tasks.add_task(execute_generation_pipeline, initial_state)

    return {"generation_id": gen_id, "status": "running", "message": "Agentic production pipeline started."}

@router.get("/generation/{generation_id}", response_model=GenerationDetailResponse)
async def get_generation_detail(generation_id: str, current_user: dict = Depends(get_current_user)):
    gen = db_store.generations.get(generation_id)
    if not gen:
        raise HTTPException(status_code=404, detail="Generation session not found")

    runs = db_store.agent_runs.get(generation_id, [])
    final_pkg = db_store.final_packages.get(generation_id)

    formatted_runs = [
        {
            "agent_name": r["agent_name"],
            "status": r["status"],
            "output_json": r["output_json"],
            "execution_time_ms": r.get("execution_time_ms", 0),
            "created_at": r.get("created_at", "")
        }
        for r in runs
    ]

    return {
        "id": gen["id"],
        "project_id": gen["project_id"],
        "user_id": gen["user_id"],
        "idea_prompt": gen["idea_prompt"],
        "status": gen["status"],
        "current_agent": gen["current_agent"],
        "quality_score": gen.get("quality_score", 0),
        "retry_count": gen.get("retry_count", 0),
        "agent_runs": formatted_runs,
        "final_package": final_pkg,
        "created_at": gen["created_at"]
    }

@router.get("/generation/{generation_id}/progress", response_model=GenerationProgressResponse)
async def get_generation_progress(generation_id: str, stream: bool = False, current_user: dict = Depends(get_current_user)):
    gen = db_store.generations.get(generation_id)
    if not gen:
        raise HTTPException(status_code=404, detail="Generation not found")

    runs = db_store.agent_runs.get(generation_id, [])
    completed = list(set([r["agent_name"] for r in runs if r["status"] == "completed"]))

    formatted_runs = [
        {
            "agent_name": r["agent_name"],
            "status": r["status"],
            "output_json": r["output_json"],
            "execution_time_ms": r.get("execution_time_ms", 0),
            "created_at": r.get("created_at", "")
        }
        for r in runs
    ]

    progress_payload = {
        "generation_id": generation_id,
        "status": gen["status"],
        "current_agent": gen["current_agent"],
        "quality_score": gen.get("quality_score", 0),
        "retry_count": gen.get("retry_count", 0),
        "completed_agents": completed,
        "latest_agent_runs": formatted_runs,
        "error_message": gen.get("error_message")
    }

    if stream:
        async def event_generator():
            while True:
                current_gen = db_store.generations.get(generation_id)
                current_runs = db_store.agent_runs.get(generation_id, [])
                c_completed = list(set([r["agent_name"] for r in current_runs if r["status"] == "completed"]))
                
                payload_json = {
                    "generation_id": generation_id,
                    "status": current_gen["status"] if current_gen else "completed",
                    "current_agent": current_gen["current_agent"] if current_gen else "Finished",
                    "quality_score": current_gen.get("quality_score", 90) if current_gen else 90,
                    "retry_count": current_gen.get("retry_count", 0) if current_gen else 0,
                    "completed_agents": c_completed,
                    "latest_agent_runs": [
                        {
                            "agent_name": r["agent_name"],
                            "status": r["status"],
                            "output_json": r["output_json"],
                            "execution_time_ms": r.get("execution_time_ms", 0),
                            "created_at": r.get("created_at", "")
                        } for r in current_runs
                    ]
                }
                yield f"data: {import_json_dumps(payload_json)}\n\n"
                if current_gen and current_gen["status"] in ["completed", "failed"]:
                    break
                await asyncio.sleep(1)

        return StreamingResponse(event_generator(), media_type="text/event-stream")

    return progress_payload

def import_json_dumps(obj: Any) -> str:
    import json
    return json.dumps(obj)
