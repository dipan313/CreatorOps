import uuid
import time
from typing import List
from fastapi import APIRouter, HTTPException, Depends, status
from app.schemas.project import ProjectCreateRequest, ProjectResponse
from app.core.security import get_current_user
from app.core.database import db_store, get_supabase_client

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectResponse])
async def list_projects(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    
    supabase = get_supabase_client()
    if supabase:
        try:
            res = supabase.table("projects").select("*").eq("user_id", user_id).execute()
            if res.data:
                return res.data
        except Exception:
            pass

    # Local Store fallback
    user_projects = [p for p in db_store.projects.values() if p["user_id"] == user_id]
    return user_projects

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(payload: ProjectCreateRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    project_id = str(uuid.uuid4())
    now_str = time.strftime("%Y-%m-%dT%H:%M:%SZ")

    project_data = {
        "id": project_id,
        "user_id": user_id,
        "title": payload.title,
        "platform": payload.platform,
        "audience": payload.audience,
        "tone": payload.tone,
        "visual_style": payload.visual_style or "Modern Dark Aesthetic",
        "created_at": now_str,
        "updated_at": now_str
    }

    supabase = get_supabase_client()
    if supabase:
        try:
            res = supabase.table("projects").insert(project_data).execute()
            if res.data:
                return res.data[0]
        except Exception:
            pass

    db_store.projects[project_id] = project_data
    return project_data

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, current_user: dict = Depends(get_current_user)):
    supabase = get_supabase_client()
    if supabase:
        try:
            res = supabase.table("projects").select("*").eq("id", project_id).execute()
            if res.data:
                return res.data[0]
        except Exception:
            pass

    project = db_store.projects.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: str, current_user: dict = Depends(get_current_user)):
    supabase = get_supabase_client()
    if supabase:
        try:
            supabase.table("projects").delete().eq("id", project_id).execute()
        except Exception:
            pass

    if project_id in db_store.projects:
        del db_store.projects[project_id]
    return None
