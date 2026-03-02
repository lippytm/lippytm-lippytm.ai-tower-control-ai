"""
Webhook HTTP server for the AI Tower Control Tower.

Listens for incoming POST requests from ManyChat, BotBuilders, and other
services, and routes them through the ControlTower orchestrator.

Run with:
    uvicorn src.webhook_server:app --host 0.0.0.0 --port 8000
"""

import json as _json
import hmac
import hashlib
import logging
import os

from fastapi import FastAPI, HTTPException, Request, Header
from fastapi.responses import JSONResponse

from src.control_tower import ControlTower

logger = logging.getLogger(__name__)
app = FastAPI(title="AI Tower Control Tower", version="1.0.0")
tower = ControlTower()

WEBHOOK_SECRET = os.environ.get("WEBHOOK_SECRET", "")


def _verify_signature(body: bytes, signature: str) -> bool:
    """Verify a GitHub-style HMAC-SHA256 webhook signature."""
    if not WEBHOOK_SECRET:
        return True  # Signature verification disabled when secret not set
    expected = "sha256=" + hmac.new(
        WEBHOOK_SECRET.encode(), body, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)


@app.get("/health")
async def health():
    """Health-check endpoint."""
    return {"status": "ok"}


@app.post("/webhook/chatgpt")
async def chatgpt_webhook(request: Request):
    """Accept a ChatGPT query via HTTP and return the reply."""
    body = await request.json()
    prompt = body.get("prompt", "")
    if not prompt:
        raise HTTPException(status_code=400, detail="prompt is required")
    result = await tower.handle_event("chatgpt-query", {"prompt": prompt})
    return JSONResponse(result)


@app.post("/webhook/manychat")
async def manychat_webhook(request: Request):
    """Accept an inbound ManyChat webhook and process the event."""
    body = await request.json()
    result = await tower.handle_event("manychat-event", body)
    return JSONResponse(result)


@app.post("/webhook/botbuilders")
async def botbuilders_webhook(request: Request):
    """Accept an inbound Bot Framework activity and process it."""
    body = await request.json()
    result = await tower.handle_event("botbuilders-event", body)
    return JSONResponse(result)


@app.post("/webhook/replit")
async def replit_webhook(request: Request):
    """Trigger a Replit deployment from an incoming webhook."""
    body = await request.json()
    result = await tower.handle_event("replit-deploy", body)
    return JSONResponse(result)


@app.post("/webhook/github")
async def github_webhook(
    request: Request,
    x_hub_signature_256: str = Header(default=""),
):
    """
    Accept GitHub webhook events (push, issues, etc.) and route them
    through the control tower.
    """
    raw_body = await request.body()
    if WEBHOOK_SECRET and not _verify_signature(raw_body, x_hub_signature_256):
        raise HTTPException(status_code=401, detail="Invalid signature")

    body = _json.loads(raw_body)
    event_type = request.headers.get("X-GitHub-Event", "")
    result = await tower.handle_event(f"github-{event_type}", body)
    return JSONResponse(result)
