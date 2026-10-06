import urllib.request
import re
import html
import json
import os
import sys

# Ensure UTF-8 output
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

REPL_CHAR = chr(0xFFFD)

CHAR_MAP = {
    "Benicio": "Benício",
    "Bencio": "Benício",
    "Araujo": "Araújo",
    "Arajo": "Araújo",
    "Magalhaes": "Magalhães",
    "Magalhes": "Magalhães",
    "Santamaria": "Santamaría",
    "Santamara": "Santamaría",
    "Santamar": "Santamaría",
    "Cesar": "César",
    "Csar": "César",
    "Garcia": "García",
    "Garca": "García",
    "Goncalves": "Gonçalves",
    "Gonalves": "Gonçalves",
    "Gurjao": "Gurjão",
    "Gurja": "Gurjão",
    "Simao": "Simão",
    "Aragon-Angel": "Aragón-Ángel",
    "Aragon Angel": "Aragón-Ángel",
    "Rovira Garcia": "Rovira-García",
    "Rovira-Garcia": "Rovira-García",
    "Telecomunicaes": "Telecomunicações",
    "Comunicaes": "Comunicações",
    "Otimizao": "Otimização",
    "Caracterizao": "Caracterização",
    "Eletromagntica": "Eletromagnética",
    "Peridicos": "Periódicos",
    "Conferncias": "Conferências",
    "Cooperao": "Cooperação",
    "Simpsio": "Simpósio",
    "Maranho": "Maranhão",
    "So": "São",
    "Joo": "João",
    "Fazal-e-Asim": "F.-E. Asim",
    "Fazal-E-Asim": "F.-E. Asim",
    "F-E- Asim": "F.-E. Asim",
    "F-E Asim": "F.-E. Asim",
    f"Ara{REPL_CHAR}jo": "Araújo",
    f"Ben{REPL_CHAR}cio": "Benício",
    f"Santamar{REPL_CHAR}a": "Santamaría",
    f"Magalh{REPL_CHAR}es": "Magalhães",
    f"C{REPL_CHAR}sar": "César",
    f"Garc{REPL_CHAR}a": "García",
    f"Comunica{REPL_CHAR}es": "Comunicações",
    f"Otimiza{REPL_CHAR}o": "Otimização",
    f"Caracteriza{REPL_CHAR}o": "Caracterização",
    f"Eletromagn{REPL_CHAR}tica": "Eletromagnética",
    REPL_CHAR: "",
}

def clean_text(text):
    if not text:
        return ""
    text = html.unescape(str(text))
    text = text.replace('\\n', ' ').replace('\\"', '"').replace("\\'", "'")
    for k, v in CHAR_MAP.items():
        text = re.sub(r'\b' + k + r'\b', v, text, flags=re.IGNORECASE) if not REPL_CHAR in k else text.replace(k, v)
    text = re.sub(r'\s*["“„”«»]\s*$', '', text)
    text = re.sub(r'^\s*["“„”«»]\s*', '', text)
    text = re.sub(r'\s+', ' ', text).strip(" ,")
    return text

def fetch_url(url):
    try:
        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req, timeout=15) as response:
            return response.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Aviso ao buscar {url}: {e}")
        return ""

def assign_metadata(item):
    text = (item["title"] + " " + item["venue"] + " " + item["authors"]).lower()
    
    # Eixos Temáticos
    eixos = []
    if any(k in text for k in ["ris", "irs", "reconfigurable intelligent", "tensor", "channel estimation", "mimo", "ofdm", "thz", "beamforming", "fluid antenna", "vlc", "visible light", "space-time", "rate-splitting", "precoding"]):
        eixos.append("Comunicações, Processamento de Sinais e Otimização")
    if any(k in text for k in ["sar", "synthetic aperture radar", "radar", "sensing", "change detection", "remote sensing", "facade"]):
        eixos.append("Sensoriamento Remoto e Sistemas de Radar")
    if any(k in text for k in ["rainfall", "amazon", "sound", "environmental", "fog computing", "climate", "acoustic", "weather"]):
        eixos.append("Monitoramento Ambiental e Climático")
    if any(k in text for k in ["gnss", "scintillation", "tracking loop", "ionospheric", "error correction", "noc", "network-on-chip", "fault", "blockchain", "sentinel", "security", "privacy", "trust"]):
        eixos.append("Vigilância de Sinais, Segurança e Confiabilidade")
    if any(k in text for k in ["uav", "fanet", "drone", "pathfinding", "federated learning", "autonomous", "disaster", "mobile", "grid"]):
        eixos.append("Sistemas Autônomos e Inteligentes")
    if any(k in text for k in ["antenna", "microstrip", "butler matrix", "resonator", "conformal", "beam steering", "electromagnetic", "dielectric", "microwave"]):
        eixos.append("Caracterização Eletromagnética em Comunicações")
        
    if not eixos:
        eixos.append("Comunicações, Processamento de Sinais e Otimização")
        
    # Work Packages
    wps = []
    if any(k in text for k in ["cubesat", "satellite", "payload", "orbit", "spaceborne", "reflectometry", "ionospheric", "space"]):
        wps.append("WP1")
    if any(k in text for k in ["antenna", "microstrip", "butler", "rf", "microwave", "circuit", "dielectric", "resonator"]):
        wps.append("WP2")
    if any(k in text for k in ["uav", "drone", "fanet", "airborne", "testbed", "platform", "pathfinding"]):
        wps.append("WP3")
    if any(k in text for k in ["isac", "sensing and communication", "radar signal", "tensor", "channel estimation", "ris sensing"]):
        wps.append("WP4")
        
    if not wps:
        wps.append("WP4")
        
    # Universidades
    unis = []
    authors_lower = item["authors"].lower()
    if any(k in authors_lower for k in ["almeida", "araújo", "araujo", "ximenes", "asim", "sokal", "romano", "rodrigues", "benício", "benicio", "maciel", "miranda", "diniz", "cavalcanti"]):
        unis.append("UFC")
    if any(k in authors_lower for k in ["antreich", "pacelli", "florindo", "magalhães", "magalhaes", "felix"]):
        unis.append("ITA")
    if any(k in authors_lower for k in ["freitas", "pasandideh", "costa", "tropea", "monteiro", "santos", "luvisa", "lazzari", "peixoto", "anjos", "valente"]):
        unis.append("UFRGS")
    if any(k in authors_lower for k in ["marcon", "silveira", "vercouter", "nogueira", "muniz", "freitas", "ferreira", "palitot", "filho", "paz"]):
        unis.append("PUCRS")
    if any(k in authors_lower for k in ["heckler", "schlosser", "vieira", "bouari", "pereira", "everling", "paulena", "franco", "silva"]):
        unis.append("UNIPAMPA")
        
    if not unis:
        unis.append("UFC")
        
    # Core Tech Tags (Em Português)
    tags = []
    
    # 1. RIS / Metassuperfícies
    if re.search(r'\b(ris|irs|metasurface|metassuperfície|metassuperficie|reflecting surface|reconfigurable surface|reconfigurable surfaces|reflective surface|rede refletora|intelligent surface)\b', text):
        tags.append("RIS / Metassuperfícies")
        
    # 2. Radar / SAR
    if re.search(r'\b(sar|synthetic aperture radar|radar|tomography|tomographic)\b', text):
        tags.append("Radar / SAR")
        
    # 3. ISAC / 6G
    if re.search(r'\b(isac|joint sensing|joint communication|sensing and communication|radar-communication|6g|integrated sensing)\b', text):
        tags.append("ISAC / 6G")
        
    # 4. MIMO & Processamento de Sinais
    if re.search(r'\b(mimo|massive mimo|precoding|beamforming|channel estimation|channel state|rate-splitting|cell-free|fluid antenna|ofdm|signal processing|khatri-rao|broadband|telecommunication|telecomunicações|telecomunicacoes|quality of service|qualidade de serviço|qualidade de servico|spatial clustering|clusterização|clusterizacao)\b', text):
        tags.append("MIMO & Processamento de Sinais")
        
    # 5. Métodos Tensoriais
    if re.search(r'\b(tensor|tensorial|parafac|tucker|cpd|canonical polyadic|matrix factorization|tensor-based)\b', text):
        tags.append("Métodos Tensoriais")
        
    # 6. VANTs & Sistemas Autônomos
    if re.search(r'\b(uav|uavs|drone|drones|fanet|airborne|autonomous|pathfinding|quadrotor|unmanned|grid)\b', text):
        tags.append("VANTs & Sistemas Autônomos")
        
    # 7. Satélites & Comunicação Espacial
    if re.search(r'\b(cubesat|cubesats|satellite|satellites|satélite|satélites|constellation|spaceborne|haps|high altitude platform|orbital|orbit)\b', text):
        tags.append("Satélites & Comunicação Espacial")
        
    # 8. GNSS & Navegação
    if re.search(r'\b(gnss|gps|scintillation|ionospheric|tracking loop|cycle slip|positioning|navigation)\b', text):
        tags.append("GNSS & Navegação")
        
    # 9. Antenas & RF
    if re.search(r'\b(antenna|antennas|antena|antenas|microstrip|butler|resonator|waveguide|dielectric|rf|radiofrequency|microwave|electromagnetic|aperture|reflectarray|polarização|polarizacao)\b', text):
        tags.append("Antenas & RF")
        
    # 10. IA & Aprendizado de Máquina
    if re.search(r'\b(federated learning|machine learning|deep learning|neural network|k-means|clustering|ai|artificial intelligence|classification|reinforcement learning|explainable|explicável|explicavel)\b', text):
        tags.append("IA & Aprendizado de Máquina")
        
    # 11. Sistemas Embarcados & Segurança
    if re.search(r'\b(noc|network-on-chip|error correction|fault tolerance|fault-tolerant|blockchain|ecc|memory controller|manycore|hardware impairments|security|trust|privacy|decoding algorithm)\b', text):
        tags.append("Sistemas Embarcados & Segurança")
        
    # 12. VLC & Comunicações Ópticas
    if re.search(r'\b(vlc|visible light|optical wireless|dimming|space-time code|photonic)\b', text):
        tags.append("VLC & Comunicações Ópticas")
        
    # 13. Sensoriamento Ambiental
    if re.search(r'\b(environmental|rainfall|amazon|climate|weather|air quality|acoustic|sound|microwave link|rain)\b', text):
        tags.append("Sensoriamento Ambiental")
        
    # Fallback para garantia de 100% de cobertura em telecomunicações
    if not tags:
        if any(w in text for w in ['communication', 'comunicação', 'comunicacao', 'signal', 'sinal', 'network', 'rede', 'wireless']):
            tags.append("MIMO & Processamento de Sinais")

    item["thematic_axes"] = eixos
    item["work_packages"] = wps
    item["institutions"] = unis
    item["tags"] = tags
    
    # Gerar Citação BibTeX
    authors_clean = item["authors"].strip(" ,")
    first_author_surname = authors_clean.split(',')[0].split()[-1] if authors_clean else "inct"
    first_word_title = [w for w in re.sub(r'[^\w\s]', '', item["title"]).split() if len(w)>3]
    w_title = first_word_title[0].lower() if first_word_title else "paper"
    cite_key = f"{first_author_surname.lower()}{item['year']}{w_title}"
    
    bib_type = "article" if item["type"] == "Periódico" else "inproceedings"
    booktitle_field = "journal" if item["type"] == "Periódico" else "booktitle"
    
    bibtex = f"@{bib_type}{{{cite_key},\n"
    bibtex += f"  author = {{{authors_clean}}},\n"
    bibtex += f"  title = {{{item['title']}}},\n"
    bibtex += f"  {booktitle_field} = {{{item['venue']}}},\n"
    bibtex += f"  year = {{{item['year']}}}\n"
    bibtex += "}"
    
    if "flexible intelligent metasurface" in item["title"].lower() and item.get("year") == 2026:
        item["award"] = "🏆 Prêmio de Melhor Artigo em Telecomunicações (Best Paper Award) — SBrT 2026"
        item["status"] = "Publicado"
    elif "circuit-based modeling approach" in item["title"].lower() and item.get("year") == 2025:
        item["award"] = "🏆 Prêmio de Melhor Artigo em Comunicações (Best Paper Award) — SBrT 2025"
        item["venue"] = "Anais do XLIII Simpósio Brasileiro de Telecomunicações e Processamento de Sinais (SBrT 2025), Natal, RN, 2025."
        item["link"] = "https://inct-signals.org/participacao-do-lasp-e-do-inct-signals-no-sbrt-2025"

    item["bibtex"] = bibtex

def sync():
    print("Iniciando sincronização automática de publicações do INCT Signals...")
    
    # Target path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    next_json = os.path.join(script_dir, "..", "public", "data", "publications.json")
    
    existing_pubs = []
    if os.path.exists(next_json):
        try:
            with open(next_json, "r", encoding="utf-8") as f:
                existing_pubs = json.load(f)
        except Exception as e:
            print(f"Não foi possível ler dataset existente: {e}")

    # Map of existing titles for deduplication
    existing_titles = {p["title"].lower().strip(): p for p in existing_pubs}
    
    fetched_pubs = []
    
    # 1. Fetch Journals from site
    html_j = fetch_url("https://inct-signals.org/artigos-em-periodicos")
    if html_j:
        html_j_clean = html.unescape(html_j).replace('\\n', '\n').replace('\\t', '\t').replace('\\"', '"').replace("\\'", "'")
        pos_j = html_j_clean.find('const publicacoes = [')
        if pos_j != -1:
            end_j = html_j_clean.find('];', pos_j)
            js_sub = html_j_clean[pos_j:end_j]
            matches = re.findall(r'\{\s*year:\s*(\d+),\s*textBefore:\s*[\'\"“](.*?)[\'\"”],\s*title:\s*[\'\"“](.*?)[\'\"”],\s*link:\s*(.*?),\s*textAfter:\s*[\'\"“](.*?)[\'\"”]\s*\}', js_sub)
            print(f"Publicações em periódicos encontradas no site: {len(matches)}")
            for yr, tb, ti, lk, ta in matches:
                yr = int(yr)
                tb = clean_text(tb)
                ti = clean_text(ti)
                lk = clean_text(lk)
                if lk == 'null' or not lk.startswith('http'): lk = None
                ta = clean_text(ta)
                
                authors = tb.rstrip(',').strip()
                venue = ta.lstrip(',').strip()
                
                status = "Publicado"
                if "submitted" in venue.lower(): status = "Submetido"
                elif "to appear" in venue.lower() or "aceito" in venue.lower(): status = "Aceito / No Prelo"

                fetched_pubs.append({
                    "type": "Periódico",
                    "title": ti,
                    "authors": authors,
                    "venue": venue,
                    "year": yr,
                    "status": status,
                    "link": lk
                })
                
    # 2. Fetch Conferences from site
    html_c = fetch_url("https://inct-signals.org/artigos-em-conferencias")
    if html_c:
        p_matches = re.findall(r'<p[^>]*>(.*?)</p>', html_c, re.DOTALL)
        for p in p_matches:
            cleaned = clean_text(re.sub(r'<[^>]+>', ' ', p))
            if len(cleaned) > 40 and ('Proceedings' in cleaned or 'Conference' in cleaned or 'Symposium' in cleaned or 'SBrT' in cleaned or 'IEEE' in cleaned or 'ION GNSS' in cleaned or 'EuCAP' in cleaned):
                title_match = re.search(r'["“](.*?)["”]', cleaned)
                if title_match:
                    title = clean_text(title_match.group(1))
                    parts = cleaned.split(f'"{title}"')
                    if len(parts) < 2: parts = cleaned.split(f'“{title}”')
                    authors = clean_text(parts[0].rstrip(',').strip()) if len(parts) > 0 else "Pesquisadores do INCT Signals"
                    venue = clean_text(parts[1].lstrip(',').strip()) if len(parts) > 1 else cleaned
                else:
                    title = cleaned
                    authors = "Pesquisadores do INCT Signals"
                    venue = cleaned
                    
                yr_m = re.search(r'\b(202[3-6])\b', cleaned)
                yr = int(yr_m.group(1)) if yr_m else 2025
                
                category = "Conferência Internacional"
                if "SBrT" in cleaned or "Brazilian" in cleaned:
                    category = "Conferência Nacional (SBrT)"
                    
                status = "Publicado"
                if "submitted" in cleaned.lower(): status = "Submetido"
                elif "accepted" in cleaned.lower() or "aceito" in cleaned.lower(): status = "Aceito"

                fetched_pubs.append({
                    "type": category,
                    "title": title,
                    "authors": authors,
                    "venue": venue,
                    "year": yr,
                    "status": status,
                    "link": None
                })

    print(f"Total de publicações extraídas da web: {len(fetched_pubs)}")
    
    # Merge and update dataset
    updated_list = []
    count_new = 0
    
    # Process fetched publications
    for fp in fetched_pubs:
        key = fp["title"].lower().strip()
        if key in existing_titles:
            # Preserve existing ID and update fields
            pub = existing_titles[key]
            pub["type"] = fp["type"]
            pub["authors"] = fp["authors"]
            pub["venue"] = fp["venue"]
            pub["year"] = fp["year"]
            pub["status"] = fp["status"]
            if fp["link"]: pub["link"] = fp["link"]
            assign_metadata(pub)
            updated_list.append(pub)
            del existing_titles[key]
        else:
            count_new += 1
            pub = {
                "id": f"pub-{len(updated_list)+1:03d}",
                "type": fp["type"],
                "title": fp["title"],
                "authors": fp["authors"],
                "venue": fp["venue"],
                "year": fp["year"],
                "status": fp["status"],
                "link": fp["link"]
            }
            assign_metadata(pub)
            updated_list.append(pub)
            
    # Keep remaining existing items
    for remaining in existing_titles.values():
        # Translate types/statuses/tags of existing items if needed
        if remaining["type"] == "Journal": remaining["type"] = "Periódico"
        elif remaining["type"] == "International Conference": remaining["type"] = "Conferência Internacional"
        elif remaining["type"] == "Brazilian Conference (SBrT)": remaining["type"] = "Conferência Nacional (SBrT)"
        
        if remaining["status"] == "Published": remaining["status"] = "Publicado"
        elif remaining["status"] == "Accepted": remaining["status"] = "Aceito"
        elif remaining["status"] == "Accepted / In Press": remaining["status"] = "Aceito / No Prelo"
        elif remaining["status"] == "Submitted": remaining["status"] = "Submetido"
        
        # Translate tags
        tag_trans = {
            "RIS / Metasurface": "RIS / Metassuperfícies",
            "Tensor Methods": "Métodos Tensoriais",
            "UAVs & Autonomous": "VANTs & Sistemas Autônomos",
            "GNSS & Navigation": "GNSS & Navegação",
            "AI & Machine Learning": "IA & Aprendizado de Máquina",
            "Embedded & Fault Tolerance": "Sistemas Embarcados & Tolerância a Falhas",
            "Environmental Sensing": "Sensoriamento Ambiental"
        }
        remaining["tags"] = [tag_trans.get(t, t) for t in remaining.get("tags", [])]
        assign_metadata(remaining)
        updated_list.append(remaining)
        
    # Re-index IDs cleanly
    for i, p in enumerate(updated_list):
        p["id"] = f"pub-{i+1:03d}"
        
    # Write to destination
    os.makedirs(os.path.dirname(next_json), exist_ok=True)
    with open(next_json, "w", encoding="utf-8") as f:
        json.dump(updated_list, f, ensure_ascii=False, indent=2)

    print(f"✅ Sincronização concluída com sucesso! Total: {len(updated_list)} publicações ({count_new} novas).")

if __name__ == "__main__":
    sync()
