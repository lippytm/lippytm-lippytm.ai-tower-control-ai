"""
BotBuilders (Microsoft Bot Framework) integration module.
Exchanges messages with a Bot Framework bot via the Direct Line API.
"""

import os
import httpx


class BotBuildersIntegration:
    """Interfaces with a Microsoft Bot Framework bot via Direct Line."""

    DIRECT_LINE_URL = "https://directline.botframework.com/v3/directline"
    TOKEN_URL = "https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token"

    def __init__(self):
        self.app_id = os.environ.get("BOTBUILDERS_APP_ID")
        self.app_password = os.environ.get("BOTBUILDERS_APP_PASSWORD")
        self._token: str | None = None
        self._conversation_id: str | None = None

    async def _get_access_token(self) -> str:
        """Obtain an OAuth2 access token from Microsoft identity platform."""
        data = {
            "grant_type": "client_credentials",
            "client_id": self.app_id,
            "client_secret": self.app_password,
            "scope": "https://api.botframework.com/.default",
        }
        async with httpx.AsyncClient() as client:
            resp = await client.post(self.TOKEN_URL, data=data)
            resp.raise_for_status()
            self._token = resp.json()["access_token"]
            return self._token

    async def start_conversation(self) -> str:
        """Start a new Direct Line conversation and return the conversation ID."""
        if not self.app_id or not self.app_password:
            return "BOTBUILDERS credentials not configured"

        token = await self._get_access_token()
        headers = {"Authorization": f"Bearer {token}"}
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{self.DIRECT_LINE_URL}/conversations", headers=headers
            )
            resp.raise_for_status()
            self._conversation_id = resp.json()["conversationId"]
            return self._conversation_id

    async def send_message(self, text: str, from_id: str = "control-tower") -> dict:
        """Send a message to the bot and return the activity ID."""
        if not self._conversation_id:
            await self.start_conversation()

        token = self._token or await self._get_access_token()
        headers = {"Authorization": f"Bearer {token}"}
        body = {
            "type": "message",
            "from": {"id": from_id},
            "text": text,
        }
        url = f"{self.DIRECT_LINE_URL}/conversations/{self._conversation_id}/activities"
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json=body, headers=headers)
            resp.raise_for_status()
            return resp.json()

    async def get_replies(self) -> list:
        """Poll for bot replies in the current conversation."""
        if not self._conversation_id:
            return []

        token = self._token or await self._get_access_token()
        headers = {"Authorization": f"Bearer {token}"}
        url = f"{self.DIRECT_LINE_URL}/conversations/{self._conversation_id}/activities"
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, headers=headers)
            resp.raise_for_status()
            activities = resp.json().get("activities", [])
            return [a for a in activities if a.get("from", {}).get("id") != "control-tower"]
