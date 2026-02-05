#!/usr/bin/env python3
"""
Backend server startup script
This script properly configures the Python path before importing the backend modules
"""

import sys
import os

def main():
    # Add the parent directory (project root) to the Python path so 'backend' module can be found
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if project_root not in sys.path:
        sys.path.insert(0, project_root)

    # Change to the project root directory to ensure proper imports
    original_cwd = os.getcwd()
    os.chdir(project_root)

    try:
        # Import the app after configuring the path
        from backend.main import app
        print("[SUCCESS] Backend import successful")

        # Now run the server
        import uvicorn

        # Use PORT environment variable if available (for Hugging Face Spaces)
        port = int(os.environ.get("PORT", 8000))

        print(f"[STARTING] Starting backend server on http://localhost:{port}")
        print("[INFO] Press Ctrl+C to stop the server")

        uvicorn.run(
            app,
            host="0.0.0.0",
            port=port,  # Use environment-defined port or default to 8000
            reload=False,  # Disable reload in production
            log_level="info"
        )

    except ImportError as e:
        print(f"[ERROR] Import error: {e}")
        print("\nThe backend modules could not be imported.")
        print("Make sure all dependencies are installed:")
        print("  cd backend && pip install -r requirements.txt")
        sys.exit(1)

    except Exception as e:
        print(f"[ERROR] Error starting server: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

    finally:
        # Restore original working directory
        os.chdir(original_cwd)

if __name__ == "__main__":
    main()