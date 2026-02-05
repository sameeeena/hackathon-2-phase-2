# Backend Specification - Todo API

## 1. Overview
The backend for the Todo application is a standalone RESTful API built with Python FastAPI. It handles data persistence, business logic, and security, providing a set of endpoints for the frontend (or any other client) to interact with.

## 2. Core Requirements
- **Independence**: The backend must be fully functional and testable without the frontend.
- **RESTful Design**: Adherence to REST principles for resource naming and HTTP methods.
- **Data Persistence**: Use SQLModel and Neon PostgreSQL for reliable storage.
- **Authentication**: Stateless JWT-based authentication (compatible with Better Auth).
- **Validation**: Strict request/response validation using Pydantic models (via SQLModel).

## 3. Features & Endpoints

### 3.1 Authentication (Middleware)
- The backend will not handle login/registration itself but will verify JWTs issued by the frontend's auth provider.
- **Middleware**: Validate `Authorization: Bearer <token>` on protected routes.

### 3.2 Todo Management
- `GET /todos`: List all todos for the authenticated user.
- `GET /todos/{id}`: Get details of a specific todo.
- `POST /todos`: Create a new todo.
- `PATCH /todos/{id}`: Update an existing todo (title, description, completed status).
- `DELETE /todos/{id}`: Delete a todo.

## 4. Technical Constraints
- **Stack**: Python 3.10+, FastAPI, SQLModel, Neon Postgres.
- **Environment Variables**:
    - `DATABASE_URL`: Connection string.
    - `JWT_SECRET`: For token verification.
- **Security**: CORS must be configured to allow requests from the frontend origin once known.

## 5. Acceptance Criteria
- [ ] API successfully connects to Neon Postgres.
- [ ] CRUD operations for Todos work as expected.
- [ ] Endpoints are protected by JWT verification.
- [ ] Automatic API documentation (Swagger/OpenAPI) is accessible at `/docs`.
