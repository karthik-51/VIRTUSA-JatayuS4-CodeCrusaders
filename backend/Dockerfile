# Use a lightweight Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy entire backend code
COPY . .

# Expose backend API port (Flask)
EXPOSE 5000

# Run your central service starter
CMD ["python", "run_backend_services.py"]