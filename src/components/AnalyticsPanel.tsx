"use client";

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

interface AnalyticsPanelProps {
  data: Publication[];
  theme?: "dark" | "light";
}

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

export function AnalyticsPanel({ data, theme = "dark" }: AnalyticsPanelProps) {
  const isDark = theme === "dark";
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

  const wpData = Object.entries(wpMap).map(([name, value]) => ({ name, value }));

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
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={wpData} margin={{ top: 4, right: 4, left: -16, bottom: 4 }}>
              <XAxis dataKey="name" tick={chartDefaults.tick} />
              <YAxis tick={chartDefaults.tick} allowDecimals={false} />
              <Tooltip
                {...tooltipStyle}
                formatter={(value: unknown) => [`${String(value)} publicação(ões)`, "Total"]}
              />
              <Bar dataKey="value" name="Publicações" radius={[4, 4, 0, 0]}>
                {wpData.map((_, i) => (
                  <Cell key={i} fill={["#8B5CF6", "#EC4899", "#06B6D4", "#FB6602"][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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
  );
}
