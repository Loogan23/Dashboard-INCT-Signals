import json
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Global name replacements map
NAME_REPLACEMENTS = [
    (r'\bBenicio\b', 'Benício'),
    (r'\bBencio\b', 'Benício'),
    (r'\bAraujo\b', 'Araújo'),
    (r'\bArajo\b', 'Araújo'),
    (r'\bMagalhaes\b', 'Magalhães'),
    (r'\bMagalhes\b', 'Magalhães'),
    (r'\bSantamaria\b', 'Santamaría'),
    (r'\bSantamara\b', 'Santamaría'),
    (r'\bSantamar\b', 'Santamaría'),
    (r'\bCesar\b', 'César'),
    (r'\bCsar\b', 'César'),
    (r'\bGarcia\b', 'García'),
    (r'\bGarca\b', 'García'),
    (r'\bGoncalves\b', 'Gonçalves'),
    (r'\bGonalves\b', 'Gonçalves'),
    (r'\bGurjao\b', 'Gurjão'),
    (r'\bGurja\b', 'Gurjão'),
    (r'\bSimao\b', 'Simão'),
    (r'\bSima\b', 'Simão'),
    (r'\bAragon-Angel\b', 'Aragón-Ángel'),
    (r'\bAragon Angel\b', 'Aragón-Ángel'),
    (r'\bRovira Garcia\b', 'Rovira-García'),
    (r'\bRovira-Garcia\b', 'Rovira-García'),
    (r'\bTelecomunicaes\b', 'Telecomunicações'),
    (r'\bComunicaes\b', 'Comunicações'),
    (r'\bOtimizao\b', 'Otimização'),
    (r'\bCaracterizao\b', 'Caracterização'),
    (r'\bEletromagntica\b', 'Eletromagnética'),
    (r'\bPeridicos\b', 'Periódicos'),
    (r'\bConferncias\b', 'Conferências'),
    (r'\bCooperao\b', 'Cooperação'),
    (r'\bSimpsio\b', 'Simpósio'),
    (r'\bFazal-e-Asim\b', 'F.-E. Asim'),
    (r'\bFazal-E-Asim\b', 'F.-E. Asim'),
    (r'\bF-E- Asim\b', 'F.-E. Asim'),
    (r'\bF-E Asim\b', 'F.-E. Asim'),
]

def clean_field(text):
    if not text:
        return ""
    text = str(text)
    for pattern, repl in NAME_REPLACEMENTS:
        text = re.sub(pattern, repl, text, flags=re.IGNORECASE)
    
    # Remove orphan quotes, double quotes, and clean trailing punctuation
    text = re.sub(r'^\s*["“„”«»]\s*', '', text)
    text = re.sub(r'\s*["“„”«»]\s*$', '', text)
    text = re.sub(r'\s+,', ',', text)
    text = re.sub(r'\s+', ' ', text).strip(" ,")
    return text

with open('public/data/publications.json', 'r', encoding='utf-8') as f:
    pubs = json.load(f)

changed_count = 0
for p in pubs:
    orig_authors = p['authors']
    orig_title = p['title']
    orig_venue = p['venue']
    
    p['title'] = clean_field(p['title'])
    p['authors'] = clean_field(p['authors'])
    p['venue'] = clean_field(p['venue'])
    p['thematic_axes'] = [clean_field(ax) for ax in p['thematic_axes']]
    
    # Re-generate BibTeX cleanly
    authors_clean = p['authors']
    first_author_surname = authors_clean.split(',')[0].split()[-1] if authors_clean else "inct"
    first_word_title = [w for w in re.sub(r'[^\w\s]', '', p['title']).split() if len(w)>3]
    w_title = first_word_title[0].lower() if first_word_title else "paper"
    cite_key = f"{first_author_surname.lower()}{p['year']}{w_title}"
    
    bib_type = "article" if p['type'] == "Periódico" else "inproceedings"
    booktitle_field = "journal" if p['type'] == "Periódico" else "booktitle"
    
    bibtex = f"@{bib_type}{{{cite_key},\n"
    bibtex += f"  author = {{{authors_clean}}},\n"
    bibtex += f"  title = {{{p['title']}}},\n"
    bibtex += f"  {booktitle_field} = {{{p['venue']}}},\n"
    bibtex += f"  year = {{{p['year']}}}\n"
    bibtex += "}"
    p['bibtex'] = bibtex

    if orig_authors != p['authors'] or orig_title != p['title'] or orig_venue != p['venue']:
        changed_count += 1
        print(f"✏️ [ID: {p['id']}] Corrigido:")
        if orig_authors != p['authors']:
            print(f"   Antes : {orig_authors}")
            print(f"   Depois: {p['authors']}")

with open('public/data/publications.json', 'w', encoding='utf-8') as f:
    json.dump(pubs, f, ensure_ascii=False, indent=2)

print(f"\n✅ Total de {changed_count} publicações atualizadas e salvas em public/data/publications.json!")
