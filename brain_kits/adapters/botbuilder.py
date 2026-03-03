"""BotBuilders (Azure Bot Framework) Brain adapter.

Bridges the Brain kit to the Azure Bot Framework Activity schema so
that the brain can power any bot registered in the Azure Bot Service or
BotBuilders.com.

Expected Activity schema (minimal):
    {
      "type": "message",
      "text": "<user message>",
      "from": {"id": "<user_id>"},
      "conversation": {"id": "<conversation_id>"},
      "id": "<activity_id>"
    }

Reply Activity:
    {
      "type": "message",
      "text": "<reply>",
      "replyToId": "<original_activity_id>"
    }

Usage
-----
In your Flask/FastAPI route::

    from brain_kits.adapters import BotBuilderAdapter

    adapter = BotBuilderAdapter()

    @app.route("/webhooks/botbuilder", methods=["POST"])
    def botbuilder_webhook():
        activity = request.get_json()
        return jsonify(adapter.handle(activity))
"""

from __future__ import annotations

from typing import Any

from brain_kits.brain import Brain


class BotBuilderAdapter:
    """Wraps a :class:`Brain` for Azure Bot Framework / BotBuilders webhooks.

    Parameters
    ----------
    brain:
        Pre-configured :class:`Brain` instance.  A default brain is
        created automatically if none is provided.
    """

    def __init__(self, brain: Brain | None = None) -> None:
        self._brain = brain or Brain()

    # ------------------------------------------------------------------
    # Public interface
    # ------------------------------------------------------------------

    def handle(self, activity: dict[str, Any]) -> dict[str, Any] | None:
        """Process a Bot Framework *activity* and return a reply activity.

        Only ``"message"`` activities trigger a brain response; all other
        activity types (e.g. ``"conversationUpdate"``) are acknowledged
        with *None* so callers can return a 200 OK with an empty body.

        Parameters
        ----------
        activity:
            Parsed JSON body from the Bot Framework channel.

        Returns
        -------
        dict or None
            A Bot Framework reply Activity dict, or *None* if no reply is
            warranted.
        """
        if activity.get("type") != "message":
            return None
        message = str(activity.get("text") or "")
        reply_text = self._brain.ask(message)
        return self._build_reply(activity, reply_text)

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _build_reply(activity: dict[str, Any], text: str) -> dict[str, Any]:
        return {
            "type": "message",
            "text": text,
            "replyToId": activity.get("id", ""),
        }
