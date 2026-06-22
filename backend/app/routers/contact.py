"""Public API endpoints: health check and contact-form submission."""

from __future__ import annotations

import os
import re

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Request,
    UploadFile,
    status,
)
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from sqlalchemy.orm import Session

from ..config import settings
from ..database import get_db
from ..models import ContactSubmission
from ..schemas import ContactCreate, ContactCreateResponse
from ..security import client_ip

router = APIRouter(prefix="/api", tags=["public"])

# Allowed CV file types and maximum upload size.
_ALLOWED_CV_EXTENSIONS = {".pdf", ".doc", ".docx"}
_MAX_CV_BYTES = 5 * 1024 * 1024  # 5 MB
_CV_CHUNK_BYTES = 64 * 1024  # read uploads in 64 KB chunks
_UNSAFE_NAME_RE = re.compile(r"[^A-Za-z0-9._-]+")


@router.get("/health", summary="Health check")
def health() -> dict[str, str]:
    """Lightweight liveness probe used by orchestration / uptime checks."""
    return {"status": "ok"}


def _sanitize_filename(name: str) -> str:
    """Reduce *name* to its basename with only safe characters retained."""
    base = os.path.basename(name).strip()
    safe = _UNSAFE_NAME_RE.sub("_", base)
    return safe or "cv"


@router.post(
    "/contact",
    response_model=ContactCreateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit the contact form (optionally with a CV attachment)",
)
async def create_contact(
    request: Request,
    firstName: str = Form(...),
    lastName: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    message: str = Form(...),
    cv: UploadFile | None = File(default=None),
    db: Session = Depends(get_db),
) -> ContactCreateResponse:
    """Validate and persist a multipart contact-form submission.

    The text fields are validated by re-using :class:`~app.schemas.ContactCreate`
    so the same XSS / SQL-injection / length / required rules apply and surface
    as a 422. An optional ``cv`` upload is validated (extension + size) and
    stored on disk under a safe, unique name.
    """
    # Run the existing strict text validation by constructing the model.
    try:
        payload = ContactCreate(
            firstName=firstName,
            lastName=lastName,
            email=email,
            phone=phone,
            message=message,
        )
    except ValidationError as exc:
        # Surface through the app's RequestValidationError handler -> 422.
        raise RequestValidationError(exc.errors()) from exc

    # Validate the optional CV upload before touching the database.
    cv_content: bytes | None = None
    cv_original: str | None = None
    if cv is not None and cv.filename:
        ext = os.path.splitext(cv.filename)[1].lower()
        if ext not in _ALLOWED_CV_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="CV must be a .pdf, .doc or .docx file.",
            )
        # Stream the upload in bounded chunks and abort as soon as it exceeds
        # the limit, so an attacker cannot force the whole (unbounded) body to
        # be buffered into memory before the size check runs.
        buffer = bytearray()
        while True:
            chunk = await cv.read(_CV_CHUNK_BYTES)
            if not chunk:
                break
            buffer.extend(chunk)
            if len(buffer) > _MAX_CV_BYTES:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="CV file must be 5 MB or smaller.",
                )
        cv_content = bytes(buffer)
        cv_original = os.path.basename(cv.filename)

    submission = ContactSubmission(
        first_name=payload.firstName,
        last_name=payload.lastName,
        email=payload.email,
        phone=payload.phone,
        message=payload.message,
        ip_address=client_ip(request),
        cv_filename=cv_original,
    )

    db.add(submission)
    db.commit()
    db.refresh(submission)

    # Persist the file using the new submission id for a unique, safe name.
    if cv_content is not None:
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        stored_name = f"{submission.id}_{_sanitize_filename(cv_original or 'cv')}"
        stored_path = os.path.join(settings.UPLOAD_DIR, stored_name)
        with open(stored_path, "wb") as fh:
            fh.write(cv_content)
        submission.cv_path = stored_path
        db.commit()

    return ContactCreateResponse(id=submission.id)
