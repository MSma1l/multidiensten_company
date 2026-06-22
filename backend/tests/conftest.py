"""Shared pytest fixtures.

The required environment variables are set BEFORE any application module is
imported so that the admin password hash, JWT secret and admin URL slug are
known and deterministic during the whole test session. The production Postgres
engine is replaced with an in-memory SQLite engine (shared via ``StaticPool``)
and the ``get_db`` dependency is overridden so the suite runs without Docker.
"""

from __future__ import annotations

import os
import tempfile

# --------------------------------------------------------------------------- #
# Environment: must be configured before importing anything from ``app``.
# --------------------------------------------------------------------------- #
ADMIN_USERNAME = "admin"
# Test secrets must satisfy validate_secrets(): ADMIN_PASSWORD >= 8 chars and
# JWT_SECRET >= 32 chars (and neither may be a known placeholder value).
ADMIN_PASSWORD = "S3cret-Test-Pass"
ADMIN_PATH = "secret-panel"
JWT_SECRET = "unit-test-jwt-secret-value-0123456789-abcdef"

_UPLOAD_DIR = tempfile.mkdtemp(prefix="cv-uploads-")

os.environ["ADMIN_USERNAME"] = ADMIN_USERNAME
os.environ["ADMIN_PASSWORD"] = ADMIN_PASSWORD
os.environ["ADMIN_PATH"] = ADMIN_PATH
os.environ["JWT_SECRET"] = JWT_SECRET
os.environ["JWT_EXPIRE_MINUTES"] = "60"
os.environ["UPLOAD_DIR"] = _UPLOAD_DIR
# Avoid accidentally building a real Postgres URL from a stray .env file.
os.environ["DATABASE_URL"] = "sqlite://"

import pytest  # noqa: E402
from sqlalchemy import create_engine  # noqa: E402
from sqlalchemy.orm import sessionmaker  # noqa: E402
from sqlalchemy.pool import StaticPool  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.database import Base, get_db  # noqa: E402
from app import models  # noqa: F401,E402  (register models on the metadata)
from app.main import app  # noqa: E402

# --------------------------------------------------------------------------- #
# Test database: a single shared in-memory SQLite connection.
# --------------------------------------------------------------------------- #
test_engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
    future=True,
)
TestingSessionLocal = sessionmaker(
    bind=test_engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)

Base.metadata.create_all(bind=test_engine)


def _override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = _override_get_db


@pytest.fixture(autouse=True)
def _reset_database():
    """Give every test a clean schema (and clear login lockout state)."""
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    from app import security

    security._login_attempts.clear()
    yield
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)


@pytest.fixture()
def client():
    """A FastAPI TestClient.

    Constructed WITHOUT the context manager on purpose so the application
    lifespan (which would call ``init_db`` against the real Postgres engine)
    does not run. Schema creation is handled against the SQLite test engine.
    """
    return TestClient(app)


@pytest.fixture()
def db_session():
    """Direct ORM session bound to the SQLite test engine for assertions."""
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def upload_dir() -> str:
    return _UPLOAD_DIR


# --------------------------------------------------------------------------- #
# Auth helpers
# --------------------------------------------------------------------------- #
@pytest.fixture()
def admin_prefix() -> str:
    return f"/{ADMIN_PATH}"


@pytest.fixture()
def auth_headers(client, admin_prefix) -> dict[str, str]:
    """Log in as the configured admin and return a Bearer auth header."""
    resp = client.post(
        f"{admin_prefix}/api/login",
        json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD},
    )
    assert resp.status_code == 200, resp.text
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


# --------------------------------------------------------------------------- #
# Data factories
# --------------------------------------------------------------------------- #
def make_job(**overrides):
    """Build a valid :class:`app.models.Job` with sensible defaults."""
    data = {
        "title_nl": "Software Ontwikkelaar",
        "title_en": "Software Developer",
        "description_nl": "Een mooie functie bij ons team in Nederland.",
        "description_en": "A great role within our team in the Netherlands.",
        "salary_type": "range",
        "salary_min": 2500,
        "salary_max": 3200,
        "salary_amount": None,
        "salary_range": "2000-3000",
        "experience_years": 3,
        "level": "middle",
        "hours_per_week": 40,
        "location": "Amsterdam",
        "company": "Randstad",
    }
    data.update(overrides)
    return models.Job(**data)


def valid_job_payload(**overrides) -> dict:
    """Build a valid JobCreate camelCase payload for the admin API."""
    data = {
        "titleNl": "Software Ontwikkelaar",
        "titleEn": "Software Developer",
        "descriptionNl": "Een mooie functie bij ons team in Nederland.",
        "descriptionEn": "A great role within our team in the Netherlands.",
        "salaryType": "range",
        "salaryMin": 2500,
        "salaryMax": 3200,
        "salaryAmount": None,
        "salaryRange": "2000-3000",
        "experienceYears": 3,
        "level": "middle",
        "hoursPerWeek": 40,
        "location": "Amsterdam",
        "company": "Randstad",
    }
    data.update(overrides)
    return data


def valid_contact_form(**overrides) -> dict:
    data = {
        "firstName": "Jan",
        "lastName": "Jansen",
        "email": "jan.jansen@example.com",
        "phone": "+31 6 12345678",
        "message": "Hello, I would like to know more about your services please.",
    }
    data.update(overrides)
    return data
