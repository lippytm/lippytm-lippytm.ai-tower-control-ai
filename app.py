"""AI Tower Control – Flask application entry point."""

from flask import Flask, jsonify
import config
from routes.chat import chat_bp
from routes.webhooks import webhooks_bp

app = Flask(__name__)
app.secret_key = config.FLASK_SECRET_KEY

app.register_blueprint(chat_bp)
app.register_blueprint(webhooks_bp)


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=config.DEBUG, port=config.PORT)
