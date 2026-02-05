import os
import sys
from pathlib import Path

# Add the parent directory to the path so we can import the backend modules properly
parent_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(parent_dir))

from main import app

# This serves as the entry point for Hugging Face Spaces
# Hugging Face Spaces will run this application with Uvicorn

if __name__ == "__main__":
    import uvicorn
    # Run the FastAPI app on the port specified by Hugging Face
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 7860)),  # Hugging Face uses PORT environment variable
        reload=False
    )