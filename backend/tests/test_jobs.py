"""Integration tests for the public Jobs endpoints."""

from __future__ import annotations

import pytest

from conftest import make_job


@pytest.fixture()
def seeded_jobs(db_session):
    """Insert a varied set of jobs and return them."""
    jobs = [
        make_job(
            title_nl="Junior Monteur",
            title_en="Junior Mechanic",
            location="Amsterdam",
            salary_type="range",
            salary_min=2500,
            salary_max=3200,
            salary_amount=None,
            salary_range="2000-3000",
            level="junior",
            experience_years=1,
            hours_per_week=40,
        ),
        make_job(
            title_nl="Senior Adviseur",
            title_en="Senior Advisor",
            location="Rotterdam",
            salary_type="fixed",
            salary_min=None,
            salary_max=None,
            salary_amount=3000,
            salary_range="3000-4000",
            level="senior",
            experience_years=8,
            hours_per_week=32,
        ),
        make_job(
            title_nl="Middle Planner",
            title_en="Middle Planner",
            location="Amsterdam",
            salary_type="range",
            salary_min=2000,
            salary_max=2800,
            salary_amount=None,
            salary_range="2000-3000",
            level="middle",
            experience_years=4,
            hours_per_week=36,
        ),
    ]
    db_session.add_all(jobs)
    db_session.commit()
    return jobs


def test_list_jobs_empty(client):
    resp = client.get("/api/jobs")
    assert resp.status_code == 200
    assert resp.json() == []


def test_list_jobs_with_data(client, seeded_jobs):
    resp = client.get("/api/jobs")
    assert resp.status_code == 200
    assert len(resp.json()) == 3


def test_salary_formatting_range_and_fixed(client, seeded_jobs):
    data = client.get("/api/jobs").json()
    by_title = {j["title"]: j for j in data}
    assert by_title["Junior Monteur"]["salary"] == "€2.500 - €3.200"
    assert by_title["Senior Adviseur"]["salary"] == "€3.000"


def test_filter_city(client, seeded_jobs):
    data = client.get("/api/jobs", params={"city": "Amsterdam"}).json()
    assert len(data) == 2
    assert all(j["location"] == "Amsterdam" for j in data)


def test_filter_salary_range(client, seeded_jobs):
    data = client.get("/api/jobs", params={"salaryRange": "3000-4000"}).json()
    assert len(data) == 1
    assert data[0]["salaryRange"] == "3000-4000"


def test_filter_level(client, seeded_jobs):
    data = client.get("/api/jobs", params={"level": "senior"}).json()
    assert len(data) == 1
    assert data[0]["level"] == "senior"


@pytest.mark.parametrize(
    "bucket,expected_count",
    [("0-2", 1), ("3-5", 1), ("6+", 1)],
)
def test_filter_experience_buckets(client, seeded_jobs, bucket, expected_count):
    data = client.get("/api/jobs", params={"experience": bucket}).json()
    assert len(data) == expected_count


def test_filter_hours(client, seeded_jobs):
    data = client.get("/api/jobs", params={"hours": 32}).json()
    assert len(data) == 1
    assert data[0]["hoursPerWeek"] == 32


def test_filter_q_substring(client, seeded_jobs):
    data = client.get("/api/jobs", params={"q": "planner"}).json()
    assert len(data) == 1
    assert data[0]["title"] == "Middle Planner"


def test_filter_combined(client, seeded_jobs):
    data = client.get(
        "/api/jobs", params={"city": "Amsterdam", "level": "junior"}
    ).json()
    assert len(data) == 1
    assert data[0]["title"] == "Junior Monteur"


def test_get_single_job(client, seeded_jobs):
    job_id = seeded_jobs[0].id
    resp = client.get(f"/api/jobs/{job_id}")
    assert resp.status_code == 200
    assert resp.json()["id"] == job_id


def test_get_single_job_404(client):
    resp = client.get("/api/jobs/999999")
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Job not found."
