def compute_score(lgu: dict) -> float:
    """
    Compute a weighted risk score for an LGU based on population, procurement patterns, and audit history.
    Score ranges from 0.0 (low risk) to 100.0 (high risk).
    
    Factors:
    - Population size (higher population = higher risk due to complexity)
    - Procurement volume/amount (large amounts increase fraud risk)
    - Geographic location (if applicable)
    """
    score = 0.0
    
    # Population factor: scale 0-100 based on population size
    # Assumption: max expected population ~10M
    population = float(lgu.get('population', 0))
    population_risk = min(100.0, (population / 10_000_000) * 40)  # Max 40 points
    
    # History/metadata factors
    metadata = lgu.get('metadata', {})
    
    # Procurement complexity factor (if procurements exist)
    procurement_count = metadata.get('procurement_count', 0)
    procurement_risk = min(30.0, procurement_count * 2)  # Max 30 points, 2 points per procurement
    
    # Data quality/completeness
    filled_fields = sum(1 for v in lgu.values() if v and v != '')
    total_fields = len(lgu)
    completeness = filled_fields / max(total_fields, 1)
    completeness_risk = (1 - completeness) * 30  # Max 30 points for incomplete data
    
    # Location/governance risk (hardcoded for now, can be enhanced)
    location_risk = 5.0  # Baseline 5 points
    
    score = population_risk + procurement_risk + completeness_risk + location_risk
    
    return round(min(100.0, max(0.0, score)), 2)
