#!/usr/bin/env bash
#
# Restore a PostgreSQL dump (created by deploy/backup-db.sh) into the running
# `db` container. Accepts both plain .sql and gzipped .sql.gz dumps.
#
# WARNING: this overwrites/merges into the live database. It prompts for
# confirmation before doing anything destructive.
#
# Usage:  ./deploy/restore-db.sh backups/appdb-20260622-101500.sql.gz
#         make restore FILE=backups/appdb-20260622-101500.sql.gz
set -euo pipefail

# Resolve repo root regardless of where the script is invoked from.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

COMPOSE="docker compose -f docker-compose.prod.yml"
ENV_FILE=".env"

DUMP_FILE="${1:-}"
if [ -z "$DUMP_FILE" ]; then
  echo "Usage: $0 <dump-file.sql|.sql.gz>" >&2
  exit 1
fi
if [ ! -f "$DUMP_FILE" ]; then
  echo "ERROR: dump file '$DUMP_FILE' not found." >&2
  exit 1
fi

# --- Load DB credentials from .env ----------------------------------------
if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: $ENV_FILE not found. Run from the repo root with a configured .env." >&2
  exit 1
fi
# shellcheck disable=SC1091
set -a; . "./$ENV_FILE"; set +a

: "${POSTGRES_USER:?POSTGRES_USER is not set in .env}"
: "${POSTGRES_DB:?POSTGRES_DB is not set in .env}"

# --- Confirmation ----------------------------------------------------------
echo "About to restore '$DUMP_FILE' into database '$POSTGRES_DB'."
echo "This may OVERWRITE existing data. This cannot be undone."
printf "Type 'yes' to continue: "
read -r REPLY
if [ "$REPLY" != "yes" ]; then
  echo "Aborted."
  exit 1
fi

# --- Restore ---------------------------------------------------------------
echo "### Restoring into '$POSTGRES_DB' ..."
# Decompress on the fly when the dump is gzipped; otherwise cat it through.
case "$DUMP_FILE" in
  *.gz) DECOMP="gzip -dc" ;;
  *)    DECOMP="cat" ;;
esac

$DECOMP "$DUMP_FILE" | $COMPOSE exec -T db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"

echo "### Restore complete."
