# Dashboard Interativo do INCT Signals: Planejamento & Arquitetura

> **Projeto:** INCT Signals (*Signal Processing, Communications, Sensing & Surveillance*)  
> **Website Oficial:** [https://inct-signals.org](https://inct-signals.org)  
> **Instituições Parceiras:** UFC (Coordenação Geral), ITA (Vice-Coordenação), UFRGS, PUCRS, UNIPAMPA, além de parceiros internacionais (DLR, CEDRA, UESTC, Skoltech).

---

## 1. Contexto e Motivação

O **INCT Signals** é uma rede nacional de excelência científica e desenvolvimento tecnológico apoiada pelo CNPq/FAPs, integrando mais de 25 pesquisadores e dezenas de pós-graduandos e bolsistas em áreas como:
- Processamento de sinais e modelos tensoriais
- Comunicações sem fio de próxima geração (5G/6G, RIS, ISAC)
- Radar, sensoriamento remoto e observação ambiental/espacial
- Sistemas autônomos, frotas de VANTs (UAVs) e computação embarcada tolerante a falhas

Com mais de **94 artigos publicados e aceitos** em periódicos internacionais de alto impacto (IEEE TSP, IEEE TWC, IEEE TVT, IEEE Access, Sensors, etc.) e conferências de ponta (IEEE ICASSP, SAM, ICC, Globecom, SBrT, etc.), surgiu a ideia de criar um **Dashboard Interativo** que organize, filtre e visualize toda essa produção científica.

---

## 2. Dimensões de Filtro e Taxonomia do Projeto

O Dashboard permite cruzar informações em múltiplas dimensões:

### A. Eixos Temáticos (6 Eixos Oficiais)
1. **Comunicações, Processamento de Sinais e Otimização**
2. **Sensoriamento Remoto e Sistemas de Radar**
3. **Monitoramento Ambiental e Climático**
4. **Vigilância de Sinais, Segurança e Confiabilidade**
5. **Sistemas Autônomos e Inteligentes**
6. **Caracterização Eletromagnética em Comunicações**

### B. Work Packages (4 WPs Estruturantes)
- **WP1:** *Satellite-based remote sensing & surveillance* (UFC • PUCRS)
  - WP1.1: Payload & components
  - WP1.2: Mission concepts & planning
- **WP2:** *Hardware, antenna designs & RF development* (UNIPAMPA • ITA • UFC)
  - WP2.1: Antennas
  - WP2.2: RF front-end
  - WP2.3: Signal recording & pre-processing
- **WP3:** *Testbeds & platforms for UAV-based sensing & surveillance* (UFRGS • ITA • UFC)
  - WP3.1: UAV experimental platform
  - WP3.2: UAV testbed
- **WP4:** *Signal processing for sensing & communications* (UFC • ITA)
  - WP4.1: Joint communications & sensing (ISAC)
  - WP4.2: Radar sensing signal processing

### C. Universidades & Laboratórios
- **UFC** (Lab. de Processamento de Sinais - LASP / DETI)
- **ITA** (Divisão de Engenharia Eletrônica)
- **UFRGS** (Instituto de Informática / Engenharia Elétrica)
- **PUCRS** (Escola Politécnica)
- **UNIPAMPA** (Campus Alegrete / Laboratório de Antenas)
- **Parceiros Internacionais:** DLR (Alemanha), CEDRA (Brasil), UESTC (China), Skoltech (Rússia).

### D. Tecnologias Core & Palavras-Chave
- *Reconfigurable Intelligent Surfaces (RIS, BD-RIS)*
- *Synthetic Aperture Radar (SAR, UAV-SAR, InSAR)*
- *Joint Communications and Sensing (ISAC)*
- *Decomposições Tensoriais (CPD, Tucker, Tensor Train)*
- *Reflectometria GNSS e Mitigação de Multitrajeto*
- *Redes de VANTs / FANETs e Roteamento Inteligente*
- *Arquiteturas Manycore e Tolerância a Falhas em Satélites (NoC)*
- *Federated Learning e IA na Borda*
- *Bioacústica e Monitoramento de Chuvas na Amazônia*
- *Matrizes Butler e Antenas Ressonadoras Dielétricas*

---

## 3. Funcionalidades do Dashboard

### 1. Painel de Indicadores (KPIs)
- Total de Publicações cadastradas (Periódicos vs. Conferências).
- Cobertura por Eixo Temático e por Work Package.
- Contagem de artigos por Universidade.
- Destaques de premiação (ex.: *Best Paper Award SBrT 2025*).

### 2. Filtros Dinâmicos e Busca em Tempo Real
- Filtro multifacetado por Eixo, WP, Instituição, Ano e Tipo de Veículo.
- Busca textual instantânea por palavras-chave, autores ou trecho de títulos.

### 3. Visualizações Interativas
- **Gráfico Temporal:** Evolução anual das publicações da rede.
- **Distribuição por Eixos e WPs:** Gráficos interativos em barras e roscas.
- **Grafo de Coautoria e Colaboração:** Visualização em rede conectando instituições, pesquisadores e temas.

### 4. Gestão de Citações e Exportação
- **Cópia de BibTeX com 1 clique** para uso direto em LaTeX/Overleaf.
- **Cópia de Referência formatada (ABNT / IEEE)**.
- **Exportação de Relatórios em CSV e BibTeX** para facilitar prestações de contas ao CNPq/CAPES e relatórios anuais do projeto.

---

## 4. Arquitetura Técnica e Deploy

- **Frontend:** Single-Page Application (SPA) responsiva com Tailwind CSS, gráficos interativos e busca client-side ultrarrápida.
- **Dataset:** publications.json estruturado e padronizado, de fácil atualização pela equipe.
- **Hospedagem:** 100% estático (GitHub Pages, Vercel, Netlify ou integrado via subdomínio/iframe no site oficial [inct-signals.org](https://inct-signals.org)).

---
*Documento gerado como registro do planejamento do projeto Dashboard INCT Signals.*
