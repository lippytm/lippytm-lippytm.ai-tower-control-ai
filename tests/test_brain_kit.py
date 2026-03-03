"""Tests for the Brain kits package."""
from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest

from brain_kits import Brain, KnowledgeBase
from brain_kits.adapters import BotBuilderAdapter, ManyChatAdapter, ReplitAdapter


# ---------------------------------------------------------------------------
# KnowledgeBase tests
# ---------------------------------------------------------------------------


class TestKnowledgeBase:
    def test_add_and_len(self):
        kb = KnowledgeBase()
        kb.add("lippytm.ai is an AI hub.")
        kb.add("ManyChat is a chatbot platform.")
        assert len(kb) == 2

    def test_duplicate_add_ignored(self):
        kb = KnowledgeBase()
        kb.add("fact one")
        kb.add("fact one")
        assert len(kb) == 1

    def test_remove_existing(self):
        kb = KnowledgeBase()
        kb.add("fact one")
        assert kb.remove("fact one") is True
        assert len(kb) == 0

    def test_remove_missing_returns_false(self):
        kb = KnowledgeBase()
        assert kb.remove("nonexistent") is False

    def test_clear(self):
        kb = KnowledgeBase(facts=["a", "b", "c"])
        kb.clear()
        assert len(kb) == 0

    def test_load_replaces_facts(self):
        kb = KnowledgeBase(facts=["old fact"])
        kb.load(["new fact one", "new fact two"])
        assert kb.all_facts() == ["new fact one", "new fact two"]

    def test_search_returns_relevant_facts(self):
        kb = KnowledgeBase(facts=[
            "ManyChat is a chatbot automation platform.",
            "OpenAI provides GPT language models.",
            "lippytm.ai integrates AI across platforms.",
        ])
        results = kb.search("What is ManyChat?")
        assert any("ManyChat" in r for r in results)

    def test_search_empty_query_returns_empty(self):
        kb = KnowledgeBase(facts=["some fact"])
        assert kb.search("") == []

    def test_search_empty_kb_returns_empty(self):
        kb = KnowledgeBase()
        assert kb.search("anything") == []

    def test_search_top_k_respected(self):
        kb = KnowledgeBase(
            facts=[f"fact about chatbot number {i}" for i in range(10)],
            top_k=2,
        )
        results = kb.search("chatbot fact")
        assert len(results) <= 2


# ---------------------------------------------------------------------------
# Brain tests (OpenAI client is always mocked)
# ---------------------------------------------------------------------------


def _mock_brain(reply: str = "Hello!") -> tuple[Brain, MagicMock]:
    """Return a Brain instance with a mocked OpenAI client."""
    brain = Brain(api_key="test-key")
    mock_client = MagicMock()
    mock_choice = MagicMock()
    mock_choice.message.content = reply
    mock_client.chat.completions.create.return_value = MagicMock(
        choices=[mock_choice]
    )
    brain._client = mock_client
    return brain, mock_client


class TestBrain:
    def test_ask_returns_reply(self):
        brain, _ = _mock_brain("Hi there!")
        assert brain.ask("Hello?") == "Hi there!"

    def test_ask_builds_history(self):
        brain, _ = _mock_brain("pong")
        brain.ask("ping")
        assert len(brain._history) == 2
        assert brain._history[0] == {"role": "user", "content": "ping"}
        assert brain._history[1] == {"role": "assistant", "content": "pong"}

    def test_reset_clears_history(self):
        brain, _ = _mock_brain()
        brain.ask("hello")
        brain.reset()
        assert brain._history == []

    def test_ask_without_history(self):
        brain, mock_client = _mock_brain("reply")
        brain.ask("first")
        brain.ask("second", include_history=False)
        # Second call should NOT include the earlier history messages
        second_call_messages = (
            mock_client.chat.completions.create.call_args_list[1][1]["messages"]
        )
        user_messages = [m for m in second_call_messages if m["role"] == "user"]
        # Only the current message should be present (no history injected)
        assert len(user_messages) == 1
        assert user_messages[0]["content"] == "second"

    def test_knowledge_base_context_injected(self):
        kb = KnowledgeBase(facts=["lippytm.ai is an AI hub."])
        brain, mock_client = _mock_brain("answer")
        brain._knowledge_base = kb
        brain.ask("What is lippytm.ai?")
        messages = mock_client.chat.completions.create.call_args[1]["messages"]
        system_contents = " ".join(
            m["content"] for m in messages if m["role"] == "system"
        )
        assert "lippytm.ai is an AI hub" in system_contents

    def test_custom_system_prompt(self):
        brain, mock_client = _mock_brain("ok")
        brain._system_prompt = "Custom prompt"
        brain.ask("hello")
        messages = mock_client.chat.completions.create.call_args[1]["messages"]
        assert messages[0]["content"] == "Custom prompt"


# ---------------------------------------------------------------------------
# ManyChatAdapter tests
# ---------------------------------------------------------------------------


class TestManyChatAdapter:
    def test_handle_returns_manychat_format(self):
        brain, _ = _mock_brain("ManyChat reply")
        adapter = ManyChatAdapter(brain=brain)
        result = adapter.handle({"last_input_text": "hello"})
        assert result["version"] == "v2"
        assert result["content"]["messages"][0]["type"] == "text"
        assert result["content"]["messages"][0]["text"] == "ManyChat reply"

    def test_handle_extracts_text_field(self):
        brain, _ = _mock_brain("reply")
        adapter = ManyChatAdapter(brain=brain)
        result = adapter.handle({"text": "hi"})
        assert result["content"]["messages"][0]["text"] == "reply"

    def test_handle_empty_message(self):
        brain, _ = _mock_brain("fallback")
        adapter = ManyChatAdapter(brain=brain)
        result = adapter.handle({})
        assert "messages" in result["content"]


# ---------------------------------------------------------------------------
# BotBuilderAdapter tests
# ---------------------------------------------------------------------------


class TestBotBuilderAdapter:
    def test_handle_message_activity(self):
        brain, _ = _mock_brain("Bot reply")
        adapter = BotBuilderAdapter(brain=brain)
        activity = {"type": "message", "text": "hello", "id": "act-1"}
        result = adapter.handle(activity)
        assert result is not None
        assert result["type"] == "message"
        assert result["text"] == "Bot reply"
        assert result["replyToId"] == "act-1"

    def test_non_message_activity_returns_none(self):
        brain, _ = _mock_brain()
        adapter = BotBuilderAdapter(brain=brain)
        result = adapter.handle({"type": "conversationUpdate"})
        assert result is None


# ---------------------------------------------------------------------------
# ReplitAdapter tests
# ---------------------------------------------------------------------------


class TestReplitAdapter:
    def test_handle_message_event(self):
        brain, _ = _mock_brain("Replit reply")
        adapter = ReplitAdapter(brain=brain)
        result = adapter.handle({"event": "message", "text": "hello"})
        assert result["reply"] == "Replit reply"
        assert result["event"] == "message"

    def test_handle_non_message_event(self):
        brain, _ = _mock_brain()
        adapter = ReplitAdapter(brain=brain)
        result = adapter.handle({"event": "deploy"})
        assert "deploy" in result["reply"]
        assert result["event"] == "deploy"
