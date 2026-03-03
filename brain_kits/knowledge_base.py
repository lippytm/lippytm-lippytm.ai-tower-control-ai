"""KnowledgeBase – lightweight in-memory knowledge store for Brain kits.

Store plain-text facts and retrieve the most relevant ones for a given
query using simple keyword matching.  No external vector database is
required, making this suitable for small to medium knowledge bases that
fit comfortably in memory.

For larger knowledge bases, replace or subclass :class:`KnowledgeBase`
and override :meth:`search` with an embedding-based retrieval strategy.

Example
-------
>>> kb = KnowledgeBase()
>>> kb.add("lippytm.ai is an AI hub for chatbots and automation.")
>>> kb.add("ManyChat is a platform for building chat automations.")
>>> results = kb.search("What is ManyChat?")
>>> print(results)
['ManyChat is a platform for building chat automations.']
"""

from __future__ import annotations

import re
from collections import Counter
from typing import Sequence


class KnowledgeBase:
    """In-memory knowledge base with keyword-based retrieval.

    Parameters
    ----------
    facts:
        Optional initial list of fact strings to pre-populate the store.
    top_k:
        Number of most-relevant facts to return from :meth:`search`.
        Defaults to ``3``.
    """

    def __init__(
        self,
        facts: Sequence[str] | None = None,
        top_k: int = 3,
    ) -> None:
        self._facts: list[str] = list(facts) if facts else []
        self._top_k = top_k

    # ------------------------------------------------------------------
    # Management
    # ------------------------------------------------------------------

    def add(self, fact: str) -> None:
        """Append *fact* to the knowledge base."""
        stripped = fact.strip()
        if stripped and stripped not in self._facts:
            self._facts.append(stripped)

    def remove(self, fact: str) -> bool:
        """Remove *fact* from the knowledge base.

        Returns *True* if the fact was found and removed, *False* otherwise.
        """
        stripped = fact.strip()
        try:
            self._facts.remove(stripped)
            return True
        except ValueError:
            return False

    def clear(self) -> None:
        """Remove all facts from the knowledge base."""
        self._facts.clear()

    def load(self, facts: Sequence[str]) -> None:
        """Replace the current knowledge base with *facts*."""
        self._facts = list(facts)

    def all_facts(self) -> list[str]:
        """Return a copy of all stored facts."""
        return list(self._facts)

    def __len__(self) -> int:
        return len(self._facts)

    # ------------------------------------------------------------------
    # Retrieval
    # ------------------------------------------------------------------

    def search(self, query: str, top_k: int | None = None) -> list[str]:
        """Return the *top_k* most relevant facts for *query*.

        Relevance is measured by the number of shared tokens between the
        query and each fact (case-insensitive, punctuation stripped).

        Parameters
        ----------
        query:
            The user's question or message.
        top_k:
            Override the instance-level ``top_k`` for this call.

        Returns
        -------
        list[str]
            Up to *top_k* facts ordered by descending relevance score.
            Facts with a score of zero are excluded.
        """
        k = top_k if top_k is not None else self._top_k
        query_tokens = _tokenize(query)
        if not query_tokens or not self._facts:
            return []

        scored: list[tuple[float, str]] = []
        for fact in self._facts:
            fact_tokens = _tokenize(fact)
            score = _jaccard(query_tokens, fact_tokens)
            if score > 0:
                scored.append((score, fact))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [fact for _, fact in scored[:k]]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

_STOP_WORDS = frozenset(
    {
        "a", "an", "and", "are", "as", "at", "be", "been", "but", "by",
        "do", "for", "from", "has", "have", "he", "her", "him", "his",
        "how", "i", "if", "in", "is", "it", "its", "me", "my", "not",
        "of", "on", "or", "our", "she", "so", "that", "the", "their",
        "them", "they", "this", "to", "us", "was", "we", "were", "what",
        "when", "where", "which", "who", "will", "with", "you", "your",
    }
)


def _tokenize(text: str) -> Counter:
    tokens = re.findall(r"[a-zA-Z0-9]+", text.lower())
    filtered = [t for t in tokens if t not in _STOP_WORDS]
    return Counter(filtered)


def _jaccard(a: Counter, b: Counter) -> float:
    intersection = sum((a & b).values())
    union = sum((a | b).values())
    return intersection / union if union else 0.0
