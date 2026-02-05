# Todo Backend API

This is a FastAPI backend for the Todo application, deployed on Hugging Face Spaces.

## API Endpoints

- `GET /`: Health check endpoint
- `GET /health`: Health check with database status
- `GET /todos/`: Get all todos
- `POST /todos/`: Create a new todo
- `PUT /todos/{id}`: Update a todo
- `DELETE /todos/{id}`: Delete a todo

## Environment Variables Required

- `DATABASE_URL`: Database connection string (PostgreSQL/Neon/SQLite)
- `BETTER_AUTH_SECRET`: Authentication secret key

## Usage

This backend is designed to work with the Todo frontend application and is deployed on Hugging Face Spaces.