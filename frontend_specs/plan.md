# Frontend Implementation Plan

## 1. Architecture & Tech Stack

*   **Framework**: Next.js 16 (App Router).
*   **Language**: TypeScript.
*   **Styling**: Tailwind CSS.
*   **Authentication**: Better Auth (`better-auth`) with JWT strategy.
*   **State Management**: TanStack Query (React Query) v5.
*   **HTTP Client**: Axios or Fetch wrapper (configured with interceptors for Auth).
*   **Icons**: Lucide React.

## 2. Component Architecture

### Atoms (UI Primitives)
*   `Button`: Reusable button with variants (primary, ghost, destructive).
*   `Input`: Styled input fields.
*   `Label`: Form labels.
*   `Card`: Container for lists and items.
*   `Spinner`: Loading state indicator.

### Molecules (Composite)
*   `TodoItem`: Displays a single todo with checkbox and delete button.
*   `TodoForm`: Input field + "Add" button.
*   `AuthForm`: Generic form wrapper for Login/Register.
*   `Navbar`: User profile menu and Sign Out.

### Organisms (Features)
*   `TodoList`: Renders the list of `TodoItem`s, handles empty states.
*   `DashboardView`: Composes Navbar, TodoForm, and TodoList.

## 3. Data Flow Strategy

### Authentication Flow
1.  **Server-Side (Next.js)**: `better-auth` configured in `src/lib/auth.ts` (or `app/api/auth/[...all]/route.ts`).
2.  **Configuration**: It uses the same `BETTER_AUTH_SECRET` as the Python backend.
3.  **Token Sharing**:
    *   `better-auth` manages the session cookie.
    *   We need to extract the raw JWT or Session ID to send to the Python Backend.
    *   *Critical*: Ensure the Python backend accepts the token format `better-auth` produces, OR configure `better-auth` to sign a JWT that the Python backend can verify.
    *   *Plan B*: If `better-auth` token format is opaque, we will use a Next.js API Proxy (`/api/proxy/[...path]`) that validates the user session on Next.js side, and then proxies the request to Python Backend with a dedicated machine-to-machine secret or forwards the user claims.
    *   *Preferred Plan*: Shared Secret. Configure `better-auth` to sign tokens with HS256 using `BETTER_AUTH_SECRET`. Python Backend verifies this signature.

### API Interaction (React Query)
*   `useTodos()`: Hook to fetch list.
*   `useCreateTodo()`: Mutation to add.
*   `useUpdateTodo()`: Mutation to toggle/edit.
*   `useDeleteTodo()`: Mutation to remove.
*   **Optimistic Updates**: UI updates immediately before API confirms, rolls back on error.

## 4. Folder Structure (`frontend/`)

```
src/
  app/
    (auth)/
      login/page.tsx
      register/page.tsx
    dashboard/
      page.tsx
    layout.tsx
    page.tsx (Landing)
  components/
    ui/ (Button, Input, etc.)
    features/ (TodoItem, TodoList)
  lib/
    auth.ts (Better Auth config)
    api.ts (Axios instance)
    query-client.ts
  hooks/
    use-todos.ts
```

## 5. Development Phases

### Phase 1: scaffolding
*   Initialize Next.js app.
*   Install dependencies (`better-auth`, `tanstack/react-query`, `axios`, `clsx`, `tailwind-merge`).
*   Setup Tailwind.

### Phase 2: Authentication
*   Configure Better Auth.
*   Create Login/Register pages.
*   Verify token generation and consistency with Python Backend.

### Phase 3: Core UI & API Integration
*   Build UI primitives (Button, Input).
*   Setup React Query provider.
*   Implement `api.ts` with interceptors.
*   Build Dashboard and Todo CRUD.

### Phase 4: Polish
*   Error handling (Toasts).
*   Loading states (Skeletons).
*   Responsive check.
