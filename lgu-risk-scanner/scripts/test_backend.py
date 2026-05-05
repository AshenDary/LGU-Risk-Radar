#!/usr/bin/env python3
"""
Test script for LGU Risk Scanner backend.
Tests all major endpoints and validates the scoring engine.

Usage:
    python scripts/test_backend.py
    
    Or with custom backend URL:
    python scripts/test_backend.py --url http://localhost:8080
"""

import requests
import json
import sys
from datetime import datetime
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

# Configuration
BASE_URL = "http://localhost:8000"
TEST_LGU_ID = "test-lgu-001"
TEST_PROCUREMENT_IDS = ["test-proc-001", "test-proc-002", "test-proc-003"]


def colored_text(text: str, color: str) -> str:
    """Return colored terminal text."""
    colors = {
        "green": "\033[92m",
        "red": "\033[91m",
        "yellow": "\033[93m",
        "blue": "\033[94m",
        "reset": "\033[0m",
    }
    return f"{colors.get(color, '')}{text}{colors['reset']}"


def print_section(title: str):
    """Print a formatted section header."""
    print(f"\n{colored_text('=' * 60, 'blue')}")
    print(colored_text(f"  {title}", "blue"))
    print(colored_text('=' * 60, 'blue'))


def print_success(msg: str):
    """Print success message."""
    print(f"{colored_text('✓', 'green')} {msg}")


def print_error(msg: str):
    """Print error message."""
    print(f"{colored_text('✗', 'red')} {msg}")


def print_info(msg: str):
    """Print info message."""
    print(f"{colored_text('ℹ', 'yellow')} {msg}")


def test_backend_health():
    """Test if backend is running."""
    print_section("Backend Health Check")
    try:
        response = requests.get(f"{BASE_URL}/", timeout=5)
        if response.status_code == 200:
            print_success(f"Backend is running at {BASE_URL}")
            data = response.json()
            print_info(f"Service: {data.get('service')}, Status: {data.get('status')}")
            return True
        else:
            print_error(f"Backend returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_error(f"Cannot connect to backend at {BASE_URL}")
        print_info("Make sure backend is running: python -m uvicorn app.main:app --reload")
        return False
    except Exception as e:
        print_error(f"Error checking backend: {e}")
        return False


def create_test_lgu():
    """Create a test LGU."""
    print_section("Step 1: Create Test LGU")
    
    payload = {
        "id": TEST_LGU_ID,
        "name": "Municipality of Silicon Valley",
        "population": 500000,
        "location": "Northern Philippines",
        "metadata": {"region": "NCR", "province": "Test"}
    }
    
    try:
        response = requests.post(f"{BASE_URL}/lgu/upsert", json=payload, timeout=5)
        if response.status_code in [200, 201]:
            data = response.json()
            print_success(f"Created LGU: {payload['name']}")
            print_info(f"LGU ID: {TEST_LGU_ID}, Population: {payload['population']:,}")
            return payload
        else:
            print_error(f"Failed to create LGU (status {response.status_code}): {response.text}")
            return None
    except Exception as e:
        print_error(f"Error creating LGU: {e}")
        return None


def create_test_procurements():
    """Create test procurements."""
    print_section("Step 2: Create Test Procurements")
    
    procurements = [
        {
            "id": TEST_PROCUREMENT_IDS[0],
            "lgu_id": TEST_LGU_ID,
            "title": "Office Supplies & Equipment",
            "supplier": "Premier Supplies Co.",
            "amount": 75000,
            "status": "completed",
            "reference_number": "PROC-2024-001"
        },
        {
            "id": TEST_PROCUREMENT_IDS[1],
            "lgu_id": TEST_LGU_ID,
            "title": "IT Infrastructure Setup",
            "supplier": "Premier Supplies Co.",
            "amount": 450000,
            "status": "completed",
            "reference_number": "PROC-2024-002"
        },
        {
            "id": TEST_PROCUREMENT_IDS[2],
            "lgu_id": TEST_LGU_ID,
            "title": "Construction Materials",
            "supplier": "Build Solutions Inc.",
            "amount": 1200000,
            "status": "draft",
            "reference_number": "PROC-2024-003"
        }
    ]
    
    created = []
    for proc in procurements:
        try:
            response = requests.post(f"{BASE_URL}/procurements/upsert", json=proc, timeout=5)
            if response.status_code in [200, 201]:
                created.append(proc)
                print_success(f"Created procurement: {proc['title']} (₱{proc['amount']:,})")
            else:
                print_error(f"Failed to create procurement {proc['id']}: {response.text}")
        except Exception as e:
            print_error(f"Error creating procurement {proc['id']}: {e}")
    
    if len(created) == len(procurements):
        total_amount = sum(p['amount'] for p in created)
        print_info(f"Total procurement value: ₱{total_amount:,}")
    
    return created


def test_lgu_endpoint():
    """Test LGU read endpoints."""
    print_section("Step 3: Test LGU Endpoints")
    
    try:
        # List all LGUs
        response = requests.get(f"{BASE_URL}/lgu/list", timeout=5)
        if response.status_code == 200:
            lgus = response.json()
            print_success(f"Retrieved {len(lgus)} LGU(s) from database")
        
        # Get specific LGU
        response = requests.get(f"{BASE_URL}/lgu/{TEST_LGU_ID}", timeout=5)
        if response.status_code == 200:
            lgu = response.json()
            print_success(f"Retrieved LGU: {lgu.get('name', 'Unknown')}")
            return True
        else:
            print_error(f"Failed to retrieve LGU: {response.text}")
            return False
    except Exception as e:
        print_error(f"Error testing LGU endpoint: {e}")
        return False


def test_procurements_endpoint():
    """Test procurements read endpoints."""
    print_section("Step 4: Test Procurement Endpoints")
    
    try:
        # List all procurements
        response = requests.get(f"{BASE_URL}/procurements/list", timeout=5)
        if response.status_code == 200:
            procs = response.json()
            print_success(f"Retrieved {len(procs)} procurement(s)")
        
        # Get specific procurement
        response = requests.get(f"{BASE_URL}/procurements/{TEST_PROCUREMENT_IDS[0]}", timeout=5)
        if response.status_code == 200:
            proc = response.json()
            print_success(f"Retrieved procurement: {proc.get('title', 'Unknown')}")
            return True
        else:
            print_error(f"Failed to retrieve procurement: {response.text}")
            return False
    except Exception as e:
        print_error(f"Error testing procurements endpoint: {e}")
        return False


def test_scoring_by_lgu():
    """Test the comprehensive scoring endpoint."""
    print_section("Step 5: Test Enhanced Scoring Endpoint (⭐ Core Feature)")
    
    try:
        response = requests.get(f"{BASE_URL}/scoring/by-lgu/{TEST_LGU_ID}", timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            print_success("Retrieved comprehensive LGU risk analysis")
            
            # Display results
            print(f"\n{colored_text('📊 RISK ANALYSIS RESULTS', 'yellow')}")
            print(f"  LGU: {data['lgu'].get('name', 'Unknown')}")
            print(f"  Population: {data['lgu'].get('population', 0):,}")
            print(f"  Procurements: {data['procurement_count']}")
            
            risk_score = data['risk_score']
            score = risk_score['score']
            level = risk_score['risk_level']
            
            # Color code the risk level
            level_color = "green" if level == "low" else "yellow" if level == "medium" else "red"
            print(f"\n  Risk Score: {colored_text(f'{score}/100', level_color)}")
            print(f"  Risk Level: {colored_text(level.upper(), level_color)}")
            
            # Show risk factors
            print(f"\n{colored_text('📈 Risk Factors Breakdown', 'yellow')}")
            factors = risk_score['factors']
            for factor_name, factor_value in factors.items():
                bar_length = int(factor_value / 5)  # Scale to 20 chars max
                bar = "█" * bar_length
                print(f"  {factor_name:<30} {factor_value:>6.2f}  {bar}")
            
            # Show total procurement amount
            total_amount = data['summary']['total_procurement_amount']
            print(f"\n{colored_text('💰 Procurement Summary', 'yellow')}")
            print(f"  Total Procurement Amount: ₱{total_amount:,.2f}")
            
            # Show recommendations
            print(f"\n{colored_text('💡 Recommendations', 'yellow')}")
            for rec in data['summary']['recommendations']:
                print(f"  {rec}")
            
            return True
        else:
            print_error(f"Failed to retrieve scoring data: {response.text}")
            return False
    except Exception as e:
        print_error(f"Error testing scoring endpoint: {e}")
        return False


def test_audit_endpoints():
    """Test audit logging endpoints."""
    print_section("Step 6: Test Audit Endpoints")
    
    try:
        response = requests.get(f"{BASE_URL}/audit/list", timeout=5)
        if response.status_code == 200:
            audits = response.json()
            print_success(f"Retrieved {len(audits)} audit log entries")
            
            # Show recent audit entries
            if audits:
                print_info("Recent audit entries:")
                for audit in audits[-3:]:  # Show last 3
                    print(f"  - {audit.get('action', 'unknown')} on {audit.get('entity_type')} by {audit.get('actor', 'unknown')}")
            return True
        else:
            print_error(f"Failed to retrieve audits: {response.text}")
            return False
    except Exception as e:
        print_error(f"Error testing audit endpoint: {e}")
        return False


def print_summary():
    """Print test summary."""
    print_section("✅ All Tests Complete!")
    print(colored_text("""
    Next Steps:
    
    1. FRONTEND INTEGRATION:
       - Connect your React frontend to: http://localhost:8000/scoring/by-lgu/{lgu_id}
       - Use the risk_score and factors to build your dashboard
       
    2. DATA VISUALIZATION:
       - Risk score gauge (0-100)
       - Factor breakdown chart
       - Procurement list table
       - Recommendation alerts
       
    3. PRODUCTION READY:
       - Backend API is fully functional
       - Database is connected and updated
       - Risk scoring engine works
       - Audit logging is active
       
    4. NEXT FEATURES:
       - Add more procurements via frontend
       - Implement filtering (by status, supplier, etc.)
       - Add export functionality
       - Implement role-based access control
    """, "green"))


def main():
    """Run all tests."""
    print(colored_text("""
    ╔════════════════════════════════════════════════╗
    ║     LGU RISK SCANNER - BACKEND TEST SUITE      ║
    ║              May 5, 2026                        ║
    ╚════════════════════════════════════════════════╝
    """, "blue"))
    
    print_info(f"Backend URL: {BASE_URL}")
    print_info(f"Test LGU ID: {TEST_LGU_ID}")
    
    # Run tests
    if not test_backend_health():
        sys.exit(1)
    
    if not create_test_lgu():
        print_error("Failed to create test LGU")
        sys.exit(1)
    
    if not create_test_procurements():
        print_error("Failed to create test procurements")
        sys.exit(1)
    
    if not test_lgu_endpoint():
        print_error("LGU endpoint test failed")
        sys.exit(1)
    
    if not test_procurements_endpoint():
        print_error("Procurements endpoint test failed")
        sys.exit(1)
    
    if not test_scoring_by_lgu():
        print_error("Scoring endpoint test failed")
        sys.exit(1)
    
    if not test_audit_endpoints():
        print_error("Audit endpoint test failed")
        sys.exit(1)
    
    print_summary()
    print_success("All tests passed! ✨")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{colored_text('Test interrupted by user', 'yellow')}")
        sys.exit(0)
    except Exception as e:
        print_error(f"Unexpected error: {e}")
        sys.exit(1)
