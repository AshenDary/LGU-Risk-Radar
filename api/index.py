import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

BACKEND_DIR = Path(__file__).resolve().parents[1] / "lgu-risk-scanner" / "backend"
FRONTEND_DIST = Path(__file__).resolve().parents[1] / "lgu-risk-scanner" / "frontend" / "dist"
sys.path.insert(0, str(BACKEND_DIR))

from app.main import app as backend_app  # noqa: E402

app = FastAPI()
app.mount("/api", backend_app)

if (FRONTEND_DIST / "assets").exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="assets")


@app.get("/{full_path:path}", include_in_schema=False)
def serve_frontend(full_path: str):
    requested_file = FRONTEND_DIST / full_path

    if requested_file.is_file():
        return FileResponse(requested_file)

    return FileResponse(FRONTEND_DIST / "index.html")
