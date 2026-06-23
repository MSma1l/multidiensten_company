#!/usr/bin/env bash
#
# Pre-deployment sanity check for the root .env file.
#
# Mirrors the backend's fail-fast secret validation (see backend/app/config.py)
# so misconfiguration is caught BEFORE building/starting containers rather than
# crash-looping the backend. Prints PASS/FAIL lines and exits non-zero if any
# check fails.
#
# Usage:  ./deploy/preflight.sh
#         make preflight
set -uo pipefail

# Resolve repo root regardless of where the script is invoked from.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

ENV_FILE=".env"

# --- Colors (disabled when not a TTY) -------------------------------------
if [ -t 1 ]; then
  RED="$(printf '\033[31m')"; GREEN="$(printf '\033[32m')"
  YELLOW="$(printf '\033[33m')"; RESET="$(printf '\033[0m')"
else
  RED=""; GREEN=""; YELLOW=""; RESET=""
fi

FAILED=0

pass() { printf "%s  PASS%s  %s\n" "$GREEN" "$RESET" "$1"; }
fail() { printf "%s  FAIL%s  %s\n" "$RED" "$RESET" "$1"; FAILED=1; }
warn() { printf "%s  WARN%s  %s\n" "$YELLOW" "$RESET" "$1"; }

# --- Load .env -------------------------------------------------------------
if [ ! -f "$ENV_FILE" ]; then
  fail ".env not found — copy .env.example to .env and fill it in."
  exit 1
fi
# shellcheck disable=SC1091
set -a; . "./$ENV_FILE"; set +a

echo "Preflight check for $ENV_FILE"
echo "----------------------------------------"

# --- 1. Required variables present and non-empty ---------------------------
REQUIRED_VARS="POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DB \
ADMIN_USERNAME ADMIN_PASSWORD ADMIN_PATH JWT_SECRET CORS_ORIGINS SERVER_NAME"

for var in $REQUIRED_VARS; do
  # Indirect expansion; empty if unset.
  value="${!var:-}"
  if [ -z "$value" ]; then
    fail "$var is missing or empty."
  else
    pass "$var is set."
  fi
done

# --- 2. JWT_SECRET strength (>= 32 chars, not a placeholder) ---------------
jwt="$(printf '%s' "${JWT_SECRET:-}" | tr '[:upper:]' '[:lower:]')"
case "$jwt" in
  ""|"change-this-secret-in-production"|"changeme"|"secret"|"changethis"|\
"your-secret-key"|"generate-a-long-random-secret")
    fail "JWT_SECRET is a known placeholder — generate one (openssl rand -hex 32)." ;;
  *)
    if [ "${#JWT_SECRET}" -lt 32 ]; then
      fail "JWT_SECRET is too short (${#JWT_SECRET} chars); need >= 32."
    else
      pass "JWT_SECRET is strong (${#JWT_SECRET} chars)."
    fi ;;
esac

# --- 3. ADMIN_PASSWORD strength (>= 8 chars, not a placeholder) ------------
adminpw="$(printf '%s' "${ADMIN_PASSWORD:-}" | tr '[:upper:]' '[:lower:]')"
case "$adminpw" in
  ""|"changeme"|"password"|"admin"|"secret"|"change-me-strong-password")
    fail "ADMIN_PASSWORD is a known placeholder — set a strong, unique value." ;;
  *)
    if [ "${#ADMIN_PASSWORD}" -lt 8 ]; then
      fail "ADMIN_PASSWORD is too short (${#ADMIN_PASSWORD} chars); need >= 8."
    else
      pass "ADMIN_PASSWORD is strong (${#ADMIN_PASSWORD} chars)."
    fi ;;
esac

# --- 4. POSTGRES_PASSWORD not a known placeholder --------------------------
pgpw="$(printf '%s' "${POSTGRES_PASSWORD:-}" | tr '[:upper:]' '[:lower:]')"
case "$pgpw" in
  ""|"apppassword"|"postgres"|"password"|"changeme"|"change-me-strong-password")
    fail "POSTGRES_PASSWORD is a known placeholder — set a strong, unique value." ;;
  *)
    pass "POSTGRES_PASSWORD is not a placeholder." ;;
esac

# --- 5. ADMIN_PATH not the literal 'admin' or a placeholder ----------------
adminpath="$(printf '%s' "${ADMIN_PATH:-}" | tr '[:upper:]' '[:lower:]')"
case "$adminpath" in
  ""|"admin"|"panel-<random>"|"your-secret-admin-path")
    fail "ADMIN_PATH is the default/placeholder — use a secret slug (panel-\$(openssl rand -hex 8))." ;;
  *)
    pass "ADMIN_PATH looks customized." ;;
esac

# --- 6. ENABLE_DOCS warning ------------------------------------------------
docs="$(printf '%s' "${ENABLE_DOCS:-false}" | tr '[:upper:]' '[:lower:]')"
if [ "$docs" = "true" ]; then
  warn "ENABLE_DOCS=true exposes /api/docs and would leak the secret ADMIN_PATH. Set it false in production."
else
  pass "ENABLE_DOCS is off."
fi

# --- 7. Domain placeholders -----------------------------------------------
case "${SERVER_NAME:-}" in
  *yourdomain.com*) warn "SERVER_NAME still contains 'yourdomain.com' — set your real domain." ;;
  *) [ -n "${SERVER_NAME:-}" ] && pass "SERVER_NAME is customized." ;;
esac
case "${CORS_ORIGINS:-}" in
  *yourdomain.com*) warn "CORS_ORIGINS still contains 'yourdomain.com' — set your real HTTPS origin." ;;
  *localhost*)      warn "CORS_ORIGINS points at localhost — set your real HTTPS origin for production." ;;
  *) [ -n "${CORS_ORIGINS:-}" ] && pass "CORS_ORIGINS is customized." ;;
esac

echo "----------------------------------------"
if [ "$FAILED" -ne 0 ]; then
  printf "%sPreflight FAILED%s — fix the items above before deploying.\n" "$RED" "$RESET"
  exit 1
fi
printf "%sPreflight PASSED%s — safe to deploy.\n" "$GREEN" "$RESET"
