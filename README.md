# LGU Risk Radar

LGU Risk Radar is a full-stack risk analysis platform for local government units (LGUs). The project helps surface governance, procurement, data quality, and audit-related risk signals through a FastAPI backend, a Supabase-backed data layer, and a React dashboard.

The goal is to give analysts, auditors, civic technology teams, and local government stakeholders a structured way to inspect LGU profiles, compare risk scores, review procurement patterns, and generate explainable risk summaries.

## Project Purpose

LGU data can be difficult to evaluate consistently when procurement records, population information, audit trails, and risk factors are scattered across separate systems. This project provides a unified interface and API for:

- Viewing LGU profiles and procurement records.
- Computing risk scores from LGU and procurement data.
- Ranking and comparing LGUs by risk level.
- Reviewing audit logs and risk factors.
- Generating plain-language explanations and reports for risk findings.
- Supporting future analyst workflows around monitoring, investigation, and public accountability.

## Core Goals

- Provide a working full-stack prototype for LGU risk monitoring.
- Make risk scoring transparent and explainable.
- Keep backend data access centralized through a secure API.
- Support Supabase as the primary persistence layer.
- Provide a clean frontend dashboard for analysis and reporting.
- Maintain a contributor-friendly codebase that can be extended by other developers.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, Recharts |
| Backend | Python, FastAPI, Uvicorn |
| Database | Supabase / PostgreSQL |
| API Client | Supabase Python client |
| Security | CORS, trusted hosts, security headers, rate limiting utilities |
| Tooling | npm, pip, PowerShell scripts |

## Repository Structure

```text
LGU-Risk-Radar/
|-- lgu-risk-scanner/
|   |-- backend/
|   |   |-- app/
|   |   |   |-- models/
|   |   |   |-- routes/
|   |   |   |-- services/
|   |   |   |-- config.py
|   |   |   |-- main.py
|   |   |   `-- security.py
|   |   |-- requirements.txt
|   |   `-- .env.example
|   |-- frontend/
|   |   |-- src/
|   |   |   |-- components/
|   |   |   |-- data/
|   |   |   |-- hooks/
|   |   |   |-- pages/
|   |   |   |-- services/
|   |   |   `-- utils/
|   |   |-- package.json
|   |   `-- .env.example
|   |-- scripts/
|   |-- supabase/
|   `-- data/
|-- SECURITY.md
|-- SECURITY_CHECKLIST.md
|-- HANDOFF_GUIDE.md
`-- README.md
```

## Main Backend Endpoints

| Endpoint | Purpose |
| --- | --- |
| `GET /` | Basic backend health check |
| `GET /health` | Detailed health and security status |
| `GET /lgu/list` | List LGUs |
| `POST /lgu/upsert` | Create or update an LGU |
| `GET /procurements/list` | List procurement records |
| `POST /procurements/upsert` | Create or update a procurement record |
| `GET /scoring/list` | List stored risk scores |
| `POST /scoring/compute` | Compute and store a risk score |
| `GET /scoring/by-lgu/{lgu_id}` | Get an enriched risk profile for one LGU |
| `GET /audit/list` | List audit log entries |
| `POST /audit/record` | Record an audit entry |
| `POST /explain/reason` | Generate a risk explanation |

## Prerequisites

Install the following before running the project:

- Git
- Node.js 18 or newer
- npm
- Python 3.10 to 3.13
- Supabase project with the required tables and policies

Python 3.14 is not recommended for this project at the moment because some dependencies may not have stable prebuilt wheels yet.

## Environment Variables

This project uses separate environment files for backend and frontend configuration.

### Backend

Create a backend environment file:

```powershell
cd "lgu-risk-scanner\backend"
copy .env.example .env
```

Update `lgu-risk-scanner/backend/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000
LLM_API_URL=
LLM_API_KEY=
LLM_MODEL=llama3.2:3b
DATABASE_URL=
```

For local development on machines with certificate trust issues, the backend supports:

```env
SUPABASE_VERIFY_SSL=false
```

Use this only for local development. Production environments should verify SSL certificates.

### Frontend

Create a frontend environment file:

```powershell
cd "lgu-risk-scanner\frontend"
copy .env.example .env.local
```

Update `lgu-risk-scanner/frontend/.env.local`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

If your backend runs on a different port, update `VITE_API_URL` accordingly.

## Database Setup

The Supabase schema is stored in:

```text
lgu-risk-scanner/supabase/schema.sql
```

Migration notes are stored in:

```text
lgu-risk-scanner/supabase/MIGRATIONS.md
```

Apply the schema to your Supabase project before running backend endpoints that read or write LGU, procurement, risk score, or audit data.

## Running the Project Locally

Run the backend and frontend in separate terminals.

### 1. Install Backend Dependencies

From the repository root:

```powershell
cd "lgu-risk-scanner\backend"
py -3.13 -m venv .venv313
.\.venv313\Scripts\python.exe -m pip install -r requirements.txt
```

If `requirements.txt` installs a newer dependency chain that fails on your Python version, use Python 3.13 and install the compatible Supabase client used during local development:

```powershell
.\.venv313\Scripts\python.exe -m pip install fastapi uvicorn[standard] pydantic pydantic-settings python-dotenv requests pandas supabase==2.18.1 pdfplumber websockets==15.0.1
```

### 2. Run the Backend

```powershell
cd "lgu-risk-scanner\backend"
.\.venv313\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

If port `8000` is already in use, run on `8001`:

```powershell
.\.venv313\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8001
```

Then update `frontend/.env.local`:

```env
VITE_API_URL=http://127.0.0.1:8001
```

### 3. Install Frontend Dependencies

Open a second terminal:

```powershell
cd "lgu-risk-scanner\frontend"
npm install
```

### 4. Run the Frontend

```powershell
npm run dev -- --host 127.0.0.1 --port 5173
```

Open the app:

```text
http://127.0.0.1:5173
```

## Verifying the Setup

Check the backend health endpoint:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/
```

Expected response:

```json
{
  "service": "lgu-risk-scanner backend",
  "status": "ok",
  "version": "1.0.0"
}
```

Check a data endpoint:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/scoring/list
```

If this fails, confirm that:

- Your Supabase credentials are valid.
- The database schema has been applied.
- `VITE_API_URL` points to the backend port you are actually using.
- `CORS_ORIGINS` includes the frontend origin, such as `http://127.0.0.1:5173`.

## Development Workflow

Recommended local workflow:

1. Create or update your `.env` files.
2. Start the backend.
3. Start the frontend.
4. Make focused changes in a feature branch.
5. Run relevant checks before opening a pull request.
6. Keep secrets out of commits.

Useful commands:

```powershell
# Frontend production build
cd "lgu-risk-scanner\frontend"
npm run build
```

```powershell
# Backend smoke test
cd "lgu-risk-scanner"
.\backend\.venv313\Scripts\python.exe scripts\test_backend.py
```

## Contribution Guidelines

Contributions are welcome. Please follow these guidelines to keep the project maintainable.

### Branching

Use short, descriptive branch names:

```text
feature/risk-score-filters
fix/cors-config
docs/setup-guide
security/input-validation
```

### Commit Messages

Use clear, action-oriented commit messages:

```text
Add LGU comparison filters
Fix backend CORS configuration
Document Supabase setup steps
Harden request validation for scoring endpoints
```

### Pull Request Checklist

Before opening a pull request:

- Confirm the backend starts successfully.
- Confirm the frontend starts successfully.
- Run `npm run build` for frontend changes.
- Test affected API endpoints for backend changes.
- Update documentation when setup, behavior, or configuration changes.
- Do not commit `.env`, `.env.local`, service role keys, API keys, or generated local logs.
- Keep pull requests focused on one feature, fix, or documentation update.

### Code Style Expectations

- Follow the existing project structure.
- Keep route handlers thin and place business logic in services.
- Keep frontend API calls in `frontend/src/services`.
- Prefer reusable components for shared UI patterns.
- Add validation and error handling for new backend inputs.
- Keep security-related changes explicit and documented.

### Security Guidelines

- Never expose Supabase service role keys in frontend code.
- Keep all privileged database access behind the backend API.
- Use `.env.example` for documenting required variables.
- Use `.env` and `.env.local` only for local secrets.
- Review `SECURITY.md` and `SECURITY_CHECKLIST.md` before changing authentication, authorization, headers, CORS, or input validation.

## Troubleshooting

### Frontend Shows `Failed to fetch`

Check that the backend is running and that `VITE_API_URL` points to the correct backend URL.

Also confirm the backend `CORS_ORIGINS` includes the frontend origin:

```env
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Backend Returns Supabase Errors

Confirm:

- `SUPABASE_URL` is correct.
- `SUPABASE_SERVICE_ROLE_KEY` is valid.
- The Supabase schema has been applied.
- The machine can establish HTTPS connections to Supabase.

### Port Already in Use

Use a different backend port:

```powershell
.\.venv313\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8001
```

Then update:

```env
VITE_API_URL=http://127.0.0.1:8001
```

### Python Dependency Installation Fails

Use Python 3.13 and recreate the virtual environment:

```powershell
cd "lgu-risk-scanner\backend"
py -3.13 -m venv .venv313
.\.venv313\Scripts\python.exe -m pip install --upgrade pip
.\.venv313\Scripts\python.exe -m pip install -r requirements.txt
```

## Additional Documentation

- `lgu-risk-scanner/BACKEND_QUICKSTART.md`
- `lgu-risk-scanner/supabase/MIGRATIONS.md`
- `SECURITY.md`
- `SECURITY_CHECKLIST.md`
- `HANDOFF_GUIDE.md`

## License

No license has been specified yet. Add a license before distributing or accepting external contributions.
