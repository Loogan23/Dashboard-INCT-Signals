"use client";

import { useState, useCallback } from "react";
import { getPublications } from "@/lib/data";
import { useDashboard } from "@/hooks/useDashboard";
import { Header } from "@/components/Header";
import { KPIBar } from "@/components/KPIBar";
import { FilterSidebar } from "@/components/FilterSidebar";
import { PublicationCard } from "@/components/PublicationCard";
import { AnalyticsPanel } from "@/components/AnalyticsPanel";
import { ExportPanel } from "@/components/ExportPanel";
import { BibtexModal } from "@/components/BibtexModal";
import { ArrowUpDown, BookOpen } from "lucide-react";
import { FilterState } from "@/types";

type Tab = "feed" | "analytics" | "export";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("feed");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [publications, setPublications] = useState(() => getPublications());

  const {
    filters,
    filtered,
    allTags,
    bibtexModal,
    kpis,
    updateFilter,
    resetFilters,
    toggleTag,
    setBibtexModal,
  } = useDashboard(publications);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  // Recarregar dados após sincronização
  const handleSyncComplete = useCallback(async () => {
    try {
      const res = await fetch("/data/publications.json?t=" + Date.now());
      if (res.ok) {
        const data = await res.json();
        setPublications(data);
      }
    } catch (e) {
      console.error("Erro ao recarregar dataset:", e);
    }
  }, []);

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 flex flex-col ${
        isDark ? "bg-[#08172D] text-slate-100" : "bg-slate-100 text-slate-900"
      }`}
    >
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSyncComplete={handleSyncComplete}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <KPIBar
        total={kpis.total}
        journals={kpis.journals}
        intConfs={kpis.intConfs}
        natConfs={kpis.natConfs}
        filtered={kpis.filtered}
        theme={theme}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">

        {/* === ABA: PUBLICAÇÕES (FEED) === */}
        {activeTab === "feed" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Barra Lateral de Filtros */}
            <div className="lg:col-span-1">
              <FilterSidebar
                filters={filters}
                allTags={allTags}
                onUpdate={updateFilter}
                onReset={resetFilters}
                onToggleTag={toggleTag}
                filteredCount={filtered.length}
                theme={theme}
              />
            </div>

            {/* Feed Principal */}
            <section className="lg:col-span-3 space-y-4">
              {/* Barra de Ordenação */}
              <div
                className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs transition-colors duration-300 shadow-sm ${
                  isDark
                    ? "bg-[#0F233F] border-[#1E3A5F] text-slate-300"
                    : "bg-white border-slate-300 text-slate-950 font-bold shadow-slate-200/60"
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-[#FB6602]" />
                  <span>
                    Exibindo{" "}
                    <span className="font-extrabold text-[#FB6602]">{filtered.length}</span>{" "}
                    de <span className="font-extrabold">{publications.length}</span> publicações
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  <label className={isDark ? "text-slate-400" : "text-slate-900 font-bold"}>
                    Ordenar por:
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      updateFilter("sortBy", e.target.value as FilterState["sortBy"])
                    }
                    className={`rounded-lg px-2.5 py-1 border text-xs focus:outline-none transition-colors ${
                      isDark
                        ? "bg-[#08172D] text-slate-200 border-[#1E3A5F]"
                        : "bg-slate-50 text-slate-950 font-semibold border-slate-300"
                    }`}
                  >
                    <option value="year-desc">Ano (mais recente)</option>
                    <option value="year-asc">Ano (mais antigo)</option>
                    <option value="title">Título (A–Z)</option>
                  </select>
                </div>
              </div>

              {/* Lista de Cards */}
              {filtered.length === 0 ? (
                <div
                  className={`text-center py-16 rounded-2xl border transition-colors ${
                    isDark
                      ? "bg-[#0F233F] border-[#1E3A5F]"
                      : "bg-white border-slate-300 shadow-sm text-slate-900"
                  }`}
                >
                  <span className="text-4xl">🔍</span>
                  <h4
                    className={`text-base font-bold mt-4 ${
                      isDark ? "text-slate-300" : "text-slate-900 font-extrabold"
                    }`}
                  >
                    Nenhuma publicação encontrada
                  </h4>
                  <p
                    className={`text-xs mt-1 ${
                      isDark ? "text-slate-500" : "text-slate-600 font-medium"
                    }`}
                  >
                    Tente remover alguns filtros ou buscar por outro termo.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 px-4 py-2 bg-[#FB6602] hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow"
                  >
                    Limpar todos os filtros
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {filtered.map((pub) => (
                    <PublicationCard
                      key={pub.id}
                      pub={pub}
                      onBibtex={setBibtexModal}
                      theme={theme}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* === ABA: ANÁLISE & GRÁFICOS === */}
        {activeTab === "analytics" && (
          <AnalyticsPanel
            data={publications}
            onSelectTag={(tag) => {
              updateFilter("tag", tag);
              setActiveTab("feed");
            }}
            theme={theme}
          />
        )}

        {/* === ABA: RELATÓRIOS & EXPORTAÇÃO === */}
        {activeTab === "export" && (
          <ExportPanel filtered={filtered} theme={theme} />
        )}
      </main>

      <footer
        className={`border-t py-6 mt-12 text-center text-xs transition-colors duration-300 ${
          isDark
            ? "bg-[#061224] border-[#1E3A5F] text-slate-500"
            : "bg-white border-slate-300 text-slate-600 font-medium shadow-sm"
        }`}
      >
        <p className={`font-semibold mb-1 ${isDark ? "text-slate-400" : "text-slate-800"}`}>
          INCT Signals — Instituto Nacional de Ciência e Tecnologia em Processamento de Sinais, Comunicações, Sensoriamento e Vigilância
        </p>
        <p>UFC · ITA · UFRGS · PUCRS · UNIPAMPA &nbsp;|&nbsp; Apoio: CNPq / CAPES / FUNCAP</p>
      </footer>

      <BibtexModal
        pub={bibtexModal}
        onClose={() => setBibtexModal(null)}
        theme={theme}
      />
    </div>
  );
}
