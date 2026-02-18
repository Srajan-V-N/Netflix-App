from flask import Flask
from flask_cors import CORS

from config import config
from db import init_db
from routes.health import health_bp
from routes.auth import auth_bp


def create_app() -> Flask:
    app = Flask(__name__)
    app.secret_key = config.SECRET_KEY

    # CORS — allow the Vite dev server
    CORS(app, origins=config.CORS_ORIGINS.split(","), supports_credentials=True)

    # Blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)

    init_db()

    return app


if __name__ == "__main__":
    print("[App] Creating Flask app…")
    app = create_app()
    print("[App] Ready — starting Flask on http://0.0.0.0:5000")
    app.run(debug=True, host="0.0.0.0", port=5000)
