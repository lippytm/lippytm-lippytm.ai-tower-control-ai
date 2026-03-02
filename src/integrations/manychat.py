"""
ManyChat integration module.
Sends messages and triggers flows via the ManyChat API.
"""

import os
import httpx


class ManyChatIntegration:
    """Handles ManyChat messaging flows."""

    BASE_URL = "https://api.manychat.com"

    def __init__(self):
        self.api_key = os.environ.get("MANYCHAT_API_KEY")
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    async def send_message(self, subscriber_id: str, message: str) -> dict:
        """Send a plain-text message to a ManyChat subscriber."""
        if not self.api_key:
            return {"error": "MANYCHAT_API_KEY not configured"}

        url = f"{self.BASE_URL}/fb/sending/sendContent"
        body = {
            "subscriber_id": subscriber_id,
            "data": {
                "version": "v2",
                "content": {
                    "messages": [{"type": "text", "text": message}],
                    "actions": [],
                    "quick_replies": [],
                },
            },
        }
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json=body, headers=self.headers)
            resp.raise_for_status()
            return resp.json()

    async def trigger_flow(self, subscriber_id: str, flow_ns: str) -> dict:
        """Trigger a ManyChat flow for a specific subscriber."""
        if not self.api_key:
            return {"error": "MANYCHAT_API_KEY not configured"}

        url = f"{self.BASE_URL}/fb/sending/sendFlow"
        body = {"subscriber_id": subscriber_id, "flow_ns": flow_ns}
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json=body, headers=self.headers)
            resp.raise_for_status()
            return resp.json()

    async def get_subscriber(self, subscriber_id: str) -> dict:
        """Retrieve subscriber info from ManyChat."""
        if not self.api_key:
            return {"error": "MANYCHAT_API_KEY not configured"}

        url = f"{self.BASE_URL}/fb/subscriber/getInfo"
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                url, params={"subscriber_id": subscriber_id}, headers=self.headers
            )
            resp.raise_for_status()
            return resp.json()
