"use client";

import { useState, useEffect } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);

  // Efeito anti-flickering com histerese e requestAnimationFrame:
  // - Ativa o modo compacto apenas ao ultrapassar 75px
  // - Retorna ao modo expandido apenas quando estiver próximo ao topo (< 15px)
  // Isso cria uma zona neutra de 60px que impede qualquer oscilação ou trepidação.
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setIsScrolled((prev) => {
            if (!prev && currentY > 75) return true;
            if (prev && currentY < 15) return false;
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      className={`border-b sticky top-0 z-40 transition-all duration-300 ease-out will-change-transform ${
        isScrolled
          ? "shadow-xl backdrop-blur-xl"
          : "shadow-md backdrop-blur-md"
      } ${
        isDark
          ? isScrolled
            ? "bg-[#0b1d38]/98 border-[#1E3A5F]"
            : "bg-[#0b1d38]/95 border-[#1E3A5F]"
          : isScrolled
          ? "bg-white/98 border-slate-300 shadow-slate-300/40"
          : "bg-white/95 border-slate-200 shadow-slate-200/50"
      }`}
    >
      {/* Linha Principal da Navbar */}
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 transition-all duration-300 ease-out ${
          isScrolled ? "py-2" : "py-3 sm:py-3.5"
        }`}
      >
        {/* Logo Oficial & Título */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
          <div
            className={`relative flex-shrink-0 flex items-center justify-center bg-white shadow-sm border border-slate-200 transition-all duration-300 ease-out ${
              isScrolled
                ? "h-8 sm:h-9 w-8 sm:w-9 p-0.5 rounded-lg"
                : "h-11 sm:h-12 w-11 sm:w-12 p-1 rounded-xl"
            }`}
          >
            <Image
              src="/logo.png"
              alt="Logo do INCT Signals"
              width={48}
              height={48}
              className="h-full w-auto object-contain transition-all duration-300"
              priority
            />
          </div>
          <div className="min-w-0">
            <h1
              className={`font-bold tracking-tight flex items-center gap-2 transition-all duration-300 ease-out ${
                isScrolled ? "text-base sm:text-lg" : "text-lg sm:text-xl"
              } ${isDark ? "text-white" : "text-slate-900"}`}
            >
              <span className="truncate">INCT Signals</span>
              <span
                className={`rounded-full bg-[#FB6602]/20 text-[#FB6602] border border-[#FB6602]/30 font-semibold transition-all duration-300 ease-out flex-shrink-0 ${
                  isScrolled ? "text-[10px] px-1.5 py-0.2" : "text-xs px-2 py-0.5"
                }`}
              >
                Painel
              </span>
            </h1>
            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                isScrolled ? "max-h-0 opacity-0" : "max-h-6 opacity-100"
              }`}
            >
              <p
                className={`text-xs truncate ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Processamento de Sinais, Comunicações, Sensoriamento &amp; Vigilância
              </p>
            </div>
          </div>
        </div>

        {/* Navegação por Abas */}
        <nav
          className={`flex items-center rounded-xl border text-sm transition-all duration-300 ease-out flex-shrink-0 ${
            isScrolled ? "p-0.5" : "p-1"
          } ${
            isDark
              ? "bg-[#08172D] border-[#1E3A5F]"
              : "bg-slate-100 border-slate-200"
          }`}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`rounded-lg font-medium transition-all duration-200 flex items-center ${
                isScrolled
                  ? "px-2.5 sm:px-3 py-1 text-xs"
                  : "px-3.5 sm:px-4 py-1.5 text-sm"
              } ${
                activeTab === tab.id
                  ? "bg-[#2D82B5] text-white shadow"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
            </button>
          ))}
        </nav>

        {/* Ações: Alternador de Tema, Botão Sincronizar & Link */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
          {/* Alternador de Tema */}
          <button
            onClick={onToggleTheme}
            title={isDark ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
            className={`rounded-xl border transition-all duration-300 flex items-center justify-center relative overflow-hidden group ${
              isScrolled ? "p-1.5" : "p-2"
            } ${
              isDark
                ? "bg-[#0F233F] hover:bg-[#1E3A5F] text-amber-400 border-[#1E3A5F]"
                : "bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-300 shadow-sm"
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
            className={`font-semibold rounded-xl border transition-all duration-300 flex items-center gap-1.5 disabled:opacity-50 ${
              isScrolled ? "text-[11px] px-2.5 py-1.5" : "text-xs px-3 py-2"
            } ${
              isDark
                ? "bg-[#0F233F] hover:bg-[#1E3A5F] text-slate-200 border-[#1E3A5F]"
                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm"
            }`}
          >
            {syncedSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 hidden sm:inline">Atualizado!</span>
              </>
            ) : (
              <>
                <RefreshCw
                  className={`w-3.5 h-3.5 text-[#FB6602] ${syncing ? "animate-spin" : ""}`}
                />
                <span className="hidden md:inline">
                  {syncing ? "Sincronizando..." : "Sincronizar"}
                </span>
              </>
            )}
          </button>

          {/* Link Oficial */}
          <a
            href="https://inct-signals.org"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-all duration-300 flex items-center gap-1.5 font-medium rounded-xl border ${
              isScrolled ? "text-[11px] px-2.5 py-1.5" : "text-xs px-3 py-2"
            } ${
              isDark
                ? "bg-[#0F233F] hover:text-[#FB6602] text-slate-300 border-[#1E3A5F]"
                : "bg-white hover:text-[#FB6602] text-slate-700 border-slate-200 shadow-sm"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">inct-signals.org</span>
          </a>
        </div>
      </div>

      {/* Banner institucional & Destaque Premiado SBrT 2025 & 2026 (Retrátil com transição CSS Grid fluida) */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          isScrolled
            ? "grid-rows-[0fr] opacity-0 pointer-events-none"
            : "grid-rows-[1fr] opacity-100"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`border-t py-2 sm:py-2.5 transition-colors duration-300 ${
              isDark
                ? "border-[#1E3A5F]/40 bg-gradient-to-r from-[#08172D] via-[#14233c] to-[#08172D]"
                : "border-slate-200 bg-gradient-to-r from-slate-100 via-amber-50/50 to-slate-100"
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap text-[11px]">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-black uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px]">
                  🏆 Prêmios SBrT 2025 &amp; 2026
                </span>
                <p className={isDark ? "text-slate-200" : "text-slate-800"}>
                  <strong className="text-amber-400 font-bold">Prêmios de Melhor Artigo:</strong>{" "}
                  <span>SBrT 2026 (Metassuperfícies Flexíveis · Salvador/BA)</span> &middot;{" "}
                  <span>SBrT 2025 (Modelagem Circuital de RIS · Natal/RN)</span> &middot;{" "}
                  <span className={isDark ? "text-slate-400" : "text-slate-600"}>
                    LASP / INCT Signals
                  </span>
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
        </div>
      </div>
    </header>
  );
}
