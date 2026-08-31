"use client";

import { Globe, BookOpen, Newspaper, Users, Layers, Boxes } from "lucide-react";

interface KPIBarProps {
  total: number;
  journals: number;
  intConfs: number;
  natConfs: number;
  filtered: number;
  theme: "dark" | "light";
}

export function KPIBar({ total, journals, intConfs, natConfs, theme }: KPIBarProps) {
  const isDark = theme === "dark";

  const cards = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Total de Artigos",
      value: total,
      color: "text-blue-500",
      bg: isDark ? "bg-blue-500/10" : "bg-blue-50",
    },
    {
      icon: <Newspaper className="w-5 h-5" />,
      label: "Periódicos",
      value: journals,
      color: "text-emerald-500",
      bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: "Conf. Internacionais",
      value: intConfs,
      color: "text-purple-500",
      bg: isDark ? "bg-purple-500/10" : "bg-purple-50",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Conf. Nacionais (SBrT)",
      value: natConfs,
      color: "text-amber-500",
      bg: isDark ? "bg-amber-500/10" : "bg-amber-50",
    },
    {
      icon: <Layers className="w-5 h-5" />,
      label: "Eixos Temáticos",
      value: "6 Eixos",
      color: "text-orange-500",
      bg: isDark ? "bg-orange-500/10" : "bg-orange-50",
    },
    {
      icon: <Boxes className="w-5 h-5" />,
      label: "Work Packages",
      value: "4 WPs",
      color: "text-rose-500",
      bg: isDark ? "bg-rose-500/10" : "bg-rose-50",
    },
  ];

  return (
    <section
      className={`border-b py-4 transition-colors duration-300 ${
        isDark
          ? "bg-[#0b1e36]/70 border-[#1E3A5F]/60"
          : "bg-slate-100/70 border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`p-3.5 rounded-xl border shadow-sm flex items-center space-x-3 transition-all duration-300 ${
              isDark
                ? "bg-[#0F233F] border-[#1E3A5F]/80"
                : "bg-white border-slate-200 shadow-slate-200/50"
            }`}
          >
            <div className={`p-2.5 ${c.bg} rounded-lg ${c.color} flex-shrink-0`}>
              {c.icon}
            </div>
            <div className="min-w-0">
              <div
                className={`text-[11px] font-medium truncate ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {c.label}
              </div>
              <div
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {c.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
