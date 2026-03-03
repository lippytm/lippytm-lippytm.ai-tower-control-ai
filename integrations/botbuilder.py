"""Azure Bot Framework / BotBuilder integration helpers.

Set BOTBUILDER_APP_ID and BOTBUILDER_APP_PASSWORD in your environment or .env file.
"""

import time
import requests
import config

TOKEN_URL = "https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token"

_token_cache: dict = {"token": None, "expires_at": 0.0}


def _get_access_token() -> str:
    """Obtain a bearer token, reusing a cached one while it is still valid."""
    now = time.monotonic()
    if _token_cache["token"] and now < _token_cache["expires_at"]:
        return _token_cache["token"]

    data = {
        "grant_type": "client_credentials",
        "client_id": config.BOTBUILDER_APP_ID,
        "client_secret": config.BOTBUILDER_APP_PASSWORD,
        "scope": "https://api.botframework.com/.default",
    }
    response = requests.post(TOKEN_URL, data=data, timeout=10)
    response.raise_for_status()
    body = response.json()
    _token_cache["token"] = body["access_token"]
    # Refresh a minute before the token actually expires
    _token_cache["expires_at"] = now + body.get("expires_in", 3600) - 60
    return _token_cache["token"]


def reply_to_activity(service_url: str, conversation_id: str, activity_id: str, text: str) -> dict:
    """Post a reply to a Bot Framework activity."""
    token = _get_access_token()
    url = f"{service_url.rstrip('/')}/v3/conversations/{conversation_id}/activities/{activity_id}"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = {"type": "message", "text": text}
    response = requests.post(url, json=payload, headers=headers, timeout=10)
    response.raise_for_status()
    return response.json()
