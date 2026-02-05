@echo off
cd /d "%~dp0"
set PYTHONPATH=%PYTHONPATH%;%CD%
python -c "import sys; sys.path.insert(0, '.'); from main import app; import uvicorn; print('Starting server...'); uvicorn.run(app, host='0.0.0.0', port=8000)"