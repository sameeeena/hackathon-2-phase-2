from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from contextlib import asynccontextmanager
from sqlmodel import SQLModel

 # Include this import
from api.routes.auth import router as auth_router
# Import modules - try absolute imports first, then relative
import sys
import os
from pathlib import Path


4 # Add this line with your other routers
app.include_router(auth_router, prefix="", tags=["auth"])  
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
    from backend.models import Todo, User  # Import to register models

    # Import routes
    from backend.api.routes.todos import router as todos_router
    from backend.api.routes.auth import router as auth_router
except ImportError:
    # Relative imports (when running from backend directory)
    from core.database import engine
    from models.todo import Todo  # Import to register models
    from models.user import User

    # Import routes
    from api.routes.todos import router as todos_router
    from api.routes.auth import router as auth_router

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
    "http://localhost:8000",
    "https://todo-app-frontend.vercel.app",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for simplicity in this setup
    allow_credentials=False, # Disable credentials to allow wildcard origin
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(todos_router, prefix="/todos", tags=["todos"])
app.include_router(auth_router, tags=["auth"])

@app.get("/")
def read_root():
    return {"message": "Todo API is running", "status": "independent"}

@app.get("/health")
def health_check():
    return {"status": "ok", "database_url_configured": "DATABASE_URL" in os.environ}