def compute_score(lgu: dict, procurements: list = None) -> dict:
    """
    Compute a weighted risk score for an LGU based on population, procurement patterns, and audit history.
    Score ranges from 0.0 (low risk) to 100.0 (high risk).
    
    Factors:
    - Population size (higher population = higher risk due to complexity)
    - Procurement volume/amount (large amounts increase fraud risk)
    - Procurement patterns (single supplier, no competition indicators)
    - Data quality/completeness
    - Geographic location (if applicable)
    
    Args:
        lgu: LGU entity dict
        procurements: List of procurement records (optional)
    
    Returns:
        dict with score, risk_level, and detailed factors breakdown
    """
    score = 0.0
    factors = {}
    procurements = procurements or []
    
    # Population factor: scale 0-100 based on population size
    # Assumption: max expected population ~10M
    population = float(lgu.get('population', 0))
    population_risk = min(100.0, (population / 10_000_000) * 25)  # Max 25 points
    factors['population_risk'] = round(population_risk, 2)
    
    # Procurement analysis
    procurement_risk = 0.0
    if procurements:
        # Volume risk: total procurement amount
        total_amount = sum(float(p.get('amount', 0)) for p in procurements)
        # Normalize: assume avg agency budget ~10M per year
        volume_risk = min(25.0, (total_amount / 10_000_000) * 25)
        
        # Concentration risk: same supplier dominance
        if len(procurements) > 0:
            suppliers = {}
            for p in procurements:
                supplier = p.get('supplier', 'unknown')
                suppliers[supplier] = suppliers.get(supplier, 0) + 1
            
            max_supplier_count = max(suppliers.values()) if suppliers else 0
            concentration_ratio = max_supplier_count / len(procurements) if procurements else 0
            concentration_risk = concentration_ratio * 20  # Max 20 points for monopoly
            
            # Status anomaly: many drafts or pending could indicate delays/issues
            status_counts = {}
            for p in procurements:
                status = p.get('status', 'draft')
                status_counts[status] = status_counts.get(status, 0) + 1
            
            draft_ratio = status_counts.get('draft', 0) / len(procurements)
            status_risk = draft_ratio * 15  # Max 15 points for stalled procurements
            
            procurement_risk = min(30.0, volume_risk + concentration_risk + status_risk)
            factors['procurement_volume_risk'] = round(volume_risk, 2)
            factors['supplier_concentration_risk'] = round(concentration_risk, 2)
            factors['status_anomaly_risk'] = round(status_risk, 2)
            factors['procurement_count'] = len(procurements)
        else:
            factors['procurement_count'] = 0
    
    # Data quality/completeness
    filled_fields = sum(1 for v in lgu.values() if v and v != '')
    total_fields = len(lgu)
    completeness = filled_fields / max(total_fields, 1)
    completeness_risk = (1 - completeness) * 20  # Max 20 points for incomplete data
    factors['data_quality_risk'] = round(completeness_risk, 2)
    
    # Location/governance risk (baseline)
    location_risk = 5.0  # Baseline 5 points
    factors['baseline_risk'] = location_risk
    
    score = population_risk + procurement_risk + completeness_risk + location_risk
    
    return {
        'score': round(min(100.0, max(0.0, score)), 2),
        'factors': factors
    }
