FROM python:3.9

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file to the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .
<<<<<<< HEAD
# Set environment variable to control which .env file to use
COPY .env .env
=======

# Set environment variable to control which .env file to use
COPY .env .env


>>>>>>> a9385fe7f370ff17031408577a9aaae61c0dbb18
# Expose the FastAPI default port
EXPOSE 8005

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8005"]
