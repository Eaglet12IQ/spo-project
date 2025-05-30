# Backend Dockerfile for FastAPI app
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY backend/req.txt .
RUN pip install --no-cache-dir -r req.txt

# Copy backend source code
COPY backend/ ./backend/

# Expose port
EXPOSE 8000

# Run alembic migrations and then start the app
CMD ["sh", "-c", "alembic revision --autogenerate -m 'initial migration' && alembic upgrade head && uvicorn backend.app.main:app --host 0.0.0.0 --port 8000"]
