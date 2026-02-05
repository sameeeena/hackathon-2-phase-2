from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from contextlib import asynccontextmanager
from sqlmodel import SQLModel

# Import modules - try absolute imports first, then relative
import sys
import os
from pathlib import Path

# Add the backend directory to the Python path to resolve imports
current_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(current_dir))

# Add the project root directory to the Python path
project_root = current_dir.parent
sys.path.insert(0, str(project_root))

# Set the current directory to the backend directory to resolve relative imports
os.chdir(current_dir)

try:
    # Absolute imports (when running from project root)
    from backend.core.database import engine
    from backend.models import Todo  # Import to register models
    from backend.models.todo import Todo  # Import to register models

    # Import routes
    from backend.api.routes.todos import router as todos_router
except ImportError:
    # Relative imports (when running from backend directory)
    from core.database import engine
    from models.todo import Todo  # Import to register models

    # Import routes
    from api.routes.todos import router as todos_router

# Load environment variables
load_dotenv()
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(title="Todo API", version="1.0.0", lifespan=lifespan)

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",  # In case frontend is served from backend
    "https://todo-app-frontend.vercel.app", # Placeholder for production
    "*"  # Allow all origins during development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers including Authorization
    expose_headers=["Access-Control-Allow-Origin", "Access-Control-Allow-Credentials", "Access-Control-Expose-Headers", "Authorization"],
    # Add this to allow preflight requests
    max_age=3600,  # Cache preflight responses for 1 hour
)

# Include Routers
app.include_router(todos_router, prefix="/todos", tags=["todos"])

@app.get("/")
def read_root():
    return {"message": "Todo API is running", "status": "independent"}

@app.get("/health")
def health_check():
    return {"status": "ok", "database_url_configured": "DATABASE_URL" in os.environ}