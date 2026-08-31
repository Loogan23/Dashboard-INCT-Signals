"use client";

import { Search, RotateCcw, SlidersHorizontal } from "lucide-react";
import { FilterState, THEMATIC_AXES, WORK_PACKAGES, INSTITUTIONS } from "@/types";

interface FilterSidebarProps {
  filters: FilterState;
  allTags: string[];
  onUpdate: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onReset: () => void;
  onToggleTag: (tag: string) => void;
  filteredCount: number;
  theme: "dark" | "light";
}

export function FilterSidebar({
  filters,
  allTags,
  onUpdate,
  onReset,
  onToggleTag,
  filteredCount,
  theme,
}: FilterSidebarProps) {
  const isDark = theme === "dark";

  const selectCls = `w-full text-xs rounded-xl px-3 py-2 border transition-colors focus:outline-none focus:border-[#FB6602] ${
    isDark
      ? "bg-[#08172D] text-slate-200 border-[#1E3A5F]"
      : "bg-white text-slate-900 border-slate-300 font-semibold shadow-sm"
  }`;

  return (
    <aside
      className={`rounded-2xl p-4 border shadow-md transition-all duration-300 ${
        isDark
          ? "bg-[#0F233F] border-[#1E3A5F]"
          : "bg-white border-slate-300 shadow-slate-200/70"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between mb-4 border-b pb-3 ${
          isDark ? "border-[#1E3A5F]" : "border-slate-200"
        }`}
      >
        <h3
          className={`font-bold text-sm flex items-center gap-2 ${
            isDark ? "text-slate-200" : "text-slate-950 font-extrabold"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-[#FB6602]" />
          Filtros de Pesquisa
        </h3>
        <button
          onClick={onReset}
          className="text-xs text-[#FB6602] hover:underline font-bold flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Limpar
        </button>
      </div>

      {/* Contador de Resultados */}
      <div
        className={`mb-4 text-center py-1.5 rounded-lg text-xs font-bold border ${
          isDark
            ? "bg-[#08172D] border-[#1E3A5F]"
            : "bg-slate-100 border-slate-300 text-slate-900"
        }`}
      >
        <span className="text-[#FB6602] font-black text-sm">{filteredCount}</span>
        <span className={isDark ? "text-slate-400" : "text-slate-800"}>
          {" "}
          publicação(ões) encontrada(s)
        </span>
      </div>

      {/* Busca livre */}
      <div className="mb-4">
        <label
          className={`block text-[11px] font-bold mb-1.5 uppercase tracking-wide ${
            isDark ? "text-slate-400" : "text-slate-900"
          }`}
        >
          Busca Livre
        </label>
        <div className="relative">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onUpdate("search", e.target.value)}
            placeholder="Ex: RIS, SAR, VANT, Tensor, Almeida..."
            className={`w-full text-xs rounded-xl pl-9 pr-3 py-2.5 border transition-colors focus:outline-none focus:border-[#FB6602] ${
              isDark
                ? "bg-[#08172D] text-white placeholder-slate-500 border-[#1E3A5F]"
                : "bg-white text-slate-950 font-semibold placeholder-slate-400 border-slate-300 shadow-sm"
            }`}
          />
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* Eixo Temático */}
      <div className="mb-4">
        <label
          className={`block text-[11px] font-bold mb-1.5 uppercase tracking-wide ${
            isDark ? "text-slate-400" : "text-slate-900"
          }`}
        >
          Eixo Temático
        </label>
        <select
          value={filters.axis}
          onChange={(e) => onUpdate("axis", e.target.value)}
          className={selectCls}
        >
          <option value="">Todos os 6 Eixos Temáticos</option>
          {THEMATIC_AXES.map((ax) => (
            <option key={ax} value={ax}>
              {ax.length > 42 ? ax.slice(0, 42) + "…" : ax}
            </option>
          ))}
        </select>
      </div>

      {/* Work Package */}
      <div className="mb-4">
        <label
          className={`block text-[11px] font-bold mb-1.5 uppercase tracking-wide ${
            isDark ? "text-slate-400" : "text-slate-900"
          }`}
        >
          Work Package (WP)
        </label>
        <select
          value={filters.wp}
          onChange={(e) => onUpdate("wp", e.target.value)}
          className={selectCls}
        >
          <option value="">Todos os WPs (WP1–WP4)</option>
          {WORK_PACKAGES.map((wp) => (
            <option key={wp.key} value={wp.key}>
              {wp.label}
            </option>
          ))}
        </select>
      </div>

      {/* Universidade */}
      <div className="mb-4">
        <label
          className={`block text-[11px] font-bold mb-1.5 uppercase tracking-wide ${
            isDark ? "text-slate-400" : "text-slate-900"
          }`}
        >
          Universidade / Instituição
        </label>
        <select
          value={filters.institution}
          onChange={(e) => onUpdate("institution", e.target.value)}
          className={selectCls}
        >
          <option value="">Todas as Instituições</option>
          {INSTITUTIONS.map((inst) => (
            <option key={inst.key} value={inst.key}>
              {inst.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tipo de Veículo */}
      <div className="mb-4">
        <label
          className={`block text-[11px] font-bold mb-1.5 uppercase tracking-wide ${
            isDark ? "text-slate-400" : "text-slate-900"
          }`}
        >
          Tipo de Veículo
        </label>
        <select
          value={filters.type}
          onChange={(e) => onUpdate("type", e.target.value)}
          className={selectCls}
        >
          <option value="">Todos os Tipos</option>
          <option value="Periódico">Periódico Internacional</option>
          <option value="Conferência Internacional">Conferência Internacional</option>
          <option value="Conferência Nacional (SBrT)">Conferência Nacional (SBrT)</option>
        </select>
      </div>

      {/* Ano */}
      <div className="mb-5">
        <label
          className={`block text-[11px] font-bold mb-1.5 uppercase tracking-wide ${
            isDark ? "text-slate-400" : "text-slate-900"
          }`}
        >
          Ano da Publicação
        </label>
        <select
          value={filters.year}
          onChange={(e) => onUpdate("year", e.target.value)}
          className={selectCls}
        >
          <option value="">Todos os Anos</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>
      </div>

      {/* Tags de Tecnologias */}
      <div>
        <label
          className={`block text-[11px] font-bold mb-2 uppercase tracking-wide ${
            isDark ? "text-slate-400" : "text-slate-900"
          }`}
        >
          Tecnologias Core (Tags)
        </label>
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => {
            const isActive = filters.tag === tag;
            return (
              <button
                key={tag}
                onClick={() => onToggleTag(tag)}
                className={`px-2.5 py-1 rounded-lg text-[10px] border transition-all duration-150 ${
                  isActive
                    ? "bg-[#FB6602] text-slate-950 font-extrabold border-[#FB6602]"
                    : isDark
                    ? "bg-[#08172D] text-slate-300 border-[#1E3A5F] hover:border-[#FB6602]/50 font-medium"
                    : "bg-slate-100 text-slate-900 border-slate-300 hover:border-[#FB6602] font-semibold"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
