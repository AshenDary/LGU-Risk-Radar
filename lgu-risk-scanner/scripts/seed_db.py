"""Seed the API-backed datastore through the FastAPI backend."""
import os

import requests


API_BASE = os.getenv("API_BASE", "http://127.0.0.1:8000")


def seed():
    lgu_payload = {
        "id": "lgu-1",
        "name": "Mock LGU",
        "population": 10000,
        "location": "Unknown",
        "metadata": {"source": "seed"},
    }
    procurement_payload = {
        "id": "proc-1",
        "lgu_id": "lgu-1",
        "reference_number": "PR-001",
        "title": "Sample Infrastructure Procurement",
        "supplier": "Demo Supplier",
        "amount": 1500000,
        "status": "submitted",
        "metadata": {"source": "seed"},
    }

    for endpoint, payload in (
        ("/lgu/upsert", lgu_payload),
        ("/procurements/upsert", procurement_payload),
        ("/scoring/compute", lgu_payload),
    ):
        response = requests.post(f"{API_BASE}{endpoint}", json=payload, timeout=30)
        response.raise_for_status()


if __name__ == '__main__':
    seed()
    print('Seeded data through', API_BASE)
