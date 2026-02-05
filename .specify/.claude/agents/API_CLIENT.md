# API Client Documentation

This API client provides a centralized way to make authenticated requests to your FastAPI backend from your Next.js frontend.

## Features

- ✅ Automatically prepends all requests with `NEXT_PUBLIC_API_URL`
- ✅ Injects `Authorization: Bearer <token>` header automatically
- ✅ Normalizes fetch errors into `{ status, message }` format
- ✅ Handles 401 responses with specific auth error and redirects to `/login`
- ✅ No hardcoded API URLs
- ✅ Separation of concerns - UI components don't handle auth logic

## Usage

### Basic API Call
```typescript
import api from '@/lib/api';

try {
  const response = await api.get('/todos');
  const todos = response.data;
} catch (error) {
  if (error.status) {
    // Handle API error: { status: number, message: string }
    console.error(`API Error: ${error.status} - ${error.message}`);
  } else {
    // Handle network error
    console.error('Network error:', error.message);
  }
}
```

### With Auth Error Handling
```typescript
import { withAuthHandling } from '@/lib/auth-utils';
import api from '@/lib/api';

const fetchTodos = async () => {
  return withAuthHandling(async () => {
    const response = await api.get('/todos');
    return response.data;
  });
};
```

### Creating New API Endpoints
```typescript
import api from '@/lib/api';

export const createTodo = async (todoData: any) => {
  const response = await api.post('/todos', todoData);
  return response.data;
};

export const updateTodo = async (id: string, todoData: any) => {
  const response = await api.patch(`/todos/${id}`, todoData);
  return response.data;
};

export const deleteTodo = async (id: string) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};
```

## Error Types

- `AuthError`: Thrown when a 401 response is received. Automatically triggers redirect to `/login`.
- `ApiError`: Normalized error format `{ status: number, message: string }`.

## Environment Variables

Make sure to set the following environment variable in your `.env.local`:

```
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```