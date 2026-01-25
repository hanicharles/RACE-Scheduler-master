# 🗓️ Race Scheduler

A comprehensive full-stack scheduling application designed to manage events with features like user authentication, calendar views, and conflict detection.

## 📋 Table of Contents
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Scripts & Utilities](#-scripts--utilities)

## 🔧 Tech Stack

### Backend
- **Framework:** FastAPI
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Authentication:** JWT (JSON Web Tokens)
- **Migrations:** Alembic
- **Other:** Pydantic, Passlib (Bcrypt), Python-Jose

### Frontend
- **Framework:** React
- **Language:** TypeScript
- **UI Component Library:** Ant Design (antd)
- **Calendar:** FullCalendar
- **State/Routing:** React Router DOM
- **HTTP Client:** Axios
- **PDF Generation:** jsPDF

## 📂 Project Structure

```
RACE-Scheduler-master-main/
├── scheduler-app/       # Backend (FastAPI Application)
│   ├── app/             # Application source code
│   │   ├── routers/     # API Endpoints (users, events, notifications)
│   │   └── ...
│   ├── alembic/         # Database migrations
│   ├── requirements.txt # Python dependencies
│   └── ...
├── scheduler-ui/        # Frontend (React Application)
│   ├── src/             # Frontend source code
│   ├── package.json     # Node.js dependencies
│   └── ...
└── README.md            # Project documentation
```

## 🛠️ Prerequisites

Ensure you have the following installed on your system:
- **Python:** 3.8+
- **Node.js:** 16+ (LTS recommended)
- **PostgreSQL:** Database server running locally or accessible remotely.

## 🚀 Installation & Setup

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd scheduler-app
    ```

2.  Create a virtual environment:
    ```bash
    python -m venv venv
    ```

3.  Activate the virtual environment:
    - **Windows:**
      ```bash
      venv\Scripts\activate
      ```
    - **Mac/Linux:**
      ```bash
      source venv/bin/activate
      ```

4.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd scheduler-ui
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## ⚙️ Configuration

### Backend Environment Variables

1.  Create a `.env` file in the `scheduler-app` directory.
2.  Add the following variables (adjust values to your PostgreSQL configuration):

    ```ini
    DB_USER=postgres
    DB_PASSWORD=your_password
    DB_HOST=localhost
    DB_NAME=race_scheduler_db
    SECRET_KEY=your_secret_key
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    ```

> **Note:** Ensure a PostgreSQL database exists with the name specified in `DB_NAME`.

## ▶️ Running the Application

### Start the Backend

Make sure your virtual environment is activated and you are in the `scheduler-app` directory.

```bash
uvicorn app.main:app --reload
```
The API will be available at `http://localhost:8000`.
A Swagger UI for API documentation is available at `http://localhost:8000/docs`.

### Start the Frontend

In a new terminal, navigate to the `scheduler-ui` directory.

```bash
npm start
```
The application will launch in your browser at `http://localhost:3000`.

## 📬 API Endpoints

Key endpoints available in the backend:

- **Users**
    - `POST /users/register`: Register a new user.
    - `POST /users/login`: Authenticate and get a token.
- **Events**
    - `GET /events`: Retrieve all events.
    - `POST /events`: Create a new event.
- **Notifications**
    - `GET /notifications`: Get user notifications.

*Refer to the `/docs` endpoint on the running backend server for the full interactive API documentation.*

## 🛠️ Scripts & Utilities

The `scheduler-app` directory contains several utility scripts for database management and debugging:

- **`create_tables.py`**: Initializes database tables based on models.
- **`seed_db.py`**: Populates the database with initial test data.
- **`reset_db.py`**: Clears and resets the database.
- **`verify_admin.py`**: Checks or verifies admin user privileges.
- **`restore_user.py`**: Utility to restore deleted or modified users (if implemented).

To run these scripts, ensure your virtual environment is active:
```bash
python seed_db.py
```
