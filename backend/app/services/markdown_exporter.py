from typing import Dict, Any

def generate_markdown_export(final_package: Dict[str, Any], project: Dict[str, Any]) -> str:
    script = final_package.get("script_markdown", "")
    creative = final_package.get("creative_direction_json", {})
    planner = final_package.get("planner_outline_json", {})
    research = final_package.get("research_json", {})
    seo = final_package.get("seo_metadata_json", {})
    thumbnails = final_package.get("thumbnail_prompts_json", [])
    quality = final_package.get("quality_review_json", {})

    title = creative.get("title", project.get("title", "Content Package"))

    md = f"""# 🚀 CREATOROPS AI: COMPLETE PUBLISH-READY PACKAGE

**Project Title**: {title}  
**Target Platform**: {project.get('platform', 'N/A')}  
**Target Audience**: {project.get('audience', 'N/A')}  
**Tone & Style**: {project.get('tone', 'N/A')}  
**Quality Score**: {quality.get('overall_score', 90)}/100  

---

## 🎨 1. CREATIVE DIRECTION
- **Core Concept**: {creative.get('core_concept', '')}
- **Audience Persona**: {creative.get('target_audience_persona', '')}
- **Brand Positioning**: {creative.get('brand_positioning', '')}
- **Key Takeaways**:
{chr(10).join([f"  - {t}" for t in creative.get('key_takeaways', [])])}

---

## 📋 2. PRODUCTION OUTLINE
- **Format**: {planner.get('content_format', '')}
- **Duration**: {planner.get('estimated_duration', '')}
- **Narrative Arc**:
{chr(10).join([f"  - **{item.get('timestamp', '')}** | {item.get('section', '')}: {item.get('goal', '')}" for item in planner.get('narrative_arc', [])])}

---

## 🔬 3. RESEARCH & BENCHMARKS
- **Key Facts & Stats**:
{chr(10).join([f"  - {f}" for f in research.get('key_facts_and_stats', [])])}
- **Target Keywords**: {", ".join(research.get('target_keywords', []))}

---

## 📝 4. PUBLICATION SCRIPT & CONTENT
{script}

---

## 🚀 5. SEO & VIRAL GROWTH METADATA
- **Headline Options**:
{chr(10).join([f"  {idx+1}. {t}" for idx, t in enumerate(seo.get('viral_titles', []))])}
- **Meta Description**: {seo.get('meta_description', '')}
- **Hashtags / Tags**: {", ".join(seo.get('tags', []))}
- **Posting Strategy**: {seo.get('posting_times', '')}

---

## 🖼️ 6. THUMBNAIL VISUAL PROMPTS
{chr(10).join([f"### Prompt {idx+1}:\n```\n{p}\n```" for idx, p in enumerate(thumbnails)])}

---
*Generated with CreatorOps AI Agentic Production Studio*
"""
    return md
