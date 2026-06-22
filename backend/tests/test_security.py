"""Unit tests for app.security (hashing, JWT, admin dependency, lockout)."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pytest
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from jose import jwt

from app import security
from app.config import settings
from app.security import (
    authenticate_admin,
    create_access_token,
    decode_access_token,
    get_current_admin,
    login_lock_remaining,
    register_failed_login,
    reset_login_attempts,
    verify_password,
    _ADMIN_HASH,
)

from conftest import ADMIN_PASSWORD, ADMIN_USERNAME


# --------------------------------------------------------------------------- #
# Password hashing
# --------------------------------------------------------------------------- #
def test_verify_password_roundtrip():
    assert verify_password(ADMIN_PASSWORD, _ADMIN_HASH) is True


def test_verify_password_wrong():
    assert verify_password("nope", _ADMIN_HASH) is False


def test_verify_password_malformed_hash_returns_false():
    assert verify_password("anything", "not-a-valid-bcrypt-hash") is False


def test_authenticate_admin_success():
    assert authenticate_admin(ADMIN_USERNAME, ADMIN_PASSWORD) is True


def test_authenticate_admin_wrong_user():
    assert authenticate_admin("intruder", ADMIN_PASSWORD) is False


def test_authenticate_admin_wrong_password():
    assert authenticate_admin(ADMIN_USERNAME, "wrong") is False


# --------------------------------------------------------------------------- #
# JWT create + decode
# --------------------------------------------------------------------------- #
def test_create_and_decode_token():
    token = create_access_token(subject=ADMIN_USERNAME)
    payload = decode_access_token(token)
    assert payload["sub"] == ADMIN_USERNAME
    assert payload["type"] == "access"
    assert "jti" in payload


def test_decode_expired_token_rejected():
    token = create_access_token(subject=ADMIN_USERNAME, expires_minutes=-1)
    with pytest.raises(Exception):
        decode_access_token(token)


def test_decode_tampered_token_rejected():
    token = create_access_token(subject=ADMIN_USERNAME)
    tampered = token[:-3] + ("aaa" if not token.endswith("aaa") else "bbb")
    with pytest.raises(Exception):
        decode_access_token(tampered)


def test_decode_wrong_secret_rejected():
    now = datetime.now(timezone.utc)
    bad = jwt.encode(
        {
            "sub": ADMIN_USERNAME,
            "iat": now,
            "nbf": now,
            "exp": now + timedelta(minutes=5),
        },
        "a-different-secret",
        algorithm=settings.JWT_ALGORITHM,
    )
    with pytest.raises(Exception):
        decode_access_token(bad)


def test_decode_missing_exp_claim_rejected():
    now = datetime.now(timezone.utc)
    token = jwt.encode(
        {"sub": ADMIN_USERNAME, "iat": now, "nbf": now},
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )
    with pytest.raises(Exception):
        decode_access_token(token)


# --------------------------------------------------------------------------- #
# get_current_admin dependency
# --------------------------------------------------------------------------- #
def _creds(token: str) -> HTTPAuthorizationCredentials:
    return HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)


def test_get_current_admin_valid():
    token = create_access_token(subject=ADMIN_USERNAME)
    assert get_current_admin(_creds(token)) == ADMIN_USERNAME


def test_get_current_admin_missing_credentials():
    with pytest.raises(HTTPException) as exc:
        get_current_admin(None)
    assert exc.value.status_code == 401


def test_get_current_admin_empty_token():
    with pytest.raises(HTTPException) as exc:
        get_current_admin(_creds(""))
    assert exc.value.status_code == 401


def test_get_current_admin_invalid_token():
    with pytest.raises(HTTPException) as exc:
        get_current_admin(_creds("garbage.token.value"))
    assert exc.value.status_code == 401


def test_get_current_admin_wrong_subject():
    token = create_access_token(subject="someone-else")
    with pytest.raises(HTTPException) as exc:
        get_current_admin(_creds(token))
    assert exc.value.status_code == 401


# --------------------------------------------------------------------------- #
# Login lockout helpers
# --------------------------------------------------------------------------- #
def test_lockout_after_five_failures():
    ip = "203.0.113.7"
    assert login_lock_remaining(ip) == 0.0
    for _ in range(5):
        register_failed_login(ip)
    assert login_lock_remaining(ip) > 0


def test_reset_clears_lockout():
    ip = "203.0.113.8"
    for _ in range(5):
        register_failed_login(ip)
    assert login_lock_remaining(ip) > 0
    reset_login_attempts(ip)
    assert login_lock_remaining(ip) == 0.0


def test_lockout_helpers_ignore_none_ip():
    register_failed_login(None)
    reset_login_attempts(None)
    assert login_lock_remaining(None) == 0.0


def test_no_lockout_before_threshold():
    ip = "203.0.113.9"
    for _ in range(4):
        register_failed_login(ip)
    assert login_lock_remaining(ip) == 0.0
