"""Data cleaning script that uses the backend cleaning logic."""
import pandas as pd
from pathlib import Path


def clean_csv(infile: str, outfile: str):
    df = pd.read_csv(infile)
    df = df.dropna(how='all')
    for col in df.select_dtypes(include=[object]).columns:
        df[col] = df[col].astype(str).str.strip()
    Path(outfile).parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(outfile, index=False)


if __name__ == '__main__':
    print('Run clean_csv("data/raw/file.csv","data/cleaned/file.csv")')
