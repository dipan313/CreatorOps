import io
import html
from typing import Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def escape_xml(text: str) -> str:
    if not text:
        return ""
    return html.escape(str(text))

def generate_pdf_export(final_package: Dict[str, Any], project: Dict[str, Any]) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    story = []

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('TitleStyle', parent=styles['Heading1'], fontSize=20, leading=24, textColor=colors.HexColor('#7C3AED'))
    h2_style = ParagraphStyle('H2Style', parent=styles['Heading2'], fontSize=14, leading=18, textColor=colors.HexColor('#0F172A'))
    body_style = ParagraphStyle('BodyStyle', parent=styles['BodyText'], fontSize=10, leading=14, textColor=colors.HexColor('#334155'))

    creative = final_package.get("creative_direction_json", {})
    quality = final_package.get("quality_review_json", {})
    title = escape_xml(creative.get("title", project.get("title", "Content Package")))

    story.append(Paragraph(f"CreatorOps AI: {title}", title_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(f"<b>Platform:</b> {escape_xml(project.get('platform', 'N/A'))} | <b>Quality Score:</b> {quality.get('overall_score', 90)}/100", body_style))
    story.append(Spacer(1, 15))

    story.append(Paragraph("1. Creative Direction", h2_style))
    story.append(Paragraph(f"<b>Core Concept:</b> {escape_xml(creative.get('core_concept', ''))}", body_style))
    story.append(Paragraph(f"<b>Target Audience:</b> {escape_xml(creative.get('target_audience_persona', ''))}", body_style))
    story.append(Spacer(1, 15))

    story.append(Paragraph("2. Script & Content Summary", h2_style))
    raw_script = final_package.get("script_markdown", "")
    escaped_script = escape_xml(raw_script[:1500]).replace("\n", "<br/>")
    story.append(Paragraph(escaped_script + "...", body_style))
    story.append(Spacer(1, 15))

    story.append(Paragraph("3. Growth & SEO Assets", h2_style))
    seo = final_package.get("seo_metadata_json", {})
    viral_titles = seo.get("viral_titles", [])
    if viral_titles:
        story.append(Paragraph("<b>Viral Titles:</b>", body_style))
        for t in viral_titles:
            story.append(Paragraph(f"• {escape_xml(t)}", body_style))
    
    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes

