# projects-avatar-fullstack

A full-stack project that includes a frontend, backend API, and a local MySQL database. The goal is to set up and run all three components using Docker Compose.

## Getting Started

### Prerequisites

- Install [Docker](https://docs.docker.com/get-docker/)
- Install [Docker Compose](https://docs.docker.com/compose/install/)
- Install [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) or any other database client to test connections.

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/WhiteboxHub/projects-avatar-fullstack.git
   cd projects-avatar-fullstack
   ```

2. **Database Setup**
   - Navigate to the `db/` directory and add the required `.sql` file.
   - Ensure the database volumes are set up correctly.

3. **Configure Database Credentials**
   - Use the correct database name, password, host, and port to connect to the local MySQL database/any 
   - DB_PASSWORD=strongpassword123
   - DB_USERNAME=root
   - DB_NAME=wbl_db
   - PORT=3306

4. **Build and Run the Project using Docker Compose**
   - First, build the containers in detached mode:
     ```bash
     docker compose build 
     ```
   - Then, bring up the services:
     ```bash
     docker compose up -d
     ```

5. **Access the Application**
   - Navigate to `http://localhost:3000/admin`
   - Login using your email/username

6. **Database Connection Testing**
   - You can connect to the MySQL database using MySQL Workbench or any database client.
   - Create a new connection and enter the database credentials.
   - Test the connection to ensure proper setup.

## Contributors

- WhiteBox Learning

