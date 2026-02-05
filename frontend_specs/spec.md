# Frontend Specification

## 1. Overview
This document specifies the requirements for the **Frontend** of the Todo Full-Stack Web Application. The frontend will be a responsive, modern web application built with **Next.js 16+ (App Router)** that interacts with a Python FastAPI backend.

## 2. User Stories

### Authentication
*   **Sign Up**: As a new user, I want to create an account using my email and password so I can save my todos.
*   **Sign In**: As a returning user, I want to log in so I can access my private todo list.
*   **Sign Out**: As a logged-in user, I want to log out to secure my session.
*   **Session Persistence**: As a user, I want to remain logged in between page refreshes.

### Todo Management
*   **View Todos**: As a logged-in user, I want to see a list of my todos.
*   **Create Todo**: As a user, I want to add a new todo with a title and optional description.
*   **Update Todo**: As a user, I want to mark a todo as completed or update its details.
*   **Delete Todo**: As a user, I want to remove a todo I no longer need.
*   **Empty State**: As a user, I want to see a helpful message when I have no todos.

## 3. Technical Requirements

### 3.1 Framework & Core Libraries
*   **Framework**: Next.js 16+ (using App Router structure `/app`).
*   **Language**: TypeScript.
*   **Styling**: Tailwind CSS (via `postcss`).
*   **Icons**: Lucide React or similar lightweight library.
*   **State Management**: React Hooks (`useState`, `useEffect`, `useContext`) or TanStack Query (preferred for API data).

### 3.2 Authentication (Better Auth)
*   **Library**: **Better Auth** (or `next-auth` v5 beta if Better Auth is not available/stable, but strictly following the prompt's request for "Better Auth").
*   **Strategy**: JWT-based.
*   **Integration**:
    *   Frontend handles login/signup forms.
    *   On success, Better Auth creates a session/token.
    *   **Crucial**: The session token (JWT) MUST be accessible to be sent to the Python Backend in the `Authorization: Bearer <token>` header.
    *   The JWT secret used by Better Auth must match `BETTER_AUTH_SECRET` in the backend.

### 3.3 API Integration
*   **Base URL**: Configurable via environment variable `NEXT_PUBLIC_API_URL`.
*   **Headers**: All protected requests must include `Authorization: Bearer <token>`.
*   **Error Handling**: Graceful handling of 401 (redirect to login), 404, and 500 errors.

## 4. Page Structure (App Router)

*   `/app/page.tsx`: Landing page (redirects to `/dashboard` if logged in, else `/login`).
*   `/app/(auth)/login/page.tsx`: Login form.
*   `/app/(auth)/register/page.tsx`: Registration form.
*   `/app/dashboard/page.tsx`: Main application view (List of todos).
*   `/app/layout.tsx`: Root layout with providers (Auth, Theme).

## 5. UI/UX Design Guidelines
*   **Theme**: Clean, modern, minimal. White/Light Gray background.
*   **Responsiveness**: Mobile-first design.
*   **Components**:
    *   `Button`: Primary, Secondary, Destructive variants.
    *   `Input`: Text, Password.
    *   `Card`: Container for Todo items.
    *   `Modal/Dialog`: For creating/editing todos (optional, can be inline).
    *   `Toast`: For success/error notifications.

## 6. Constraints
*   **No Direct DB Access**: Frontend MUST NOT connect to the Postgres database directly.
*   **Strict Types**: TypeScript `interface` or `type` definitions must mirror Backend Pydantic models.
