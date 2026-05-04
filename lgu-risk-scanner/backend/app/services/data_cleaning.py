import pandas as pd


def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Minimal cleaning pipeline: drop empty rows, strip strings."""
    df = df.dropna(how="all")
    for col in df.select_dtypes(include=[object]).columns:
        df[col] = df[col].astype(str).str.strip()
    return df
