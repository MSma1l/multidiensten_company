# Multidiensten Company

A bilingual (NL/EN) recruitment website. The frontend is a Vite + React single
page app; the backend is a Python/FastAPI service backed by PostgreSQL that
receives Contact form submissions and exposes a secret admin panel to review
them.

## Architecture

| Component   | Stack                          | Default URL                                     |
| ----------- | ------------------------------ | ----------------------------------------------- |
| Frontend    | Vite + React                   | http://localhost:8080 (Docker)                  |
| Backend API | Python + FastAPI + PostgreSQL  | http://localhost:8000                           |
| Admin panel | FastAPI (JWT-protected)        | http://localhost:8000/panel-ec490bc3fb279313    |

The Contact form (`src/pages/Contact/Contact.jsx`) validates input client-side
and then `POST`s it to `{VITE_API_URL}/api/contact`.

## Run everything with Docker

This is the easiest way to start the whole stack (frontend, backend and
database) at once:

```bash
docker compose up --build
```

Once the containers are healthy:

- Frontend: http://localhost:8080
- Backend API: http://localhost:8000
- Admin panel: http://localhost:8000/panel-ec490bc3fb279313

Configuration (database credentials, admin login, JWT secret and the secret
admin URL slug) is read from a root `.env` file. Copy the provided example and
adjust the values before starting:

```bash
cp .env.example .env   # if an example file is provided
```

## Local development

Run the frontend on its own with Vite's dev server (hot reload):

```bash
npm install
npm run dev
```

The dev server serves the app at http://localhost:5173. The backend is **not**
started by `npm run dev` — run it separately (see below) or via Docker.

The frontend reads the backend base URL from the `VITE_API_URL` environment
variable. For local dev this defaults to `http://localhost:8000` via the
committed `.env.development` file. If `VITE_API_URL` is unset, the Contact form
falls back to optimistic success (it shows the confirmation without a backend),
which keeps unit tests and design previews working without an API.

### Tests

```bash
npm test          # run the vitest suite once
npm run test:watch
```

## Admin panel

The admin panel is intentionally mounted under a hard-to-guess secret URL slug
rather than the obvious `/admin`. The slug is the `ADMIN_PATH` value from
`.env` (e.g. `panel-ec490bc3fb279313`), so the full URL is:

```
http://localhost:8000/<ADMIN_PATH>
```

Login credentials come from `.env` as well (`ADMIN_USERNAME` /
`ADMIN_PASSWORD`). Change all of these — the secret slug, the credentials and
`JWT_SECRET` — before deploying.

## Backend

The backend is a **Python + FastAPI** application using **PostgreSQL** for
storage. Key characteristics:

- **JWT authentication** protects the admin panel and any privileged endpoints.
- **Server-side validation** on every submission: required fields, length
  limits, and protection against XSS and SQL-injection style payloads. The
  public `POST /api/contact` endpoint returns `201` with `{id, message}` on
  success and `422` with a `detail` field on validation failure.
- **Environment-based config** (`backend/app/config.py`) via
  `pydantic-settings`: database connection, admin credentials, the secret
  `ADMIN_PATH` slug, JWT settings and CORS origins are all read from the
  environment / `.env`.
</content>
</invoke>
