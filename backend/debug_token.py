import httpx
import os
from jose import jwt
from dotenv import load_dotenv

# Load env from .env file explicitly
load_dotenv(dotenv_path=".env")

SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
ALGORITHM = "HS256"

if not SECRET_KEY:
    print("Error: BETTER_AUTH_SECRET not found")
    exit(1)

# Generate Token
user_id = "test_user_123"
token = jwt.encode({"sub": user_id}, SECRET_KEY, algorithm=ALGORITHM)
print(f"Generated Token: {token}")

# Make Request
url = "http://localhost:8000/todos/"
headers = {"Authorization": f"Bearer {token}"}
data = {"title": "Debug Task", "description": "Created via debug script"}

try:
    print(f"Sending POST to {url}...")
    response = httpx.post(url, json=data, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Connection Error: {e}")
    print("Make sure the backend is running on localhost:8000")
