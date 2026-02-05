import sys
import os
# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlmodel import SQLModel, create_engine
from models.todo import Todo  # Ensure model is registered
from dotenv import load_dotenv

# Load env from backend directory
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

print(f"Connecting to DB...")
engine = create_engine(DATABASE_URL)

print("Creating tables...")
SQLModel.metadata.create_all(engine)
print("Tables created successfully.")
