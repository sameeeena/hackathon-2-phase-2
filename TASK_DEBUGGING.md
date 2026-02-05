# Troubleshooting Task Management Issues

This document explains common issues with adding tasks in the app frontend and their solutions.

## Common Issues & Solutions

### 1. ID Type Mismatch
**Problem**: Backend expects integer IDs but frontend sends string IDs.
**Solution**: Updated all Todo interfaces to use `id: number` instead of `id: string`.

### 2. API Endpoint Configuration
**Problem**: Incorrect API endpoints causing 404 errors.
**Solution**: Verified that frontend endpoints (`/todos/`) match backend router prefix (`/todos`).

### 3. Backend Service Not Running
**Problem**: API calls fail because backend service is not running.
**Solution**: Ensure the backend FastAPI service is running on the expected port (default: 8000).

### 4. Authentication Issues
**Problem**: API calls fail with 401 Unauthorized errors.
**Solution**:
- Ensure proper JWT token is included in requests
- Verify that Better Auth session is active
- Check that the `NEXT_PUBLIC_API_URL` is correctly configured

### 5. Environment Configuration
**Problem**: Wrong API URL causing connection failures.
**Solution**: Verify `NEXT_PUBLIC_API_URL` in `.env.local` matches the backend address.

## Debugging Steps

1. **Check Backend Status**:
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```

2. **Verify Environment Variables**:
   - Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
   - Ensure it matches the backend URL

3. **Test API Manually**:
   - Use browser dev tools to check network requests
   - Look for specific error messages in console

4. **Use Debug Components**:
   - Try the DebugAddTodoForm component to see detailed error messages

## Component Updates Made

- `frontend/src/app/dashboard/page.tsx` - Updated Todo interface to use `id: number`
- `frontend/src/components/AddTodoForm.tsx` - Enhanced error handling
- `frontend/src/components/TodoItem.tsx` - Updated to use correct ID type and enhanced error handling
- `frontend/src/components/DebugAddTodoForm.tsx` - Added for troubleshooting purposes

## API Flow

1. Frontend makes authenticated requests to `/todos/*` endpoints
2. Backend verifies JWT token and extracts user_id
3. Backend filters tasks by user_id automatically
4. Frontend displays only tasks belonging to the authenticated user