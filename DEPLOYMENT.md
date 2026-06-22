# Production Deployment Guide

How to deploy the Multidiensten website on a Linux server with Docker, a single
nginx reverse proxy, and free HTTPS certificates from Let's Encrypt.

---

## 1. Overview & architecture

In production a single **nginx reverse proxy** is the only thing exposed to the
internet (ports 80 and 443). It terminates HTTPS and forwards traffic to the
internal services over Docker's private network:

- `/api/...` and the secret admin path go to the **backend** (FastAPI).
- Everything else goes to the **frontend** (the React SPA, served by nginx).

The backend stores contact submissions in **PostgreSQL** and saves uploaded CV
files in a persistent **uploads** volume.

```
                       Internet
                          |
                  80/443  |   (the only published ports)
                          v
                +-------------------+
                |   proxy (nginx)   |  TLS termination, ${SERVER_NAME}
                +---------+---------+
                          |
          /api/  +  /<ADMIN_PATH>      everything else
                 |                         |
                 v                         v
           +-----------+            +-------------+
           |  backend  |            |  frontend   |
           | (FastAPI) |            | (React SPA) |
           +-----+-----+            +-------------+
                 |
        +--------+--------+
        |                 |
        v                 v
   +---------+      +-------------+
   |   db    |      |  uploads    |   (CV files, named volume)
   | Postgres|      |  volume     |
   +---------+      +-------------+

   certbot  ----> renews the TLS certificate every 12h
```

Only the proxy publishes host ports. `backend`, `frontend` and `db` are private.

---

## 2. Prerequisites

- A **Linux server** (Ubuntu 22.04+ recommended) with root/sudo access.
- A **domain name** with a DNS **A record** pointing to the server's public IP
  (e.g. `yourdomain.com -> 203.0.113.10`). HTTPS issuance requires this.
- **Ports 80 and 443 open** in any firewall / cloud security group.

---

## 3. Install Docker & the Compose plugin (Ubuntu)

```bash
# Install Docker Engine + Compose plugin from Docker's official repository
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin

# (Optional) run docker without sudo — log out/in afterwards
sudo usermod -aG docker "$USER"

# Verify
docker --version
docker compose version
```

---

## 4. Get the code and configure `.env`

```bash
git clone <your-repo-url> multidiensten_company
cd multidiensten_company
cp .env.example .env
```

Edit `.env` and set **every** variable. Below is what each one means.

```ini
# --- PostgreSQL ---
POSTGRES_USER=appuser
POSTGRES_PASSWORD=<strong-password>
POSTGRES_DB=appdb
POSTGRES_HOST=db          # leave as "db" (the compose service name)
POSTGRES_PORT=5432

# --- Admin panel access ---
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<strong-password>
ADMIN_PATH=panel-<random>     # secret URL slug, see below

# --- JWT ---
JWT_SECRET=<long-random-secret>
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60

# --- CORS: set to your HTTPS domain ---
CORS_ORIGINS=https://yourdomain.com

# --- Production deployment ---
SERVER_NAME=yourdomain.com         # your real domain (no protocol)
CERTBOT_EMAIL=you@example.com      # for certificate expiry notices
```

**Generate strong secrets** — never reuse the example values:

```bash
# Strong passwords / JWT secret
openssl rand -hex 32

# A secret, hard-to-guess admin path
echo "panel-$(openssl rand -hex 8)"
```

Notes:

- `SERVER_NAME` must be the bare domain (e.g. `yourdomain.com`), no `https://`.
- `CORS_ORIGINS` must match the public HTTPS origin exactly.
- The admin panel lives at `/<ADMIN_PATH>` — keep this value private.

---

## 5. First run, then enable HTTPS

### 5a. (Optional) test over HTTP first

You can confirm the containers build and run before touching certificates.
Bring everything up; the proxy will still try to redirect to HTTPS, but you can
check the services are healthy:

```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f backend
```

Then stop again before issuing certificates:

```bash
docker compose -f docker-compose.prod.yml down
```

### 5b. Issue the first certificate

1. Make sure DNS for `SERVER_NAME` points at this server and ports 80/443 are
   open.
2. Run the one-time bootstrap script. It creates a temporary self-signed cert so
   nginx can start, serves the ACME challenge, then requests the real
   certificate and reloads nginx:

   ```bash
   ./deploy/init-letsencrypt.sh
   ```

   Tip: while testing, edit the top of the script and set `STAGING=1` to use
   Let's Encrypt's staging environment (avoids hitting rate limits). Set it back
   to `0` and re-run once everything works.

3. Bring up the full stack:

   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```

That's it — the site is now live over HTTPS.

---

## 6. How to reach things

| What            | URL                                      |
| --------------- | ---------------------------------------- |
| Website (SPA)   | `https://yourdomain.com`                 |
| Admin panel     | `https://yourdomain.com/<ADMIN_PATH>`    |
| API health      | `https://yourdomain.com/api/health`      |

Quick check from anywhere:

```bash
curl -i https://yourdomain.com/api/health
```

---

## 7. Certificate auto-renewal

The `certbot` service runs continuously and attempts renewal every 12 hours;
Let's Encrypt certificates are renewed automatically when they are within 30
days of expiry. The nginx proxy reloads on its normal restart cycle and picks up
renewed certificates.

Test renewal without actually issuing a certificate:

```bash
docker compose -f docker-compose.prod.yml run --rm certbot renew --dry-run
```

---

## 8. Maintenance

**View logs**

```bash
docker compose -f docker-compose.prod.yml logs -f            # all services
docker compose -f docker-compose.prod.yml logs -f proxy      # just the proxy
docker compose -f docker-compose.prod.yml logs -f backend    # just the API
```

**Update / redeploy**

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

**Database backup**

```bash
# Dump to a file on the host (reads creds from .env)
docker compose -f docker-compose.prod.yml exec -T db \
  pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > backup-$(date +%F).sql

# Restore
cat backup-YYYY-MM-DD.sql | docker compose -f docker-compose.prod.yml exec -T db \
  psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
```

**Uploaded CV files** are kept in the `uploads` Docker volume (mounted at
`/app/uploads` inside the backend). They survive restarts and redeploys. To back
them up:

```bash
docker run --rm -v multidiensten_company_uploads:/data -v "$PWD":/backup \
  alpine tar czf /backup/uploads-$(date +%F).tar.gz -C /data .
```

(Volume name is `<project>_uploads`; confirm with `docker volume ls`.)

**Stop / start**

```bash
docker compose -f docker-compose.prod.yml down     # stop (keeps volumes/data)
docker compose -f docker-compose.prod.yml up -d    # start again
```

---

## 9. Security checklist

- [ ] **Firewall**: allow only what you need.
      ```bash
      sudo ufw allow OpenSSH
      sudo ufw allow 80/tcp
      sudo ufw allow 443/tcp
      sudo ufw enable
      ```
- [ ] **Strong secrets**: generate `POSTGRES_PASSWORD`, `ADMIN_PASSWORD` and
      `JWT_SECRET` with `openssl rand -hex 32`. Never ship the example values.
- [ ] **Keep `ADMIN_PATH` secret** — it is the only obscurity layer in front of
      the admin login. Use a random slug (`panel-$(openssl rand -hex 8)`).
- [ ] **Never commit `.env`** — it holds all secrets. Confirm it is gitignored.
- [ ] **HTTPS only** — the proxy redirects all HTTP traffic to HTTPS; keep it
      that way.
- [ ] The backend, frontend and database are **not published** to the host — only
      the proxy is. Don't add host port mappings for them in production.
