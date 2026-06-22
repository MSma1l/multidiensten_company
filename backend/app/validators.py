"""Security validation helpers.

These functions provide *defence in depth* on top of the ORM's parameterised
queries: they reject obvious XSS and SQL-injection payloads before any value
is ever persisted. They are intentionally conservative — a couple of false
positives on hostile-looking input is an acceptable price for blocking
malicious content on a simple contact form.

All checks are case-insensitive.
"""

from __future__ import annotations

import re

# ---------------------------------------------------------------------------- #
# XSS detection
# ---------------------------------------------------------------------------- #

# Literal substrings that should never appear in a name / email / phone, and
# that are dangerous even inside free-text messages.
_XSS_SUBSTRINGS: tuple[str, ...] = (
    "<script",
    "</script",
    "javascript:",
    "vbscript:",
    "data:text/html",
    "<iframe",
    "<img",
    "<svg",
    "<object",
    "<embed",
    "<style",
    "<link",
    "<meta",
    "<base",
    "&#",          # HTML numeric character reference (encoding-based bypass)
    "&lt;script",
    "expression(",  # legacy CSS expression() XSS
)

# Inline event handler attributes such as ``onerror=`` / ``onload=``.
# Matches ``on<word>`` optionally followed by whitespace and ``=``.
_EVENT_HANDLER_RE = re.compile(r"on[a-z]+\s*=", re.IGNORECASE)

# Any angle bracket — used for the stricter checks on short/structured fields.
_ANGLE_BRACKET_RE = re.compile(r"[<>]")


def contains_xss(value: str, *, strict: bool = True) -> bool:
    """Return ``True`` if *value* looks like an XSS attempt.

    Parameters
    ----------
    value:
        The raw user-supplied string.
    strict:
        When ``True`` (the default, used for names / email / phone) the mere
        presence of an angle bracket ``<`` / ``>`` is rejected. When ``False``
        (used for the free-text message) angle brackets are tolerated but the
        known-dangerous substrings and event handlers above are still blocked.
    """
    if not value:
        return False

    lowered = value.lower()

    # Known-dangerous literal tokens (applies in both modes).
    for token in _XSS_SUBSTRINGS:
        if token in lowered:
            return True

    # Inline event handlers like onerror= / onload= / onmouseover=.
    if _EVENT_HANDLER_RE.search(lowered):
        return True

    # In strict mode, no raw angle brackets are allowed at all.
    if strict and _ANGLE_BRACKET_RE.search(value):
        return True

    return False


# ---------------------------------------------------------------------------- #
# SQL injection detection
# ---------------------------------------------------------------------------- #

# Regex patterns that catch classic injection signatures. Word boundaries and
# explicit spacing keep them from firing on ordinary prose.
_SQLI_PATTERNS: tuple[re.Pattern[str], ...] = (
    re.compile(r"'\s*or\s", re.IGNORECASE),          # ' OR
    re.compile(r'"\s*or\s', re.IGNORECASE),          # " OR
    re.compile(r"\bor\s+1\s*=\s*1\b", re.IGNORECASE),  # OR 1=1
    re.compile(r"\band\s+1\s*=\s*1\b", re.IGNORECASE),  # AND 1=1
    re.compile(r"\bunion\s+select\b", re.IGNORECASE),
    re.compile(r"\bdrop\s+table\b", re.IGNORECASE),
    re.compile(r"\binsert\s+into\b", re.IGNORECASE),
    re.compile(r"\bdelete\s+from\b", re.IGNORECASE),
    re.compile(r"\bupdate\b.+\bset\b", re.IGNORECASE),
    re.compile(r"\bselect\b.+\bfrom\b", re.IGNORECASE),
    re.compile(r"\btruncate\s+table\b", re.IGNORECASE),
    re.compile(r"\balter\s+table\b", re.IGNORECASE),
    re.compile(r"\bexec(\s|\()", re.IGNORECASE),       # exec / exec(
    re.compile(r"\bxp_\w+", re.IGNORECASE),            # xp_cmdshell etc.
    re.compile(r"\bsp_\w+", re.IGNORECASE),
)

# Literal tokens that are always suspicious. ``--`` and the stacked-query
# semicolon are only blocked in strict mode (see below) since they appear in
# legitimate prose occasionally; the comment-block markers are always blocked.
_SQLI_SUBSTRINGS_ALWAYS: tuple[str, ...] = (
    "/*",
    "*/",
    ";--",
    "' --",
    '" --',
    "'--",
)

# These are noisy in free text, so only enforced in strict mode.
_SQLI_SUBSTRINGS_STRICT: tuple[str, ...] = (
    "--",
    ";",
)


def contains_sql_injection(value: str, *, strict: bool = True) -> bool:
    """Return ``True`` if *value* contains classic SQL-injection signatures.

    The regex patterns (UNION SELECT, DROP TABLE, OR 1=1, ...) are always
    enforced. In ``strict`` mode (names / email / phone) additional, noisier
    tokens such as a bare ``--`` or ``;`` are also rejected. The free-text
    message uses ``strict=False`` so ordinary punctuation passes while genuine
    injection attempts are still blocked.
    """
    if not value:
        return False

    lowered = value.lower()

    for token in _SQLI_SUBSTRINGS_ALWAYS:
        if token in lowered:
            return True

    if strict:
        for token in _SQLI_SUBSTRINGS_STRICT:
            if token in value:
                return True

    for pattern in _SQLI_PATTERNS:
        if pattern.search(value):
            return True

    return False


# ---------------------------------------------------------------------------- #
# Convenience: combined guard used by the schemas
# ---------------------------------------------------------------------------- #


def assert_safe(value: str, *, field: str, strict: bool = True) -> str:
    """Validate *value* and return it unchanged, or raise ``ValueError``.

    Designed to be called from pydantic field validators so that FastAPI
    surfaces a 422 response naming the offending field.
    """
    if contains_xss(value, strict=strict):
        raise ValueError(f"{field} contains potentially malicious content (XSS).")
    if contains_sql_injection(value, strict=strict):
        raise ValueError(
            f"{field} contains potentially malicious content (SQL injection)."
        )
    return value
