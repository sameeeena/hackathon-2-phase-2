#!/usr/bin/env python
"""
Application entry point for the Todo API backend.
Handles import paths correctly regardless of how the script is called.
"""

import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Now import and run the main app
from main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)