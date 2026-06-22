"""Authentication & authorization helpers (JWT + password hashing)."""

from __future__ import annotations

import time
import uuid
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from .config import settings


# ---------------------------------------------------------------------------- #
# Trusted client IP resolution
# ---------------------------------------------------------------------------- #
def client_ip(request: Request) -> str | None:
    """Return the trusted originating client IP.

    Security note: the left-most ``X-Forwarded-For`` hop is fully
    client-controlled and must NOT be trusted — an attacker could rotate it to
    sidestep the per-IP login lockout. The reverse proxy (nginx) sets
    ``X-Real-IP`` to ``$remote_addr`` (the real TCP peer), so we prefer that and
    otherwise fall back to the direct socket peer. ``X-Forwarded-For`` is
    intentionally ignored here.
    """
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()
    return request.client.host if request.client else None

# ---------------------------------------------------------------------------- #
# Password hashing
# ---------------------------------------------------------------------------- #
# The configured admin password is hashed once at startup (see ``_ADMIN_HASH``)
# and every login attempt is verified against that hash — the plaintext is
# never compared directly.
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    # Explicit cost factor (work factor) of 12 rounds.
    bcrypt__rounds=12,
)

# bcrypt only considers the first 72 bytes; truncate defensively to avoid the
# backend raising on longer secrets.
_ADMIN_HASH: str = pwd_context.hash(settings.ADMIN_PASSWORD[:72])


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Return ``True`` if *plain_password* matches *hashed_password*."""
    try:
        return pwd_context.verify(plain_password[:72], hashed_password)
    except ValueError:
        # Raised by passlib for malformed hashes; treat as a failed match.
        return False


def authenticate_admin(username: str, password: str) -> bool:
    """Validate admin credentials against the configured values."""
    username_ok = username == settings.ADMIN_USERNAME
    password_ok = verify_password(password, _ADMIN_HASH)
    # Evaluate both regardless of order to reduce trivial timing leaks.
    return username_ok and password_ok


# ---------------------------------------------------------------------------- #
# JWT helpers
# ---------------------------------------------------------------------------- #


def create_access_token(subject: str, expires_minutes: int | None = None) -> str:
    """Create a signed JWT for *subject* (the admin username).

    The token carries hardened claims: issued-at (``iat``), not-before
    (``nbf``), expiry (``exp``) and a random unique token id (``jti``).
    """
    expire_minutes = (
        expires_minutes if expires_minutes is not None else settings.JWT_EXPIRE_MINUTES
    )
    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "iat": now,
        "nbf": now,
        "exp": now + timedelta(minutes=expire_minutes),
        "jti": uuid.uuid4().hex,
        "type": "access",
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    """Decode and validate a JWT, raising ``JWTError`` on any problem.

    Expiry (``exp``) and not-before (``nbf``) are required and verified.
    """
    return jwt.decode(
        token,
        settings.JWT_SECRET,
        algorithms=[settings.JWT_ALGORITHM],
        options={
            "require_exp": True,
            "require_nbf": True,
            "verify_exp": True,
            "verify_nbf": True,
        },
    )


# ---------------------------------------------------------------------------- #
# Login rate limiting / lockout (per client IP, in-process)
# ---------------------------------------------------------------------------- #
# NOTE: this state lives in process memory only — it is reset on restart and is
# not shared across multiple workers. It provides a pragmatic brute-force speed
# bump for the single-admin panel, not a distributed guarantee.

_LOGIN_MAX_ATTEMPTS = 5
_LOGIN_LOCKOUT_SECONDS = 15 * 60  # 15 minutes

# ip -> {"failures": int, "locked_until": float (monotonic seconds)}
_login_attempts: dict[str, dict[str, float]] = {}


def login_lock_remaining(ip: str | None) -> float:
    """Return the remaining lockout time in seconds for *ip* (0 if unlocked)."""
    if not ip:
        return 0.0
    entry = _login_attempts.get(ip)
    if not entry:
        return 0.0
    remaining = entry.get("locked_until", 0.0) - time.monotonic()
    return remaining if remaining > 0 else 0.0


def register_failed_login(ip: str | None) -> None:
    """Record a failed login for *ip*, locking it once the threshold is hit."""
    if not ip:
        return
    entry = _login_attempts.setdefault(ip, {"failures": 0.0, "locked_until": 0.0})
    entry["failures"] += 1
    if entry["failures"] >= _LOGIN_MAX_ATTEMPTS:
        entry["locked_until"] = time.monotonic() + _LOGIN_LOCKOUT_SECONDS
        # Reset the counter so the next window starts fresh after the lockout.
        entry["failures"] = 0.0


def reset_login_attempts(ip: str | None) -> None:
    """Clear all failure / lockout state for *ip* (called on a successful login)."""
    if ip:
        _login_attempts.pop(ip, None)


# ---------------------------------------------------------------------------- #
# FastAPI dependency
# ---------------------------------------------------------------------------- #

# ``auto_error=False`` lets us return a consistent 401 (with WWW-Authenticate)
# instead of FastAPI's default 403 when the header is missing.
_bearer_scheme = HTTPBearer(auto_error=False)

_CREDENTIALS_EXCEPTION = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials.",
    headers={"WWW-Authenticate": "Bearer"},
)


def get_current_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
) -> str:
    """Resolve the current admin username from a Bearer token.

    Raises ``401`` if the token is missing, malformed, expired, or does not
    correspond to the configured admin user.
    """
    if credentials is None or not credentials.credentials:
        raise _CREDENTIALS_EXCEPTION

    try:
        payload = decode_access_token(credentials.credentials)
    except JWTError as exc:
        # Re-raise a generic 401; the underlying reason is intentionally not leaked.
        raise _CREDENTIALS_EXCEPTION from exc

    username = payload.get("sub")
    if not username or username != settings.ADMIN_USERNAME:
        raise _CREDENTIALS_EXCEPTION

    return username
