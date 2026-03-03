import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")
OPENAI_MAX_TOKENS = int(os.getenv("OPENAI_MAX_TOKENS", "1024"))

MANYCHAT_API_KEY = os.getenv("MANYCHAT_API_KEY", "")
MANYCHAT_PAGE_ID = os.getenv("MANYCHAT_PAGE_ID", "")

BOTBUILDER_APP_ID = os.getenv("BOTBUILDER_APP_ID", "")
BOTBUILDER_APP_PASSWORD = os.getenv("BOTBUILDER_APP_PASSWORD", "")

REPLIT_WEBHOOK_SECRET = os.getenv("REPLIT_WEBHOOK_SECRET", "")

FLASK_SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "change-me-in-production")
DEBUG = os.getenv("DEBUG", "false").lower() == "true"
PORT = int(os.getenv("PORT", "5000"))
