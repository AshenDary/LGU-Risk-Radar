# LGU Risk Scanner

Scaffold for a Local Government Unit (LGU) risk scoring project. Contains a FastAPI backend, React frontend, data folders, example scripts, and a Supabase schema.

Backend writes all data mutations to Supabase using the service role key. The frontend only reads from the FastAPI API.

Required backend environment variables:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CORS_ORIGINS`
- `LLM_API_URL` and `LLM_API_KEY` if explanation generation is enabled later

Quick start (backend):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
uvicorn app.main:app --reload --app-dir backend --port 8000
```

Seed data through the backend after the API is running:

```powershell
$env:API_BASE = "http://127.0.0.1:8000"
python scripts\seed_db.py
```

Quick start (frontend):

```bash
cd frontend
npm install
npm run dev
```

Structure highlights:
- `backend/` - FastAPI app and services
- `frontend/` - React + Vite scaffold
- `data/` - raw, cleaned, processed
- `scripts/` - helpers for ETL and seeding
- `supabase/schema.sql` - DB schema

Primary API routes:
- `GET /lgu/list`, `GET /lgu/{id}`, `POST /lgu/upsert`, `PUT /lgu/{id}`
- `GET /procurements/list`, `GET /procurements/{id}`, `POST /procurements/upsert`, `PUT /procurements/{id}`
- `GET /scoring/list`, `POST /scoring/compute`
- `GET /audit/list`, `POST /audit/record`
