import os
from dotenv import load_dotenv

from pathlib import Path
load_dotenv(Path(__file__).parent / ".env")


class Config:
    SECRET_KEY: str = os.getenv("FLASK_SECRET_KEY", "dev-secret-key")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "jwt-dev-secret")
    JWT_EXPIRY_HOURS: int = 24

    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT: int = int(os.getenv("MYSQL_PORT", "3306"))
    MYSQL_USER: str = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_DB: str = os.getenv("MYSQL_DB", "defaultdb")

    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:5173")


config = Config()
