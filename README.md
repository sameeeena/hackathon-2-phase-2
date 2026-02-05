# Fullstack Todo App

A modern fullstack todo application built with Next.js and FastAPI.

## Features

- User authentication and authorization
- Todo management (create, read, update, delete)
- Clean and responsive UI
- Secure API with JWT authentication
- Database integration with SQLModel

## Tech Stack

- **Frontend**: Next.js 16.1.1, React 19.2.3, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.13, SQLModel, PostgreSQL/SQLite
- **Authentication**: Better Auth

## Installation

### Prerequisites
- Node.js (v18 or higher)
- Python 3.13
- pip

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file based on `.env.example` and configure your settings

4. Start the backend server:
   ```bash
   python start_server.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your backend API URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Access the application at `http://localhost:3000`
2. Register or log in to your account
3. Start managing your todos!

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)