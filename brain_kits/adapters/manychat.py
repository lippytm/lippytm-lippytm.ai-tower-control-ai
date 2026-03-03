"""ManyChat Brain adapter.

Bridges the Brain kit to ManyChat's Dynamic Content webhook format.

ManyChat Dynamic Content request (POST body):
    {
      "id": "<subscriber_id>",
      "key": "<custom_field_key>",    # optional
      "last_input_text": "user message"
    }

Expected response format for ManyChat:
    {
      "version": "v2",
      "content": {
        "messages": [{"type": "text", "text": "<reply>"}]
      }
    }

Usage
-----
In your Flask/FastAPI route::

    from brain_kits.adapters import ManyChatAdapter

    adapter = ManyChatAdapter()

    @app.route("/webhooks/manychat", methods=["POST"])
    def manychat_webhook():
        payload = request.get_json()
        return jsonify(adapter.handle(payload))
"""

from __future__ import annotations

from typing import Any

from brain_kits.brain import Brain


class ManyChatAdapter:
    """Wraps a :class:`Brain` for ManyChat Dynamic Content webhooks.

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

    def handle(self, payload: dict[str, Any]) -> dict[str, Any]:
        """Process a ManyChat Dynamic Content webhook *payload*.

        Parameters
        ----------
        payload:
            Parsed JSON body from ManyChat.

        Returns
        -------
        dict
            ManyChat v2 dynamic-content response.
        """
        message = self._extract_message(payload)
        reply = self._brain.ask(message)
        return self._build_response(reply)

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _extract_message(payload: dict[str, Any]) -> str:
        return str(payload.get("last_input_text") or payload.get("text") or "")

    @staticmethod
    def _build_response(reply: str) -> dict[str, Any]:
        return {
            "version": "v2",
            "content": {
                "messages": [{"type": "text", "text": reply}]
            },
        }
