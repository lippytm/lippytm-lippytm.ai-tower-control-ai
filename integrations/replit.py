"""Replit integration helpers.

Replit does not currently expose a public API for running or messaging repls
programmatically.  This module provides a placeholder that can be extended once
an API key or webhook secret is available.

Set REPLIT_WEBHOOK_SECRET in your environment or .env file.
"""

import hmac
import hashlib
import config


def verify_webhook_signature(payload: bytes, signature: str) -> bool:
    """Verify that an incoming webhook originated from Replit.

    Args:
        payload: Raw request body bytes.
        signature: Value of the X-Replit-Signature header.

    Returns:
        True if the signature is valid, False otherwise.
    """
    if not config.REPLIT_WEBHOOK_SECRET:
        return False
    expected = hmac.new(
        config.REPLIT_WEBHOOK_SECRET.encode(),
        payload,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
