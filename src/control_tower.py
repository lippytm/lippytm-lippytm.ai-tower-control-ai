"""
Control Tower – central orchestrator for all platform integrations.

Routes incoming events and outbound broadcasts to the correct integration
modules: OpenAI/ChatGPT, GitHub, ManyChat, BotBuilders, and Replit.
"""

import json
import logging

from src.integrations import (
    OpenAIIntegration,
    GitHubIntegration,
    ManyChatIntegration,
    BotBuildersIntegration,
    ReplitIntegration,
)

logger = logging.getLogger(__name__)


class ControlTower:
    """
    Central hub that connects ChatGPT, GitHub, ManyChat, BotBuilders,
    and Replit into a single automated workflow.
    """

    def __init__(self):
        self.openai = OpenAIIntegration()
        self.github = GitHubIntegration()
        self.manychat = ManyChatIntegration()
        self.botbuilders = BotBuildersIntegration()
        self.replit = ReplitIntegration()

    # ------------------------------------------------------------------
    # Outbound broadcasting
    # ------------------------------------------------------------------

    async def broadcast(self, message: str, platform: str = "all") -> dict:
        """
        Send *message* to one or all downstream platforms.

        Parameters
        ----------
        message:
            The text to broadcast.
        platform:
            ``"manychat"``, ``"botbuilders"``, ``"replit"``, or ``"all"``.

        Returns
        -------
        dict
            A mapping of platform name → result.
        """
        results: dict = {}

        if platform in ("all", "manychat"):
            try:
                # ManyChat requires a subscriber ID; skip silently when not set.
                results["manychat"] = {"status": "skipped – no subscriber_id in broadcast"}
            except Exception as exc:
                results["manychat"] = {"error": str(exc)}

        if platform in ("all", "botbuilders"):
            try:
                results["botbuilders"] = await self.botbuilders.send_message(message)
            except Exception as exc:
                results["botbuilders"] = {"error": str(exc)}

        logger.info("Broadcast result: %s", json.dumps(results))
        return results

    # ------------------------------------------------------------------
    # Inbound event routing (GitHub repository_dispatch)
    # ------------------------------------------------------------------

    async def handle_event(self, event_type: str, payload: dict) -> dict:
        """
        Route an incoming repository_dispatch event to the right handler.

        Supported event types
        ---------------------
        ``chatgpt-query``
            Payload: ``{"prompt": "..."}``
        ``manychat-event``
            Payload: ``{"subscriber_id": "...", "message": "..."}``
        ``botbuilders-event``
            Payload: ``{"text": "..."}``
        ``replit-deploy``
            Payload: ``{"repl_id": "..."}``
        """
        handlers = {
            "chatgpt-query": self._handle_chatgpt_query,
            "manychat-event": self._handle_manychat_event,
            "botbuilders-event": self._handle_botbuilders_event,
            "replit-deploy": self._handle_replit_deploy,
        }

        handler = handlers.get(event_type)
        if not handler:
            return {"error": f"Unknown event type: {event_type}"}

        try:
            return await handler(payload)
        except Exception as exc:
            logger.exception("Error handling event %s", event_type)
            return {"error": str(exc)}

    # ------------------------------------------------------------------
    # Private event handlers
    # ------------------------------------------------------------------

    async def _handle_chatgpt_query(self, payload: dict) -> dict:
        prompt = payload.get("prompt", "")
        if not prompt:
            return {"error": "No prompt provided"}
        reply = await self.openai.chat(prompt)
        return {"reply": reply}

    async def _handle_manychat_event(self, payload: dict) -> dict:
        subscriber_id = payload.get("subscriber_id", "")
        message = payload.get("message", "")
        if not subscriber_id or not message:
            return {"error": "subscriber_id and message are required"}
        return await self.manychat.send_message(subscriber_id, message)

    async def _handle_botbuilders_event(self, payload: dict) -> dict:
        text = payload.get("text", "")
        if not text:
            return {"error": "No text provided"}
        return await self.botbuilders.send_message(text)

    async def _handle_replit_deploy(self, payload: dict) -> dict:
        repl_id = payload.get("repl_id", "")
        if not repl_id:
            return {"error": "No repl_id provided"}
        return await self.replit.run_repl(repl_id)
