"""Integration tests for the public contact + health endpoints."""

from __future__ import annotations

import io

from app.models import ContactSubmission

from conftest import valid_contact_form


def test_health(client):
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_contact_success_persists_row(client, db_session):
    resp = client.post("/api/contact", data=valid_contact_form())
    assert resp.status_code == 201, resp.text
    body = resp.json()
    assert "id" in body
    rows = db_session.query(ContactSubmission).all()
    assert len(rows) == 1
    assert rows[0].email == "jan.jansen@example.com"
    assert rows[0].cv_filename is None


def test_contact_records_ip(client, db_session):
    # The trusted client IP comes from X-Real-IP (set by nginx to $remote_addr).
    resp = client.post(
        "/api/contact",
        data=valid_contact_form(),
        headers={"X-Real-IP": "198.51.100.5"},
    )
    assert resp.status_code == 201
    row = db_session.query(ContactSubmission).one()
    assert row.ip_address == "198.51.100.5"


def test_contact_ignores_spoofed_xff(client, db_session):
    # X-Forwarded-For is client-controlled and must NOT be trusted; only
    # X-Real-IP (or the socket peer) is recorded.
    resp = client.post(
        "/api/contact",
        data=valid_contact_form(),
        headers={
            "X-Forwarded-For": "1.2.3.4, 10.0.0.1",
            "X-Real-IP": "198.51.100.9",
        },
    )
    assert resp.status_code == 201
    row = db_session.query(ContactSubmission).one()
    assert row.ip_address == "198.51.100.9"


def test_contact_xss_rejected_and_not_persisted(client, db_session):
    resp = client.post(
        "/api/contact",
        data=valid_contact_form(message="<script>alert(1)</script> hello world!"),
    )
    assert resp.status_code == 422
    assert db_session.query(ContactSubmission).count() == 0


def test_contact_sqli_rejected(client, db_session):
    resp = client.post(
        "/api/contact",
        data=valid_contact_form(
            message="please UNION SELECT password FROM users now"
        ),
    )
    assert resp.status_code == 422
    assert db_session.query(ContactSubmission).count() == 0


def test_contact_empty_field_rejected(client):
    resp = client.post("/api/contact", data=valid_contact_form(firstName=""))
    assert resp.status_code == 422


def test_contact_too_long_rejected(client):
    resp = client.post(
        "/api/contact", data=valid_contact_form(message="x" * 2001)
    )
    assert resp.status_code == 422


def test_contact_with_valid_cv(client, db_session, upload_dir):
    files = {"cv": ("resume.pdf", io.BytesIO(b"%PDF-1.4 fake"), "application/pdf")}
    resp = client.post("/api/contact", data=valid_contact_form(), files=files)
    assert resp.status_code == 201, resp.text
    row = db_session.query(ContactSubmission).one()
    assert row.cv_filename == "resume.pdf"
    assert row.cv_path is not None
    import os

    assert os.path.exists(row.cv_path)


def test_contact_bad_cv_extension_rejected(client, db_session):
    files = {"cv": ("resume.exe", io.BytesIO(b"MZ"), "application/octet-stream")}
    resp = client.post("/api/contact", data=valid_contact_form(), files=files)
    assert resp.status_code == 422
    assert db_session.query(ContactSubmission).count() == 0


def test_contact_oversized_cv_rejected(client, db_session):
    big = io.BytesIO(b"a" * (5 * 1024 * 1024 + 1))
    files = {"cv": ("resume.pdf", big, "application/pdf")}
    resp = client.post("/api/contact", data=valid_contact_form(), files=files)
    assert resp.status_code == 422
    assert db_session.query(ContactSubmission).count() == 0


def test_contact_missing_required_form_field(client):
    # python-multipart: omitting a required Form field yields 422.
    incomplete = valid_contact_form()
    del incomplete["email"]
    resp = client.post("/api/contact", data=incomplete)
    assert resp.status_code == 422
