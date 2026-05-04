"""Simple PDF extraction stub. Replace with pdfplumber or similar."""
from pathlib import Path


def extract_text_from_pdf(path: str) -> str:
    p = Path(path)
    if not p.exists():
        return ""
    # TODO: implement with pdfminer or pdfplumber
    return ""


if __name__ == '__main__':
    print('PDF extractor placeholder')
