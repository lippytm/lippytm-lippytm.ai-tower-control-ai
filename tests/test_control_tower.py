"""
Tests for the ControlTower orchestrator.
"""

import pytest
from unittest.mock import AsyncMock


@pytest.fixture
def tower():
    from src.control_tower import ControlTower
    return ControlTower()


@pytest.mark.asyncio
async def test_handle_unknown_event(tower):
    result = await tower.handle_event("unknown-event", {})
    assert "error" in result
    assert "unknown" in result["error"].lower()


@pytest.mark.asyncio
async def test_handle_chatgpt_query_no_prompt(tower):
    result = await tower.handle_event("chatgpt-query", {})
    assert "error" in result


@pytest.mark.asyncio
async def test_handle_chatgpt_query_with_prompt(tower):
    tower.openai.chat = AsyncMock(return_value="Hello from ChatGPT!")
    result = await tower.handle_event("chatgpt-query", {"prompt": "Say hi"})
    assert result == {"reply": "Hello from ChatGPT!"}
    tower.openai.chat.assert_awaited_once_with("Say hi")


@pytest.mark.asyncio
async def test_handle_manychat_event_missing_fields(tower):
    result = await tower.handle_event("manychat-event", {"message": "hi"})
    assert "error" in result


@pytest.mark.asyncio
async def test_handle_manychat_event_ok(tower):
    tower.manychat.send_message = AsyncMock(return_value={"status": "ok"})
    result = await tower.handle_event(
        "manychat-event", {"subscriber_id": "123", "message": "hello"}
    )
    assert result == {"status": "ok"}


@pytest.mark.asyncio
async def test_handle_botbuilders_event_no_text(tower):
    result = await tower.handle_event("botbuilders-event", {})
    assert "error" in result


@pytest.mark.asyncio
async def test_handle_botbuilders_event_ok(tower):
    tower.botbuilders.send_message = AsyncMock(return_value={"id": "activity-1"})
    result = await tower.handle_event("botbuilders-event", {"text": "test message"})
    assert result == {"id": "activity-1"}


@pytest.mark.asyncio
async def test_handle_replit_deploy_no_repl_id(tower):
    result = await tower.handle_event("replit-deploy", {})
    assert "error" in result


@pytest.mark.asyncio
async def test_handle_replit_deploy_ok(tower):
    tower.replit.run_repl = AsyncMock(return_value={"data": {"runRepl": {}}})
    result = await tower.handle_event("replit-deploy", {"repl_id": "abc123"})
    assert "data" in result


@pytest.mark.asyncio
async def test_broadcast_all_returns_dict(tower):
    tower.botbuilders.send_message = AsyncMock(return_value={"id": "act1"})
    result = await tower.broadcast("Hello world", platform="all")
    assert isinstance(result, dict)
    assert "manychat" in result
    assert "botbuilders" in result


@pytest.mark.asyncio
async def test_broadcast_single_platform(tower):
    tower.botbuilders.send_message = AsyncMock(return_value={"id": "act1"})
    result = await tower.broadcast("Hello world", platform="botbuilders")
    assert "botbuilders" in result
    assert "manychat" not in result
