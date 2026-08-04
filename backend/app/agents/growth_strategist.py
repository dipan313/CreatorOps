from typing import Any, Dict, Type
from pydantic import BaseModel
from app.agents.base import BaseAgent
from app.schemas.agent_outputs import GrowthStrategistOutput
from app.core.config import settings

class GrowthStrategistAgent(BaseAgent):
    def __init__(self):
        system_prompt = (
            "You are the Growth & Viral Strategist at CreatorOps AI Studio. "
            "Your job is to optimize distribution assets: generate high-CTR viral headline options, "
            "platform-optimized tags and hashtags, video descriptions / captions, AI thumbnail prompts, "
            "and recommended posting schedule."
        )
        super().__init__(
            name="Growth Strategist",
            model_name=settings.GEMINI_MODEL_DRAFTING,
            system_prompt=system_prompt
        )

    def _generate_fallback(self, input_data: Dict[str, Any], output_schema: Type[BaseModel]) -> Dict[str, Any]:
        idea = input_data.get("idea_prompt", "AI Production Studio")
        platform = input_data.get("platform", "YouTube")

        return {
            "viral_title_options": [
                f"How I Scaled My {idea.title()} Workflow by 300% (Steal This Blueprint)",
                f"The Secret {idea.title()} Strategy Nobody Is Talking About in 2026",
                f"Stop Doing {idea.title()} Wrong: The 5-Minute Production Framework",
                f"Why {idea.title()} Will Change Content Creation Forever"
            ],
            "meta_description": f"Master {idea} with this comprehensive, step-by-step masterclass for {platform}. Discover key research, production scripting, and growth shortcuts to scale your audience faster.",
            "hashtags_and_tags": [
                f"#{idea.replace(' ', '')}",
                "#CreatorEconomy",
                "#AIWorkflow",
                "#ContentCreation",
                "#DigitalMarketing2026",
                "#ProductivityHacks"
            ],
            "thumbnail_visual_prompts": [
                f"Hyper-realistic 8k cinematic thumbnail of a futuristic AI production studio with glowing neon purple accents, holographic charts showing 10x growth, high contrast text area reading '{idea.upper()} SECRET', extreme detail, --ar 16:9",
                f"3D render of a golden rocket launcher emerging from a digital creator laptop, dark sleek background, vibrant purple and cyan lighting, bold typography space, --ar 16:9"
            ],
            "best_posting_times": "Tuesday & Thursday at 2:00 PM EST / 11:00 AM PST (Peak audience engagement window for tech & creator topics)."
        }
