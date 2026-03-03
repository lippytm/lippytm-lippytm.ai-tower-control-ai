"""Replit Brain adapter.

Bridges the Brain kit to Replit webhook events so that a Replit-hosted
app can use the lippytm.ai Brain to respond to questions or triggers.

Expected Replit webhook payload:
    {
      "event": "message" | "deploy" | "status",
      "text": "<user message>",           # present for "message" events
      "repl_id": "<repl_id>",
      "user": "<username>"
    }

Response:
    {
      "reply": "<brain reply>",
      "event": "<original event type>"
    }

Usage
-----
In your Flask/FastAPI route::

    from brain_kits.adapters import ReplitAdapter

    adapter = ReplitAdapter()

    @app.route("/webhooks/replit", methods=["POST"])
    def replit_webhook():
        payload = request.get_json()
        return jsonify(adapter.handle(payload))
"""

from __future__ import annotations

from typing import Any

from brain_kits.brain import Brain


class ReplitAdapter:
    """Wraps a :class:`Brain` for Replit webhook events.

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
        """Process a Replit webhook *payload* and return a reply.

        Only ``"message"`` events trigger a brain response.  Other event
        types receive a generic acknowledgement.

        Parameters
        ----------
        payload:
            Parsed JSON body from the Replit webhook.

        Returns
        -------
        dict
            Response containing ``"reply"`` and the original ``"event"``
            type.
        """
        event = str(payload.get("event", ""))
        if event == "message":
            text = str(payload.get("text") or "")
            reply = self._brain.ask(text)
        else:
            reply = f"Event '{event}' received."
        return {"reply": reply, "event": event}
