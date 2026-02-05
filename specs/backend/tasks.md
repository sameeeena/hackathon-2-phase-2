# Backend Task Breakdown

## 1. Setup Tasks

### [BACK-001] Project Initialization
- **Description**: Initialize the Python environment, install dependencies, and set up the basic FastAPI application structure.
- **Input**: `requirements.txt`, python environment.
- **Output**: Functional `backend` directory with `venv`, `main.py`, and installed packages.
- **Dependencies**: None.
- **Completion Criteria**: `python -m backend.main` runs without errors; `/health` endpoint returns 200.
- **Status**: [x] Complete

### [BACK-002] Environment Configuration
- **Description**: Create `.env` file for managing configuration secrets.
- **Input**: Database URL, JWT Secret.
- **Output**: `.env` file and `.env.example`.
- **Dependencies**: None.
- **Completion Criteria**: App loads variables via `python-dotenv`.
- **Status**: [x] Complete

### [BACK-003] CORS Configuration
- **Description**: Configure Cross-Origin Resource Sharing to allow frontend access.
- **Input**: List of allowed origins (localhost, production URL).
- **Output**: configured `CORSMiddleware`.
- **Dependencies**: [BACK-001]
- **Completion Criteria**: Options requests from allowed origins return 200.
- **Status**: [x] Complete

## 2. Database Tasks

### [BACK-004] Database Connection Setup
- **Description**: Implement SQLModel engine and session dependency.
- **Input**: `DATABASE_URL` env var.
- **Output**: `backend/core/database.py` module.
- **Dependencies**: [BACK-002]
- **Completion Criteria**: `get_session` yields a valid database session.
- **Status**: [x] Complete

### [BACK-005] Database Model Definition
- **Description**: Define the `Todo` data model with SQLModel.
- **Input**: Schema requirements (id, title, user_id, etc.).
- **Output**: `backend/models/todo.py` class.
- **Dependencies**: [BACK-004]
- **Completion Criteria**: Model includes `user_id` index; tables created on startup.
- **Status**: [x] Complete

## 3. Authentication Tasks

### [BACK-006] JWT Verification Middleware
- **Description**: Implement dependency to verify JWT tokens and extract user ID.
- **Input**: `Authorization: Bearer <token>` header.
- **Output**: Authenticated `user_id` string.
- **Dependencies**: [BACK-002]
- **Completion Criteria**: Valid token returns user_id; invalid token raises 401 Unauthorized; missing token raises 401.
- **Failure**: Return 401 Unauthorized.
- **Status**: [x] Complete

## 4. API Implementation Tasks

### [BACK-007] Implement Create Todo (POST)
- **Description**: Endpoint to create a new task.
- **Input**: JSON body (`title`, `description`), Auth User.
- **Output**: Created Todo object with assigned `user_id`.
- **Dependencies**: [BACK-005], [BACK-006]
- **Completion Criteria**: Record is saved to DB with correct `user_id`.
- **Status**: [x] Complete

### [BACK-008] Implement Read Todos (GET List)
- **Description**: Endpoint to list tasks for the current user.
- **Input**: Auth User, pagination params.
- **Output**: List of Todo objects.
- **Dependencies**: [BACK-007]
- **Completion Criteria**: Returns only tasks belonging to the requesting `user_id`.
- **Status**: [x] Complete

### [BACK-009] Implement Read Todo (GET Detail)
- **Description**: Endpoint to get a specific task.
- **Input**: `todo_id`, Auth User.
- **Output**: Todo object.
- **Dependencies**: [BACK-008]
- **Completion Criteria**: Returns task if owned by user; 404 if not found or owned by another.
- **Status**: [x] Complete

### [BACK-010] Implement Update Todo (PATCH)
- **Description**: Endpoint to update a task.
- **Input**: `todo_id`, JSON body (partial), Auth User.
- **Output**: Updated Todo object.
- **Dependencies**: [BACK-009]
- **Completion Criteria**: Updates fields; preserves `user_id`; 404 if unauthorized.
- **Status**: [x] Complete

### [BACK-011] Implement Delete Todo (DELETE)
- **Description**: Endpoint to delete a task.
- **Input**: `todo_id`, Auth User.
- **Output**: Success message.
- **Dependencies**: [BACK-010]
- **Completion Criteria**: Record removed from DB; 404 if unauthorized.
- **Status**: [x] Complete

## 5. Security Enforcement Tasks

### [BACK-012] Enforce Task Ownership
- **Description**: Ensure all database queries filter by `user_id`.
- **Input**: `user_id` from JWT.
- **Output**: Scoped database queries.
- **Dependencies**: [BACK-006]
- **Completion Criteria**: Users strictly cannot access data belonging to others.
- **Status**: [x] Complete

### [BACK-013] Deployment Configuration
- **Description**: Configure app for serverless deployment (Vercel).
- **Input**: `vercel.json` config.
- **Output**: Deployable artifact.
- **Dependencies**: All previous.
- **Completion Criteria**: `main.py` is exposed correctly as an entry point.
- **Status**: [x] Complete

## 6. Testing Tasks

### [BACK-014] Unit & Integration Testing
- **Description**: Verify all functionality with automated tests.
- **Input**: Test suite (`pytest`).
- **Output**: Pass/Fail report.
- **Dependencies**: All previous.
- **Completion Criteria**: 100% pass rate for critical paths (Auth, CRUD, Security).
- **Status**: [x] Complete
