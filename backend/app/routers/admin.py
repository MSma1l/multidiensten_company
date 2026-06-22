"""Admin router mounted under the secret ``ADMIN_PATH`` slug.

The router is built by :func:`build_admin_router` at application-creation time
so that the prefix can be derived dynamically from settings (e.g.
``/panel-ec490bc3fb279313``). It serves the single-file admin SPA and the
JWT-protected JSON API used by that SPA.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import FileResponse, HTMLResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..config import Settings
from ..database import get_db
from ..models import ContactSubmission, Job
from ..schemas import (
    JobCreate,
    LoginRequest,
    MeResponse,
    SubmissionOut,
    TokenResponse,
    job_to_admin,
)
from ..security import (
    authenticate_admin,
    create_access_token,
    get_current_admin,
    login_lock_remaining,
    register_failed_login,
    reset_login_attempts,
)


def _client_ip(request: Request) -> str | None:
    """Best-effort extraction of the originating client IP (proxy-aware)."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else None

# Location of the single-file admin SPA.
_ADMIN_HTML_PATH = Path(__file__).resolve().parent.parent / "static" / "admin.html"


def _load_admin_html() -> str:
    """Read the admin SPA from disk (raises a clear error if it is missing)."""
    try:
        return _ADMIN_HTML_PATH.read_text(encoding="utf-8")
    except FileNotFoundError:  # pragma: no cover - configuration error
        return "<h1>Admin panel asset not found.</h1>"


def build_admin_router(settings: Settings) -> APIRouter:
    """Construct the admin ``APIRouter`` using the configured secret prefix."""
    router = APIRouter(prefix=settings.admin_prefix, tags=["admin"])

    # ------------------------------------------------------------------ #
    # Admin SPA (HTML)
    # ------------------------------------------------------------------ #
    @router.get("", include_in_schema=False)
    @router.get("/", include_in_schema=False)
    def admin_panel() -> HTMLResponse:
        """Serve the self-contained admin dashboard."""
        return HTMLResponse(content=_load_admin_html())

    # ------------------------------------------------------------------ #
    # Auth
    # ------------------------------------------------------------------ #
    @router.post("/api/login", response_model=TokenResponse, summary="Admin login")
    def login(credentials: LoginRequest, request: Request) -> TokenResponse:
        """Validate admin credentials and issue a JWT access token.

        Failed attempts are rate limited per client IP: after 5 failures the IP
        is locked out for 15 minutes (HTTP 429). A successful login resets the
        counter. Error messages stay generic to avoid user enumeration.
        """
        ip = _client_ip(request)

        remaining = login_lock_remaining(ip)
        if remaining > 0:
            minutes = int(remaining // 60) + 1
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=(
                    "Too many failed login attempts. "
                    f"Try again in about {minutes} minute(s)."
                ),
                headers={"Retry-After": str(int(remaining))},
            )

        if not authenticate_admin(credentials.username, credentials.password):
            register_failed_login(ip)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        reset_login_attempts(ip)
        token = create_access_token(subject=credentials.username)
        return TokenResponse(access_token=token)

    @router.get("/api/me", response_model=MeResponse, summary="Current admin")
    def me(current_admin: str = Depends(get_current_admin)) -> MeResponse:
        """Return the identity of the authenticated admin."""
        return MeResponse(username=current_admin)

    # ------------------------------------------------------------------ #
    # Submissions (protected)
    # ------------------------------------------------------------------ #
    @router.get(
        "/api/submissions",
        response_model=list[SubmissionOut],
        summary="List all submissions (newest first)",
    )
    def list_submissions(
        db: Session = Depends(get_db),
        current_admin: str = Depends(get_current_admin),
    ) -> list[ContactSubmission]:
        stmt = select(ContactSubmission).order_by(ContactSubmission.created_at.desc())
        return list(db.execute(stmt).scalars().all())

    @router.get(
        "/api/submissions/{submission_id}",
        response_model=SubmissionOut,
        summary="Get a single submission",
    )
    def get_submission(
        submission_id: int,
        db: Session = Depends(get_db),
        current_admin: str = Depends(get_current_admin),
    ) -> ContactSubmission:
        submission = db.get(ContactSubmission, submission_id)
        if submission is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Submission not found.",
            )
        return submission

    @router.delete(
        "/api/submissions/{submission_id}",
        summary="Delete a submission",
    )
    def delete_submission(
        submission_id: int,
        db: Session = Depends(get_db),
        current_admin: str = Depends(get_current_admin),
    ) -> dict:
        submission = db.get(ContactSubmission, submission_id)
        if submission is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Submission not found.",
            )
        db.delete(submission)
        db.commit()
        return {"status": "deleted", "id": submission_id}

    @router.get(
        "/api/submissions/{submission_id}/cv",
        summary="Download a submission's CV attachment",
    )
    def download_submission_cv(
        submission_id: int,
        db: Session = Depends(get_db),
        current_admin: str = Depends(get_current_admin),
    ) -> FileResponse:
        submission = db.get(ContactSubmission, submission_id)
        if (
            submission is None
            or not submission.cv_path
            or not os.path.exists(submission.cv_path)
        ):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No CV available for this submission.",
            )
        return FileResponse(
            submission.cv_path,
            filename=submission.cv_filename or os.path.basename(submission.cv_path),
        )

    # ------------------------------------------------------------------ #
    # Jobs (protected, full structured records)
    # ------------------------------------------------------------------ #
    @router.get("/api/jobs", summary="List all jobs (admin)")
    def admin_list_jobs(
        db: Session = Depends(get_db),
        current_admin: str = Depends(get_current_admin),
    ) -> list[dict[str, Any]]:
        stmt = select(Job).order_by(Job.created_at.desc())
        jobs = db.execute(stmt).scalars().all()
        return [job_to_admin(job) for job in jobs]

    @router.post(
        "/api/jobs",
        status_code=status.HTTP_201_CREATED,
        summary="Create a job",
    )
    def admin_create_job(
        payload: JobCreate,
        db: Session = Depends(get_db),
        current_admin: str = Depends(get_current_admin),
    ) -> dict[str, Any]:
        job = Job(
            title_nl=payload.titleNl,
            title_en=payload.titleEn,
            description_nl=payload.descriptionNl,
            description_en=payload.descriptionEn,
            salary_type=payload.salaryType,
            salary_min=payload.salaryMin,
            salary_max=payload.salaryMax,
            salary_amount=payload.salaryAmount,
            salary_range=payload.salaryRange,
            experience_years=payload.experienceYears,
            level=payload.level,
            hours_per_week=payload.hoursPerWeek,
            location=payload.location,
            company=payload.company,
        )
        db.add(job)
        db.commit()
        db.refresh(job)
        return job_to_admin(job)

    @router.put("/api/jobs/{job_id}", summary="Update a job")
    def admin_update_job(
        job_id: int,
        payload: JobCreate,
        db: Session = Depends(get_db),
        current_admin: str = Depends(get_current_admin),
    ) -> dict[str, Any]:
        job = db.get(Job, job_id)
        if job is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found.",
            )
        job.title_nl = payload.titleNl
        job.title_en = payload.titleEn
        job.description_nl = payload.descriptionNl
        job.description_en = payload.descriptionEn
        job.salary_type = payload.salaryType
        job.salary_min = payload.salaryMin
        job.salary_max = payload.salaryMax
        job.salary_amount = payload.salaryAmount
        job.salary_range = payload.salaryRange
        job.experience_years = payload.experienceYears
        job.level = payload.level
        job.hours_per_week = payload.hoursPerWeek
        job.location = payload.location
        job.company = payload.company
        db.commit()
        db.refresh(job)
        return job_to_admin(job)

    @router.delete("/api/jobs/{job_id}", summary="Delete a job")
    def admin_delete_job(
        job_id: int,
        db: Session = Depends(get_db),
        current_admin: str = Depends(get_current_admin),
    ) -> dict:
        job = db.get(Job, job_id)
        if job is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found.",
            )
        db.delete(job)
        db.commit()
        return {"status": "deleted", "id": job_id}

    return router
