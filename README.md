# 📡 Dashboard Interativo do INCT Signals

> **INCT Signals:** *Signal Processing, Communications, Sensing & Surveillance*  
> **Website Oficial:** [https://inct-signals.org](https://inct-signals.org)  
> **Apoio:** CNPq / CAPES / FUNCAP  
> **Instituições Parceiras:** UFC (Coordenação Geral), ITA (Vice-Coordenação), UFRGS, PUCRS, UNIPAMPA e Parceiros Internacionais (DLR, CEDRA, UESTC, Skoltech).

---

## 🎯 Sobre o Projeto

O **Dashboard Interativo do INCT Signals** é um painel web moderno, responsivo e de alta performance desenvolvido para catalogar, organizar, analisar e visualizar toda a produção científica da rede nacional de excelência do INCT Signals (mais de 90+ artigos em periódicos internacionais de alto impacto como *IEEE TSP, IEEE TWC, IEEE TVT, IEEE Access, Sensors* e conferências de ponta como *IEEE ICASSP, SAM, ICC, Globecom e SBrT*).

O painel permite cruzar informações entre **Eixos Temáticos**, **Work Packages (WPs)**, **Instituições**, **Autores** e **Anos de Publicação**, facilitando a prestação de contas ao CNPq/CAPES e oferecendo transparência à comunidade científica.

---

## ✨ Principais Funcionalidades

### 1. 📄 Publicações & Busca Multifacetada
- **Filtros Combinados:** Filtre por Eixo Temático, Work Package (WP1–WP4), Universidade Parceira, Tipo de Veículo (Periódico vs. Conferência) e Ano.
- **Busca em Tempo Real:** Pesquisa instantânea por título, autor, veículo ou palavra-chave.
- **Modo Claro & Escuro (Dark/Light Mode):** Interface adaptável com suporte a tema escuro profundo e tema claro.

### 2. 📊 Análise & Gráficos Interativos
- **Produção Científica Anual:** Evolução temporal da produção de periódicos e conferências.
- **Distribuição por Eixos Temáticos:** Gráfico de rosca com detalhamento de cada um dos 6 eixos oficiais.
- **Distribuição por Work Package (WP1–WP4):** Gráfico de barras com legenda explicativa detalhada do escopo de cada WP.
- **Ranking de Universidades:** Artigos produzidos por cada polo da rede.

### 3. 🕸️ Grafo de Colaboração Interinstitucional
- **Rede Interativa em SVG:** Visualização das conexões e coautoria direta entre os 5 polos nacionais (**UFC, ITA, UFRGS, PUCRS, UNIPAMPA**).
- **Detalhamento ao Clicar:** Exibe a quantidade de artigos produzidos em parceria e lista os títulos co-autorados entre duas instituições.

### 4. 💾 Gestão de Citações & Exportação de Relatórios
- **Cópia em 1-Clique:** Copie referências formatadas em **BibTeX**, **IEEE** e **ABNT**.
- **Exportação Massiva:** Baixe relatórios consolidados do acervo filtrado nos formatos **BibTeX (`.bib`)** e **CSV (`.csv`)**.

### 5. 🔄 Sincronização Automática de Dados
- **Botão Sincronizar:** Executa scripts de automação Python (`scripts/sync_publications.py`) para capturar novos artigos diretamente do portal oficial.
- **Pipeline CI/CD:** Integração via GitHub Actions para atualização contínua e automatizada da base de dados.

---

## 🏷️ Taxonomia do INCT Signals

### 🎯 Eixos Temáticos (6 Eixos Oficiais)
1. **Comunicações, Processamento de Sinais e Otimização**
2. **Sensoriamento Remoto e Sistemas de Radar**
3. **Monitoramento Ambiental e Climático**
4. **Vigilância de Sinais, Segurança e Confiabilidade**
5. **Sistemas Autônomos e Inteligentes**
6. **Caracterização Eletromagnética em Comunicações**

### 📦 Work Packages (4 WPs Estruturantes)
- **WP1:** *Sensoriamento Remoto & Vigilância por Satélite* (UFC • PUCRS)
- **WP2:** *Hardware, Antenas & Desenvolvimento RF* (UNIPAMPA • ITA • UFC)
- **WP3:** *Testbeds & Plataformas para Sensoriamento com VANTs* (UFRGS • ITA • UFC)
- **WP4:** *Processamento de Sinais para Sensoriamento & Comunicações* (UFC • ITA)

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Biblioteca UI:** [React 19](https://react.dev/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Gráficos:** [Recharts 3](https://recharts.org/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Linguagem:** [TypeScript 5](https://www.typescriptlang.org/)
- **Scripting & Automação:** Python 3 (BeautifulSoup, BibtexParser)

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js** (v18.0.0 ou superior)
- **npm** ou **yarn** / **pnpm**
- **Python 3.10+** (opcional, para rodar scripts de sincronização)

### 1. Clonar o Repositório
```bash
git clone https://github.com/Loogan23/Dashboard-INCT-Signals.git
cd Dashboard-INCT-Signals
```

### 2. Instalar as Dependências
```bash
npm install
```

### 3. Executar o Servidor de Desenvolvimento
```bash
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### 4. Compilar para Produção (Build)
```bash
npm run build
npm run start
```

### 5. Sincronizar Publicações (Script Python)
```bash
npm run sync
# ou diretamente via python
python scripts/sync_publications.py
```

---

## 📁 Estrutura de Pastas

```text
DashboardINCTsignals/
├── .github/
│   └── workflows/
│       └── sync-publications.yml   # Workflow do GitHub Actions para sincronização
├── public/
│   ├── data/
│   │   └── publications.json       # Base de dados estruturada das publicações
│   └── logo.png                    # Logo oficial do INCT Signals
├── scripts/
│   └── sync_publications.py        # Script Python de scraping e sincronização
├── src/
│   ├── app/
│   │   ├── api/sync/               # Endpoint da API Next.js para acionar sincronização
│   │   ├── layout.tsx              # Layout raiz com fontes e metadados
│   │   └── page.tsx                # Página principal do Dashboard (Single Page App)
│   ├── components/
│   │   ├── AnalyticsPanel.tsx      # Painel de gráficos e visualizações de dados
│   │   ├── CollaborationNetwork.tsx# Grafo de coautoria interinstitucional em SVG
│   │   ├── ExportPanel.tsx         # Painel de exportação de relatórios (CSV/BibTeX)
│   │   ├── FilterSidebar.tsx       # Barra lateral com filtros dinâmicos
│   │   ├── Header.tsx              # Cabeçalho com abas, botão de sync e modo escuro
│   │   ├── KPIBar.tsx              # Indicadores de desempenho e contadores
│   │   └── PublicationCard.tsx     # Card de exibição individual da publicação
│   ├── hooks/
│   │   └── useDashboard.ts         # Hook customizado para gestão de estado e filtros
│   ├── lib/
│   │   └── data.ts                 # Utilitários de manipulação de dados e ordenação
│   └── types/
│       └── index.ts                # Definições de tipos TypeScript do projeto
├── package.json
└── README.md
```

---

## 🤝 Créditos e Realização

Projeto desenvolvido para o **INCT Signals** sob a liderança das universidades integrantes:
- **Universidade Federal do Ceará (UFC)**
- **Instituto Tecnológico de Aeronáutica (ITA)**
- **Universidade Federal do Rio Grande do Sul (UFRGS)**
- **Pontifícia Universidade Católica do Rio Grande do Sul (PUCRS)**
- **Universidade Federal do Pampa (UNIPAMPA)**

Parceria institucional e financiamento: **CNPq • CAPES • FUNCAP**
