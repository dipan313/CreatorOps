FROM python:3.11-slim

WORKDIR /app

# Set default server port environment variable
ENV PORT=8000

# Install system dependencies needed for ReportLab / build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies (supports repo root & backend context)
COPY requirements.txt* backend/requirements.txt* ./
RUN if [ -f backend/requirements.txt ]; then cp backend/requirements.txt requirements.txt; fi && \
    pip install --no-cache-dir -r requirements.txt

# Copy application source code (supports repo root & backend context)
COPY . .
RUN if [ -d backend/app ]; then cp -r backend/* .; fi

# Expose server port
EXPOSE 8000

# Run FastAPI app with uvicorn listening on dynamic $PORT assigned by Railway
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
