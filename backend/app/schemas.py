"""Pydantic v2 schemas with strict server-side validation."""

from __future__ import annotations

import re
from datetime import datetime

from typing import Any

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    computed_field,
    field_validator,
    model_validator,
)

from .validators import assert_safe

# ---------------------------------------------------------------------------- #
# Reusable regular expressions
# ---------------------------------------------------------------------------- #

# Names: unicode letters plus space, hyphen and apostrophe. No digits.
_NAME_RE = re.compile(r"^[^\W\d_][\w \-']*$", re.UNICODE)
# The above keeps it simple; we additionally forbid digits explicitly below.
_HAS_DIGIT_RE = re.compile(r"\d")

# A pragmatic email pattern (full RFC validation is delegated to email-validator
# at the type level when desired; this guards format/shape cheaply).
_EMAIL_RE = re.compile(
    r"^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$"
)

# Phone: only +, -, (), spaces and digits are permitted characters.
_PHONE_ALLOWED_RE = re.compile(r"^[+\-()\s\d]+$")
_DIGIT_RE = re.compile(r"\d")


# ---------------------------------------------------------------------------- #
# Public contact form
# ---------------------------------------------------------------------------- #


class ContactCreate(BaseModel):
    """Incoming payload for ``POST /api/contact``.

    Field aliases map the camelCase JSON keys used by the React front-end to
    snake_case-friendly Python attributes. All validation failures raise a
    ``ValueError`` so FastAPI returns a 422 naming the field and reason.
    """

    model_config = ConfigDict(populate_by_name=True, str_strip_whitespace=False)

    firstName: str = Field(..., description="Given name")
    lastName: str = Field(..., description="Family name")
    email: str = Field(..., description="Contact email address")
    phone: str = Field(..., description="Contact phone number")
    message: str = Field(..., description="Free-text message")

    # -------------------------- helpers -------------------------- #
    @staticmethod
    def _require_non_empty(value: str, field: str) -> str:
        if value is None:
            raise ValueError(f"{field} is required.")
        stripped = value.strip()
        if not stripped:
            raise ValueError(f"{field} must not be empty.")
        return stripped

    @staticmethod
    def _check_length(value: str, field: str, lo: int, hi: int) -> str:
        length = len(value)
        if length < lo:
            raise ValueError(f"{field} must be at least {lo} characters.")
        if length > hi:
            raise ValueError(f"{field} must be at most {hi} characters.")
        return value

    # -------------------------- field validators -------------------------- #
    @field_validator("firstName")
    @classmethod
    def _validate_first_name(cls, v: str) -> str:
        v = cls._require_non_empty(v, "First name")
        v = cls._check_length(v, "First name", 2, 50)
        assert_safe(v, field="First name", strict=True)
        if _HAS_DIGIT_RE.search(v) or not _NAME_RE.match(v):
            raise ValueError(
                "First name may only contain letters, spaces, hyphens and apostrophes."
            )
        return v

    @field_validator("lastName")
    @classmethod
    def _validate_last_name(cls, v: str) -> str:
        v = cls._require_non_empty(v, "Last name")
        v = cls._check_length(v, "Last name", 2, 50)
        assert_safe(v, field="Last name", strict=True)
        if _HAS_DIGIT_RE.search(v) or not _NAME_RE.match(v):
            raise ValueError(
                "Last name may only contain letters, spaces, hyphens and apostrophes."
            )
        return v

    @field_validator("email")
    @classmethod
    def _validate_email(cls, v: str) -> str:
        v = cls._require_non_empty(v, "Email")
        v = cls._check_length(v, "Email", 5, 120)
        assert_safe(v, field="Email", strict=True)
        if not _EMAIL_RE.match(v):
            raise ValueError("Email address is not valid.")
        return v.lower()

    @field_validator("phone")
    @classmethod
    def _validate_phone(cls, v: str) -> str:
        v = cls._require_non_empty(v, "Phone")
        v = cls._check_length(v, "Phone", 7, 25)
        assert_safe(v, field="Phone", strict=True)
        if not _PHONE_ALLOWED_RE.match(v):
            raise ValueError(
                "Phone may only contain digits and the characters + - ( ) and spaces."
            )
        digit_count = len(_DIGIT_RE.findall(v))
        if digit_count < 7 or digit_count > 15:
            raise ValueError("Phone must contain between 7 and 15 digits.")
        return v

    @field_validator("message")
    @classmethod
    def _validate_message(cls, v: str) -> str:
        v = cls._require_non_empty(v, "Message")
        v = cls._check_length(v, "Message", 10, 2000)
        # Free text: lenient mode still blocks script tags / UNION SELECT / etc.
        assert_safe(v, field="Message", strict=False)
        return v


# ---------------------------------------------------------------------------- #
# Responses
# ---------------------------------------------------------------------------- #


class ContactCreateResponse(BaseModel):
    """Response returned after a successful contact submission."""

    id: int
    message: str = "Thank you for your message. We will be in touch soon."


class SubmissionOut(BaseModel):
    """Full representation of a stored submission for the admin panel."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    first_name: str
    last_name: str
    email: str
    phone: str
    message: str
    ip_address: str | None = None
    cv_filename: str | None = None
    created_at: datetime

    @computed_field  # type: ignore[prop-decorator]
    @property
    def hasCv(self) -> bool:
        """Whether this submission has a CV attachment available for download."""
        return self.cv_filename is not None


# ---------------------------------------------------------------------------- #
# Admin auth
# ---------------------------------------------------------------------------- #


class LoginRequest(BaseModel):
    """Credentials submitted to the admin login endpoint."""

    username: str = Field(..., min_length=1, max_length=150)
    password: str = Field(..., min_length=1, max_length=256)


class TokenResponse(BaseModel):
    """Issued JWT access token."""

    access_token: str
    token_type: str = "bearer"


class MeResponse(BaseModel):
    """Identity of the currently authenticated admin."""

    username: str


# ---------------------------------------------------------------------------- #
# Jobs
# ---------------------------------------------------------------------------- #

_SALARY_TYPES = {"range", "fixed"}
_SALARY_RANGES = {"0-2000", "2000-3000", "3000-4000", "4000+"}
_LEVELS = {"junior", "middle", "senior"}
_HOURS = {32, 36, 38, 40}


class JobCreate(BaseModel):
    """Admin payload (camelCase) for creating / updating a :class:`~app.models.Job`.

    All validation failures raise ``ValueError`` so FastAPI surfaces a 422 that
    names the offending field. XSS / SQL-injection guards reuse the same helpers
    as the contact form.
    """

    model_config = ConfigDict(populate_by_name=True, str_strip_whitespace=False)

    titleNl: str = Field(..., description="Dutch job title")
    titleEn: str = Field(..., description="English job title")
    descriptionNl: str = Field(..., description="Dutch description")
    descriptionEn: str = Field(..., description="English description")
    salaryType: str = Field(..., description="'range' or 'fixed'")
    salaryMin: int | None = Field(default=None)
    salaryMax: int | None = Field(default=None)
    salaryAmount: int | None = Field(default=None)
    salaryRange: str = Field(..., description="Filter bucket")
    experienceYears: int = Field(...)
    level: str = Field(..., description="junior | middle | senior")
    hoursPerWeek: int = Field(...)
    location: str = Field(...)
    company: str = Field(default="Randstad")

    # -------------------------- helpers -------------------------- #
    @staticmethod
    def _require_non_empty(value: str, field: str) -> str:
        if value is None:
            raise ValueError(f"{field} is required.")
        stripped = value.strip()
        if not stripped:
            raise ValueError(f"{field} must not be empty.")
        return stripped

    @staticmethod
    def _check_length(value: str, field: str, lo: int, hi: int) -> str:
        length = len(value)
        if length < lo:
            raise ValueError(f"{field} must be at least {lo} characters.")
        if length > hi:
            raise ValueError(f"{field} must be at most {hi} characters.")
        return value

    # -------------------------- field validators -------------------------- #
    @field_validator("titleNl")
    @classmethod
    def _validate_title_nl(cls, v: str) -> str:
        v = cls._require_non_empty(v, "Title (NL)")
        v = cls._check_length(v, "Title (NL)", 2, 120)
        return assert_safe(v, field="Title (NL)", strict=True)

    @field_validator("titleEn")
    @classmethod
    def _validate_title_en(cls, v: str) -> str:
        v = cls._require_non_empty(v, "Title (EN)")
        v = cls._check_length(v, "Title (EN)", 2, 120)
        return assert_safe(v, field="Title (EN)", strict=True)

    @field_validator("descriptionNl")
    @classmethod
    def _validate_description_nl(cls, v: str) -> str:
        v = cls._require_non_empty(v, "Description (NL)")
        v = cls._check_length(v, "Description (NL)", 10, 4000)
        # Free text: lenient SQLi mode like the contact message.
        return assert_safe(v, field="Description (NL)", strict=False)

    @field_validator("descriptionEn")
    @classmethod
    def _validate_description_en(cls, v: str) -> str:
        v = cls._require_non_empty(v, "Description (EN)")
        v = cls._check_length(v, "Description (EN)", 10, 4000)
        return assert_safe(v, field="Description (EN)", strict=False)

    @field_validator("salaryType")
    @classmethod
    def _validate_salary_type(cls, v: str) -> str:
        if v not in _SALARY_TYPES:
            raise ValueError("Salary type must be 'range' or 'fixed'.")
        return v

    @field_validator("salaryRange")
    @classmethod
    def _validate_salary_range(cls, v: str) -> str:
        if v not in _SALARY_RANGES:
            raise ValueError(
                "Salary range must be one of "
                "'0-2000', '2000-3000', '3000-4000', '4000+'."
            )
        return v

    @field_validator("level")
    @classmethod
    def _validate_level(cls, v: str) -> str:
        if v not in _LEVELS:
            raise ValueError("Level must be 'junior', 'middle' or 'senior'.")
        return v

    @field_validator("experienceYears")
    @classmethod
    def _validate_experience(cls, v: int) -> int:
        if v < 0 or v > 50:
            raise ValueError("Experience years must be between 0 and 50.")
        return v

    @field_validator("hoursPerWeek")
    @classmethod
    def _validate_hours(cls, v: int) -> int:
        if v not in _HOURS:
            raise ValueError("Hours per week must be one of 32, 36, 38 or 40.")
        return v

    @field_validator("location")
    @classmethod
    def _validate_location(cls, v: str) -> str:
        v = cls._require_non_empty(v, "Location")
        v = cls._check_length(v, "Location", 2, 80)
        return assert_safe(v, field="Location", strict=True)

    @field_validator("company")
    @classmethod
    def _validate_company(cls, v: str | None) -> str:
        if v is None or not v.strip():
            return "Randstad"
        v = cls._check_length(v.strip(), "Company", 2, 80)
        return assert_safe(v, field="Company", strict=True)

    # -------------------------- cross-field validation -------------------------- #
    @model_validator(mode="after")
    def _validate_salary_values(self) -> "JobCreate":
        if self.salaryType == "range":
            if self.salaryMin is None or self.salaryMax is None:
                raise ValueError(
                    "Salary min and max are required for a salary range."
                )
            if self.salaryMin <= 0 or self.salaryMax <= 0:
                raise ValueError("Salary min and max must be greater than 0.")
            if self.salaryMax < self.salaryMin:
                raise ValueError("Salary max must be greater than or equal to min.")
        else:  # fixed
            if self.salaryAmount is None or self.salaryAmount <= 0:
                raise ValueError(
                    "Salary amount is required and must be greater than 0 "
                    "for a fixed salary."
                )
        return self


# ---------------------------------------------------------------------------- #
# Job serialisation helpers
# ---------------------------------------------------------------------------- #


def _format_eur(amount: int) -> str:
    """Format an integer euro amount with thousands dots, e.g. ``€2.500``."""
    return "€" + f"{amount:,}".replace(",", ".")


def format_salary(job: Any) -> str:
    """Return the human-readable salary display string for *job*."""
    if job.salary_type == "range":
        return f"{_format_eur(job.salary_min)} - {_format_eur(job.salary_max)}"
    return _format_eur(job.salary_amount)


def job_to_public(job: Any) -> dict[str, Any]:
    """Serialise *job* into the exact shape the public Jobs page consumes."""
    return {
        "id": job.id,
        "title": job.title_nl,
        "titleEN": job.title_en,
        "company": job.company,
        "location": job.location,
        "salary": format_salary(job),
        "salaryRange": job.salary_range,
        "level": job.level,
        "experienceYears": job.experience_years,
        "hoursPerWeek": job.hours_per_week,
        "desc": job.description_nl,
        "descEN": job.description_en,
    }


def job_to_admin(job: Any) -> dict[str, Any]:
    """Serialise *job* into the full structured admin representation."""
    return {
        "id": job.id,
        "titleNl": job.title_nl,
        "titleEn": job.title_en,
        "descriptionNl": job.description_nl,
        "descriptionEn": job.description_en,
        "salaryType": job.salary_type,
        "salaryMin": job.salary_min,
        "salaryMax": job.salary_max,
        "salaryAmount": job.salary_amount,
        "salaryRange": job.salary_range,
        "experienceYears": job.experience_years,
        "level": job.level,
        "hoursPerWeek": job.hours_per_week,
        "location": job.location,
        "company": job.company,
        "createdAt": job.created_at,
    }
