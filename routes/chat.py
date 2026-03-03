"""Chat API routes.

POST /api/chat
  Body: { "message": "...", "history": [{"role": "...", "content": "..."}] }
  Returns: { "reply": "..." }
"""

from flask import Blueprint, request, jsonify
from integrations import openai_client

chat_bp = Blueprint("chat", __name__, url_prefix="/api")


@chat_bp.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    user_message = data.get("message", "").strip()
    history = data.get("history", [])

    if not user_message:
        return jsonify({"error": "message is required"}), 400

    messages = list(history) + [{"role": "user", "content": user_message}]
    reply = openai_client.chat(messages)
    return jsonify({"reply": reply})
