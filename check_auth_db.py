import sqlite3
import os

# Check the auth.db file in the frontend directory
db_path = "frontend/auth.db"

if os.path.exists(db_path):
    print(f"Database file {db_path} exists")

    # Connect to the database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()

    print(f"Tables in auth.db: {tables}")

    # If there are tables, show their structures
    for table_name in tables:
        table = table_name[0]
        print(f"\nStructure of table '{table}':")
        cursor.execute(f"PRAGMA table_info('{table}')")
        columns = cursor.fetchall()
        for col in columns:
            print(f"  {col}")

    conn.close()
else:
    print(f"Database file {db_path} does not exist")