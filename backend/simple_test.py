import sys
import os
from pathlib import Path

# Add the project root to the path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# Add the backend directory to the path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Now try to import
try:
    from main import app
    print("Backend imported successfully!")
except Exception as e:
    print(f"Error importing backend: {e}")
    import traceback
    traceback.print_exc()