#!/usr/bin/env bash
#
# Obtain the FIRST Let's Encrypt certificate for this stack.
#
# nginx refuses to start if the certificate referenced in its config does not
# exist yet — a chicken-and-egg problem. This script breaks the loop:
#   1. create a temporary self-signed "dummy" cert so nginx can boot,
#   2. start the proxy (which serves the ACME webroot challenge),
#   3. delete the dummy and request the REAL cert via the webroot plugin,
#   4. reload nginx so it picks up the real certificate.
#
# Run this ONCE, after your domain's A record points at this server and ports
# 80/443 are open. Afterwards the `certbot` service handles auto-renewal.
#
# Usage:  ./deploy/init-letsencrypt.sh
set -euo pipefail

# --- Configuration --------------------------------------------------------
# SERVER_NAME and EMAIL are read from .env if present; override here if needed.
DOMAIN="${SERVER_NAME:-}"
EMAIL="${CERTBOT_EMAIL:-}"      # e.g. you@example.com (used for renewal notices)
STAGING=0                       # set to 1 to use Let's Encrypt's staging CA
                                # (avoids rate limits while testing)

COMPOSE="docker compose -f docker-compose.prod.yml"
DATA_PATH="./deploy/certbot"
RSA_KEY_SIZE=4096

# --- Load .env so SERVER_NAME / CERTBOT_EMAIL can come from there ----------
if [ -f .env ]; then
  # shellcheck disable=SC1091
  set -a; . ./.env; set +a
  DOMAIN="${DOMAIN:-$SERVER_NAME}"
  EMAIL="${EMAIL:-${CERTBOT_EMAIL:-}}"
fi

if [ -z "$DOMAIN" ]; then
  echo "ERROR: SERVER_NAME is not set. Set it in .env or export it." >&2
  exit 1
fi

echo "### Setting up HTTPS for: $DOMAIN"

# --- Step 1: download recommended TLS params ------------------------------
if [ ! -e "$DATA_PATH/conf/options-ssl-nginx.conf" ] || \
   [ ! -e "$DATA_PATH/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  mkdir -p "$DATA_PATH/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf \
    > "$DATA_PATH/conf/options-ssl-nginx.conf" || true
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem \
    > "$DATA_PATH/conf/ssl-dhparams.pem" || true
fi

# --- Step 2: create a dummy certificate so nginx can start ----------------
CERT_PATH="/etc/letsencrypt/live/$DOMAIN"
echo "### Creating dummy certificate for $DOMAIN ..."
mkdir -p "$DATA_PATH/conf/live/$DOMAIN"
$COMPOSE run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:$RSA_KEY_SIZE -days 1 \
    -keyout '$CERT_PATH/privkey.pem' \
    -out '$CERT_PATH/fullchain.pem' \
    -subj '/CN=localhost'" certbot

# --- Step 3: start the proxy with the dummy cert --------------------------
echo "### Starting nginx proxy ..."
$COMPOSE up --force-recreate -d proxy

# --- Step 4: remove the dummy certificate ---------------------------------
echo "### Deleting dummy certificate for $DOMAIN ..."
$COMPOSE run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/$DOMAIN && \
  rm -Rf /etc/letsencrypt/archive/$DOMAIN && \
  rm -Rf /etc/letsencrypt/renewal/$DOMAIN.conf" certbot

# --- Step 5: request the real certificate ---------------------------------
echo "### Requesting Let's Encrypt certificate for $DOMAIN ..."

# Build optional flags.
email_arg="--register-unsafely-without-email"
if [ -n "$EMAIL" ]; then
  email_arg="--email $EMAIL"
fi

staging_arg=""
if [ "$STAGING" != "0" ]; then
  staging_arg="--staging"
fi

$COMPOSE run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $email_arg \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --rsa-key-size $RSA_KEY_SIZE \
    --agree-tos \
    --no-eff-email \
    --force-renewal" certbot

# --- Step 6: reload nginx with the real certificate -----------------------
echo "### Reloading nginx ..."
$COMPOSE exec proxy nginx -s reload

echo "### Done. HTTPS is now active for https://$DOMAIN"
