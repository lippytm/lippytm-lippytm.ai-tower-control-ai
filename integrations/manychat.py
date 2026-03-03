"""ManyChat integration helpers.

See https://api.manychat.com for full API documentation.
Set MANYCHAT_API_KEY and MANYCHAT_PAGE_ID in your environment or .env file.
"""

import requests
import config

BASE_URL = "https://api.manychat.com/fb"


def _headers() -> dict:
    return {"Authorization": f"Bearer {config.MANYCHAT_API_KEY}"}


def send_message(subscriber_id: str, text: str) -> dict:
    """Send a plain-text message to a ManyChat subscriber."""
    url = f"{BASE_URL}/sending/sendContent"
    payload = {
        "subscriber_id": subscriber_id,
        "data": {
            "version": "v2",
            "content": {
                "type": "instagram",
                "messages": [{"type": "text", "text": text}],
            },
        },
    }
    response = requests.post(url, json=payload, headers=_headers(), timeout=10)
    response.raise_for_status()
    return response.json()
