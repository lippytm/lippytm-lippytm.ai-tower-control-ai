# lippytm.ai Tower Control

Control tower for OpenAI ChatGPT's integrated interfaces with other applications, projects, and platforms — BotBuilders, ManyChat, Replit, and more.

---

## Brain Kits

**Brain kits** are reusable AI brain modules that can be dropped into any lippytm.ai repository to give it OpenAI-powered intelligence.  Each kit includes:

- A core `Brain` class backed by OpenAI Chat Completions
- A `KnowledgeBase` for storing and retrieving relevant facts
- Platform adapters for ManyChat, BotBuilders (Azure Bot Framework), and Replit

### Repository layout

```
brain_kits/
├── __init__.py            ← exports Brain, KnowledgeBase
├── brain.py               ← core OpenAI-backed Brain class
├── knowledge_base.py      ← in-memory knowledge base with keyword retrieval
└── adapters/
    ├── __init__.py        ← exports all adapters
    ├── manychat.py        ← ManyChat Dynamic Content adapter
    ├── botbuilder.py      ← Azure Bot Framework / BotBuilders adapter
    └── replit.py          ← Replit webhook adapter
tests/
└── test_brain_kit.py      ← pytest suite (no external API calls)
```

### Quick start

#### 1. Install dependencies

```bash
pip install -r requirements.txt
```

#### 2. Configure environment variables

```bash
cp .env.example .env
# edit .env and set OPENAI_API_KEY
```

#### 3. Use the Brain in your code

```python
from dotenv import load_dotenv
load_dotenv()

from brain_kits import Brain, KnowledgeBase

# Optionally seed the brain with project-specific knowledge
kb = KnowledgeBase()
kb.add("lippytm.ai is an AI hub connecting ChatGPT, ManyChat, BotBuilders, and Replit.")
kb.add("ManyChat is a platform for building chat automations on Instagram, Facebook, and SMS.")

brain = Brain(knowledge_base=kb)
print(brain.ask("What is lippytm.ai?"))
```

#### 4. Wire to a platform

**ManyChat Dynamic Content webhook (Flask example)**

```python
from flask import Flask, request, jsonify
from brain_kits.adapters import ManyChatAdapter

app = Flask(__name__)
adapter = ManyChatAdapter()

@app.route("/webhooks/manychat", methods=["POST"])
def manychat_webhook():
    return jsonify(adapter.handle(request.get_json()))
```

**BotBuilders / Azure Bot Framework**

```python
from brain_kits.adapters import BotBuilderAdapter

adapter = BotBuilderAdapter()

@app.route("/webhooks/botbuilder", methods=["POST"])
def botbuilder_webhook():
    reply = adapter.handle(request.get_json())
    return jsonify(reply) if reply else ("", 200)
```

**Replit webhook**

```python
from brain_kits.adapters import ReplitAdapter

adapter = ReplitAdapter()

@app.route("/webhooks/replit", methods=["POST"])
def replit_webhook():
    return jsonify(adapter.handle(request.get_json()))
```

### Configuration

| Variable | Default | Description |
|---|---|---|
| `OPENAI_API_KEY` | *(required)* | OpenAI secret key |
| `OPENAI_MODEL` | `gpt-4o` | Model name |
| `OPENAI_MAX_TOKENS` | `1024` | Max tokens per completion |
| `BRAIN_SYSTEM_PROMPT` | *(built-in)* | Custom system prompt for the Brain |

### Running tests

```bash
pip install pytest
pytest tests/
```

### Adding the Brain kit to another repository

1. Copy the `brain_kits/` directory into the target repository.
2. Add `openai` and `python-dotenv` to that repository's `requirements.txt`.
3. Set `OPENAI_API_KEY` in the environment (`.env` file or CI secret).
4. Import and use `Brain` / the platform adapters as shown above.
