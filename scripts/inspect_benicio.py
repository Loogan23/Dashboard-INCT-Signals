import json
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('public/data/publications.json', 'r', encoding='utf-8') as f:
    pubs = json.load(f)

print(f"Total de publicações: {len(pubs)}")

# Search for the specific publication or any publication with Benicio
for p in pubs:
    if 'bistatic sensing' in p['title'].lower() or 'benicio' in p['authors'].lower() or 'benício' in p['authors'].lower():
        print(f"📌 [ID: {p['id']}]")
        print(f"   Título: {p['title']}")
        print(f"   Autores: {p['authors']}")
        print(f"   Veículo: {p['venue']}")
        print("-" * 50)
