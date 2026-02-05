# Frontend Implementation Guide (Phase II)

This document serves as the comprehensive guide for implementing the Next.js Frontend. It is designed to consume the existing, immutable FastAPI backend.

## 1. Frontend Folder Structure

The project follows a standard Next.js 16+ App Router structure with clear separation of concerns.

```
/frontend
  /app
    /(auth)              # Route Group: Public auth pages (login, register)
      /login/page.tsx
      /register/page.tsx
      layout.tsx
    /(dashboard)         # Route Group: Protected app pages
      /dashboard/page.tsx
      layout.tsx         # Contains Navbar/Sidebar
    /api/auth/[...all]   # Better Auth API route
      route.ts
    globals.css          # Tailwind imports & global styles
    layout.tsx           # Root layout
    page.tsx             # Landing page (redirects to dashboard or login)
  /components
    /ui                  # Reusable UI primitives (Button, Input, Modal)
    /dashboard           # Feature-specific components (TodoList, TodoItem)
    /auth                # Auth forms (SignInForm, SignUpForm)
  /lib
    api.ts               # Centralized API client
    auth.ts              # Better Auth configuration
    auth-client.ts       # Better Auth client-side instance
    utils.ts             # CN/Tailwind merge helpers
  /types
    index.ts             # Shared interfaces (Todo, User, ApiError)
  middleware.ts          # Route protection logic
  .env.local             # Environment secrets
```

## 2. Environment Configuration

Secure configuration is paramount for the "Shared Secret" architecture between Frontend and Backend.

**Required Variables (`.env.local`):**
*   `NEXT_PUBLIC_API_URL`: The absolute URL of the Python Backend (e.g., `http://localhost:8000`). Used by the API client.
*   `BETTER_AUTH_SECRET`: **CRITICAL**. This must match the backend's `BETTER_AUTH_SECRET`. It is used to sign the JWTs. Next.js uses this to issue tokens; Python uses this to verify them.
*   `BETTER_AUTH_URL`: The base URL of the Next.js application (e.g., `http://localhost:3000`).

**Security Note:** `BETTER_AUTH_SECRET` is a server-side only variable. It is never exposed to the client bundle.

## 3. Better Auth Configuration

We use Better Auth with the JWT plugin to ensure sessions result in a portable token compatible with the backend.

**Implementation Steps (`lib/auth.ts`):**
1.  **Initialize**: Import `betterAuth` from `better-auth`.
2.  **Database**: Since the frontend does not own the data, use the backend's database connection or a lightweight adapter if Better Auth requires persistence, OR configure it to be stateless/JWT-only if supported by the specific Better Auth version used. *Note: For this Hackathon, we assume Better Auth manages user persistence in the shared database or a separate table, but the key output is the JWT.*
3.  **JWT Strategy**: Explicitly enable `session: { strategy: "jwt" }`.
4.  **Providers**: Enable `emailAndPassword`.

**Token issuance:**
Upon successful login, Better Auth generates a JWT signed with `HS256` (default) using `BETTER_AUTH_SECRET`. This matches the backend's `python-jose` verification expectation.

## 4. JWT Token Handling

The Frontend acts as a secure courier for the JWT.

*   **Retrieval**:
    *   **Server Components**: Use `auth.api.getSession({ headers: await headers() })`.
    *   **Client Components**: Use the `useSession` hook from the auth client.
*   **Storage**: Better Auth handles storage automatically (typically `httpOnly` cookies).
*   **Accessibility**: The raw JWT string is accessible via the session object (e.g., `session.token` or `session.session.token`).
*   **Expiration**: Handled by the middleware and API client. If a token is expired, requests fail, and the user is redirected.
*   **Logout**: Calling `authClient.signOut()` clears the cookies locally.

## 5. API Client Implementation

A centralized `fetch` wrapper in `lib/api.ts` ensures consistency and security.

**Features:**
1.  **Base URL Prepending**: Automatically prepends `NEXT_PUBLIC_API_URL`.
2.  **Token Injection**:
    *   On the **Server**: Extracts token from request headers/cookies.
    *   On the **Client**: Extracts token from the active session hook.
    *   Adds `Authorization: Bearer <token>` to the request.
3.  **Error Normalization**: Catches `fetch` errors and returns standardized error objects.
4.  **401 Interception**: If the backend returns `401 Unauthorized`, the client throws a specific error that triggers a redirect to `/login` (or clears the session).

**Example Flow:**
`UI Component` -> `api.get('/todos')` -> `Add Bearer Header` -> `FastAPI Backend`

## 6. Route Protection Strategy

**Public Routes:**
*   `/login`
*   `/register`
*   `/` (Landing)

**Protected Routes:**
*   `/dashboard/**` (All dashboard sub-pages)

**Implementation (`middleware.ts`):**
*   Uses Better Auth's middleware helper.
*   Checks if a session exists.
*   **Logic**:
    *   If user is **Unauthenticated** and visits `/dashboard` -> Redirect to `/login`.
    *   If user is **Authenticated** and visits `/login` -> Redirect to `/dashboard`.

## 7. Task Management UI Implementation

The UI is "dumb" regarding permissions; it simply renders what the API returns.

*   **Fetching Tasks**: `dashboard/page.tsx` (Server Component) calls `api.get("/todos/")`. The backend uses the JWT to filter results to *only* the logged-in user.
*   **Creating Tasks**: Client component `<AddTodoForm />` calls `api.post("/todos/", { title })`.
    *   *Note*: The frontend sends the payload. The backend extracts `user_id` from the token. The frontend **never** sends `user_id` manually.
*   **Updating/Deleting**: `<TodoItem />` calls `api.patch` or `api.delete`.
    *   Optimistic updates can be used via `useOptimistic` or standard `router.refresh()` after mutation.

## 8. State Management & UX

*   **Loading States**:
    *   Wrap dashboard in `<Suspense fallback={<DashboardSkeleton />}>`.
    *   Show "Submitting..." state on buttons during API calls.
*   **Empty States**: If `todos.length === 0`, render a friendly "You have no tasks. Create one!" illustration.
*   **Error Handling**:
    *   **Toast Notifications**: Use a library like `sonner` or `react-hot-toast` to show "Task created" or "Failed to delete".
    *   **Boundaries**: Use `error.tsx` in the dashboard route to catch server-side fetch errors gracefully.

## 9. Responsive Design

*   **Strategy**: Mobile-First Tailwind CSS.
*   **Layout**:
    *   Mobile: Hamburger menu, stacked lists.
    *   Desktop: Sidebar navigation, grid/table views.
*   **Accessibility**:
    *   Forms use `<label>` tags.
    *   Buttons have `aria-label` where text is hidden.
    *   Focus states are visible (`ring-*` utilities).

## 10. Integration Validation

Before marking the frontend as complete, verify:
1.  **Network Inspection**: Open DevTools -> Network. Confirm `Authorization: Bearer eyJ...` is sent with every request to `localhost:8000`.
2.  **Access Control**: Try to access `/todos/1` (where ID 1 belongs to another user) via API client manually. Backend should return 404/403. UI should handle this (e.g., generic error).
3.  **Data Isolation**: Login as User A, create tasks. Login as User B, verify list is empty.

## 11. Security Considerations

*   **Zero Trust**: The frontend does not enforce "User A owns Task 1". It relies on the backend returning 404/403 if the relationship is invalid.
*   **Token Safety**: JWTs are signed. Tampering with the token string invalidates the signature, causing the backend to reject requests.
*   **Environment Safety**: Secrets are kept server-side. The public API URL is the only exposed config.

---

**Ready for Development.** Proceed to [FRONT-001] to initialize the project.