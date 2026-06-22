"""SQLAlchemy ORM models."""

from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


class ContactSubmission(Base):
    """A single contact-form submission stored by the public API."""

    __tablename__ = "contact_submissions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    phone: Mapped[str] = mapped_column(String(25), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)

    # Captured server-side from the request; never trusted from the client.
    ip_address: Mapped[str | None] = mapped_column(String(64), nullable=True)

    # Optional CV attachment uploaded with the contact form. ``cv_filename`` is
    # the original (sanitised) name shown in the admin UI; ``cv_path`` is the
    # absolute path of the stored file on disk.
    cv_filename: Mapped[str | None] = mapped_column(String(255), nullable=True)
    cv_path: Mapped[str | None] = mapped_column(String(512), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    def __repr__(self) -> str:  # pragma: no cover - debugging convenience
        return (
            f"<ContactSubmission id={self.id} "
            f"email={self.email!r} created_at={self.created_at!r}>"
        )


class Job(Base):
    """A job vacancy managed by admins and exposed to the public Jobs page."""

    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    title_nl: Mapped[str] = mapped_column(String(120), nullable=False)
    title_en: Mapped[str] = mapped_column(String(120), nullable=False)
    description_nl: Mapped[str] = mapped_column(Text, nullable=False)
    description_en: Mapped[str] = mapped_column(Text, nullable=False)

    # Salary is either an inclusive range ('range') or a single amount ('fixed').
    salary_type: Mapped[str] = mapped_column(String(10), nullable=False)
    salary_min: Mapped[int | None] = mapped_column(Integer, nullable=True)
    salary_max: Mapped[int | None] = mapped_column(Integer, nullable=True)
    salary_amount: Mapped[int | None] = mapped_column(Integer, nullable=True)
    # Coarse bucket used for filtering on the public page.
    salary_range: Mapped[str] = mapped_column(String(20), nullable=False)

    experience_years: Mapped[int] = mapped_column(Integer, nullable=False)
    level: Mapped[str] = mapped_column(String(20), nullable=False)
    hours_per_week: Mapped[int] = mapped_column(Integer, nullable=False)
    location: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    company: Mapped[str] = mapped_column(
        String(80), nullable=False, default="Randstad"
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    def __repr__(self) -> str:  # pragma: no cover - debugging convenience
        return f"<Job id={self.id} title_nl={self.title_nl!r}>"
