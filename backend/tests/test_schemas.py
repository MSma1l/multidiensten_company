"""Unit tests for app.schemas (ContactCreate, JobCreate and serialisers)."""

from __future__ import annotations

import types

import pytest
from pydantic import ValidationError

from app.schemas import (
    ContactCreate,
    JobCreate,
    _format_eur,
    format_salary,
    job_to_admin,
    job_to_public,
)

from conftest import valid_contact_form, valid_job_payload


# --------------------------------------------------------------------------- #
# ContactCreate
# --------------------------------------------------------------------------- #
def test_contact_valid():
    c = ContactCreate(**valid_contact_form())
    assert c.firstName == "Jan"
    assert c.email == "jan.jansen@example.com"  # lower-cased


def test_contact_email_is_lowercased():
    c = ContactCreate(**valid_contact_form(email="Jan.JANSEN@Example.COM"))
    assert c.email == "jan.jansen@example.com"


@pytest.mark.parametrize(
    "field,value",
    [
        ("firstName", ""),
        ("firstName", "   "),
        ("firstName", "J"),                # too short
        ("firstName", "J" * 51),           # too long
        ("firstName", "Jan2"),             # contains digit
        ("firstName", "<script>"),         # xss
        ("lastName", ""),
        ("lastName", "X"),
        ("lastName", "Jansen9"),
        ("lastName", "a'or 1=1"),          # sqli
        ("email", "not-an-email"),
        ("email", "a@b"),                  # too short / no TLD
        ("email", ""),
        ("phone", "123"),                  # too short
        ("phone", "abcdefg"),              # bad chars
        ("phone", "+31 6 123"),            # too few digits
        ("phone", "1" * 26),               # too long
        ("message", ""),
        ("message", "short"),              # too short (<10)
        ("message", "x" * 2001),           # too long
        ("message", "<script>alert(1)</script> hello world"),  # xss in message
        ("message", "hello UNION SELECT * FROM users now"),    # sqli in message
    ],
)
def test_contact_invalid_fields(field, value):
    with pytest.raises(ValidationError):
        ContactCreate(**valid_contact_form(**{field: value}))


def test_contact_phone_valid_formats():
    for phone in ["+31612345678", "06-12345678", "(020) 123 4567"]:
        ContactCreate(**valid_contact_form(phone=phone))


# --------------------------------------------------------------------------- #
# JobCreate
# --------------------------------------------------------------------------- #
def test_job_valid_range():
    job = JobCreate(**valid_job_payload())
    assert job.salaryType == "range"


def test_job_valid_fixed():
    job = JobCreate(
        **valid_job_payload(
            salaryType="fixed",
            salaryMin=None,
            salaryMax=None,
            salaryAmount=3000,
        )
    )
    assert job.salaryAmount == 3000


def test_job_company_defaults_to_randstad_when_blank():
    job = JobCreate(**valid_job_payload(company="   "))
    assert job.company == "Randstad"


@pytest.mark.parametrize(
    "overrides",
    [
        {"titleNl": ""},
        {"titleNl": "x"},                       # too short
        {"titleNl": "x" * 121},                 # too long
        {"titleEn": "<script>"},                # xss
        {"descriptionNl": "short"},             # too short
        {"descriptionNl": "x" * 4001},          # too long
        {"descriptionEn": "hi UNION SELECT a FROM b please"},  # sqli
        {"salaryType": "weird"},                # bad enum
        {"salaryRange": "9999"},                # bad bucket
        {"level": "principal"},                 # bad level
        {"hoursPerWeek": 20},                   # bad hours
        {"experienceYears": -1},                # below range
        {"experienceYears": 99},                # above range
        {"location": ""},
        {"location": "x"},                      # too short
        # range cross-field rules
        {"salaryType": "range", "salaryMin": None, "salaryMax": 3000},
        {"salaryType": "range", "salaryMin": 3000, "salaryMax": None},
        {"salaryType": "range", "salaryMin": 0, "salaryMax": 3000},
        {"salaryType": "range", "salaryMin": 3000, "salaryMax": 2000},  # max<min
        # fixed cross-field rules
        {"salaryType": "fixed", "salaryMin": None, "salaryMax": None,
         "salaryAmount": None},
        {"salaryType": "fixed", "salaryMin": None, "salaryMax": None,
         "salaryAmount": -5},
    ],
)
def test_job_invalid(overrides):
    with pytest.raises(ValidationError):
        JobCreate(**valid_job_payload(**overrides))


def test_job_all_valid_levels_and_hours():
    for level in ("junior", "middle", "senior"):
        JobCreate(**valid_job_payload(level=level))
    for hours in (32, 36, 38, 40):
        JobCreate(**valid_job_payload(hoursPerWeek=hours))
    for bucket in ("0-2000", "2000-3000", "3000-4000", "4000+"):
        JobCreate(**valid_job_payload(salaryRange=bucket))


# --------------------------------------------------------------------------- #
# Serialisation helpers
# --------------------------------------------------------------------------- #
def test_format_eur():
    assert _format_eur(2500) == "€2.500"
    assert _format_eur(3000) == "€3.000"
    assert _format_eur(1000000) == "€1.000.000"


def _fake_job(**kw):
    base = dict(
        id=1,
        title_nl="Titel",
        title_en="Title",
        company="Randstad",
        location="Amsterdam",
        salary_type="range",
        salary_min=2500,
        salary_max=3200,
        salary_amount=None,
        salary_range="2000-3000",
        level="middle",
        experience_years=3,
        hours_per_week=40,
        description_nl="NL desc",
        description_en="EN desc",
        created_at="2026-01-01",
    )
    base.update(kw)
    return types.SimpleNamespace(**base)


def test_format_salary_range():
    assert format_salary(_fake_job()) == "€2.500 - €3.200"


def test_format_salary_fixed():
    job = _fake_job(salary_type="fixed", salary_amount=3000)
    assert format_salary(job) == "€3.000"


def test_job_to_public_shape():
    out = job_to_public(_fake_job())
    assert out["title"] == "Titel"
    assert out["titleEN"] == "Title"
    assert out["salary"] == "€2.500 - €3.200"
    assert out["desc"] == "NL desc"
    assert out["descEN"] == "EN desc"


def test_job_to_admin_shape():
    out = job_to_admin(_fake_job())
    assert out["titleNl"] == "Titel"
    assert out["salaryMin"] == 2500
    assert out["createdAt"] == "2026-01-01"
