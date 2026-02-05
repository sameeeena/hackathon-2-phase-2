import sys
import os

# Add the parent directory (where backend is located) to the Python path
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

# Change to the parent directory
os.chdir(parent_dir)

try:
    from backend.main import app
    print("SUCCESS: Backend import successful")

    # Test the API endpoints directly
    import asyncio
    from fastapi.testclient import TestClient

    client = TestClient(app)

    # Test root endpoint
    response = client.get("/")
    print(f"Root endpoint response: {response.json()}")

    # Test health endpoint
    response = client.get("/health")
    print(f"Health endpoint response: {response.json()}")

    # Test todos endpoint (will require auth)
    response = client.get("/todos/")
    print(f"Todos endpoint status: {response.status_code}")

except ImportError as e:
    print(f"ERROR: Import failed - {e}")
except Exception as e:
    print(f"ERROR: {e}")