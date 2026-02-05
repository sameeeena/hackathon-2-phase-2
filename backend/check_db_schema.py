from sqlmodel import create_engine, inspect
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)

inspector = inspect(engine)
if "todo" in inspector.get_table_names():
    columns = [col["name"] for col in inspector.get_columns("todo")]
    print(f"Columns in 'todo' table: {columns}")
else:
    print("'todo' table does not exist.")
