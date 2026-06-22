# Backend image — FastAPI served by uvicorn
# Build context is ./backend, so all COPY paths are relative to backend/
FROM python:3.12-slim

# Avoid writing .pyc files and buffer stdout/stderr for proper log streaming
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# System deps. psycopg2-binary and bcrypt ship prebuilt wheels, but libpq
# runtime libs and build essentials keep things robust across base updates.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        libpq5 \
        curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies first to leverage Docker layer caching
COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
