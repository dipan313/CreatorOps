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
            "post_image_prompt": f"Professional minimalist 3D graphic banner for {platform} post on '{idea}', featuring futuristic neon typography, sleek corporate aesthetic, high contrast dark theme, vibrant indigo and violet lighting, photorealistic 8k",
            "video_storyboard_scenes": [
                {
                    "scene_number": "1",
                    "timestamp": "0:00 - 0:05",
                    "caption": f"Hook: If you are still doing {idea} manually, stop right now!",
                    "visual_cue": f"High energy visual: Cyberpunk digital studio with glowing neon stats showing 10x growth",
                    "audio_script": f"If you are still doing {idea} manually in 2026, you are losing 90% of your reach!"
                },
                {
                    "scene_number": "2",
                    "timestamp": "0:05 - 0:20",
                    "caption": "The Problem: Traditional workflows are slow and fragmented.",
                    "visual_cue": "Fast-cut montage of messy notes and slow manual writing vs clean automated timeline",
                    "audio_script": "Traditional workflows take hours of manual research and scripting without proven retention hooks."
                },
                {
                    "scene_number": "3",
                    "timestamp": "0:20 - 0:45",
                    "caption": "The Solution: Autonomous multi-agent pipeline step-by-step.",
                    "visual_cue": "3D holographic graph showing 6 AI agents collaborating in real-time",
                    "audio_script": "Here is the exact 6-agent studio framework that automates research, scripting, quality control, and visual thumbnails."
                },
                {
                    "scene_number": "4",
                    "timestamp": "0:45 - 1:00",
                    "caption": "Actionable Takeaway & Closing Call to Action.",
                    "visual_cue": "Sleek subscribe & share callout with glowing neon button effect",
                    "audio_script": "Save this guide and try CreatorOps AI today to scale your content output tenfold!"
                }
            ],
            "best_posting_times": "Tuesday & Thursday at 2:00 PM EST / 11:00 AM PST (Peak audience engagement window for tech & creator topics)."
        }
