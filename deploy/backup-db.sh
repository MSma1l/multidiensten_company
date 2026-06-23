#!/usr/bin/env bash
#
# Back up the production PostgreSQL database to a timestamped, gzipped dump.
#
# Runs `pg_dump` INSIDE the running `db` container (no psql client needed on the
# host) and streams the output to ./backups/ on the host. Credentials are read
# from the root .env file (POSTGRES_USER / POSTGRES_DB).
#
# Usage:  ./deploy/backup-db.sh
#         make backup
set -euo pipefail

# Resolve repo root regardless of where the script is invoked from.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

COMPOSE="docker compose -f docker-compose.prod.yml"
ENV_FILE=".env"
BACKUP_DIR="backups"

# --- Load DB credentials from .env ----------------------------------------
if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: $ENV_FILE not found. Run from the repo root with a configured .env." >&2
  exit 1
fi
# shellcheck disable=SC1091
set -a; . "./$ENV_FILE"; set +a

: "${POSTGRES_USER:?POSTGRES_USER is not set in .env}"
: "${POSTGRES_DB:?POSTGRES_DB is not set in .env}"

# --- Produce the dump ------------------------------------------------------
mkdir -p "$BACKUP_DIR"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
OUTFILE="$BACKUP_DIR/${POSTGRES_DB}-${TIMESTAMP}.sql.gz"

echo "### Dumping database '$POSTGRES_DB' as user '$POSTGRES_USER' ..."
# -T disables pseudo-TTY allocation so the stream stays clean for redirection.
$COMPOSE exec -T db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip > "$OUTFILE"

echo "### Backup written to: $OUTFILE"
echo "### Size: $(du -h "$OUTFILE" | cut -f1)"
