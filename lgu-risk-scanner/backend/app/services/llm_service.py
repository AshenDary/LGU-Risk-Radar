import os
import requests


class LLMService:
    """Simple wrapper for external LLM calls. Replace with real implementation."""

    def __init__(self, api_url: str = None, api_key: str = None):
        self.api_url = api_url or os.getenv("LLM_API_URL")
        self.api_key = api_key or os.getenv("LLM_API_KEY")

    def generate(self, prompt: str) -> str:
        if not self.api_url:
            return "LLM service not configured"
        # Minimal example using a generic POST; adapt to your provider
        resp = requests.post(self.api_url, json={"prompt": prompt}, headers={"Authorization": f"Bearer {self.api_key}"})
        if resp.ok:
            return resp.text
        return f"LLM error: {resp.status_code}"
