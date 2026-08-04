from typing import Any, Dict, Type
from pydantic import BaseModel
from app.agents.base import BaseAgent
from app.schemas.agent_outputs import CreativeDirectorOutput
from app.core.config import settings

class CreativeDirectorAgent(BaseAgent):
    def __init__(self):
        system_prompt = (
            "You are the Creative Director at CreatorOps AI Studio. "
            "Your job is to analyze the user's raw content idea, target platform, target audience, and tone. "
            "Synthesize a high-level creative vision, brand positioning, target viewer persona, and key takeaways."
        )
        super().__init__(
            name="Creative Director",
            model_name=settings.GEMINI_MODEL_REASONING,
            system_prompt=system_prompt
        )

    def _generate_fallback(self, input_data: Dict[str, Any], output_schema: Type[BaseModel]) -> Dict[str, Any]:
        idea = input_data.get("idea_prompt", "AI Content Studio")
        platform = input_data.get("platform", "YouTube")
        audience = input_data.get("audience", "Tech Enthusiasts")
        tone = input_data.get("tone", "Informative & Engaging")

        return {
            "title": f"The Ultimate Guide to {idea.title()}",
            "core_concept": f"An authoritative, high-impact breakdown of '{idea}' tailored specifically for {platform} viewers.",
            "target_audience_persona": f"{audience} seeking practical, cutting-edge insights delivered in a {tone} tone.",
            "tone_and_voice": tone,
            "brand_positioning": f"Positioned as the definitive, go-to resource on {platform} for this topic.",
            "key_takeaways": [
                f"Understanding the core fundamentals of {idea}",
                "Step-by-step framework for real-world implementation",
                "Common pitfalls to avoid and future trends to watch"
            ]
        }
