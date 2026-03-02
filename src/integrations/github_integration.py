"""
GitHub integration module.
Uses the GitHub REST API to create issues, comments, and dispatch
repository_dispatch events to connected repositories.
"""

import os
import httpx


class GitHubIntegration:
    """Handles GitHub API calls for cross-repo automation."""

    BASE_URL = "https://api.github.com"

    def __init__(self):
        self.token = os.environ.get("GITHUB_TOKEN")
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        }

    async def dispatch_event(self, repo: str, event_type: str, payload: dict) -> dict:
        """Trigger a repository_dispatch event on a GitHub repo."""
        url = f"{self.BASE_URL}/repos/{repo}/dispatches"
        body = {"event_type": event_type, "client_payload": payload}
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json=body, headers=self.headers)
            resp.raise_for_status()
            return {"status": "dispatched", "repo": repo, "event_type": event_type}

    async def create_issue(self, repo: str, title: str, body: str) -> dict:
        """Open a new issue in the specified GitHub repository."""
        url = f"{self.BASE_URL}/repos/{repo}/issues"
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                url, json={"title": title, "body": body}, headers=self.headers
            )
            resp.raise_for_status()
            data = resp.json()
            return {"issue_number": data["number"], "url": data["html_url"]}

    async def add_comment(self, repo: str, issue_number: int, comment: str) -> dict:
        """Add a comment to an existing GitHub issue."""
        url = f"{self.BASE_URL}/repos/{repo}/issues/{issue_number}/comments"
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                url, json={"body": comment}, headers=self.headers
            )
            resp.raise_for_status()
            return {"comment_id": resp.json()["id"]}
