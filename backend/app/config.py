"""Application configuration.

All settings are read from environment variables via ``pydantic-settings``.
Sensible defaults are provided so the application can also be started locally
without a fully populated ``.env`` file.
"""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Strongly-typed application settings sourced from the environment."""

    # ------------------------------------------------------------------ #
    # Database
    # ------------------------------------------------------------------ #
    POSTGRES_USER: str = "appuser"
    POSTGRES_PASSWORD: str = "apppassword"
    POSTGRES_DB: str = "appdb"
    POSTGRES_HOST: str = "db"
    POSTGRES_PORT: str = "5432"

    # Optional explicit override. When empty, the URL is built from the
    # individual POSTGRES_* parts above.
    DATABASE_URL: str | None = None

    # ------------------------------------------------------------------ #
    # Admin credentials & secret panel slug
    # ------------------------------------------------------------------ #
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "changeme"
    # The custom (hard-to-guess) URL slug the admin panel is mounted under,
    # e.g. "panel-ec490bc3fb279313".
    ADMIN_PATH: str = "admin"

    # ------------------------------------------------------------------ #
    # JWT
    # ------------------------------------------------------------------ #
    JWT_SECRET: str = "change-this-secret-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60

    # ------------------------------------------------------------------ #
    # File uploads (CV attachments on the contact form)
    # ------------------------------------------------------------------ #
    # Directory where uploaded CV files are stored. Created at startup if
    # it does not yet exist.
    UPLOAD_DIR: str = "/app/uploads"

    # ------------------------------------------------------------------ #
    # CORS
    # ------------------------------------------------------------------ #
    # Comma-separated list of allowed origins for the public API.
    CORS_ORIGINS: str = "http://localhost:8080,http://localhost:5173"

    # ------------------------------------------------------------------ #
    # API documentation
    # ------------------------------------------------------------------ #
    # Interactive docs (Swagger UI / ReDoc) and the OpenAPI schema are disabled
    # by default because the schema would otherwise leak the secret ADMIN_PATH
    # to unauthenticated clients. Set ENABLE_DOCS=true to turn them on (e.g. in
    # a trusted development environment).
    ENABLE_DOCS: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    @property
    def sqlalchemy_database_uri(self) -> str:
        """Return the SQLAlchemy connection URI.

        Uses ``DATABASE_URL`` verbatim when provided, otherwise assembles a
        ``postgresql+psycopg2`` URL from the individual components.
        """
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return (
            f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @property
    def admin_prefix(self) -> str:
        """Normalised URL prefix for the admin panel (always single leading slash)."""
        slug = self.ADMIN_PATH.strip("/")
        return f"/{slug}"

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse the comma-separated CORS origins into a clean list."""
        return [
            origin.strip()
            for origin in self.CORS_ORIGINS.split(",")
            if origin.strip()
        ]


# --------------------------------------------------------------------------- #
# Startup secret validation (fail-fast on weak / default / missing secrets)
# --------------------------------------------------------------------------- #
# Known insecure placeholder values that must never reach production. Compared
# case-insensitively.
_PLACEHOLDER_JWT_SECRETS = {
    "",
    "change-this-secret-in-production",
    "changeme",
    "secret",
    "changethis",
    "your-secret-key",
}
_PLACEHOLDER_PASSWORDS = {
    "",
    "changeme",
    "password",
    "admin",
    "secret",
}
_PLACEHOLDER_DB_PASSWORDS = {
    "",
    "apppassword",
    "postgres",
    "password",
    "changeme",
}

# Minimum acceptable lengths for the respective secrets.
_MIN_JWT_SECRET_LEN = 32
_MIN_ADMIN_PASSWORD_LEN = 8


def validate_secrets(s: "Settings | None" = None) -> None:
    """Validate security-critical settings, raising ``RuntimeError`` on failure.

    Called at application startup so the process refuses to boot with a missing,
    placeholder, or otherwise weak secret. Each error message names the offending
    environment variable to make misconfiguration obvious.
    """
    s = s if s is not None else settings

    # --- JWT_SECRET --------------------------------------------------------- #
    jwt_secret = (s.JWT_SECRET or "").strip()
    if jwt_secret.lower() in _PLACEHOLDER_JWT_SECRETS:
        raise RuntimeError(
            "JWT_SECRET is missing or set to a known placeholder. "
            "Set a strong, random JWT_SECRET (at least "
            f"{_MIN_JWT_SECRET_LEN} characters)."
        )
    if len(jwt_secret) < _MIN_JWT_SECRET_LEN:
        raise RuntimeError(
            f"JWT_SECRET is too short ({len(jwt_secret)} chars); it must be at "
            f"least {_MIN_JWT_SECRET_LEN} characters long."
        )

    # --- ADMIN_PASSWORD ----------------------------------------------------- #
    admin_password = s.ADMIN_PASSWORD or ""
    if admin_password.strip().lower() in _PLACEHOLDER_PASSWORDS:
        raise RuntimeError(
            "ADMIN_PASSWORD is missing or set to a known placeholder. "
            "Set a strong, unique ADMIN_PASSWORD."
        )
    if len(admin_password) < _MIN_ADMIN_PASSWORD_LEN:
        raise RuntimeError(
            f"ADMIN_PASSWORD is too short ({len(admin_password)} chars); it must "
            f"be at least {_MIN_ADMIN_PASSWORD_LEN} characters long."
        )

    # --- POSTGRES_PASSWORD -------------------------------------------------- #
    # Only enforced when the app actually connects to Postgres. When an explicit
    # DATABASE_URL is supplied (e.g. SQLite in tests) the POSTGRES_* parts are
    # unused, so the placeholder default is harmless.
    if not s.DATABASE_URL:
        if (s.POSTGRES_PASSWORD or "").strip().lower() in _PLACEHOLDER_DB_PASSWORDS:
            raise RuntimeError(
                "POSTGRES_PASSWORD is missing or set to a known placeholder "
                "(e.g. 'apppassword'). Set a strong, unique POSTGRES_PASSWORD."
            )


@lru_cache
def get_settings() -> Settings:
    """Return a cached ``Settings`` instance (read the environment once)."""
    return Settings()


# Module-level singleton for convenient importing across the app.
settings = get_settings()
