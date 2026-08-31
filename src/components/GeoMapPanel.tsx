"use client";

import { useState, useMemo } from "react";
import { Publication, GeoLocationNode } from "@/types";
import { getGeoMapData } from "@/lib/data";
import { MapPin, Globe, Compass, Building2 } from "lucide-react";

interface GeoMapPanelProps {
  data: Publication[];
  theme?: "dark" | "light";
}

// Projeção Cartográfica Exata para o Brasil em Canvas SVG (500x500)
// Longitude: -73°W a -34°W | Latitudes +5°N a -34°S
const BRAZIL_NODES: (GeoLocationNode & { svgX: number; svgY: number })[] = [
  {
    id: "UFC",
    name: "UFC",
    fullName: "Universidade Federal do Ceará (Coordenação Geral)",
    city: "Fortaleza",
    stateCountry: "Ceará, Brasil",
    lat: -3.74,
    lng: -38.52,
    x: 75,
    y: 22,
    svgX: 442, // Fortaleza (CE) - Nordeste
    svgY: 112,
    type: "core",
    count: 0,
    color: "#FB6602",
  },
  {
    id: "ITA",
    name: "ITA",
    fullName: "Instituto Tecnológico de Aeronáutica (Vice-Coordenação)",
    city: "São José dos Campos",
    stateCountry: "São Paulo, Brasil",
    lat: -23.22,
    lng: -45.90,
    x: 62,
    y: 65,
    svgX: 347, // São José dos Campos (SP) - Sudeste
    svgY: 361,
    type: "core",
    count: 0,
    color: "#2D82B5",
  },
  {
    id: "UFRGS",
    name: "UFRGS",
    fullName: "Univ. Federal do Rio Grande do Sul",
    city: "Porto Alegre",
    stateCountry: "Rio Grande do Sul, Brasil",
    lat: -30.03,
    lng: -51.22,
    x: 48,
    y: 84,
    svgX: 275, // Porto Alegre (RS) - Sul
    svgY: 445,
    type: "core",
    count: 0,
    color: "#8B5CF6",
  },
  {
    id: "PUCRS",
    name: "PUCRS",
    fullName: "Pontifícia Univ. Católica do RS",
    city: "Porto Alegre",
    stateCountry: "Rio Grande do Sul, Brasil",
    lat: -30.06,
    lng: -51.17,
    x: 52,
    y: 86,
    svgX: 310, // Porto Alegre (RS) - Adjacente a UFRGS para clareza
    svgY: 442,
    type: "core",
    count: 0,
    color: "#EC4899",
  },
  {
    id: "UNIPAMPA",
    name: "UNIPAMPA",
    fullName: "Univ. Federal do Pampa (Lab. de Antenas)",
    city: "Alegrete",
    stateCountry: "Rio Grande do Sul, Brasil",
    lat: -29.78,
    lng: -55.79,
    x: 35,
    y: 82,
    svgX: 215, // Alegrete (Oeste do RS)
    svgY: 440,
    type: "core",
    count: 0,
    color: "#06B6D4",
  },
];

const INT_NODES: GeoLocationNode[] = [
  {
    id: "DLR",
    name: "DLR",
    fullName: "Centro Aeroespacial Alemão (DLR)",
    city: "Oberpfaffenhofen",
    stateCountry: "Alemanha 🇩🇪",
    lat: 48.08,
    lng: 11.28,
    x: 0,
    y: 0,
    type: "international",
    count: 6,
    color: "#10B981",
  },
  {
    id: "UESTC",
    name: "UESTC",
    fullName: "Univ. de Ciência e Tec. Eletrônica da China",
    city: "Chengdu",
    stateCountry: "China 🇨🇳",
    lat: 30.65,
    lng: 104.06,
    x: 0,
    y: 0,
    type: "international",
    count: 4,
    color: "#F59E0B",
  },
  {
    id: "Skoltech",
    name: "Skoltech",
    fullName: "Instituto Skolkovo de Ciência e Tecnologia",
    city: "Moscou",
    stateCountry: "Rússia 🇷🇺",
    lat: 55.75,
    lng: 37.61,
    x: 0,
    y: 0,
    type: "international",
    count: 3,
    color: "#6366F1",
  },
];

export function GeoMapPanel({ data, theme = "dark" }: GeoMapPanelProps) {
  const isDark = theme === "dark";
  const rawNodes = useMemo(() => getGeoMapData(data), [data]);

  // Atualiza a contagem real de publicações
  const nodes = useMemo(() => {
    return BRAZIL_NODES.map((n) => {
      const found = rawNodes.find((rn) => rn.id === n.id);
      return { ...n, count: found ? found.count : 0 };
    });
  }, [rawNodes]);

  const [selectedGeo, setSelectedGeo] = useState<GeoLocationNode | null>(null);

  const ufcNode = nodes.find((n) => n.id === "UFC") || nodes[0];

  const cardCls = `p-6 rounded-2xl border shadow-lg transition-all duration-300 ${
    isDark
      ? "bg-[#0F233F] border-[#1E3A5F]"
      : "bg-white border-slate-200 shadow-slate-200/60"
  }`;

  return (
    <div className={cardCls}>
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div>
          <h3
            className={`text-base font-bold flex items-center gap-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            <Globe className="w-5 h-5 text-[#FB6602]" />
            Mapa Geográfico &amp; Polos da Rede INCT Signals
          </h3>
          <p
            className={`text-xs mt-0.5 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Localização geográfica exata das universidades parceiras no Brasil e cooperação internacional
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FB6602]"></span> Polos Nacionais
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Conexões Internacionais
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Mapa Gráfico do Brasil com Projeção Cartográfica Exata (2 Colunas) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative flex items-center justify-center p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 overflow-hidden min-h-[420px]">
            <svg viewBox="0 0 520 480" className="w-full h-auto max-h-[440px] select-none">
              <defs>
                <pattern
                  id="grid-pattern"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke={isDark ? "rgba(30, 58, 95, 0.3)" : "rgba(203, 213, 225, 0.6)"}
                    strokeWidth="0.6"
                  />
                </pattern>
                <linearGradient id="route-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FB6602" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Fundo de Grade Cartográfica */}
              <rect width="520" height="480" fill="url(#grid-pattern)" rx="8" />

              {/* Vetor Fidedigno do Silhueta Geográfica do Brasil */}
              <path
                d="M 230,30 
                   Q 310,40 370,80 
                   Q 445,100 455,130 
                   Q 465,160 440,200 
                   Q 415,250 375,320 
                   Q 350,375 300,430 
                   Q 260,468 215,455 
                   Q 185,440 210,410 
                   Q 220,380 180,330 
                   Q 120,290 60,260 
                   Q 75,210 110,160 
                   Q 150,110 230,30 Z"
                fill={isDark ? "#091D38" : "#E2E8F0"}
                stroke={isDark ? "#1E3A5F" : "#CBD5E1"}
                strokeWidth="1.5"
                strokeDasharray="4 2"
                opacity="0.8"
              />

              {/* Linhas de Fluxo de Pesquisa / Conexões entre UFC e Polos */}
              {nodes.map((node) => {
                if (node.id === "UFC") return null;

                const isSelected = selectedGeo?.id === node.id;

                // Curvatura suave de rota
                const cx = (ufcNode.svgX + node.svgX) / 2 - 25;
                const cy = (ufcNode.svgY + node.svgY) / 2;

                return (
                  <path
                    key={`route-${node.id}`}
                    d={`M ${ufcNode.svgX},${ufcNode.svgY} Q ${cx},${cy} ${node.svgX},${node.svgY}`}
                    fill="none"
                    stroke={isSelected ? "#FB6602" : "url(#route-grad)"}
                    strokeWidth={isSelected ? 3.5 : 2}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Marcadores de Polos Nacionais */}
              {nodes.map((node) => {
                const isSelected = selectedGeo?.id === node.id;
                const isUFC = node.id === "UFC";
                const radius = isUFC ? 15 : 11;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.svgX}, ${node.svgY})`}
                    className="cursor-pointer group"
                    onClick={() => setSelectedGeo(isSelected ? null : node)}
                  >
                    {/* Anel Pulsante para a Sede da Coordenação (UFC) */}
                    {isUFC && (
                      <circle
                        r="24"
                        fill="#FB6602"
                        fillOpacity="0.25"
                        className="animate-ping"
                      />
                    )}

                    {/* Halo de Seleção */}
                    {isSelected && (
                      <circle
                        r={radius + 6}
                        fill="none"
                        stroke="#FB6602"
                        strokeWidth="2"
                        strokeDasharray="3 2"
                      />
                    )}

                    {/* Círculo Principal do Marcador */}
                    <circle
                      r={radius}
                      fill={node.color}
                      stroke="#0F233F"
                      strokeWidth="2"
                      className="transition-transform duration-300 group-hover:scale-125"
                    />

                    {/* Sigla no Marcador */}
                    <text
                      y={4}
                      fill="#FFFFFF"
                      fontSize={isUFC ? "10" : "8.5"}
                      fontWeight="800"
                      textAnchor="middle"
                      className="pointer-events-none drop-shadow"
                    >
                      {node.name}
                    </text>

                    {/* Rótulo da Cidade */}
                    <text
                      y={radius + 14}
                      fill={isSelected ? "#FB6602" : isDark ? "#F1F5F9" : "#0F172A"}
                      fontSize="10"
                      fontWeight="700"
                      textAnchor="middle"
                      className="pointer-events-none drop-shadow-md"
                    >
                      {node.city} ({node.name})
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Seção de Conexões Internacionais */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-400" />
              Parcerias &amp; Cooperação Científica Internacional
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {INT_NODES.map((intNode) => {
                const isSelected = selectedGeo?.id === intNode.id;
                return (
                  <div
                    key={intNode.id}
                    onClick={() => setSelectedGeo(isSelected ? null : intNode)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-emerald-500/20 border-emerald-500/50 text-white"
                        : "bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400">
                        {intNode.stateCountry}
                      </span>
                      <h5 className="text-xs font-bold text-white">{intNode.name}</h5>
                      <p className="text-[10px] text-slate-400">{intNode.city}</p>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {intNode.count} pubs
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detalhes do Polo Geográfico Selecionado (1 Coluna) */}
        <div className="lg:col-span-1 space-y-4">
          {selectedGeo ? (
            <div
              className={`p-4 rounded-xl border transition-all ${
                isDark
                  ? "bg-[#08172D] border-[#1E3A5F] text-slate-200"
                  : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 mb-3 border-slate-700/50">
                <div>
                  <span
                    className="px-2.5 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider"
                    style={{ backgroundColor: selectedGeo.color }}
                  >
                    {selectedGeo.type === "core" ? "Polo Nacional" : "Parceiro Internacional"}
                  </span>
                  <h4 className="text-sm font-bold mt-1">{selectedGeo.fullName}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#FB6602]" />
                    {selectedGeo.city}, {selectedGeo.stateCountry}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Volume de Publicações:</span>
                  <span className="font-extrabold text-[#FB6602]">
                    {selectedGeo.count} artigo(s)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Coordenadas Globais:</span>
                  <span className="font-mono text-[11px] text-cyan-400">
                    {selectedGeo.lat}°, {selectedGeo.lng}°
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/50">
                <h5 className="text-xs font-bold mb-1.5 text-slate-300 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#FB6602]" /> Atuação &amp; Papel na Rede:
                </h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {selectedGeo.id === "UFC"
                    ? "Sede da Coordenação Geral do INCT Signals e do Laboratório de Processamento de Sinais (LASP). Liderança em decomposições tensoriais, otimização de sistemas de comunicação e ISAC."
                    : selectedGeo.id === "ITA"
                    ? "Vice-coordenação geral do projeto. Excelência em antenas, sistemas RF, de-noising e sensoriamento por radar embarcado."
                    : selectedGeo.id === "UFRGS" || selectedGeo.id === "PUCRS"
                    ? "Desenvolvimento de sistemas autônomos, frotas de VANTs (UAVs), roteamento inteligente e payload tolerante a falhas para satélites (WP1 & WP3)."
                    : selectedGeo.id === "UNIPAMPA"
                    ? "Laboratório de Antenas e RF (WP2), com desenvolvimento de protótipos de refletarrays e superfícies reconfiguráveis (RIS)."
                    : "Colaboração internacional estratégica em sensoriamento remoto, radar e processamento estatístico de sinais."}
                </p>
              </div>
            </div>
          ) : (
            <div
              className={`p-6 rounded-xl border text-center flex flex-col items-center justify-center min-h-[360px] ${
                isDark
                  ? "bg-[#08172D]/60 border-[#1E3A5F] text-slate-400"
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              <Compass className="w-8 h-8 text-[#FB6602] mb-2 opacity-80" />
              <h4 className="text-sm font-bold text-slate-200">
                Polos Geográficos do INCT
              </h4>
              <p className="text-xs mt-1 max-w-xs leading-relaxed">
                Clique nos pontos do mapa do Brasil ou nos quadros internacionais para exibir informações detalhadas da atuação de cada universidade parceira.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
