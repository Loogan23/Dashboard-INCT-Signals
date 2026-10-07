import urllib.request
import re
import html
import json
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

REPLACEMENTS = [
    (r'\bAra[uú\ufffd]?jo\b', 'Araújo'),
    (r'\bBen[ií\ufffd]?cio\b', 'Benício'),
    (r'\bSantamar[ií\ufffd]?a\b', 'Santamaría'),
    (r'\bMagalh[aã\ufffd]?es\b', 'Magalhães'),
    (r'\bC[eé\ufffd]?sar\b', 'César'),
    (r'\bGarc[ií\ufffd]?a\b', 'García'),
    (r'\bGon[cç\ufffd]?alves\b', 'Gonçalves'),
    (r'\bGurj[aã\ufffd]?o\b', 'Gurjão'),
    (r'\bSim[aã\ufffd]?o\b', 'Simão'),
    (r'\bUch[oóô\ufffd]?a\b', 'Uchôa'),
    (r'\bAlc[aáâ\ufffd]?ntara\b', 'Alcântara'),
    (r'\bSimp[oó\ufffd]?sio\b', 'Simpósio'),
    (r'\bTelecomunica[cç\ufffd]?[oõ\ufffd]?es\b', 'Telecomunicações'),
    (r'\bComunica[cç\ufffd]?[oõ\ufffd]?es\b', 'Comunicações'),
    (r'\bOtimiza[cç\ufffd]?[aã\ufffd]?o\b', 'Otimização'),
    (r'\bCaracteriza[cç\ufffd]?[aã\ufffd]?o\b', 'Caracterização'),
    (r'\bDiscrimina[cç\ufffd]?[aã\ufffd]?o\b', 'Discriminação'),
    (r'\bPolariza[cç\ufffd]?[aã\ufffd]?o\b', 'Polarização'),
    (r'\bRecep[cç\ufffd]?[aã\ufffd]?o\b', 'Recepção'),
    (r'\bServi[cç\ufffd]?[oõ\ufffd]?s\b', 'Serviços'),
    (r'\bServi[cç\ufffd]?[oõ\ufffd]?o\b', 'Serviço'),
    (r'\bCoopera[cç\ufffd]?[aã\ufffd]?o\b', 'Cooperação'),
    (r'\bConfer[eê\ufffd]?ncias\b', 'Conferências'),
    (r'\bPeri[oó\ufffd]?dicos\b', 'Periódicos'),
    (r'\bPublica[cç\ufffd]?[oõ\ufffd]?es\b', 'Publicações'),
    (r'\bEletromagn[eé\ufffd]?tica\b', 'Eletromagnética'),
    (r'\bMaranh[aã\ufffd]?o\b', 'Maranhão'),
    (r'\bS[aã\ufffd]?o\s+Paulo\b', 'São Paulo'),
    (r'\bS[aã\ufffd]?o\s+Carlos\b', 'São Carlos'),
    (r'\bS[aã\ufffd]?o\s+Leopoldo\b', 'São Leopoldo'),
    (r'\bJo[aã\ufffd]?o\b', 'João'),
    (r'\bExplic[aá\ufffd]?vel\b', 'Explicável'),
    (r'\bClusteriza[cç\ufffd]?[aã\ufffd]?o\b', 'Clusterização'),
    (r'\bAndr[eé\ufffd]\b', 'André'),
    (r'\bVin[ií\ufffd]?cius\b', 'Vinícius'),
    (r'\bFazal-e-Asim\b', 'F.-E. Asim'),
    (r'\bFazal-E-Asim\b', 'F.-E. Asim'),
    (r'\bF-E- Asim\b', 'F.-E. Asim'),
    (r'\bF-E Asim\b', 'F.-E. Asim'),
    (r'\bF-\.E\. Asim\b', 'F.-E. Asim'),
    (r'\bB\. S[aã]?okal\b', 'B. Sokal'),
    (r'\bArag[oó\ufffd]?n-?[AÁ\ufffd]?ngel\b', 'Aragón-Ángel'),
    (r'\bRovira-?Garc[ií\ufffd]?a\b', 'Rovira-García'),
]

def clean_text(text):
    if not text:
        return ""
    text = html.unescape(str(text))
    # Remove escaped chars
    text = text.replace('\\n', ' ').replace('\\t', ' ').replace('\\"', '"').replace("\\'", "'").replace('\\', '')
    
    # Specific bad strings
    text = text.replace("Sãound", "Sound").replace("Sãokal", "Sokal")
    text = text.replace("ÁÁngel", "Ángel").replace("ÓÓpticas", "Ópticas")
    
    for pat, rep in REPLACEMENTS:
        text = re.sub(pat, rep, text, flags=re.IGNORECASE)
            
    # Clean remaining replacement characters
    text = text.replace(chr(0xFFFD), "")
    
    # Remove quotes, commas, trailing backslashes
    text = re.sub(r'^\s*["“„”«»\']+\s*', '', text)
    text = re.sub(r'\s*["“„”«»\']+\s*$', '', text)
    text = re.sub(r'\s+,', ',', text)
    text = re.sub(r'\s+', ' ', text).strip(" ,\"'\\")
    return text

def fetch_url(url, retries=3, delay=2):
    import time
    for attempt in range(1, retries + 1):
        try:
            req = urllib.request.Request(
                url,
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
            )
            with urllib.request.urlopen(req, timeout=25) as response:
                return response.read().decode('utf-8', errors='ignore')
        except Exception as e:
            if attempt < retries:
                time.sleep(delay)
            else:
                print(f"Aviso ao buscar {url} após {retries} tentativas: {e}")
                return ""


def assign_metadata(item):
    text = (item["title"] + " " + item["venue"] + " " + item["authors"]).lower()
    
    # Eixos Temáticos
    eixos = []
    if any(k in text for k in ["ris", "irs", "reconfigurable intelligent", "tensor", "channel estimation", "mimo", "ofdm", "thz", "beamforming", "fluid antenna", "antenas fluidas", "vlc", "visible light", "space-time", "rate-splitting", "precoding", "eeg", "seizure", "cell-free"]):
        eixos.append("Comunicações, Processamento de Sinais e Otimização")
    if any(k in text for k in ["sar", "synthetic aperture radar", "radar", "sensing", "change detection", "remote sensing", "facade"]):
        eixos.append("Sensoriamento Remoto e Sistemas de Radar")
    if any(k in text for k in ["rainfall", "amazon", "sound", "environmental", "fog computing", "climate", "acoustic", "weather"]):
        eixos.append("Monitoramento Ambiental e Climático")
    if any(k in text for k in ["gnss", "scintillation", "tracking loop", "ionospheric", "error correction", "noc", "network-on-chip", "fault", "blockchain", "sentinel", "security", "privacy", "trust"]):
        eixos.append("Vigilância de Sinais, Segurança e Confiabilidade")
    if any(k in text for k in ["uav", "fanet", "drone", "pathfinding", "federated learning", "autonomous", "disaster", "mobile", "grid"]):
        eixos.append("Sistemas Autônomos e Inteligentes")
    if any(k in text for k in ["antenna", "antena", "antenas", "microstrip", "butler matrix", "resonator", "conformal", "beam steering", "electromagnetic", "dielectric", "microwave", "rede refletora", "stripline"]):
        eixos.append("Caracterização Eletromagnética em Comunicações")
        
    if not eixos:
        eixos.append("Comunicações, Processamento de Sinais e Otimização")
        
    # Work Packages
    wps = []
    if any(k in text for k in ["cubesat", "satellite", "satélite", "payload", "orbit", "spaceborne", "reflectometry", "ionospheric", "space"]):
        wps.append("WP1")
    if any(k in text for k in ["antenna", "antena", "antenas", "microstrip", "butler", "rf", "microwave", "circuit", "dielectric", "resonator", "fluid antenna", "antenas fluidas"]):
        wps.append("WP2")
    if any(k in text for k in ["uav", "drone", "fanet", "airborne", "testbed", "platform", "pathfinding"]):
        wps.append("WP3")
    if any(k in text for k in ["isac", "sensing and communication", "radar signal", "tensor", "channel estimation", "ris sensing", "cell-free", "eeg"]):
        wps.append("WP4")
        
    if not wps:
        wps.append("WP4")
        
    # Universidades
    unis = []
    authors_lower = item["authors"].lower()
    if any(k in authors_lower for k in ["almeida", "araújo", "araujo", "ximenes", "asim", "sokal", "romano", "rodrigues", "benício", "benicio", "maciel", "miranda", "diniz", "cavalcanti", "paiva", "carneiro", "aguiar", "alcântara", "alcantara"]):
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
        
    # Core Tech Tags
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
    if re.search(r'\b(mimo|cf-mmimo|massive mimo|precoding|beamforming|channel estimation|channel state|rate-splitting|cell-free|fluid antenna|antenas fluidas|ofdm|signal processing|processamento de sinais|khatri-rao|broadband|telecommunication|telecomunicações|telecomunicacoes|quality of service|qualidade de serviço|qualidade de servico|spatial clustering|clusterização|clusterizacao|power control|alocação de potência)\b', text):
        tags.append("MIMO & Processamento de Sinais")
        
    # 5. Métodos Tensoriais
    if re.search(r'\b(tensor|tensorial|parafac|tucker|cpd|canonical polyadic|matrix factorization|tensor-based|decomposição tensorial|tensor decomposition)\b', text):
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
    if re.search(r'\b(antenna|antennas|antena|antenas|microstrip|butler|resonator|waveguide|dielectric|rf|radiofrequency|microwave|electromagnetic|aperture|reflectarray|polarização|polarizacao|stripline)\b', text):
        tags.append("Antenas & RF")
        
    # 10. IA & Aprendizado de Máquina
    if re.search(r'\b(federated learning|machine learning|deep learning|neural network|k-means|clustering|ai|artificial intelligence|classification|reinforcement learning|explainable|explicável|explicavel|pso|yolo|eeg|seizure)\b', text):
        tags.append("IA & Aprendizado de Máquina")
        
    # 11. Sistemas Embarcados & Segurança
    if re.search(r'\b(noc|network-on-chip|error correction|fault tolerance|fault-tolerant|blockchain|ecc|memory controller|manycore|hardware impairments|security|trust|privacy|decoding algorithm)\b', text):
        tags.append("Sistemas Embarcados & Segurança")
        
    # 12. VLC & Comunicações Ópticas
    if re.search(r'\b(vlc|visible light|optical wireless|dimming|space-time code|photonic|óptica|optica|ópticas)\b', text):
        tags.append("VLC & Comunicações Ópticas")
        
    # 13. Sensoriamento Ambiental
    if re.search(r'\b(environmental|rainfall|amazon|climate|weather|air quality|acoustic|sound|microwave link|rain)\b', text):
        tags.append("Sensoriamento Ambiental")
        
    # Fallback
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
    
    # Prêmios e destaques especiais
    if "flexible intelligent metasurface" in item["title"].lower() and item.get("year") == 2026:
        item["award"] = "🏆 Prêmio de Melhor Artigo em Telecomunicações (Best Paper Award) — SBrT 2026"
        item["status"] = "Publicado"
        item["type"] = "Conferência Nacional (SBrT)"
        item["venue"] = "Anais do XLIV Simpósio Brasileiro de Telecomunicações e Processamento de Sinais (SBrT 2026), Salvador, BA, 2026."
        item["link"] = "https://inct-signals.org/lasp-e-inct-signals-celebram-premio-de-melhor-artigo-no-sbrt-2026"
        item["work_packages"] = ["WP2", "WP4"]
    elif "circuit-based modeling approach" in item["title"].lower() and item.get("year") == 2025:
        item["award"] = "🏆 Prêmio de Melhor Artigo em Comunicações (Best Paper Award) — SBrT 2025"
        item["status"] = "Publicado"
        item["type"] = "Conferência Nacional (SBrT)"
        item["venue"] = "Anais do XLIII Simpósio Brasileiro de Telecomunicações e Processamento de Sinais (SBrT 2025), Natal, RN, 2025."
        item["link"] = "https://inct-signals.org/participacao-do-lasp-e-do-inct-signals-no-sbrt-2025"
        item["work_packages"] = ["WP2", "WP4"]

    item["bibtex"] = bibtex

def run_sync():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    next_json = os.path.join(script_dir, "..", "public", "data", "publications.json")
    
    existing_pubs = []
    if os.path.exists(next_json):
        with open(next_json, "r", encoding="utf-8") as f:
            existing_pubs = json.load(f)
            
    # Map of existing items by normalized title
    existing_map = {}
    for p in existing_pubs:
        norm_key = re.sub(r'[^a-zA-Z0-9]', '', p["title"].lower())
        if norm_key not in existing_map:
            existing_map[norm_key] = p
            
    fetched_pubs = []
    
    # 1. Fetch Journals
    print("Buscando periódicos...")
    html_j = fetch_url("https://inct-signals.org/artigos-em-periodicos")
    if html_j:
        html_j_clean = html.unescape(html_j).replace('\\n', '\n').replace('\\t', '\t').replace('\\"', '"').replace("\\'", "'")
        pos_j = html_j_clean.find('const publicacoes = [')
        if pos_j != -1:
            end_j = html_j_clean.find('];', pos_j)
            js_sub = html_j_clean[pos_j:end_j]
            matches = re.findall(r'\{\s*year:\s*(\d+),\s*textBefore:\s*[\'\"“](.*?)[\'\"”],\s*title:\s*[\'\"“](.*?)[\'\"”],\s*link:\s*(.*?),\s*textAfter:\s*[\'\"“](.*?)[\'\"”]\s*\}', js_sub)
            print(f"Periódicos encontrados: {len(matches)}")
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
                
    # 2. Fetch Conferences
    print("Buscando artigos em conferências...")
    html_c = fetch_url("https://inct-signals.org/artigos-em-conferencias")
    if html_c:
        content_c = html.unescape(html_c.replace('\\"', '"').replace('\\n', ' '))
        lis = re.findall(r'<li\b[^>]*>(.*?)</li>', content_c, re.DOTALL | re.IGNORECASE)
        
        seen_conf_texts = set()
        conf_count = 0
        
        for it in lis:
            clean = ' '.join(re.sub(r'<[^>]+>', ' ', it).split())
            if len(clean) < 30 or any(clean.startswith(w) for w in ["Eventos", "Publicações", "Convênios", "I Workshop", "II Workshop", "III Workshop"]):
                continue
            if not any(k in clean for k in ['SBrT', 'Conference', 'Symposium', 'Simpósio', 'Simposio', 'Proceedings', 'IEEE', 'ION GNSS', 'EuCAP', 'Congress', 'Workshop', 'Asilomar', 'Anais', 'In:']):
                continue
                
            norm_c = re.sub(r'[^a-zA-Z0-9]', '', clean.lower())
            if norm_c in seen_conf_texts:
                continue
            seen_conf_texts.add(norm_c)
            
            # Extract links
            links = re.findall(r'href=["\'](.*?)["\']', it)
            link = links[0] if links and links[0].startswith("http") else None
            
            # Extract title in quotes
            norm_q = clean.replace('“', '"').replace('”', '"').replace('„', '"').replace('«', '"').replace('»', '"').replace('’', "'")
            m = re.search(r'"([^"]+)"', norm_q)
            if m:
                title = clean_text(m.group(1))
                authors = clean_text(norm_q[:m.start()])
                venue = clean_text(norm_q[m.end():])
            else:
                parts = clean.split(',')
                if len(parts) >= 3:
                    authors = clean_text(', '.join(parts[:2]))
                    title = clean_text(parts[2])
                    venue = clean_text(', '.join(parts[3:]))
                else:
                    title = clean_text(clean)
                    authors = "Pesquisadores do INCT Signals"
                    venue = clean_text(clean)
                    
            venue = re.sub(r'^(in|In|em|Em)\s+', '', venue).strip(" ,\"'\\")
            
            yr_m = re.search(r'\b(202[3-7])\b', clean)
            year = int(yr_m.group(1)) if yr_m else 2025
            
            category = "Conferência Internacional"
            clean_lower = clean.lower()
            venue_lower = venue.lower()
            if any(k in clean_lower or k in venue_lower for k in [
                "sbrt", "brazilian telecommunications", "brazilian symposium",
                "simpósio brasileiro", "simposio brasileiro", "xliv brazilian"
            ]):
                category = "Conferência Nacional (SBrT)"
                
            status = "Publicado"
            if "submitted" in clean_lower: status = "Submetido"
            elif "accepted" in clean_lower or "aceito" in clean_lower: status = "Aceito"
            
            fetched_pubs.append({
                "type": category,
                "title": title,
                "authors": authors,
                "venue": venue,
                "year": year,
                "status": status,
                "link": link
            })
            conf_count += 1
            
        print(f"Conferências encontradas: {conf_count}")
        
    print(f"Total de publicações extraídas: {len(fetched_pubs)}")
    
    # Process fetched and build final list
    final_pubs = []
    used_keys = set()
    
    for fp in fetched_pubs:
        key = re.sub(r'[^a-zA-Z0-9]', '', fp["title"].lower())
        if key in used_keys:
            continue
        used_keys.add(key)
        
        if key in existing_map:
            pub = existing_map[key]
            pub["type"] = fp["type"]
            pub["title"] = fp["title"]
            pub["authors"] = fp["authors"]
            pub["venue"] = fp["venue"]
            pub["year"] = fp["year"]
            pub["status"] = fp["status"]
            if fp["link"]: pub["link"] = fp["link"]
            assign_metadata(pub)
            final_pubs.append(pub)
        else:
            pub = {
                "id": f"pub-{len(final_pubs)+1:03d}",
                "type": fp["type"],
                "title": fp["title"],
                "authors": fp["authors"],
                "venue": fp["venue"],
                "year": fp["year"],
                "status": fp["status"],
                "link": fp["link"]
            }
            assign_metadata(pub)
            final_pubs.append(pub)
            
    # Include any existing items not currently matched on site
    for key, remaining in existing_map.items():
        if key not in used_keys:
            assign_metadata(remaining)
            final_pubs.append(remaining)
            used_keys.add(key)
            
    # Ordering:
    # 1. SBrT 2026 Best Paper (Romano)
    # 2. SBrT 2025 Best Paper (Alcântara)
    # 3. Rest of 2026 SBrT
    # 4. Rest of 2026 International Conferences
    # 5. Rest of 2026 Journals
    # 6. 2025 conferences and journals
    # 7. 2024 conferences and journals
    def order_rank(p):
        if "award" in p:
            return (0, -p.get("year", 0), 0)
        yr = -p.get("year", 0)
        type_rank = 1 if "SBrT" in p.get("type", "") else (2 if "Conferência" in p.get("type", "") else 3)
        return (1, yr, type_rank)
        
    final_pubs.sort(key=order_rank)
    
    # Re-index IDs cleanly
    for i, p in enumerate(final_pubs):
        p["id"] = f"pub-{i+1:03d}"
        
    # Write to destination
    os.makedirs(os.path.dirname(next_json), exist_ok=True)
    with open(next_json, "w", encoding="utf-8") as f:
        json.dump(final_pubs, f, ensure_ascii=False, indent=2)

    print(f"✅ Sincronização concluída com sucesso! Total: {len(final_pubs)} publicações salvas em public/data/publications.json.")
    return final_pubs

if __name__ == "__main__":
    run_sync()
