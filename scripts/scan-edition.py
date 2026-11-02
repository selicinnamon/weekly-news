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
    pages = []
    failures = []
    for number, page in enumerate(reader.pages, 1):
        try:
            pages.append(page.extract_text() or '')
        except Exception as error:
            pages.append('')
            failures.append({'page': number, 'error': str(error)})
    output = destination / (pdf.stem + '.txt')
    output.write_text('\n'.join(f'\n=== PDF PAGE {i} ===\n{text}' for i, text in enumerate(pages, 1)))
    record = {'path': str(pdf), 'pages': len(pages), 'characters': sum(map(len, pages)), 'text': str(output)}
    if failures:
        record['extractionFailures'] = failures
    inventory.append(record)
    print(json.dumps(record), flush=True)
(destination / 'inventory.json').write_text(json.dumps(inventory, ensure_ascii=False, indent=2))
