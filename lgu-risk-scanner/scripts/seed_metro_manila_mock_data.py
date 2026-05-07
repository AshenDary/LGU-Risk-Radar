"""Seed cleaned Metro Manila mock data through the FastAPI backend."""
from __future__ import annotations

import json
import os
from pathlib import Path

import requests


API_BASE = os.getenv("API_BASE", "http://127.0.0.1:8000").rstrip("/")
DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "metro_manila_mock_data.json"


def post_json(endpoint: str, payload: dict) -> dict:
    response = requests.post(f"{API_BASE}{endpoint}", json=payload, timeout=30)
    response.raise_for_status()
    return response.json()


def get_json(endpoint: str) -> dict:
    response = requests.get(f"{API_BASE}{endpoint}", timeout=30)
    response.raise_for_status()
    return response.json()


def seed() -> None:
    with DATA_PATH.open("r", encoding="utf-8") as file:
        dataset = json.load(file)

    lgus = dataset["lgus"]
    procurements = dataset["procurements"]
    audit_findings = dataset.get("audit_findings", [])

    for lgu in lgus:
        post_json("/lgu/upsert", lgu)

    for procurement in procurements:
        post_json("/procurements/upsert", procurement)

    for lgu in lgus:
        get_json(f"/scoring/by-lgu/{lgu['id']}")

    for audit_finding in audit_findings:
        post_json("/audit/record", audit_finding)

    print(
        f"Seeded {len(lgus)} Metro Manila LGUs and "
        f"{len(procurements)} procurement records, plus "
        f"{len(audit_findings)} synthetic audit findings through {API_BASE}."
    )


if __name__ == "__main__":
    seed()
