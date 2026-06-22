"""Application entry point: FastAPI app factory and configuration."""

from __future__ import annotations

import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import settings, validate_secrets
from .database import init_db
from .routers.admin import build_admin_router
from .routers.contact import router as contact_router
from .routers.jobs import router as jobs_router

# Content-Security-Policy for the self-contained admin SPA. Inline styles and
# scripts are permitted because the panel is a single self-hosted HTML file.
_ADMIN_CSP = (
    "default-src 'self'; "
    "style-src 'self' 'unsafe-inline'; "
    "script-src 'self' 'unsafe-inline'; "
    "img-src 'self' data:; "
    "connect-src 'self'"
)

logger = logging.getLogger("uvicorn.error")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialise the database schema and upload directory on startup."""
    logger.info("Initialising database schema...")
    init_db()
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    logger.info("Upload directory ready at %s", settings.UPLOAD_DIR)
    logger.info("Database ready. Admin panel mounted at %s", settings.admin_prefix)
    yield
    # No teardown actions required.


def create_app() -> FastAPI:
    """Application factory: build and configure the FastAPI instance."""
    # Fail-fast: refuse to start with missing / placeholder / weak secrets.
    validate_secrets(settings)

    # Interactive docs and the OpenAPI schema are disabled by default. Leaving
    # them enabled would expose the secret ADMIN_PATH (the admin routes are in
    # the schema) to any unauthenticated client hitting /api/openapi.json.
    docs_kwargs: dict[str, str | None] = (
        {
            "docs_url": "/api/docs",
            "redoc_url": "/api/redoc",
            "openapi_url": "/api/openapi.json",
        }
        if settings.ENABLE_DOCS
        else {"docs_url": None, "redoc_url": None, "openapi_url": None}
    )

    app = FastAPI(
        title="Multidiensten Company API",
        description="Backend API for the company website and admin panel.",
        version="1.0.0",
        lifespan=lifespan,
        **docs_kwargs,
    )

    # ------------------------------------------------------------------ #
    # CORS — restricted to the configured front-end origins.
    # ------------------------------------------------------------------ #
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    # ------------------------------------------------------------------ #
    # Security headers (applied to every response).
    # ------------------------------------------------------------------ #
    admin_prefix = settings.admin_prefix

    @app.middleware("http")
    async def security_headers(request: Request, call_next):
        """Attach hardening headers; CSP for the admin HTML, no-store for its API."""
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "no-referrer"
        response.headers["X-XSS-Protection"] = "0"

        path = request.url.path
        if path == admin_prefix or path.startswith(admin_prefix + "/"):
            if "/api/" in path or path.endswith("/api"):
                # Admin JSON API: never cache potentially sensitive data.
                response.headers["Cache-Control"] = "no-store"
            else:
                # Admin SPA HTML page.
                response.headers["Content-Security-Policy"] = _ADMIN_CSP
        return response

    # ------------------------------------------------------------------ #
    # Routers
    # ------------------------------------------------------------------ #
    app.include_router(contact_router)
    app.include_router(jobs_router)
    app.include_router(build_admin_router(settings))

    # ------------------------------------------------------------------ #
    # Consistent validation error shape with a clear ``detail`` message.
    # ------------------------------------------------------------------ #
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        """Return a flattened, human-readable 422 response.

        ``detail`` is a single readable string (first error) while ``errors``
        retains the full structured list for programmatic clients.
        """
        raw_errors = exc.errors()
        first_message = "Invalid input."
        # Build a JSON-safe error list: pydantic v2 puts a non-serialisable
        # ValueError object in ``ctx``, which would break JSONResponse, so we
        # drop ``ctx`` and keep only the readable fields.
        safe_errors = []
        for err in raw_errors:
            safe_errors.append(
                {
                    "loc": [str(p) for p in err.get("loc", [])],
                    "msg": err.get("msg", "Invalid value.").replace("Value error, ", ""),
                    "type": err.get("type", "value_error"),
                }
            )
        if safe_errors:
            err = safe_errors[0]
            loc = ".".join(p for p in err["loc"] if p != "body")
            first_message = f"{loc}: {err['msg']}" if loc else err["msg"]

        return JSONResponse(
            status_code=422,
            content={"detail": first_message, "errors": safe_errors},
        )

    return app


# ASGI application object used by uvicorn (``uvicorn app.main:app``).
app = create_app()
