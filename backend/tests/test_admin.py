"""Integration tests for the protected admin router."""

from __future__ import annotations

import io

import pytest

from conftest import (
    ADMIN_PASSWORD,
    ADMIN_USERNAME,
    valid_contact_form,
    valid_job_payload,
)


# --------------------------------------------------------------------------- #
# Admin SPA + auth
# --------------------------------------------------------------------------- #
def test_admin_panel_html(client, admin_prefix):
    resp = client.get(admin_prefix)
    assert resp.status_code == 200
    assert "text/html" in resp.headers["content-type"]


def test_login_success(client, admin_prefix):
    resp = client.post(
        f"{admin_prefix}/api/login",
        json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]


def test_login_wrong_password(client, admin_prefix):
    resp = client.post(
        f"{admin_prefix}/api/login",
        json={"username": ADMIN_USERNAME, "password": "wrong"},
    )
    assert resp.status_code == 401


def test_login_lockout_after_repeated_failures(client, admin_prefix):
    for _ in range(5):
        client.post(
            f"{admin_prefix}/api/login",
            json={"username": ADMIN_USERNAME, "password": "wrong"},
        )
    # 6th attempt is locked out, even with correct credentials.
    resp = client.post(
        f"{admin_prefix}/api/login",
        json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD},
    )
    assert resp.status_code == 429
    assert "Retry-After" in resp.headers


def test_me_endpoint(client, admin_prefix, auth_headers):
    resp = client.get(f"{admin_prefix}/api/me", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["username"] == ADMIN_USERNAME


def test_me_requires_auth(client, admin_prefix):
    resp = client.get(f"{admin_prefix}/api/me")
    assert resp.status_code == 401


# --------------------------------------------------------------------------- #
# Submissions
# --------------------------------------------------------------------------- #
def test_submissions_require_auth(client, admin_prefix):
    assert client.get(f"{admin_prefix}/api/submissions").status_code == 401
    assert client.get(f"{admin_prefix}/api/submissions/1").status_code == 401
    assert client.delete(f"{admin_prefix}/api/submissions/1").status_code == 401


def test_submissions_list_and_get_and_delete(client, admin_prefix, auth_headers):
    client.post("/api/contact", data=valid_contact_form())

    listed = client.get(f"{admin_prefix}/api/submissions", headers=auth_headers)
    assert listed.status_code == 200
    items = listed.json()
    assert len(items) == 1
    sub_id = items[0]["id"]
    assert items[0]["hasCv"] is False

    one = client.get(
        f"{admin_prefix}/api/submissions/{sub_id}", headers=auth_headers
    )
    assert one.status_code == 200
    assert one.json()["email"] == "jan.jansen@example.com"

    deleted = client.delete(
        f"{admin_prefix}/api/submissions/{sub_id}", headers=auth_headers
    )
    assert deleted.status_code == 200
    assert deleted.json()["status"] == "deleted"

    assert (
        client.get(
            f"{admin_prefix}/api/submissions/{sub_id}", headers=auth_headers
        ).status_code
        == 404
    )


def test_submission_get_404(client, admin_prefix, auth_headers):
    resp = client.get(
        f"{admin_prefix}/api/submissions/424242", headers=auth_headers
    )
    assert resp.status_code == 404


def test_submission_delete_404(client, admin_prefix, auth_headers):
    resp = client.delete(
        f"{admin_prefix}/api/submissions/424242", headers=auth_headers
    )
    assert resp.status_code == 404


# --------------------------------------------------------------------------- #
# CV download
# --------------------------------------------------------------------------- #
def test_cv_download_success(client, admin_prefix, auth_headers):
    files = {"cv": ("cv.pdf", io.BytesIO(b"%PDF-1.4 data"), "application/pdf")}
    client.post("/api/contact", data=valid_contact_form(), files=files)
    sub_id = client.get(
        f"{admin_prefix}/api/submissions", headers=auth_headers
    ).json()[0]["id"]

    resp = client.get(
        f"{admin_prefix}/api/submissions/{sub_id}/cv", headers=auth_headers
    )
    assert resp.status_code == 200
    assert resp.content == b"%PDF-1.4 data"


def test_cv_download_404_when_none(client, admin_prefix, auth_headers):
    client.post("/api/contact", data=valid_contact_form())
    sub_id = client.get(
        f"{admin_prefix}/api/submissions", headers=auth_headers
    ).json()[0]["id"]
    resp = client.get(
        f"{admin_prefix}/api/submissions/{sub_id}/cv", headers=auth_headers
    )
    assert resp.status_code == 404


# --------------------------------------------------------------------------- #
# Jobs CRUD
# --------------------------------------------------------------------------- #
def test_jobs_require_auth(client, admin_prefix):
    assert client.get(f"{admin_prefix}/api/jobs").status_code == 401
    assert (
        client.post(
            f"{admin_prefix}/api/jobs", json=valid_job_payload()
        ).status_code
        == 401
    )


def test_job_create_list_update_delete(client, admin_prefix, auth_headers):
    # Create
    created = client.post(
        f"{admin_prefix}/api/jobs", json=valid_job_payload(), headers=auth_headers
    )
    assert created.status_code == 201, created.text
    job = created.json()
    job_id = job["id"]
    assert job["titleNl"] == "Software Ontwikkelaar"

    # List
    listed = client.get(f"{admin_prefix}/api/jobs", headers=auth_headers)
    assert listed.status_code == 200
    assert len(listed.json()) == 1

    # Update
    updated = client.put(
        f"{admin_prefix}/api/jobs/{job_id}",
        json=valid_job_payload(titleNl="Aangepaste Titel"),
        headers=auth_headers,
    )
    assert updated.status_code == 200
    assert updated.json()["titleNl"] == "Aangepaste Titel"

    # Delete
    deleted = client.delete(
        f"{admin_prefix}/api/jobs/{job_id}", headers=auth_headers
    )
    assert deleted.status_code == 200
    assert deleted.json() == {"status": "deleted", "id": job_id}

    assert (
        client.get(f"{admin_prefix}/api/jobs", headers=auth_headers).json() == []
    )


def test_job_create_invalid_422(client, admin_prefix, auth_headers):
    resp = client.post(
        f"{admin_prefix}/api/jobs",
        json=valid_job_payload(level="principal"),
        headers=auth_headers,
    )
    assert resp.status_code == 422


def test_job_update_404(client, admin_prefix, auth_headers):
    resp = client.put(
        f"{admin_prefix}/api/jobs/999999",
        json=valid_job_payload(),
        headers=auth_headers,
    )
    assert resp.status_code == 404


def test_job_delete_404(client, admin_prefix, auth_headers):
    resp = client.delete(
        f"{admin_prefix}/api/jobs/999999", headers=auth_headers
    )
    assert resp.status_code == 404
