import uuid
from datetime import datetime, timezone, timedelta

import bcrypt
import jwt

from config import config
from db import get_connection


# ---------------------------------------------------------------------------
# Password helpers
# ---------------------------------------------------------------------------

def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt(rounds=12)).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


# ---------------------------------------------------------------------------
# JWT helpers
# ---------------------------------------------------------------------------

def create_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(hours=config.JWT_EXPIRY_HOURS),
    }
    return jwt.encode(payload, config.JWT_SECRET_KEY, algorithm="HS256")


def decode_token(token: str) -> dict:
    return jwt.decode(token, config.JWT_SECRET_KEY, algorithms=["HS256"])


# ---------------------------------------------------------------------------
# DB queries
# ---------------------------------------------------------------------------

def find_by_email(email: str) -> dict | None:
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE email = %s LIMIT 1", (email,))
            return cur.fetchone()
    finally:
        conn.close()


def find_by_id(user_id: str) -> dict | None:
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, userId, name, email, createdAt FROM users WHERE userId = %s LIMIT 1",
                (user_id,),
            )
            return cur.fetchone()
    finally:
        conn.close()


def create_user(name: str, email: str, plain_password: str) -> dict:
    user_id = str(uuid.uuid4())
    hashed = hash_password(plain_password)
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO users (userId, name, email, password) VALUES (%s, %s, %s, %s)",
                (user_id, name, email, hashed),
            )
        conn.commit()
        return {"userId": user_id, "name": name, "email": email}
    finally:
        conn.close()
