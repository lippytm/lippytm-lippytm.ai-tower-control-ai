"""Tests for the Flask application endpoints and integrations."""

import json
import hmac
import hashlib
from unittest.mock import MagicMock, patch
import pytest


@pytest.fixture()
def client(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    monkeypatch.setenv("FLASK_SECRET_KEY", "test-secret")
    monkeypatch.setenv("REPLIT_WEBHOOK_SECRET", "webhook-secret")

    # Reload config so env vars are picked up
    import importlib
    import config
    importlib.reload(config)

    import app as flask_app
    flask_app.app.config["TESTING"] = True
    with flask_app.app.test_client() as c:
        yield c


# ---------------------------------------------------------------------------
# /health
# ---------------------------------------------------------------------------

def test_health(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.get_json() == {"status": "ok"}


# ---------------------------------------------------------------------------
# POST /api/chat
# ---------------------------------------------------------------------------

def test_chat_missing_message(client):
    resp = client.post("/api/chat", json={})
    assert resp.status_code == 400
    assert "error" in resp.get_json()


def test_chat_success(client):
    with patch("integrations.openai_client.chat", return_value="Hello back!") as mock_chat:
        resp = client.post("/api/chat", json={"message": "Hi"})
    assert resp.status_code == 200
    assert resp.get_json() == {"reply": "Hello back!"}
    mock_chat.assert_called_once_with([{"role": "user", "content": "Hi"}])


def test_chat_with_history(client):
    history = [{"role": "system", "content": "You are helpful."}]
    with patch("integrations.openai_client.chat", return_value="Sure!") as mock_chat:
        resp = client.post("/api/chat", json={"message": "Help", "history": history})
    assert resp.status_code == 200
    expected_messages = history + [{"role": "user", "content": "Help"}]
    mock_chat.assert_called_once_with(expected_messages)


# ---------------------------------------------------------------------------
# POST /webhooks/manychat
# ---------------------------------------------------------------------------

def test_manychat_webhook_empty_text(client):
    resp = client.post("/webhooks/manychat", json={"text": ""})
    assert resp.status_code == 200
    assert resp.get_json()["status"] == "ignored"


def test_manychat_webhook_success(client):
    with patch("integrations.openai_client.chat", return_value="Nice to meet you!"):
        resp = client.post("/webhooks/manychat", json={"text": "Hello"})
    assert resp.status_code == 200
    body = resp.get_json()
    assert body["version"] == "v2"
    messages = body["content"]["messages"]
    assert messages[0]["text"] == "Nice to meet you!"


# ---------------------------------------------------------------------------
# POST /webhooks/botbuilder
# ---------------------------------------------------------------------------

def test_botbuilder_non_message_activity(client):
    resp = client.post("/webhooks/botbuilder", json={"type": "typing"})
    assert resp.status_code == 200
    assert resp.get_json()["status"] == "ignored"


def test_botbuilder_message_activity(client):
    activity = {
        "type": "message",
        "text": "Hello bot",
        "serviceUrl": "https://smba.trafficmanager.net/",
        "conversation": {"id": "conv123"},
        "id": "act456",
    }
    with patch("integrations.openai_client.chat", return_value="Hi!"), \
         patch("integrations.botbuilder.reply_to_activity", return_value={}) as mock_reply:
        resp = client.post("/webhooks/botbuilder", json=activity)
    assert resp.status_code == 200
    mock_reply.assert_called_once_with(
        "https://smba.trafficmanager.net/", "conv123", "act456", "Hi!"
    )


# ---------------------------------------------------------------------------
# POST /webhooks/replit
# ---------------------------------------------------------------------------

def test_replit_invalid_signature(client):
    resp = client.post(
        "/webhooks/replit",
        data=b'{"event":"test"}',
        content_type="application/json",
        headers={"X-Replit-Signature": "badsig"},
    )
    assert resp.status_code == 403


def test_replit_valid_signature(client):
    payload = b'{"event":"deploy"}'
    secret = "webhook-secret"
    sig = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
    resp = client.post(
        "/webhooks/replit",
        data=payload,
        content_type="application/json",
        headers={"X-Replit-Signature": sig},
    )
    assert resp.status_code == 200
    assert resp.get_json()["status"] == "received"


# ---------------------------------------------------------------------------
# integrations/openai_client
# ---------------------------------------------------------------------------

def test_openai_chat():
    mock_response = MagicMock()
    mock_response.choices[0].message.content = "Test reply"

    with patch("integrations.openai_client.get_client") as mock_get_client:
        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = mock_response
        mock_get_client.return_value = mock_client

        from integrations import openai_client
        result = openai_client.chat([{"role": "user", "content": "Hi"}])

    assert result == "Test reply"


# ---------------------------------------------------------------------------
# integrations/botbuilder – token caching
# ---------------------------------------------------------------------------

def test_botbuilder_token_cache():
    import importlib
    import integrations.botbuilder as bb
    importlib.reload(bb)  # reset cache

    first_body = {"access_token": "token-1", "expires_in": 3600}
    with patch("integrations.botbuilder.requests.post") as mock_post:
        mock_post.return_value.json.return_value = first_body
        mock_post.return_value.raise_for_status = MagicMock()

        t1 = bb._get_access_token()
        t2 = bb._get_access_token()  # should use cache

    assert t1 == "token-1"
    assert t2 == "token-1"
    assert mock_post.call_count == 1  # only one HTTP request
