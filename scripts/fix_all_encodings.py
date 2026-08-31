import json
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Dicionário completo de substituições de nomes e termos acentuados
WORD_MAP = {
    'Arajo': 'Araújo',
    'Bencio': 'Benício',
    'Santamara': 'Santamaría',
    'Magalhes': 'Magalhães',
    'Csar': 'César',
    'Garca': 'García',
    'Gonalves': 'Gonçalves',
    'Telecomunicaes': 'Telecomunicações',
    'Comunicaes': 'Comunicações',
    'Otimizao': 'Otimização',
    'Caracterizao': 'Caracterização',
    'Eletromagntica': 'Eletromagnética',
    'Peridicos': 'Periódicos',
    'Conferncias': 'Conferências',
    'Cooperao': 'Cooperação',
    'Simpsio': 'Simpósio',
    'Maranho': 'Maranhão',
    'So': 'São',
    'Joo': 'João',
}

def clean_value(val):
    if not val:
        return ""
    val = str(val)
    for k, v in WORD_MAP.items():
        val = re.sub(r'\b' + k + r'\b', v, val, flags=re.IGNORECASE)
    
    # Remover aspas órfãs, vírgulas residuais e caracteres órfãos
    val = re.sub(r'\s*["“„”«»]\s*$', '', val)
    val = re.sub(r'^\s*["“„”«»]\s*', '', val)
    val = re.sub(r'\s+,', ',', val)
    val = re.sub(r'\s+', ' ', val).strip(" ,")
    return val

with open('public/data/publications.json', 'r', encoding='utf-8') as f:
    pubs = json.load(f)

for p in pubs:
    p['title'] = clean_value(p['title'])
    p['authors'] = clean_value(p['authors'])
    p['venue'] = clean_value(p['venue'])
    p['thematic_axes'] = [clean_value(ax) for ax in p['thematic_axes']]
    
    # Atualizar citação BibTeX com nomes limpos e acentuados
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

with open('public/data/publications.json', 'w', encoding='utf-8') as f:
    json.dump(pubs, f, ensure_ascii=False, indent=2)

print(f"✅ Sucesso: Todas as {len(pubs)} publicações foram corrigidas e salvas em public/data/publications.json")
