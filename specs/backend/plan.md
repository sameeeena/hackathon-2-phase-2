# Backend Development Plan

This plan follows a strict **backend-first** approach. The backend is a standalone service that does not depend on the frontend runtime.

## Phase 1: Project Setup
- [ ] Initialize Python environment (venv) and install dependencies (`fastapi`, `uvicorn`, `sqlmodel`, `psycopg2-binary`, `python-dotenv`, `python-jose`).
- [ ] Configure `backend/main.py` with a basic health check endpoint.
- [ ] Set up `.env` configuration for `DATABASE_URL`, `JWT_SECRET`, and `JWT_ALGORITHM`.
- [ ] Configure CORS (Cross-Origin Resource Sharing) to allow frontend communication (initially `*`, then restricted).

## Phase 2: Neon PostgreSQL Connection
- [ ] Set up the `backend/core/database.py` module.
- [ ] Configure SQLModel `create_engine` with the Neon `DATABASE_URL`.
- [ ] Implement a `get_session` dependency for managing database transactions per request.
- [ ] Verify connection to the Neon instance.

## Phase 3: Database Models
- [ ] Create `backend/models` module.
- [ ] Define the `Todo` model with fields: `id`, `title`, `description`, `completed`, `created_at`, `updated_at`, and `user_id`.
- [ ] Note: `user_id` is a reference string (from the JWT sub claim) since users are managed externally (Better Auth).
- [ ] Configure automatic table creation on startup (for development).

## Phase 4: JWT Verification Middleware
- [ ] Implement `backend/core/security.py`.
- [ ] Create a dependency `get_current_user` that:
    1.  Extracts the `Authorization: Bearer <token>` header.
    2.  Decodes and verifies the JWT signature using `JWT_SECRET`.
    3.  Validates the expiration (`exp`).
    4.  Returns the `user_id` (sub) or raises 401 Unauthorized.
- [ ] Ensure strict statelessness (no server-side sessions).

## Phase 5: Secured API Routes
- [ ] Create `backend/api/routes/todos.py`.
- [ ] Implement CRUD operations:
    -   `POST /todos`: Create a new task.
    -   `GET /todos`: List all tasks.
    -   `GET /todos/{id}`: Get a specific task.
    -   `PATCH /todos/{id}`: Update a task.
    -   `DELETE /todos/{id}`: Delete a task.
- [ ] Apply the `get_current_user` dependency to all these routes to ensure they are protected.

## Phase 6: Task Ownership Enforcement
- [ ] Update CRUD logic to enforce that users can **only** access their own tasks.
- [ ] **Create**: Automatically assign the `user_id` from the token to the new task.
- [ ] **Read/Update/Delete**: Always filter queries by `user_id` (e.g., `select(Todo).where(Todo.user_id == current_user_id)`).
- [ ] Return 404 Not Found (instead of 403 Forbidden) if a user tries to access a task ID that belongs to someone else (security best practice).

## Phase 7: Error Handling & Response Standards
- [ ] Standardize API responses (JSON).
- [ ] Implement global exception handlers for:
    -   Validation errors (422).
    -   Authentication errors (401).
    -   Resource not found (404).
    -   Server errors (500).

## Phase 8: Local Development & Testing
- [ ] Create `tests/` directory.
- [ ] Configure `pytest` with a dedicated test database (or mock session).
- [ ] Write integration tests for:
    -   Auth middleware (valid/invalid tokens).
    -   CRUD operations (happy paths).
    -   Ownership isolation (ensure User A cannot see User B's tasks).

## Phase 9: Deployment Readiness
- [ ] Create a `Dockerfile` (if containerizing) or `vercel.json` (for Vercel).
- [ ] Ensure the application is stateless and configuration is strictly environment-variable driven.
- [ ] Verify that no secrets are hardcoded.