from typing import Any, Dict, Type
from pydantic import BaseModel
from app.agents.base import BaseAgent
from app.schemas.agent_outputs import PlannerOutput
from app.core.config import settings

class PlannerAgent(BaseAgent):
    def __init__(self):
        system_prompt = (
            "You are the Production Planner at CreatorOps AI Studio. "
            "Take the Creative Director's vision and construct a structured narrative arc, "
            "section-by-section outline, format specification, duration estimate, and production checklist."
        )
        super().__init__(
            name="Planner",
            model_name=settings.GEMINI_MODEL_REASONING,
            system_prompt=system_prompt
        )

    def _generate_fallback(self, input_data: Dict[str, Any], output_schema: Type[BaseModel]) -> Dict[str, Any]:
        platform = input_data.get("platform", "YouTube")
        creative = input_data.get("creative_direction", {})
        title = creative.get("title", "Content Mastery")

        duration = "8-10 Minutes" if platform in ["YouTube", "Podcast", "Blog"] else "60 Seconds"
        content_format = "Deep-Dive Structured Masterclass Script" if platform in ["YouTube", "Podcast", "Blog"] else "High-Paced Short Form Breakdown"

        return {
            "content_format": content_format,
            "estimated_duration": duration,
            "narrative_arc": [
                {"timestamp": "0:00 - 0:45", "section": "Pattern-Interrupt Hook & Problem Statement", "goal": "Grab attention immediately and state the big promise."},
                {"timestamp": "0:45 - 2:30", "section": "Context & Foundational Framework", "goal": "Deconstruct why traditional methods fail and set up the new way."},
                {"timestamp": "2:30 - 6:00", "section": "Core Execution Strategy (3 Key Pillars)", "goal": "Provide actionable steps with visual examples."},
                {"timestamp": "6:00 - 8:00", "section": "Case Study & Real-World Results", "goal": "Prove the validity of the concepts with real data."},
                {"timestamp": "8:00 - End", "section": "Key Takeaways & High-Conversion CTA", "goal": "Drive comments, subscriptions, and next steps."}
            ],
            "production_checklist": [
                "Screen recordings / UI walkthroughs",
                "High-contrast slide graphics for key statistics",
                "Dynamic background audio track (low volume)",
                "Clear microphone audio preset"
            ]
        }
