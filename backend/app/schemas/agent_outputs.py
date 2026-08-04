from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class CreativeDirectorOutput(BaseModel):
    title: str = Field(description="Catchy campaign title")
    core_concept: str = Field(description="Refined core content thesis")
    target_audience_persona: str = Field(description="Detailed viewer profile")
    tone_and_voice: str = Field(description="Strategic messaging tone")
    brand_positioning: str = Field(description="Competitive edge & angle")
    key_takeaways: List[str] = Field(description="Main value points for viewers")

class PlannerOutput(BaseModel):
    content_format: str = Field(description="Structure format e.g. 5-part script, video breakdown")
    estimated_duration: str = Field(description="Length estimate e.g. 8-10 mins, 60s Reel")
    narrative_arc: List[Dict[str, str]] = Field(description="Section-by-section outline with hooks and timestamps")
    production_checklist: List[str] = Field(description="Assets needed before recording")

class ResearchAnalystOutput(BaseModel):
    key_facts_and_stats: List[str] = Field(description="Verified data points and trends")
    competitor_benchmarks: List[str] = Field(description="What top creators are doing in this niche")
    target_keywords: List[str] = Field(description="High-traffic search phrases")
    sources_and_references: List[str] = Field(description="Reference URLs or trend sources")

class ContentCreatorOutput(BaseModel):
    headline: str = Field(description="Main title or video headline")
    hook: str = Field(description="First 5 seconds attention hook")
    script_markdown: str = Field(description="Full formatted production script in Markdown")
    call_to_action: str = Field(description="Engaging closing CTA")
    revision_notes: Optional[str] = Field(default=None, description="Modifications made if revised")

class QualityDirectorOutput(BaseModel):
    overall_score: int = Field(description="Quality score from 0 to 100 (Threshold: 90)")
    clarity_score: int = Field(description="Clarity and readability rating (0-100)")
    engagement_score: int = Field(description="Hook & retention rating (0-100)")
    seo_alignment_score: int = Field(description="SEO and search alignment rating (0-100)")
    strengths: List[str] = Field(description="Highlights of the generated content")
    areas_for_improvement: List[str] = Field(description="Specific feedback for revision")
    actionable_feedback: str = Field(description="Detailed guidance if score < 90")
    passes_quality_gate: bool = Field(description="True if score >= 90 or retry limit reached")

class GrowthStrategistOutput(BaseModel):
    viral_title_options: List[str] = Field(description="3-5 high-CTR headline options")
    meta_description: str = Field(description="SEO optimized meta description / video caption")
    hashtags_and_tags: List[str] = Field(description="Platform optimized tags")
    thumbnail_visual_prompts: List[str] = Field(description="AI Image generation prompts (Midjourney/DALL-E) for thumbnails")
    best_posting_times: str = Field(description="Recommended distribution strategy")
