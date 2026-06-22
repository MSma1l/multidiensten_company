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


@lru_cache
def get_settings() -> Settings:
    """Return a cached ``Settings`` instance (read the environment once)."""
    return Settings()


# Module-level singleton for convenient importing across the app.
settings = get_settings()
