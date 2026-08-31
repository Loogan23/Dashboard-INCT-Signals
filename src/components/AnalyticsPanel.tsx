"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Publication } from "@/types";
import { getAnalyticsData, COLORS } from "@/lib/data";
import { CollaborationNetwork } from "@/components/CollaborationNetwork";
import { BarChart3, Users, Layers } from "lucide-react";

interface AnalyticsPanelProps {
  data: Publication[];
  theme?: "dark" | "light";
}

type ViewMode = "all" | "charts" | "network";

// Nomes curtos e legíveis para os Eixos Temáticos nos gráficos
const SHORT_AXIS_NAMES: Record<string, string> = {
  "Comunicações, Processamento de Sinais e Otimização": "Comunicações & Sinal",
  "Sensoriamento Remoto e Sistemas de Radar": "Sensoriamento & Radar",
  "Monitoramento Ambiental e Climático": "Monitoramento Ambiental",
  "Vigilância de Sinais, Segurança e Confiabilidade": "Vigilância & Segurança",
  "Sistemas Autônomos e Inteligentes": "Sistemas Autônomos",
  "Caracterização Eletromagnética em Comunicações": "Caracterização Eletromagnética",
};

const UNI_COLORS: Record<string, string> = {
  UFC: "#FB6602",
  ITA: "#2D82B5",
  UFRGS: "#8B5CF6",
  PUCRS: "#EC4899",
  UNIPAMPA: "#06B6D4",
};

const WP_META: Record<string, { label: string; color: string }> = {
  WP1: { label: "Sensoriamento Remoto & Vigilância por Satélite", color: "#8B5CF6" },
  WP2: { label: "Hardware, Antenas & Desenvolvimento RF", color: "#EC4899" },
  WP3: { label: "Testbeds & Plataformas para Sensoriamento com VANTs", color: "#06B6D4" },
  WP4: { label: "Processamento de Sinais para Sensoriamento & Comunicações", color: "#FB6602" },
};

export function AnalyticsPanel({ data, theme = "dark" }: AnalyticsPanelProps) {
  const isDark = theme === "dark";
  const [viewMode, setViewMode] = useState<ViewMode>("all");

  const { years, yearJournals, yearIntConf, yearNatConf, axisMap, wpMap, uniMap } =
    getAnalyticsData(data);

  const yearData = years.map((y, i) => ({
    year: y.toString(),
    Periódicos: yearJournals[i],
    "Conf. Internacional": yearIntConf[i],
    "Conf. Nacional (SBrT)": yearNatConf[i],
  }));

  const axisData = Object.entries(axisMap).map(([fullName, value]) => ({
    name: SHORT_AXIS_NAMES[fullName] || fullName.split(",")[0].trim(),
    fullName,
    value,
  }));

  const wpData = Object.entries(wpMap).map(([name, value]) => ({
    name,
    fullName: WP_META[name]?.label || name,
    value,
  }));

  const uniData = Object.entries(uniMap)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  const chartDefaults = {
    style: { fontSize: 11, fill: isDark ? "#94a3b8" : "#475569" },
    tick: { fill: isDark ? "#94a3b8" : "#475569" },
  };

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: isDark ? "#0F233F" : "#ffffff",
      borderColor: isDark ? "#1E3A5F" : "#cbd5e1",
      borderRadius: 8,
      fontSize: 12,
      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
    },
    itemStyle: { color: isDark ? "#ffffff" : "#0f172a" },
    labelStyle: { color: isDark ? "#ffffff" : "#0f172a", fontWeight: "bold" },
  };

  const cardCls = `p-5 rounded-2xl border shadow-md transition-all duration-300 ${
    isDark
      ? "bg-[#0F233F] border-[#1E3A5F]"
      : "bg-white border-slate-200 shadow-slate-200/50"
  }`;

  const titleCls = `text-sm font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`;

  return (
    <div className="space-y-8">
      {/* Barra de Filtros de Visualização */}
      <div
        className={`p-2 rounded-2xl border flex flex-wrap items-center justify-between gap-3 shadow-md ${
          isDark
            ? "bg-[#0F233F]/90 border-[#1E3A5F]"
            : "bg-white border-slate-200 shadow-slate-200/50"
        }`}
      >
        <div className="flex items-center gap-2 px-2">
          <Layers className="w-4 h-4 text-[#FB6602]" />
          <span
            className={`text-xs font-bold ${
              isDark ? "text-slate-200" : "text-slate-800"
            }`}
          >
            Modo de Visualização:
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: "all", label: "Visão Completa", icon: Layers },
            { id: "charts", label: "Gráficos de Distribuição", icon: BarChart3 },
            { id: "network", label: "Grafo de Colaboração", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = viewMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as ViewMode)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#FB6602] text-slate-950 shadow-[0_0_12px_rgba(251,102,2,0.3)]"
                    : isDark
                    ? "text-slate-300 hover:bg-[#1E3A5F]/60"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. SEÇÃO DE GRÁFICOS DE DISTRIBUIÇÃO */}
      {(viewMode === "all" || viewMode === "charts") && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Produção Anual */}
            <div className={cardCls}>
              <h3 className={titleCls}>📊 Produção Científica Anual</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={yearData} margin={{ top: 4, right: 4, left: -16, bottom: 4 }}>
                  <XAxis dataKey="year" tick={chartDefaults.tick} />
                  <YAxis tick={chartDefaults.tick} allowDecimals={false} />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={(value: unknown, name: unknown) => [
                      `${String(value)} publicação(ões)`,
                      String(name),
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: isDark ? "#94a3b8" : "#475569" }} />
                  <Bar dataKey="Periódicos" fill="#FB6602" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Conf. Internacional" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Conf. Nacional (SBrT)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Eixos Temáticos */}
            <div className={cardCls}>
              <h3 className={titleCls}>🎯 Publicações por Eixo Temático</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={axisData}
                    cx="50%"
                    cy="45%"
                    outerRadius={75}
                    innerRadius={30}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {axisData.map((_, i) => (
                      <Cell key={i} fill={COLORS.axisColors[i % COLORS.axisColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    {...tooltipStyle}
                    formatter={(value: unknown, name: unknown, item: { payload?: { fullName?: string } }) => [
                      `${String(value)} publicação(ões)`,
                      item?.payload?.fullName || String(name),
                    ]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={60}
                    wrapperStyle={{ fontSize: 10, color: isDark ? "#cbd5e1" : "#334155" }}
                    formatter={(value: string) => (
                      <span className={isDark ? "text-slate-300 mr-2" : "text-slate-700 mr-2"}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Work Packages */}
            <div className={cardCls}>
              <h3 className={titleCls}>📦 Distribuição por Work Package (WP1–WP4)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={wpData} margin={{ top: 4, right: 4, left: -16, bottom: 4 }}>
                  <XAxis dataKey="name" tick={chartDefaults.tick} />
                  <YAxis tick={chartDefaults.tick} allowDecimals={false} />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={(value: unknown, _name: unknown, item: { payload?: { fullName?: string } }) => [
                      `${String(value)} publicação(ões)`,
                      item?.payload?.fullName || "Total",
                    ]}
                  />
                  <Bar dataKey="value" name="Publicações" radius={[4, 4, 0, 0]}>
                    {wpData.map((entry, i) => (
                      <Cell key={i} fill={WP_META[entry.name]?.color || ["#8B5CF6", "#EC4899", "#06B6D4", "#FB6602"][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Legenda detalhada explicando cada WP */}
              <div className={`mt-3 pt-3 border-t grid grid-cols-1 gap-1.5 text-[11px] ${isDark ? "border-[#1E3A5F]" : "border-slate-200"}`}>
                {Object.entries(WP_META).map(([key, meta]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: meta.color }}
                    />
                    <span className={isDark ? "text-slate-300" : "text-slate-700"}>
                      <strong className={isDark ? "text-slate-100 font-bold" : "text-slate-900 font-bold"}>{key}:</strong> {meta.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Universidades */}
            <div className={cardCls}>
              <h3 className={titleCls}>🏛️ Artigos por Universidade Parceira</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={uniData} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
                  <XAxis type="number" tick={chartDefaults.tick} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={chartDefaults.tick} width={85} />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={(value: unknown) => [`${String(value)} publicação(ões)`, "Total"]}
                  />
                  <Bar dataKey="value" name="Publicações" radius={[0, 4, 4, 0]}>
                    {uniData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={
                          UNI_COLORS[entry.name] ||
                          COLORS.axisColors[i % COLORS.axisColors.length]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 2. SEÇÃO: GRAFO DE COLABORAÇÃO INSTITUCIONAL */}
      {(viewMode === "all" || viewMode === "network") && (
        <CollaborationNetwork data={data} theme={theme} />
      )}
    </div>
  );
}
