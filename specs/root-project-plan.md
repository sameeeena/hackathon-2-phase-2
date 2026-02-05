# Project Architecture & Folder Structure (Root-Level Plan)

## 1. Project Overview & Scope

*   **Project Context**: This document outlines the architectural blueprint for **Phase II of Hackathon 2: Todo Full-Stack Web Application**.
*   **Primary Objective**: To build a robust, scalable, and secure full-stack Todo application using a modern tech stack with a strict backend-first development approach.
*   **In Scope**:
    *   Definition of the root-level folder structure.
    *   Detailed specification of the Backend technology stack (Python FastAPI, SQLModel, Neon Postgres).
    *   Detailed specification of the Frontend technology stack (Next.js 16+, Better Auth).
    *   Establishment of the backend-first development strategy.
    *   Definition of authentication and environment variable strategies.
*   **Out of Scope**:
    *   Detailed UI/UX design wireframes or mockups.
    *   Specific implementation details of individual features (to be defined in subsequent task specs).
    *   Non-core features or extensions not explicitly required for Phase II.

## 2. Root-Level Project Structure and Folder Responsibilities

The project will adhere to the following mandatory root folder structure:

```
/todo-app
  /backend   → Python FastAPI service
  /frontend  → Next.js 16+ App Router application
  /specs     → specification, plan, tasks, implementation files
  README.md
```

*   **`/backend`**: Contains the complete Python FastAPI service. This includes API routes, database models, business logic, and backend-specific configurations. It operates independently of the frontend.
*   **`/frontend`**: Contains the Next.js 16+ App Router application. This includes pages, components, client-side logic, and integration with the backend API.
*   **`/specs`**: Serves as the central repository for project documentation, including this architectural plan, detailed task breakdowns (`tasks.md`), implementation guides, and other specification files.
*   **`README.md`**: The entry point for the project, providing high-level documentation, setup instructions, and links to more detailed specs.

## 3. Key Development Strategy & Rationale

*   **Backend-First Approach**: Development **MUST** proceed with the backend first. The API must be fully functional and tested before significant frontend development begins.
*   **Rationale**:
    *   **Contract Stability**: Establishing a stable API contract (endpoints, request/response schemas) early allows the frontend to be built against a concrete specification, reducing integration friction.
    *   **Separation of Concerns**: Enforces a strict boundary between data management/business logic (backend) and user interface/presentation (frontend).
    *   **Testing & Validation**: Allows for thorough testing of business logic and data integrity via API tests without UI dependencies.
    *   **Parallel Development Potential**: Once the API contract is frozen, frontend work can proceed with mocked data or the actual API without blocking on backend changes.

## 4. Technology Stack Definitions

### Backend Tech Stack
*   **Python FastAPI**: Chosen for its high performance, ease of use, and native support for asynchronous programming, making it ideal for modern RESTful APIs.
*   **SQLModel ORM**: Combines SQLAlchemy and Pydantic to provide a declarative, Pythonic way to interact with the SQL database and define data models, reducing boilerplate.
*   **Neon Serverless PostgreSQL**: A scalable, managed Postgres solution that fits the serverless paradigm and offers easy scaling.
*   **JWT Verification (Better Auth compatible)**: The backend will implement stateless authentication by verifying JWTs. It will be designed to be compatible with tokens issued/managed by Better Auth on the frontend.
*   **RESTful API Only**: The backend is strictly an API provider; it serves JSON data, not HTML or static assets for the frontend.

### Frontend Tech Stack
*   **Next.js 16+ (App Router)**: A React framework providing server-side rendering, static site generation, and advanced routing capabilities for a performant and SEO-friendly user experience.
*   **Better Auth**: utilized for handling user authentication flows (sign-up, sign-in, session management) seamlessly within the Next.js ecosystem.
*   **JWT Token Handling**: The frontend will securely manage JWTs obtained via Better Auth and include them in the Authorization header of requests to the backend API.

## 5. Authentication Flow & Security Considerations

*   **JWT-Based Authentication Flow**:
    1.  User logs in via the Frontend using **Better Auth**.
    2.  Upon successful authentication, Better Auth issues a JWT.
    3.  The Frontend retrieves this JWT and attaches it as a Bearer token in the `Authorization` header for all protected API requests to the Backend.
    4.  The Backend middleware intercepts the request, validates the JWT signature and claims (using the shared secret/key), and either grants access or returns a 401 Unauthorized response.
*   **Environment Variable Strategy**:
    *   **`BETTER_AUTH_SECRET`**: Used to sign/encrypt and verify authentication tokens. Shared logic or keys must be consistent to ensure the backend can verify tokens issued by the frontend auth system.
    *   **`DATABASE_URL`**: Connection string for the Neon Serverless PostgreSQL database.
    *   **Management**:
        *   **Local Development**: Stored in `.env` files (e.g., `.env.local`, `.env.development`) which are git-ignored to prevent leaking secrets.
        *   **Production**: Injected securely via the hosting platform's environment variable management system.
        *   **Constraint**: Secrets and database URLs must **NEVER** be hardcoded in the codebase.

## 6. Acceptance Criteria / Validation Checks

- [ ] **Structure**: Root folders `/backend`, `/frontend`, `/specs` created.
- [ ] **Backend Plan**: FastAPI, SQLModel, Neon, JWT verification defined.
- [ ] **Frontend Plan**: Next.js 16+, Better Auth defined.
- [ ] **Strategy**: Backend-first approach explicitly documented and adopted.
- [ ] **Security**: Env vars (`BETTER_AUTH_SECRET`, `DATABASE_URL`) identified and JWT flow mapped.

## 7. Follow-ups and Risks

*   **Immediate Action**: Initialize the `backend` directory and set up the basic FastAPI project structure with `uv` or `poetry`.
*   **Immediate Action**: Set up the Neon PostgreSQL database instance and obtain the `DATABASE_URL`.
*   **Risk**: Ensuring strict type compatibility between the frontend TypeScript types and backend Pydantic models (consider code generation or shared schemas later).
