"""
OpenAI / ChatGPT integration module.
Provides a thin wrapper around the OpenAI Chat Completions API.
"""

import os
from openai import AsyncOpenAI


class OpenAIIntegration:
    """Handles communication with OpenAI ChatGPT."""

    def __init__(self):
        api_key = os.environ.get("OPENAI_API_KEY")
        self.client = AsyncOpenAI(api_key=api_key) if api_key else None
        self.model = os.environ.get("OPENAI_MODEL", "gpt-4o")

    async def chat(self, message: str, system_prompt: str = None) -> str:
        """Send a message to ChatGPT and return the reply."""
        if not self.client:
            return "[OpenAI] API key not configured."

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": message})

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
        )
        return response.choices[0].message.content

    async def complete(self, prompt: str) -> str:
        """Shortcut – sends a prompt and returns the ChatGPT response."""
        return await self.chat(prompt)
