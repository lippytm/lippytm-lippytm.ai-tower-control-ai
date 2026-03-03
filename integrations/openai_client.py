from openai import OpenAI
import config

_client = None


def get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=config.OPENAI_API_KEY)
    return _client


def chat(messages: list[dict], model: str | None = None, max_tokens: int | None = None) -> str:
    """Send a list of messages to OpenAI and return the assistant reply text."""
    client = get_client()
    response = client.chat.completions.create(
        model=model or config.OPENAI_MODEL,
        messages=messages,
        max_tokens=max_tokens or config.OPENAI_MAX_TOKENS,
    )
    return response.choices[0].message.content or ""
