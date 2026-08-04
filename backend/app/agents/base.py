import json
import logging
from typing import Any, Dict, Optional, Type
from pydantic import BaseModel
from app.core.config import settings

logger = logging.getLogger(__name__)

class BaseAgent:
    def __init__(self, name: str, model_name: str, system_prompt: str):
        self.name = name
        self.model_name = model_name
        self.system_prompt = system_prompt
        self._llm = None
        self._init_llm()

    def _init_llm(self):
        # 1. Groq API (Free Llama 3.3 70B Model)
        if settings.GROQ_API_KEY and not settings.GROQ_API_KEY.startswith("your_"):
            try:
                from langchain_groq import ChatGroq
                self._llm = ChatGroq(
                    groq_api_key=settings.GROQ_API_KEY,
                    model_name="llama-3.3-70b-versatile",
                    temperature=0.7,
                )
                logger.info(f"Initialized Groq LLM for agent '{self.name}'.")
                return
            except Exception as e:
                logger.debug(f"Groq LLM init skipped for agent '{self.name}': {e}")

        # 2. OpenAI API (GPT-4o-mini / GPT-4o)
        if settings.OPENAI_API_KEY and not settings.OPENAI_API_KEY.startswith("your_"):
            try:
                from langchain_openai import ChatOpenAI
                self._llm = ChatOpenAI(
                    openai_api_key=settings.OPENAI_API_KEY,
                    model_name="gpt-4o-mini",
                    temperature=0.7,
                )
                logger.info(f"Initialized OpenAI LLM for agent '{self.name}'.")
                return
            except Exception as e:
                logger.debug(f"OpenAI LLM init skipped for agent '{self.name}': {e}")

        # 3. Google Gemini API
        if settings.GEMINI_API_KEY and not settings.GEMINI_API_KEY.startswith("your_"):
            try:
                from langchain_google_genai import ChatGoogleGenerativeAI
                self._llm = ChatGoogleGenerativeAI(
                    google_api_key=settings.GEMINI_API_KEY,
                    model=self.model_name,
                    temperature=0.7,
                )
                logger.info(f"Initialized Gemini LLM for agent '{self.name}' with model '{self.model_name}'.")
                return
            except Exception as e:
                logger.debug(f"Gemini LLM init skipped for agent '{self.name}': {e}")

        self._llm = None

    async def run(self, input_data: Dict[str, Any], output_schema: Type[BaseModel]) -> Dict[str, Any]:
        """Runs the agent prompt with structured JSON output, falling back to mock generator if API key is missing."""
        prompt = f"{self.system_prompt}\n\nINPUT CONTEXT:\n{json.dumps(input_data, indent=2)}\n\nRespond ONLY with valid JSON matching schema keys."

        if self._llm:
            try:
                response = await self._llm.ainvoke(prompt)
                content = response.content if hasattr(response, 'content') else str(response)
                # Clean code blocks
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()
                parsed = json.loads(content)
                return parsed
            except Exception as e:
                logger.warning(f"Agent '{self.name}' LLM invocation failed: {e}. Executing zero-cost fallback mode.")

        # Zero-Cost Intelligent Fallback Generation
        return self._generate_fallback(input_data, output_schema)

    def _generate_fallback(self, input_data: Dict[str, Any], output_schema: Type[BaseModel]) -> Dict[str, Any]:
        """Provides default fallback responses for all agent schemas when API key is missing or offline."""
        raise NotImplementedError("Each specialized agent must implement _generate_fallback.")
