"""Public Jobs API: list and retrieve job vacancies for the Jobs page.

These endpoints are read-only and unauthenticated. Job records are created and
managed through the JWT-protected admin API (see :mod:`app.routers.admin`).
"""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Job
from ..schemas import job_to_public

router = APIRouter(prefix="/api", tags=["jobs"])


@router.get("/jobs", summary="List job vacancies (with optional filters)")
def list_jobs(
    db: Session = Depends(get_db),
    city: str | None = Query(default=None),
    salaryRange: str | None = Query(default=None),
    level: str | None = Query(default=None),
    experience: str | None = Query(default=None, description="'0-2' | '3-5' | '6+'"),
    hours: int | None = Query(default=None),
    q: str | None = Query(default=None, description="Substring over NL/EN title"),
) -> list[dict[str, Any]]:
    """Return all jobs matching the supplied filters in the public shape.

    Filtering is performed in the SQL query using bound parameters; the
    ``experience`` bucket is translated into a range over ``experience_years``.
    """
    stmt = select(Job)

    if city:
        stmt = stmt.where(Job.location == city)
    if salaryRange:
        stmt = stmt.where(Job.salary_range == salaryRange)
    if level:
        stmt = stmt.where(Job.level == level)
    if hours is not None:
        stmt = stmt.where(Job.hours_per_week == hours)

    if experience == "0-2":
        stmt = stmt.where(Job.experience_years.between(0, 2))
    elif experience == "3-5":
        stmt = stmt.where(Job.experience_years.between(3, 5))
    elif experience == "6+":
        stmt = stmt.where(Job.experience_years >= 6)

    if q:
        pattern = f"%{q.strip()}%"
        stmt = stmt.where(
            or_(Job.title_nl.ilike(pattern), Job.title_en.ilike(pattern))
        )

    stmt = stmt.order_by(Job.created_at.desc())
    jobs = db.execute(stmt).scalars().all()
    return [job_to_public(job) for job in jobs]


@router.get("/jobs/{job_id}", summary="Get a single job vacancy")
def get_job(
    job_id: int,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    """Return a single job in the public shape, or 404 if it does not exist."""
    job = db.get(Job, job_id)
    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found.",
        )
    return job_to_public(job)
