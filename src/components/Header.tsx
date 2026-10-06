"use client";

import { useState } from "react";
import Image from "next/image";
import { Globe, RefreshCw, CheckCircle2, Sun, Moon } from "lucide-react";

type Tab = "feed" | "analytics" | "export";

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onSyncComplete?: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: "analytics", icon: "📊", label: "Análise & Gráficos" },
  { id: "feed", icon: "📄", label: "Publicações" },
  { id: "export", icon: "💾", label: "Relatórios & Exportar" },
];

export function Header({
  activeTab,
  onTabChange,
  onSyncComplete,
  theme,
  onToggleTheme,
}: HeaderProps) {
  const [syncing, setSyncing] = useState(false);
  const [syncedSuccess, setSyncedSuccess] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    setSyncedSuccess(false);
    try {
      const res = await fetch("/api/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSyncedSuccess(true);
        if (onSyncComplete) onSyncComplete();
        setTimeout(() => setSyncedSuccess(false), 3000);
      }
    } catch (e) {
      console.error("Erro ao sincronizar:", e);
    } finally {
      setSyncing(false);
    }
  };

  const isDark = theme === "dark";

  return (
    <header
      className={`border-b sticky top-0 z-40 shadow-lg backdrop-blur-md transition-colors duration-300 ${
        isDark
          ? "bg-[#0b1d38]/95 border-[#1E3A5F]"
          : "bg-white/95 border-slate-200 shadow-slate-200/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo Oficial & Título */}
        <div className="flex items-center space-x-3">
          <div className="relative h-12 w-12 flex-shrink-0 flex items-center justify-center bg-white p-1 rounded-xl shadow-md overflow-hidden border border-slate-200">
            <Image
              src="/logo.png"
              alt="Logo do INCT Signals"
              width={48}
              height={48}
              className="h-full w-auto object-contain"
              priority
            />
          </div>
          <div>
            <h1
              className={`text-xl font-bold tracking-tight flex items-center gap-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              INCT Signals{" "}
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FB6602]/20 text-[#FB6602] border border-[#FB6602]/30 font-semibold">
                Painel do Projeto
              </span>
            </h1>
            <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Processamento de Sinais, Comunicações, Sensoriamento &amp; Vigilância
            </p>
          </div>
        </div>

        {/* Navegação por Abas */}
        <nav
          className={`flex items-center p-1 rounded-xl border text-sm transition-colors ${
            isDark
              ? "bg-[#08172D] border-[#1E3A5F]"
              : "bg-slate-100 border-slate-200"
          }`}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-1.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                activeTab === tab.id
                  ? "bg-[#2D82B5] text-white shadow"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Ações: Alternador de Tema, Botão Sincronizar & Link */}
        <div className="flex items-center space-x-2">
          {/* Alternador de Tema Fluido (Light / Dark) */}
          <button
            onClick={onToggleTheme}
            title={isDark ? "Mudar para Modo Claro (Light Mode)" : "Mudar para Modo Escuro (Dark Mode)"}
            className={`p-2 rounded-xl border transition-all duration-500 flex items-center justify-center relative overflow-hidden group ${
              isDark
                ? "bg-[#0F233F] hover:bg-[#1E3A5F] text-amber-400 border-[#1E3A5F] hover:shadow-[0_0_12px_rgba(251,191,36,0.2)]"
                : "bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-300 shadow-sm hover:shadow-[0_0_12px_rgba(245,158,11,0.25)]"
            }`}
          >
            <div className="relative w-4 h-4 flex items-center justify-center">
              <Sun
                className={`w-4 h-4 absolute transition-all duration-500 transform ${
                  isDark
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 rotate-90 scale-50"
                }`}
              />
              <Moon
                className={`w-4 h-4 absolute transition-all duration-500 transform ${
                  isDark
                    ? "opacity-0 -rotate-90 scale-50"
                    : "opacity-100 rotate-0 scale-100"
                }`}
              />
            </div>
          </button>

          {/* Botão Sincronizar */}
          <button
            onClick={handleSync}
            disabled={syncing}
            title="Sincronizar publicações com o portal do INCT Signals"
            className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all flex items-center gap-1.5 disabled:opacity-50 ${
              isDark
                ? "bg-[#0F233F] hover:bg-[#1E3A5F] text-slate-200 border-[#1E3A5F]"
                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm"
            }`}
          >
            {syncedSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Atualizado!</span>
              </>
            ) : (
              <>
                <RefreshCw className={`w-3.5 h-3.5 text-[#FB6602] ${syncing ? "animate-spin" : ""}`} />
                <span>{syncing ? "Sincronizando..." : "Sincronizar"}</span>
              </>
            )}
          </button>

          {/* Link Oficial */}
          <a
            href="https://inct-signals.org"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border ${
              isDark
                ? "bg-[#0F233F] hover:text-[#FB6602] text-slate-300 border-[#1E3A5F]"
                : "bg-white hover:text-[#FB6602] text-slate-700 border-slate-200 shadow-sm"
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> inct-signals.org
          </a>
        </div>
      </div>

      {/* Banner institucional & Destaque Premiado SBrT 2026 */}
      <div
        className={`border-t transition-colors duration-300 ${
          isDark
            ? "border-[#1E3A5F]/40 bg-gradient-to-r from-[#08172D] via-[#14233c] to-[#08172D]"
            : "border-slate-200 bg-gradient-to-r from-slate-100 via-amber-50/50 to-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap text-[11px]">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-black uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px]">
              🏆 Prêmios SBrT 2025 &amp; 2026
            </span>
            <p className={isDark ? "text-slate-200" : "text-slate-800"}>
              <strong className="text-amber-400 font-bold">Bicampeonato em Melhores Artigos:</strong>{" "}
              <span>SBrT 2026 (Metassuperfícies Flexíveis · Salvador/BA)</span> &middot;{" "}
              <span>SBrT 2025 (Modelagem Circuital de RIS · Natal/RN)</span> &middot;{" "}
              <span className={isDark ? "text-slate-400" : "text-slate-600"}>LASP / INCT Signals</span>
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold">
            {["UFC", "ITA", "UFRGS", "PUCRS", "UNIPAMPA"].map((uni) => (
              <span
                key={uni}
                className={`px-2 py-0.5 rounded border ${
                  isDark
                    ? "bg-blue-900/60 text-blue-200 border-blue-700/50"
                    : "bg-blue-100 text-blue-800 border-blue-200"
                }`}
              >
                {uni}
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
