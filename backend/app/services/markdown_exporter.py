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

    # Pre-compute all multi-line blocks (backslashes not allowed inside f-string expressions in Python <3.12)
    key_takeaways = "\n".join(["  - " + t for t in creative.get("key_takeaways", [])])

    narrative_arc = "\n".join([
        "  - **" + item.get("timestamp", "") + "** | " + item.get("section", "") + ": " + item.get("goal", "")
        for item in planner.get("narrative_arc", [])
    ])

    key_facts = "\n".join(["  - " + f for f in research.get("key_facts_and_stats", [])])
    target_keywords = ", ".join(research.get("target_keywords", []))

    viral_titles = "\n".join([
        "  " + str(idx + 1) + ". " + t
        for idx, t in enumerate(seo.get("viral_titles", []))
    ])
    hashtags = ", ".join(seo.get("tags", []))

    thumbnail_prompts = "\n".join([
        "### Prompt " + str(idx + 1) + ":\n```\n" + p + "\n```"
        for idx, p in enumerate(thumbnails)
    ])

    md = (
        "# \U0001f680 CREATOROPS AI: COMPLETE PUBLISH-READY PACKAGE\n\n"
        f"**Project Title**: {title}  \n"
        f"**Target Platform**: {project.get('platform', 'N/A')}  \n"
        f"**Target Audience**: {project.get('audience', 'N/A')}  \n"
        f"**Tone & Style**: {project.get('tone', 'N/A')}  \n"
        f"**Quality Score**: {quality.get('overall_score', 90)}/100  \n\n"
        "---\n\n"
        "## \U0001f3a8 1. CREATIVE DIRECTION\n"
        f"- **Core Concept**: {creative.get('core_concept', '')}\n"
        f"- **Audience Persona**: {creative.get('target_audience_persona', '')}\n"
        f"- **Brand Positioning**: {creative.get('brand_positioning', '')}\n"
        "- **Key Takeaways**:\n"
        f"{key_takeaways}\n\n"
        "---\n\n"
        "## \U0001f4cb 2. PRODUCTION OUTLINE\n"
        f"- **Format**: {planner.get('content_format', '')}\n"
        f"- **Duration**: {planner.get('estimated_duration', '')}\n"
        "- **Narrative Arc**:\n"
        f"{narrative_arc}\n\n"
        "---\n\n"
        "## \U0001f52c 3. RESEARCH & BENCHMARKS\n"
        "- **Key Facts & Stats**:\n"
        f"{key_facts}\n"
        f"- **Target Keywords**: {target_keywords}\n\n"
        "---\n\n"
        "## \U0001f4dd 4. PUBLICATION SCRIPT & CONTENT\n"
        f"{script}\n\n"
        "---\n\n"
        "## \U0001f680 5. SEO & VIRAL GROWTH METADATA\n"
        "- **Headline Options**:\n"
        f"{viral_titles}\n"
        f"- **Meta Description**: {seo.get('meta_description', '')}\n"
        f"- **Hashtags / Tags**: {hashtags}\n"
        f"- **Posting Strategy**: {seo.get('posting_times', '')}\n\n"
        "---\n\n"
        "## \U0001f5bc\ufe0f 6. THUMBNAIL VISUAL PROMPTS\n"
        f"{thumbnail_prompts}\n\n"
        "---\n"
        "*Generated with CreatorOps AI Agentic Production Studio*\n"
    )
    return md
