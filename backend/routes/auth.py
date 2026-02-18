from functools import wraps

from flask import Blueprint, jsonify, request
import jwt

from config import config
from models.user import (
    create_user,
    find_by_email,
    find_by_id,
    verify_password,
    create_token,
    decode_token,
)

auth_bp = Blueprint("auth", __name__)

_GENERIC_ERROR = "Invalid email or password."


# ---------------------------------------------------------------------------
# Auth decorator
# ---------------------------------------------------------------------------

def require_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing token"}), 401
        token = auth_header.split(" ", 1)[1]
        try:
            payload = decode_token(token)
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        request.current_user_id = payload["sub"]
        return f(*args, **kwargs)
    return decorated


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@auth_bp.post("/api/auth/register")
def register():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not all([name, email, password]):
        return jsonify({"error": "All fields are required."}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters."}), 400
    if find_by_email(email):
        return jsonify({"error": "An account with this email already exists."}), 409

    user = create_user(name, email, password)
    return jsonify({"message": "Account created successfully.", "user": user}), 201


@auth_bp.post("/api/auth/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not all([email, password]):
        return jsonify({"error": "All fields are required."}), 400

    user = find_by_email(email)
    if not user or not verify_password(password, user["password"]):
        return jsonify({"error": _GENERIC_ERROR}), 401

    token = create_token(user["userId"], user["email"])
    return jsonify({
        "token": token,
        "user": {
            "userId": user["userId"],
            "name": user["name"],
            "email": user["email"],
        },
    }), 200


@auth_bp.get("/api/auth/profile")
@require_token
def profile():
    user = find_by_id(request.current_user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404
    # Convert datetime to ISO string for JSON serialisation
    user_data = dict(user)
    if hasattr(user_data.get("createdAt"), "isoformat"):
        user_data["createdAt"] = user_data["createdAt"].isoformat()
    return jsonify({"user": user_data}), 200
