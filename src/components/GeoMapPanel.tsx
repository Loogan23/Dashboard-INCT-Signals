"use client";

import { useState, useMemo } from "react";
import { Publication, GeoLocationNode } from "@/types";
import { getGeoMapData } from "@/lib/data";
import { MapPin, Globe, Compass, Building2 } from "lucide-react";

interface GeoMapPanelProps {
  data: Publication[];
  theme?: "dark" | "light";
}

export function GeoMapPanel({ data, theme = "dark" }: GeoMapPanelProps) {
  const isDark = theme === "dark";
  const geoNodes = useMemo(() => getGeoMapData(data), [data]);
  const [selectedGeo, setSelectedGeo] = useState<GeoLocationNode | null>(null);

  const cardCls = `p-6 rounded-2xl border shadow-lg transition-all duration-300 ${
    isDark
      ? "bg-[#0F233F] border-[#1E3A5F]"
      : "bg-white border-slate-200 shadow-slate-200/60"
  }`;

  // Coordenação central (UFC)
  const ufcNode = geoNodes.find((n) => n.id === "UFC") || geoNodes[0];

  return (
    <div className={cardCls}>
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
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
            Distribuição geográfica dos laboratórios parceiros e conexões de pesquisa internacionais (Brasil, Alemanha, China, Rússia)
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Mapa Gráfico em SVG Responsivo (2 Colunas) */}
        <div className="lg:col-span-2 relative flex items-center justify-center p-3 rounded-xl bg-slate-950/60 border border-slate-800/90 overflow-hidden min-h-[360px]">
          <svg viewBox="0 0 800 450" className="w-full h-auto select-none">
            {/* Fundo de Mapa Estilizado com Grade Tecnológica */}
            <defs>
              <pattern
                id="geo-grid"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 30 0 L 0 0 0 30"
                  fill="none"
                  stroke={isDark ? "rgba(30, 58, 95, 0.25)" : "rgba(203, 213, 225, 0.5)"}
                  strokeWidth="0.8"
                />
              </pattern>
              <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FB6602" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            <rect width="800" height="450" fill="url(#geo-grid)" rx="8" />

            {/* Contornos Simbólicos de Continentes / América do Sul / Europa / Ásia */}
            <g fill={isDark ? "#08172D" : "#E2E8F0"} opacity="0.6">
              {/* América do Sul simplificada */}
              <path d="M 280,120 Q 340,110 370,160 Q 320,280 230,410 Q 180,350 160,260 Q 200,180 280,120 Z" />
              {/* Europa & Ásia simplificada */}
              <path d="M 600,30 Q 750,20 780,150 Q 700,200 580,160 Q 550,80 600,30 Z" />
            </g>

            {/* Arcos / Linhas de Conexão com o Polo Central (UFC) */}
            {geoNodes.map((node) => {
              if (node.id === "UFC") return null;

              const isSelected = selectedGeo?.id === node.id;

              // Coordenadas calculadas
              const x1 = (ufcNode.x / 100) * 800;
              const y1 = (ufcNode.y / 100) * 450;
              const x2 = (node.x / 100) * 800;
              const y2 = (node.y / 100) * 450;

              // Curvatura das rotas
              const cx = (x1 + x2) / 2;
              const cy = (y1 + y2) / 2 - 30;

              return (
                <path
                  key={`line-${node.id}`}
                  d={`M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`}
                  fill="none"
                  stroke={isSelected ? "#FB6602" : "url(#arc-gradient)"}
                  strokeWidth={isSelected ? 3 : 1.5}
                  strokeDasharray={node.type === "international" ? "4 3" : undefined}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Marcadores de Polos (Pins) */}
            {geoNodes.map((node) => {
              const isSelected = selectedGeo?.id === node.id;
              const cx = (node.x / 100) * 800;
              const cy = (node.y / 100) * 450;
              const radius = node.id === "UFC" ? 14 : node.type === "core" ? 11 : 9;

              return (
                <g
                  key={node.id}
                  transform={`translate(${cx}, ${cy})`}
                  className="cursor-pointer group"
                  onClick={() => setSelectedGeo(isSelected ? null : node)}
                >
                  {/* Efeito Pulsante para o Polo de Coordenação (UFC) */}
                  {node.id === "UFC" && (
                    <circle
                      r="22"
                      fill="#FB6602"
                      fillOpacity="0.2"
                      className="animate-ping"
                    />
                  )}

                  {/* Círculo Interno */}
                  <circle
                    r={radius}
                    fill={node.color}
                    stroke={isSelected ? "#FFFFFF" : "#0F233F"}
                    strokeWidth={isSelected ? 3 : 1.5}
                    className="transition-transform duration-300 group-hover:scale-125"
                  />

                  {/* Nome/Sigla */}
                  <text
                    y={radius + 14}
                    fill={isSelected ? "#FB6602" : isDark ? "#E2E8F0" : "#0F172A"}
                    fontSize="11"
                    fontWeight="800"
                    textAnchor="middle"
                    className="pointer-events-none drop-shadow"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detalhes do Polo Geográfico Selecionado */}
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
                    ? "Sede da Coordenação Geral do INCT Signals e do Laboratório de Processamento de Sinais (LASP). Liderança em decomposições tensoriais e ISAC."
                    : selectedGeo.id === "ITA"
                    ? "Vice-coordenação geral do projeto. Excelência em antenas, RF e sensoriamento por radar embarcado."
                    : selectedGeo.id === "UFRGS" || selectedGeo.id === "PUCRS"
                    ? "Desenvolvimento de sistemas autônomos, frotas de VANTs (UAVs) e payload de satélites (WP1 & WP3)."
                    : selectedGeo.id === "UNIPAMPA"
                    ? "Laboratório de Antenas e RF (WP2), com desenvolvimento de protótipos de refletarrays e superfícies RIS."
                    : "Colaboração internacional estratégica em sensoriamento remoto, redes de comunicações avançadas e intercâmbio científico."}
                </p>
              </div>
            </div>
          ) : (
            <div
              className={`p-6 rounded-xl border text-center flex flex-col items-center justify-center min-h-[320px] ${
                isDark
                  ? "bg-[#08172D]/60 border-[#1E3A5F] text-slate-400"
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              <Compass className="w-8 h-8 text-[#FB6602] mb-2 opacity-80" />
              <h4 className="text-sm font-bold text-slate-200">
                Polos de Pesquisa
              </h4>
              <p className="text-xs mt-1 max-w-xs leading-relaxed">
                Clique nos marcadores do mapa para visualizar detalhes da atuação das universidades e parceiros internacionais do INCT Signals.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
