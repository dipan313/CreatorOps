from fastapi import APIRouter, HTTPException, Depends, Response
from app.core.security import get_current_user
from app.core.database import db_store
from app.services.markdown_exporter import generate_markdown_export
from app.services.pdf_exporter import generate_pdf_export

router = APIRouter(prefix="/export", tags=["Exports"])

@router.get("/markdown/{generation_id}")
async def export_markdown(generation_id: str, current_user: dict = Depends(get_current_user)):
    final_pkg = db_store.final_packages.get(generation_id)
    if not final_pkg:
        raise HTTPException(status_code=404, detail="Final content package not found for this generation session.")

    project = db_store.projects.get(final_pkg.get("project_id"), {"title": "CreatorOps Campaign", "platform": "YouTube"})
    md_content = generate_markdown_export(final_pkg, project)

    filename = f"creatorops_{generation_id[:8]}.md"
    return Response(
        content=md_content,
        media_type="text/markdown",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/pdf/{generation_id}")
async def export_pdf(generation_id: str, current_user: dict = Depends(get_current_user)):
    final_pkg = db_store.final_packages.get(generation_id)
    if not final_pkg:
        raise HTTPException(status_code=404, detail="Final content package not found for this generation session.")

    project = db_store.projects.get(final_pkg.get("project_id"), {"title": "CreatorOps Campaign", "platform": "YouTube"})
    pdf_bytes = generate_pdf_export(final_pkg, project)

    filename = f"creatorops_{generation_id[:8]}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
