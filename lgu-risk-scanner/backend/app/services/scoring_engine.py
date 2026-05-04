def compute_score(lgu: dict) -> float:
    """Compute a simple risk score for an LGU. Replace with real logic."""
    # Basic placeholder: score by number of keys and numeric fields
    base = 0.0
    for k, v in lgu.items():
        if isinstance(v, (int, float)):
            base += float(v)
        elif isinstance(v, str):
            base += 0.1
    return round(base, 2)
