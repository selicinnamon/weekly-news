"""Extract supplied PDFs into page-delimited local research files."""
import json
import sys
from pathlib import Path
from pypdf import PdfReader

source, destination = map(Path, sys.argv[1:3])
destination.mkdir(parents=True, exist_ok=True)
inventory = []
for pdf in sorted(source.rglob('*.pdf')):
    try:
        reader = PdfReader(pdf)
    except Exception as error:
        record = {'path': str(pdf), 'error': str(error)}
        inventory.append(record)
        print(json.dumps(record), flush=True)
        continue
    pages = [page.extract_text() or '' for page in reader.pages]
    output = destination / (pdf.stem + '.txt')
    output.write_text('\n'.join(f'\n=== PDF PAGE {i} ===\n{text}' for i, text in enumerate(pages, 1)))
    record = {'path': str(pdf), 'pages': len(pages), 'characters': sum(map(len, pages)), 'text': str(output)}
    inventory.append(record)
    print(json.dumps(record), flush=True)
(destination / 'inventory.json').write_text(json.dumps(inventory, ensure_ascii=False, indent=2))
