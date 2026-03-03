"""Webhook route handlers for platform events.

POST /webhooks/manychat  - receives events from ManyChat
POST /webhooks/botbuilder - receives activities from Azure Bot Framework
POST /webhooks/replit    - receives events from Replit
"""

from flask import Blueprint, request, jsonify
from integrations import openai_client, botbuilder, replit

webhooks_bp = Blueprint("webhooks", __name__, url_prefix="/webhooks")


@webhooks_bp.route("/manychat", methods=["POST"])
def manychat_webhook():
    """Handle an inbound ManyChat message and reply via OpenAI."""
    data = request.get_json(silent=True) or {}
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"status": "ignored"}), 200

    reply = openai_client.chat([{"role": "user", "content": text}])

    # Return the reply in ManyChat's dynamic content format
    return jsonify({
        "version": "v2",
        "content": {
            "type": "instagram",
            "messages": [{"type": "text", "text": reply}],
        },
    })


@webhooks_bp.route("/botbuilder", methods=["POST"])
def botbuilder_webhook():
    """Handle an inbound Bot Framework activity and reply via OpenAI."""
    activity = request.get_json(silent=True) or {}
    if activity.get("type") != "message":
        return jsonify({"status": "ignored"}), 200

    text = activity.get("text", "").strip()
    service_url = activity.get("serviceUrl", "")
    conversation_id = (activity.get("conversation") or {}).get("id", "")
    activity_id = activity.get("id", "")

    if not text:
        return jsonify({"status": "ignored"}), 200

    reply = openai_client.chat([{"role": "user", "content": text}])
    botbuilder.reply_to_activity(service_url, conversation_id, activity_id, reply)
    return jsonify({"status": "ok"})


@webhooks_bp.route("/replit", methods=["POST"])
def replit_webhook():
    """Handle an inbound Replit webhook event."""
    signature = request.headers.get("X-Replit-Signature", "")
    if not replit.verify_webhook_signature(request.data, signature):
        return jsonify({"error": "invalid signature"}), 403

    data = request.get_json(silent=True) or {}
    return jsonify({"status": "received", "event": data.get("event")})
