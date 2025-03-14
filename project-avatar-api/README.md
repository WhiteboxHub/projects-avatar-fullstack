# Project Avatar API

## Setup and Installation

### Running Locally (Mac & Windows)

#### 1. Clone this repository to your local machine:
```bash
git clone https://github.com/WhiteboxHub/projects-avatar-fullstack.git
cd projects-avatar-fullstack/project-avatar-api
```

#### 2. Set up a Virtual Environment

- **For Windows:**
  ```powershell
  python -m venv myvenv
  venv\Scripts\activate
  ```

- **For Mac/Linux:**
  ```bash
  python3 -m venv venv
  source myvenv/bin/activate
  ```

#### 3. Install the required Python dependencies:
```bash
pip install -r requirements.txt
```

#### 4. Ensure your MySQL database is up and running.
- Update the `DATABASE_URL` connection string in your code to point to the existing database.

#### 5. Run the app locally:
```bash
uvicorn app.main:app --reload
```

#### 6. The app should now be running at `http://127.0.0.1:8000`.

## Running with Docker

#### 1. Build the Docker image:
```bash
docker build -t project-avatar-api .
```

#### 2. Run the container:
```bash
docker run -p 8000:8000 project-avatar-api
```

#### 3. The app should now be accessible at `http://localhost:8000`.

#### 4. To stop the container, find the container ID and remove it:
```bash
docker ps  # Lists running containers
docker stop <container_id>
```

#### 5. To remove all unused images and containers:
```bash
docker system prune -a
```

## Testing the API with Postman

1. **Get Batches:**
   - **Method**: `GET`
   - **Endpoint**: `/batch/batches`
   - **Description**: Fetches all the existing batches from the database.
   - **Response**: A list of batches.

2. **Insert New Batch:**
   - **Method**: `POST`
   - **Endpoint**: `/batch/insert`
   - **Description**: Inserts a new batch into the database.
   - **Body**: JSON with batch details (example):
     ```json
     {
       "batch_name": "New Batch",
       "batch_code": "NB001"
     }
     ```
   - **Response**: Confirmation of the inserted batch.

3. **Delete a Batch:**
   - **Method**: `DELETE`
   - **Endpoint**: `/batch/delete/{batch_id}`
   - **Description**: Deletes a batch with the specified `batch_id`.
   - **Response**: Confirmation of deletion.

## Example Endpoints

### Get Batches
```http
GET /batch/batches
```
- Response Example:
```json
[
  {
    "id": 1,
    "batch_name": "Batch 1",
    "batch_code": "B001"
  },
  {
    "id": 2,
    "batch_name": "Batch 2",
    "batch_code": "B002"
  }
]
```

### Insert New Batch
```http
POST /batch/insert
```
- Body:
```json
{
  "batch_name": "New Batch",
  "batch_code": "NB001"
}
```
- Response Example:
```json
{
  "message": "Batch inserted successfully",
  "batch": {
    "id": 3,
    "batch_name": "New Batch",
    "batch_code": "NB001"
  }
}
```

### Delete a Batch
```http
DELETE /batch/delete/3
```
- Response Example:
```json
{
  "message": "Batch deleted successfully"
}
```

## Notes
- Make sure to update the database connection details according to your setup.
- This API is intended for basic batch operations and can be extended with additional routes as needed.
- Using Docker ensures that the API runs in a consistent environment across different systems.
