"""Core Brain module – OpenAI-powered conversational intelligence.

This module is the heart of every Brain kit.  It keeps a rolling
conversation history, optionally grounds responses in a KnowledgeBase,
and exposes a simple ``ask()`` interface that any platform adapter can
call.

Environment variables (loaded via python-dotenv if present):
    OPENAI_API_KEY   – required
    OPENAI_MODEL     – default: gpt-4o
    OPENAI_MAX_TOKENS – default: 1024
    BRAIN_SYSTEM_PROMPT – optional custom system prompt
"""

from __future__ import annotations

import os
from typing import Any

from openai import OpenAI

from .knowledge_base import KnowledgeBase

_DEFAULT_SYSTEM_PROMPT = (
    "You are an intelligent AI assistant for lippytm.ai. "
    "You help users with questions about AI, chatbots, automation, "
    "Web3, and the lippytm.ai ecosystem. "
    "Be concise, helpful, and friendly."
)


class Brain:
    """OpenAI-backed brain that can be embedded in any lippytm.ai repository.

    Parameters
    ----------
    api_key:
        OpenAI API key.  Defaults to the ``OPENAI_API_KEY`` env var.
    model:
        OpenAI model name.  Defaults to ``OPENAI_MODEL`` env var or ``gpt-4o``.
    max_tokens:
        Maximum tokens in each completion.  Defaults to ``OPENAI_MAX_TOKENS``
        env var or ``1024``.
    system_prompt:
        Custom system prompt.  Defaults to ``BRAIN_SYSTEM_PROMPT`` env var or
        the built-in lippytm.ai prompt.
    knowledge_base:
        Optional :class:`KnowledgeBase` instance.  When provided, relevant
        facts are injected into the conversation before each user message.
    """

    def __init__(
        self,
        api_key: str | None = None,
        model: str | None = None,
        max_tokens: int | None = None,
        system_prompt: str | None = None,
        knowledge_base: KnowledgeBase | None = None,
    ) -> None:
        self._api_key = api_key or os.environ.get("OPENAI_API_KEY", "")
        self._model = model or os.environ.get("OPENAI_MODEL", "gpt-4o")
        self._max_tokens = int(
            max_tokens or os.environ.get("OPENAI_MAX_TOKENS", "1024")
        )
        self._system_prompt = (
            system_prompt
            or os.environ.get("BRAIN_SYSTEM_PROMPT", "")
            or _DEFAULT_SYSTEM_PROMPT
        )
        self._knowledge_base = knowledge_base
        self._client: OpenAI | None = None
        self._history: list[dict[str, Any]] = []

    # ------------------------------------------------------------------
    # Public interface
    # ------------------------------------------------------------------

    def ask(self, message: str, *, include_history: bool = True) -> str:
        """Send *message* to the brain and return the assistant reply.

        Parameters
        ----------
        message:
            The user's message.
        include_history:
            When *True* (default) the full conversation history is sent to
            OpenAI so the brain can maintain context across turns.

        Returns
        -------
        str
            The assistant's reply text.
        """
        messages = self._build_messages(message, include_history=include_history)
        reply = self._complete(messages)
        self._history.append({"role": "user", "content": message})
        self._history.append({"role": "assistant", "content": reply})
        return reply

    def reset(self) -> None:
        """Clear the conversation history."""
        self._history.clear()

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _get_client(self) -> OpenAI:
        if self._client is None:
            self._client = OpenAI(api_key=self._api_key)
        return self._client

    def _build_messages(
        self, message: str, *, include_history: bool
    ) -> list[dict[str, Any]]:
        messages: list[dict[str, Any]] = [
            {"role": "system", "content": self._system_prompt}
        ]

        # Inject knowledge base context when available
        if self._knowledge_base:
            facts = self._knowledge_base.search(message)
            if facts:
                context = "Relevant knowledge:\n" + "\n".join(
                    f"- {f}" for f in facts
                )
                messages.append({"role": "system", "content": context})

        if include_history:
            messages.extend(self._history)

        messages.append({"role": "user", "content": message})
        return messages

    def _complete(self, messages: list[dict[str, Any]]) -> str:
        client = self._get_client()
        response = client.chat.completions.create(
            model=self._model,
            messages=messages,  # type: ignore[arg-type]
            max_tokens=self._max_tokens,
        )
        return response.choices[0].message.content or ""
