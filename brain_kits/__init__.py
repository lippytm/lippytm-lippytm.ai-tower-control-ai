"""Brain Kits – reusable AI brain modules for lippytm.ai repositories.

Each kit wires an OpenAI-powered brain to a platform-specific adapter
(ManyChat, BotBuilders, Replit, etc.) so that any repository in the
lippytm.ai ecosystem can add intelligent, knowledge-grounded responses
with minimal boilerplate.

Quick start
-----------
>>> from brain_kits import Brain
>>> brain = Brain()
>>> print(brain.ask("What is lippytm.ai?"))
"""

from .brain import Brain
from .knowledge_base import KnowledgeBase

__all__ = ["Brain", "KnowledgeBase"]
