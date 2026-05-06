# Metro Manila Mock Data

This folder contains cleaned, synthetic mock data for all 17 LGUs in Metro Manila.

## File

- `metro_manila_mock_data.json`

## Contents

- `lgus`: 17 LGU records that match `backend/app/models/lgu.py`
- `procurements`: 68 procurement records that match `backend/app/models/procurement.py`

The dataset is synthetic and does not represent real audit findings or real procurement awards. It is intended for scoring-engine, backend, and frontend integration demos.

## Seed Through Backend

Start the backend first, then run:

```powershell
$env:API_BASE = "http://127.0.0.1:8000"
python lgu-risk-scanner/scripts/seed_metro_manila_mock_data.py
```

The script upserts LGUs, upserts procurements, then calls:

```text
GET /scoring/by-lgu/{lgu_id}
```

Use this endpoint for procurement-aware scoring. `POST /scoring/compute` currently scores only the LGU payload passed to it and does not fetch procurement records.
