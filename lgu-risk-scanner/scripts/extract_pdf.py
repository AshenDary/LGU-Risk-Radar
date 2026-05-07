"""PDF extraction for procurement documents using pdfplumber."""
import pdfplumber
from pathlib import Path
import re
from typing import Dict, List


def extract_text_from_pdf(path: str) -> str:
    """
    Extract text from a PDF file using pdfplumber.
    
    Args:
        path: Path to the PDF file
        
    Returns:
        Extracted text as string
    """
    p = Path(path)
    if not p.exists():
        raise FileNotFoundError(f"PDF file not found: {path}")
    
    if not p.suffix.lower() == '.pdf':
        raise ValueError(f"File is not a PDF: {path}")
    
    text = ""
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    
    return text.strip()


def extract_procurement_data(text: str) -> Dict[str, str]:
    """
    Extract structured procurement data from PDF text.
    
    Args:
        text: Raw text extracted from PDF
        
    Returns:
        Dictionary with extracted fields
    """
    data = {}
    
    # Common patterns for procurement documents
    patterns = {
        'procurement_id': r'(?:Procurement|Contract)\s*(?:ID|Number)[:\s]*([A-Z0-9\-]+)',
        'amount': r'(?:Amount|Value|Cost)[:\s]*₱?\s*([\d,]+\.?\d*)',
        'supplier': r'(?:Supplier|Vendor|Contractor)[:\s]*([^\n\r]+)',
        'status': r'(?:Status|State)[:\s]*([A-Za-z\s]+)',
        'date': r'(?:Date|Issued)[:\s]*([\d/\-]+)',
        'description': r'(?:Description|Scope)[:\s]*([^\n\r]+)'
    }
    
    for field, pattern in patterns.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            data[field] = match.group(1).strip()
    
    return data


def process_procurement_pdf(pdf_path: str) -> Dict[str, str]:
    """
    Process a procurement PDF and extract structured data.
    
    Args:
        pdf_path: Path to the PDF file
        
    Returns:
        Dictionary with extracted procurement data
    """
    try:
        text = extract_text_from_pdf(pdf_path)
        if not text:
            return {"error": "No text extracted from PDF"}
        
        data = extract_procurement_data(text)
        data['source_file'] = pdf_path
        data['extraction_status'] = 'success'
        return data
    except Exception as e:
        return {
            "error": str(e),
            "source_file": pdf_path,
            "extraction_status": "failed"
        }


def batch_process_pdfs(pdf_dir: str, output_csv: str = None) -> List[Dict[str, str]]:
    """
    Process all PDFs in a directory.
    
    Args:
        pdf_dir: Directory containing PDF files
        output_csv: Optional path to save results as CSV
        
    Returns:
        List of extracted data dictionaries
    """
    pdf_dir = Path(pdf_dir)
    if not pdf_dir.exists():
        raise FileNotFoundError(f"Directory not found: {pdf_dir}")
    
    results = []
    for pdf_file in pdf_dir.glob("*.pdf"):
        print(f"Processing: {pdf_file}")
        data = process_procurement_pdf(str(pdf_file))
        results.append(data)
    
    if output_csv:
        import pandas as pd
        df = pd.DataFrame(results)
        df.to_csv(output_csv, index=False)
        print(f"Results saved to: {output_csv}")
    
    return results


if __name__ == '__main__':
    # Example usage
    pdf_path = "path/to/procurement.pdf"  # Replace with actual path
    try:
        data = process_procurement_pdf(pdf_path)
        print("Extracted data:")
        for key, value in data.items():
            print(f"  {key}: {value}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Batch processing example
    # batch_process_pdfs("data/procurement_pdfs", "data/extracted_procurements.csv")
