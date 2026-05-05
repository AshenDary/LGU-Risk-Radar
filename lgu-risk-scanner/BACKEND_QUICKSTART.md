# Backend Quick Start Guide

This guide will help you run the LGU Risk Scanner backend and test it.

## Prerequisites

- Python 3.10+
- pip or conda
- Supabase project with tables migrated (done ✓)

## Step 1: Install Dependencies

```bash
cd lgu-risk-scanner/backend

# Create virtual environment (if not already done)
python -m venv .venv

# Activate virtual environment
# On Windows:
.\.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Step 2: Configure Environment

Your `.env` file is already configured with:
- `SUPABASE_URL` ✓
- `SUPABASE_SERVICE_ROLE_KEY` ✓

Verify it exists and has these values:
```bash
cat .env  # On Windows: type .env
```

## Step 3: Run the Backend

```bash
cd lgu-risk-scanner/backend

# Start the server with auto-reload for development
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

Keep this terminal open while testing.

## Step 4: Run Tests (New Terminal)

In a **new terminal window**:

```bash
cd lgu-risk-scanner

# Activate virtual environment if needed
# On Windows:
.\.venv\Scripts\activate

# Run the test script
python scripts/test_backend.py
```

The script will:
1. ✓ Check backend is running
2. ✓ Create test LGU (Municipality of Silicon Valley)
3. ✓ Create test procurements
4. ✓ Test all CRUD endpoints
5. ✓ Run the enhanced scoring endpoint (core feature)
6. ✓ Display risk analysis with factors and recommendations
7. ✓ Test audit logging

## Expected Test Output

```
═══════════════════════════════════════════════════════════
  Backend Health Check
═══════════════════════════════════════════════════════════
✓ Backend is running at http://localhost:8000
ℹ Service: lgu-risk-scanner backend, Status: ok

═══════════════════════════════════════════════════════════
  Step 1: Create Test LGU
═══════════════════════════════════════════════════════════
✓ Created LGU: Municipality of Silicon Valley
ℹ LGU ID: test-lgu-001, Population: 500,000
...

═══════════════════════════════════════════════════════════
  Step 5: Test Enhanced Scoring Endpoint (⭐ Core Feature)
═══════════════════════════════════════════════════════════
✓ Retrieved comprehensive LGU risk analysis

📊 RISK ANALYSIS RESULTS
  LGU: Municipality of Silicon Valley
  Population: 500,000
  Procurements: 3
  
  Risk Score: 56.23/100
  Risk Level: MEDIUM

📈 Risk Factors Breakdown
  population_risk                 25.00  ████████████████████
  procurement_volume_risk         18.33  ██████████████████
  supplier_concentration_risk     10.00  ██████████
  status_anomaly_risk              5.00  █████
  data_quality_risk                0.00  
  baseline_risk                    5.00  █████

💰 Procurement Summary
  Total Procurement Amount: ₱1,725,000.00

💡 Recommendations
  ⚠️ High supplier concentration: Consider diversifying suppliers
  ⚠️ Many drafted procurements: Review stalled processes
```

## API Endpoints Summary

### LGU Management
- `GET /lgu/list` - List all LGUs
- `GET /lgu/{lgu_id}` - Get specific LGU
- `POST /lgu/upsert` - Create/Update LGU

### Procurement Management
- `GET /procurements/list` - List all procurements
- `GET /procurements/{procurement_id}` - Get specific procurement
- `POST /procurements/upsert` - Create/Update procurement

### Risk Scoring (⭐ Main Feature)
- `GET /scoring/by-lgu/{lgu_id}` - **Get comprehensive risk analysis**
  - Includes LGU data, procurements, risk score, factors, recommendations
- `GET /scoring/list` - List all risk scores
- `POST /scoring/compute` - Compute and store risk score

### Audit Logging
- `GET /audit/list` - List audit logs
- `POST /audit/record` - Record audit entry

## Troubleshooting

### Backend won't start
```
Error: Module not found
→ Make sure you activated the venv and ran pip install -r requirements.txt
```

### Tests fail with connection error
```
Error: Cannot connect to backend at http://localhost:8000
→ Make sure backend is running in another terminal
→ Check that port 8000 is not in use
```

### Tests fail with Supabase error
```
Error: Supabase backend configuration is missing
→ Check .env file has SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
→ Verify Supabase migration was applied (tables exist in your database)
```

### High risk score on test data
This is expected! The test procurements have:
- High volume (₱1.7M)
- Supplier concentration (same supplier for 2/3 procurements)
- Stalled procurements (draft status)

These are realistic risk indicators for demonstration.

## Next: Frontend Integration

Once backend is tested and running:

1. Install frontend dependencies:
```bash
cd lgu-risk-scanner/frontend
npm install
```

2. Update API base URL in `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

3. Start frontend:
```bash
npm run dev
```

4. Frontend will call the backend endpoints to display LGU data and risk scores.

## Development Workflow

1. **Terminal 1** - Run backend:
   ```bash
   cd lgu-risk-scanner/backend
   python -m uvicorn app.main:app --reload
   ```

2. **Terminal 2** - Run tests:
   ```bash
   python scripts/test_backend.py
   ```

3. **Terminal 3** - Run frontend:
   ```bash
   cd lgu-risk-scanner/frontend
   npm run dev
   ```

Now you have full-stack development environment ready!

## Production Deployment

See `HANDOFF_GUIDE.md` for production deployment instructions.
