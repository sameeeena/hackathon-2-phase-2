# Backend Implementation Guide

This document details the implementation of the independent Python FastAPI backend.

## 1. Project Structure
```
/backend
  /api
    /routes
      todos.py       # CRUD endpoints with ownership check
  /core
    database.py      # Neon DB connection & session dependency
    security.py      # JWT verification using BETTER_AUTH_SECRET
  /models
    todo.py          # SQLModel definition
  main.py            # App entry point, CORS, Lifespan
  vercel.json        # Deployment config
  requirements.txt   # Dependencies
```

## 2. Database Connection (Neon)
**File:** `backend/core/database.py`
- Uses `sqlmodel.create_engine` with `DATABASE_URL`.
- Provides `get_session` dependency for safe transaction management.
- Handles `postgres://` to `postgresql://` conversion for SQLAlchemy compatibility.

## 3. Data Models
**File:** `backend/models/todo.py`
```python
class Todo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    completed: bool = False
    created_at: datetime
    updated_at: datetime
    user_id: str = Field(index=True) # Critical for ownership
```

## 4. Authentication & Security
**File:** `backend/core/security.py`
- **Rule:** JWT Secret **MUST** come from `BETTER_AUTH_SECRET`.
- **Logic:**
    1.  Extracts Bearer token from `Authorization` header.
    2.  Decodes using `HS256` (default) and `BETTER_AUTH_SECRET`.
    3.  Returns `sub` claim (user ID) or raises 401.
- **Dependency:** `get_current_user` is injected into all protected routes.

## 5. API Routes & Ownership Enforcement
**File:** `backend/api/routes/todos.py`
- **Create:** `user_id` is automatically set from the auth token.
  ```python
  todo.user_id = current_user_id
  ```
- **Read/List:** Queries are strictly filtered by `user_id`.
  ```python
  select(Todo).where(Todo.user_id == current_user_id)
  ```
- **Update/Delete:** Checks ownership before modification. If `todo.user_id != current_user_id`, returns **404 Not Found** (to prevent ID enumeration/leaks).

## 6. Deployment (Serverless)
**File:** `backend/vercel.json`
- Configured for Vercel Python runtime.
- Entry point: `main.py`.
- Stateless design ensures compatibility with serverless scaling.

## 7. Example Payloads

### Request: Create Todo
`POST /todos/`
```json
{
  "title": "Finish Hackathon",
  "description": "Implement frontend integration",
  "completed": false
}
```

### Response: Success
`200 OK`
```json
{
  "id": 1,
  "title": "Finish Hackathon",
  "description": "Implement frontend integration",
  "completed": false,
  "created_at": "2026-01-03T12:00:00Z",
  "updated_at": "2026-01-03T12:00:00Z",
  "user_id": "user_2jd8..."
}
```

### Response: Unauthorized
`401 Unauthorized`
```json
{
  "detail": "Not authenticated"
}
```
