"""Unit tests for app.validators (XSS / SQL-injection detection)."""

from __future__ import annotations

import pytest

from app.validators import (
    assert_safe,
    contains_sql_injection,
    contains_xss,
)


# --------------------------------------------------------------------------- #
# contains_xss
# --------------------------------------------------------------------------- #
@pytest.mark.parametrize(
    "value",
    [
        "<script>alert(1)</script>",
        "</script>",
        "javascript:alert(1)",
        "vbscript:msgbox(1)",
        "data:text/html,<b>",
        "<iframe src=x>",
        "<img src=x onerror=alert(1)>",
        "<svg/onload=alert(1)>",
        "<object data=x>",
        "<embed src=x>",
        "<style>x</style>",
        "<link rel=x>",
        "<meta http-equiv=x>",
        "<base href=x>",
        "&#x3c;script&#x3e;",
        "&lt;script&gt;",
        "color: expression(alert(1))",
        "onerror=alert(1)",
        "onmouseover = alert(1)",
    ],
)
def test_contains_xss_positive_strict(value):
    assert contains_xss(value, strict=True) is True


def test_contains_xss_strict_blocks_bare_angle_bracket():
    # In strict mode a bare angle bracket is rejected even without a token.
    assert contains_xss("2 < 3", strict=True) is True


def test_contains_xss_lenient_allows_bare_angle_bracket():
    # In lenient (message) mode an isolated angle bracket is tolerated.
    assert contains_xss("2 < 3 and 4 > 1", strict=False) is False


def test_contains_xss_lenient_still_blocks_script():
    assert contains_xss("<script>evil</script>", strict=False) is True


@pytest.mark.parametrize(
    "value",
    [
        "",
        "Just a normal sentence.",
        "Jan Jansen",
        "jan@example.com",
    ],
)
def test_contains_xss_negative(value):
    assert contains_xss(value, strict=True) is False


def test_contains_xss_empty_returns_false():
    assert contains_xss("", strict=False) is False


# --------------------------------------------------------------------------- #
# contains_sql_injection
# --------------------------------------------------------------------------- #
@pytest.mark.parametrize(
    "value",
    [
        "' OR '1'='1",
        '" OR "1"="1',
        "x OR 1=1",
        "x AND 1=1",
        "1 UNION SELECT password FROM users",
        "DROP TABLE users",
        "INSERT INTO users VALUES (1)",
        "DELETE FROM users",
        "UPDATE users SET admin=1",
        "SELECT name FROM users",
        "TRUNCATE TABLE users",
        "ALTER TABLE users",
        "exec(cmd)",
        "exec sp_who",
        "xp_cmdshell",
        "sp_executesql",
        "value /* comment */",
        "value */",
        "admin';--",
        "name' --",
        'name" --',
        "name'--",
    ],
)
def test_contains_sql_injection_positive(value):
    assert contains_sql_injection(value, strict=True) is True


def test_sql_injection_strict_blocks_dashes_and_semicolons():
    assert contains_sql_injection("a -- b", strict=True) is True
    assert contains_sql_injection("a ; b", strict=True) is True


def test_sql_injection_lenient_allows_dashes_and_semicolons():
    # Ordinary punctuation passes in the lenient message mode.
    assert contains_sql_injection("Well - maybe; perhaps.", strict=False) is False


def test_sql_injection_lenient_still_blocks_union_select():
    assert (
        contains_sql_injection("1 UNION SELECT 1 FROM t", strict=False) is True
    )


@pytest.mark.parametrize(
    "value",
    [
        "",
        "I would like more information.",
        "My order number is 12345.",
    ],
)
def test_contains_sql_injection_negative(value):
    assert contains_sql_injection(value, strict=True) is False


def test_sql_injection_empty_returns_false():
    assert contains_sql_injection("", strict=True) is False


# --------------------------------------------------------------------------- #
# assert_safe
# --------------------------------------------------------------------------- #
def test_assert_safe_returns_value_when_clean():
    assert assert_safe("Hello there", field="Field") == "Hello there"


def test_assert_safe_raises_on_xss():
    with pytest.raises(ValueError, match="XSS"):
        assert_safe("<script>x</script>", field="Message")


def test_assert_safe_raises_on_sql_injection():
    with pytest.raises(ValueError, match="SQL injection"):
        assert_safe("1 UNION SELECT 1 FROM t", field="Message")
