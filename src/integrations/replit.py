"""
Replit integration module.
Triggers Replit deployments and interacts with Replit projects via its API.
"""

import os
import httpx


class ReplitIntegration:
    """Handles Replit project deployment and status checks."""

    BASE_URL = "https://replit.com/graphql"

    def __init__(self):
        self.api_key = os.environ.get("REPLIT_API_KEY")
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
        }

    async def get_repl(self, repl_id: str) -> dict:
        """Fetch metadata for a specific Repl by ID."""
        if not self.api_key:
            return {"error": "REPLIT_API_KEY not configured"}

        query = """
        query GetRepl($id: String!) {
          repl(id: $id) {
            id
            title
            slug
            url
            isPrivate
            deploymentState
          }
        }
        """
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                self.BASE_URL,
                json={"query": query, "variables": {"id": repl_id}},
                headers=self.headers,
            )
            resp.raise_for_status()
            return resp.json()

    async def run_repl(self, repl_id: str) -> dict:
        """Trigger a run/deploy for a Repl."""
        if not self.api_key:
            return {"error": "REPLIT_API_KEY not configured"}

        mutation = """
        mutation RunRepl($replId: String!) {
          runRepl(input: { replId: $replId }) {
            repl {
              id
              title
              deploymentState
            }
          }
        }
        """
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                self.BASE_URL,
                json={"query": mutation, "variables": {"replId": repl_id}},
                headers=self.headers,
            )
            resp.raise_for_status()
            return resp.json()
