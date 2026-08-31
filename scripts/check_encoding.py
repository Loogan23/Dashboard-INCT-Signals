import json
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('public/data/publications.json', 'r', encoding='utf-8') as f:
    pubs = json.load(f)

print(f"Total de publicações no dataset: {len(pubs)}")

count_issues = 0
for p in pubs:
    issues = []
    for field in ['title', 'authors', 'venue']:
        val = p[field]
        # Check for missing accents in common Brazilian/Portuguese names and terms
        matches = re.findall(r'\b\w*(?:Arajo|Bencio|Magalhes|Santamara|Csar|Garca|Comunicaes|Otimizao|Caracterizao|Eletromagntica|Peridicos|Conferncias|Cooperao|Naves|Gonalves|Jnior|Simo)\w*\b', val, re.IGNORECASE)
        if matches:
            issues.append((field, matches, val))
            
    if issues:
        count_issues += 1
        print(f"📌 [ID: {p['id']}]")
        for field, m, full in issues:
            print(f"   Field '{field}': {m} --> FULL: {full[:100]}")

print(f"\nTotal de entradas com problemas de acentuação/corte: {count_issues}")
