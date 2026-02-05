import requests
import subprocess
import time
import signal
import os

# Start the frontend server
print("Starting frontend server...")
frontend_process = subprocess.Popen(["npm", "run", "dev"], cwd="frontend", stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# Wait a bit for the server to start
time.sleep(5)

try:
    # Make a request to the auth endpoint to trigger initialization
    print("Making request to auth endpoint to trigger table creation...")
    response = requests.get("http://localhost:3000/api/auth/csrf")

    print(f"Response status: {response.status_code}")
    print(f"Response headers: {response.headers}")

    # Wait a bit more to ensure tables are created
    time.sleep(2)

finally:
    # Kill the frontend server
    frontend_process.terminate()
    try:
        frontend_process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        frontend_process.kill()

# Now check the auth.db file
import sqlite3

db_path = "frontend/auth.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

print(f"\nTables in auth.db after request: {tables}")

conn.close()