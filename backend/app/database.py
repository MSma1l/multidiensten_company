"""Database setup: engine, session factory, declarative base and helpers."""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from .config import settings

# ---------------------------------------------------------------------------- #
# Engine
# ---------------------------------------------------------------------------- #
# ``pool_pre_ping`` transparently recycles connections that the database may
# have dropped, which is important behind connection poolers / long-lived
# containers.
engine = create_engine(
    settings.sqlalchemy_database_uri,
    pool_pre_ping=True,
    future=True,
)

# Session factory. ``expire_on_commit=False`` lets us keep using ORM objects
# (e.g. to serialise a created row) after the surrounding commit.
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
    class_=Session,
)


class Base(DeclarativeBase):
    """Declarative base class for all ORM models."""


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a scoped database session.

    The session is always closed when the request finishes, even on error.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Create all tables that do not yet exist.

    Importing :mod:`app.models` here guarantees the models are registered on
    the metadata before ``create_all`` runs.
    """
    from . import models  # noqa: F401  (import for side effect: model registration)

    Base.metadata.create_all(bind=engine)
