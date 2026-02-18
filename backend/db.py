import pymysql
from config import config


def get_connection():
    """Return a new PyMySQL connection to the defaultdb database."""
    return pymysql.connect(
        host=config.MYSQL_HOST,
        port=config.MYSQL_PORT,
        user=config.MYSQL_USER,
        password=config.MYSQL_PASSWORD,
        database=config.MYSQL_DB,
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
        ssl={"ssl": {}},
        connect_timeout=10,
    )


def init_db():
    """Create the users table if it does not already exist (idempotent)."""
    try:
        conn = get_connection()
    except Exception as exc:
        print(f"[DB] ❌ Could not connect to database: {exc}")
        print("[DB]    Check MYSQL_HOST / MYSQL_PORT / MYSQL_PASSWORD in backend/.env")
        raise
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS users (
                    id          INT          AUTO_INCREMENT PRIMARY KEY,
                    userId      VARCHAR(36)  NOT NULL UNIQUE,
                    name        VARCHAR(120) NOT NULL,
                    email       VARCHAR(255) NOT NULL UNIQUE,
                    password    VARCHAR(255) NOT NULL,
                    createdAt   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_email  (email),
                    INDEX idx_userId (userId)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                """
            )
        conn.commit()
        print("[DB] Table initialized")
    finally:
        conn.close()
