"""Data cleaning script for procurement data."""
import pandas as pd
from pathlib import Path
import re
from typing import Dict, Any


def clean_amount(amount_str: str) -> float:
    """
    Clean and parse monetary amounts from procurement data.
    
    Args:
        amount_str: String representation of amount (e.g., "₱1,234,567.89", "1234567.89")
        
    Returns:
        Cleaned float value
    """
    if pd.isna(amount_str) or not amount_str:
        return 0.0
    
    # Remove currency symbols and commas
    cleaned = re.sub(r'[₱$,]', '', str(amount_str))
    cleaned = re.sub(r',', '', cleaned)
    
    try:
        return float(cleaned)
    except ValueError:
        return 0.0


def clean_supplier_name(supplier_str: str) -> str:
    """
    Clean supplier names by removing extra whitespace and standardizing.
    
    Args:
        supplier_str: Raw supplier name
        
    Returns:
        Cleaned supplier name
    """
    if pd.isna(supplier_str) or not supplier_str:
        return "Unknown"
    
    # Remove extra whitespace
    cleaned = ' '.join(str(supplier_str).split())
    
    # Standardize common variations
    cleaned = re.sub(r'\b(inc|corp|co|llc|ltd|pty)\b\.?', r'\1', cleaned, flags=re.IGNORECASE)
    
    return cleaned.title()


def clean_status(status_str: str) -> str:
    """
    Standardize procurement status values.
    
    Args:
        status_str: Raw status string
        
    Returns:
        Standardized status
    """
    if pd.isna(status_str) or not status_str:
        return "draft"
    
    status = str(status_str).strip().lower()
    
    # Map common variations to standard statuses
    status_mapping = {
        'pending': ['pending', 'awaiting', 'waiting'],
        'awarded': ['awarded', 'approved', 'accepted'],
        'completed': ['completed', 'finished', 'done'],
        'cancelled': ['cancelled', 'canceled', 'terminated'],
        'failed': ['failed', 'unsuccessful'],
        'on_hold': ['on hold', 'hold', 'suspended'],
        'draft': ['draft', 'proposed', 'initial']
    }
    
    for standard, variations in status_mapping.items():
        if any(var in status for var in variations):
            return standard
    
    return status


def clean_procurement_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean procurement DataFrame with procurement-specific logic.
    
    Args:
        df: Raw procurement DataFrame
        
    Returns:
        Cleaned DataFrame
    """
    # Make a copy to avoid modifying original
    cleaned_df = df.copy()
    
    # Standard cleaning
    cleaned_df = cleaned_df.dropna(how='all')
    
    # Clean text columns
    text_columns = cleaned_df.select_dtypes(include=[object]).columns
    for col in text_columns:
        cleaned_df[col] = cleaned_df[col].astype(str).str.strip()
    
    # Procurement-specific cleaning
    if 'amount' in cleaned_df.columns:
        cleaned_df['amount'] = cleaned_df['amount'].apply(clean_amount)
    
    if 'supplier' in cleaned_df.columns:
        cleaned_df['supplier'] = cleaned_df['supplier'].apply(clean_supplier_name)
    
    if 'status' in cleaned_df.columns:
        cleaned_df['status'] = cleaned_df['status'].apply(clean_status)
    
    # Add derived columns
    if 'amount' in cleaned_df.columns:
        cleaned_df['amount_category'] = pd.cut(
            cleaned_df['amount'],
            bins=[0, 100000, 500000, 1000000, float('inf')],
            labels=['Small', 'Medium', 'Large', 'Very Large']
        )
    
    # Remove duplicates based on key fields
    key_fields = ['procurement_id', 'lgu_id', 'amount', 'supplier']
    existing_keys = [col for col in key_fields if col in cleaned_df.columns]
    if existing_keys:
        cleaned_df = cleaned_df.drop_duplicates(subset=existing_keys, keep='first')
    
    return cleaned_df


def clean_csv(infile: str, outfile: str):
    """
    Clean a CSV file and save the result.
    
    Args:
        infile: Input CSV file path
        outfile: Output CSV file path
    """
    df = pd.read_csv(infile)
    cleaned_df = clean_procurement_data(df)
    
    Path(outfile).parent.mkdir(parents=True, exist_ok=True)
    cleaned_df.to_csv(outfile, index=False)
    
    print(f"Cleaned data saved to: {outfile}")
    print(f"Original rows: {len(df)}, Cleaned rows: {len(cleaned_df)}")


def validate_procurement_data(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Validate cleaned procurement data.
    
    Args:
        df: Cleaned DataFrame
        
    Returns:
        Validation report
    """
    report = {
        'total_rows': len(df),
        'missing_amounts': df['amount'].isna().sum() if 'amount' in df.columns else 0,
        'invalid_amounts': (df['amount'] <= 0).sum() if 'amount' in df.columns else 0,
        'unique_suppliers': df['supplier'].nunique() if 'supplier' in df.columns else 0,
        'status_distribution': df['status'].value_counts().to_dict() if 'status' in df.columns else {},
    }
    
    return report


if __name__ == '__main__':
    # Example usage
    input_file = "data/raw/procurements.csv"
    output_file = "data/cleaned/procurements_cleaned.csv"
    
    try:
        clean_csv(input_file, output_file)
        
        # Load and validate
        cleaned_df = pd.read_csv(output_file)
        validation = validate_procurement_data(cleaned_df)
        print("Validation report:")
        for key, value in validation.items():
            print(f"  {key}: {value}")
            
    except FileNotFoundError:
        print(f"Input file not found: {input_file}")
        print("Usage: python clean_data.py")
        print("Make sure to update input_file and output_file paths")
