"""Adapters – platform-specific Brain kit integrations.

Each adapter wraps a :class:`~brain_kits.Brain` instance and handles the
request/response format expected by a specific platform.

Available adapters
------------------
ManyChatAdapter
    Handles ManyChat dynamic-content webhook requests.
BotBuilderAdapter
    Handles Azure Bot Framework activity objects.
ReplitAdapter
    Handles Replit webhook events.
"""

from .botbuilder import BotBuilderAdapter
from .manychat import ManyChatAdapter
from .replit import ReplitAdapter

__all__ = ["ManyChatAdapter", "BotBuilderAdapter", "ReplitAdapter"]
