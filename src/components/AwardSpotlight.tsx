"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Trophy,
  ExternalLink,
  Quote,
  Sparkles,
  BookOpen,
  Check,
  Award,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { Publication } from "@/types";

interface AwardSpotlightProps {
  publications?: Publication[];
  pub?: Publication;
  onBibtex?: (pub: Publication) => void;
  onNavigateToFeed?: (filter?: string) => void;
  theme?: "dark" | "light";
}

interface AwardSlide {
  year: number;
  edition: string;
  badge: string;
  category: string;
  subBadge: string;
  location: string;
  title: string;
  authorsDetailed: { name: string; role: string; highlight?: boolean }[];
  venue: string;
  description: string;
  tags: { label: string; color: string }[];
  newsUrl: string;
  bibtex: string;
  pubId: string;
}

const SLIDES_DATA: AwardSlide[] = [
  {
    year: 2026,
    edition: "XLIV SBrT 2026",
    badge: "Prêmio de Melhor Artigo · SBrT 2026",
    category: "Telecomunicações",
    subBadge: "Iniciação Científica (Graduação)",
    location: "Salvador / BA · Outubro 2026",
    title:
      "Channel Estimation for Flexible Intelligent Metasurface Aided MIMO Communications",
    authorsDetailed: [
      {
        name: "Vinícius Lopes Romano",
        role: "1º Autor · Graduação Eng. Telecom / Bolsista IC INCT-Signals (UFC)",
        highlight: true,
      },
      {
        name: "Prof. Dr. André L. F. de Almeida",
        role: "Orientador · Coordenador LASP & INCT-Signals (UFC)",
      },
      {
        name: "Prof. Dr. Daniel C. Araújo",
        role: "Coautor · Universidade de Brasília (UnB / LASP)",
      },
    ],
    venue:
      "Anais do XLIV Simpósio Brasileiro de Telecomunicações e Processamento de Sinais (SBrT 2026), Salvador, BA, 2026.",
    description:
      "A pesquisa investiga técnicas inovadoras de estimação de canal em sistemas MIMO assistidos por Flexible Intelligent Metasurfaces (FIMs), tecnologia emergente essencial para as comunicações sem fio de 6ª Geração (6G). O trabalho integra formulações tensoriais e superfícies programáveis flexíveis, reforçando a formação científica de excelência na graduação da UFC e a cooperação com a UnB.",
    tags: [
      { label: "Comunicações & Sinais", color: "blue" },
      { label: "WP2 & WP4", color: "orange" },
      { label: "RIS / Metassuperfícies", color: "emerald" },
      { label: "UFC & UnB", color: "cyan" },
    ],
    newsUrl:
      "https://inct-signals.org/lasp-e-inct-signals-celebram-premio-de-melhor-artigo-no-sbrt-2026",
    bibtex: `@inproceedings{romano2026channel,
  author = {V. L. Romano, A. L. F. de Almeida, D. C. Araújo},
  title = {Channel Estimation for Flexible Intelligent Metasurface Aided MIMO Communications},
  booktitle = {Anais do XLIV Simpósio Brasileiro de Telecomunicações e Processamento de Sinais (SBrT 2026), Salvador, BA},
  year = {2026}
}`,
    pubId: "pub-001",
  },
  {
    year: 2025,
    edition: "XLIII SBrT 2025",
    badge: "Prêmio de Melhor Artigo · SBrT 2025",
    category: "Comunicações",
    subBadge: "Pós-Graduação & Pesquisa Avançada",
    location: "Natal / RN · 2025",
    title:
      "Circuit-Based Modeling Approach for Channel Estimation in RIS-Assisted Communications",
    authorsDetailed: [
      {
        name: "Daniel C. Alcântara",
        role: "Pesquisador LASP / Bolsista INCT-Signals (UFC)",
        highlight: true,
      },
      {
        name: "Daniel V. C. de Oliveira",
        role: "Pesquisador LASP (UFC)",
      },
      {
        name: "Dr. Gilderlan T. de Araújo",
        role: "Pós-Doutorando LASP (UFC)",
      },
      {
        name: "Prof. Paulo R. B. Gomes",
        role: "Pesquisador Colaborador LASP",
      },
      {
        name: "Prof. Dr. André L. F. de Almeida",
        role: "Orientador · Coordenador LASP & INCT-Signals (UFC)",
      },
    ],
    venue:
      "Anais do XLIII Simpósio Brasileiro de Telecomunicações e Processamento de Sinais (SBrT 2025), Natal, RN, 2025.",
    description:
      "O trabalho propõe uma modelagem eletromagnética baseada em teoria de circuitos com matrizes de impedância mútua para estimação de canais assistida por Reconfigurable Intelligent Surfaces (RIS). A abordagem modela de maneira realista os efeitos de acoplamento mútuo entre elementos refletores e perdas ôhmicas, viabilizando algoritmos de estimação de alta precisão em cenários práticos.",
    tags: [
      { label: "Comunicações & Sinais", color: "blue" },
      { label: "WP2 & WP4", color: "orange" },
      { label: "RIS / Metassuperfícies", color: "emerald" },
      { label: "UFC (LASP)", color: "cyan" },
    ],
    newsUrl: "https://inct-signals.org/participacao-do-lasp-e-do-inct-signals-no-sbrt-2025",
    bibtex: `@inproceedings{alcantara2025circuitbased,
  author = {D. C. Alcântara, D. V. C. de Oliveira, G. T. de Araújo, P. R. B. Gomes, A. L. F. de Almeida},
  title = {Circuit-Based Modeling Approach for Channel Estimation in RIS-Assisted Communications},
  booktitle = {Anais do XLIII Simpósio Brasileiro de Telecomunicações e Processamento de Sinais (SBrT 2025), Natal, RN},
  year = {2025}
}`,
    pubId: "pub-002",
  },
];

export function AwardSpotlight({
  publications = [],
  onBibtex,
  onNavigateToFeed,
  theme = "dark",
}: AwardSpotlightProps) {
  const isDark = theme === "dark";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const slides = useMemo(() => {
    // Sincroniza com dados reais de publications se disponíveis
    return SLIDES_DATA.map((slide) => {
      const match = publications.find(
        (p) => p.id === slide.pubId || (p.year === slide.year && !!p.award)
      );
      if (match) {
        return {
          ...slide,
          pubId: match.id,
          title: match.title || slide.title,
          venue: match.venue || slide.venue,
          bibtex: match.bibtex || slide.bibtex,
        };
      }
      return slide;
    });
  }, [publications]);

  const currentSlide = slides[currentIndex];

  // Alternância automática a cada 7 segundos se não estiver pausado
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const handleCopyBibtex = () => {
    const pubObj = publications.find(
      (p) => p.id === currentSlide.pubId || (p.year === currentSlide.year && !!p.award)
    );
    if (pubObj && onBibtex) {
      onBibtex(pubObj);
      return;
    }
    navigator.clipboard.writeText(currentSlide.bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Suporte a swipe em telas touch
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) handleNext();
    else if (diff < -50) handlePrev();
    setTouchStart(null);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`relative overflow-hidden rounded-3xl border transition-all duration-500 shadow-xl group ${
        isDark
          ? "bg-gradient-to-br from-[#1c1808] via-[#0F233F] to-[#08172D] border-amber-500/50 shadow-[0_0_35px_rgba(245,158,11,0.15)]"
          : "bg-gradient-to-br from-amber-50/95 via-orange-50/30 to-white border-amber-300 shadow-amber-200/50"
      }`}
    >
      {/* Luzes de fundo / Ambient Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Barra de Progresso / Indicador do Carrossel no Topo */}
      <div className="relative h-1.5 w-full bg-slate-700/20 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            currentSlide.year === 2026 ? "bg-amber-500" : "bg-orange-500"
          }`}
          style={{
            width: `${((currentIndex + 1) / slides.length) * 100}%`,
          }}
        />
      </div>

      <div className="relative p-6 sm:p-7">
        {/* Cabeçalho do Carrossel: Seletor de Anos e Controles de Navegação */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          {/* Seletor de Abas de Anos (Pills) */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center p-1 rounded-2xl border bg-black/20 border-amber-500/30 shadow-inner">
              {slides.map((s, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={s.year}
                    onClick={() => setCurrentIndex(idx)}
                    className={`px-3 py-1 rounded-xl text-xs font-black tracking-wide transition-all duration-300 flex items-center gap-1.5 ${
                      isActive
                        ? "bg-amber-500 text-slate-950 shadow-md scale-105"
                        : isDark
                        ? "text-slate-400 hover:text-amber-300"
                        : "text-slate-600 hover:text-amber-900"
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    {s.edition}
                    {s.year === 2026 && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-slate-950 text-amber-400 font-extrabold uppercase">
                        Novo
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                isDark
                  ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                  : "bg-amber-100 text-amber-900 border-amber-300"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Categoria: {currentSlide.category}
            </span>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                isDark
                  ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                  : "bg-blue-100 text-blue-900 border-blue-300"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              {currentSlide.subBadge}
            </span>
          </div>

          {/* Controles de navegação (Anterior / Próximo / Play-Pause) */}
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs font-bold mr-2 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {currentIndex + 1} de {slides.length}
            </span>

            <button
              onClick={() => setIsPaused((prev) => !prev)}
              title={isPaused ? "Retomar reprodução automática" : "Pausar reprodução"}
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark
                  ? "bg-[#0b1d38] hover:bg-[#1E3A5F] text-slate-400 border-slate-700"
                  : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handlePrev}
              title="Prêmio anterior"
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark
                  ? "bg-[#0b1d38] hover:bg-[#1E3A5F] text-amber-400 border-amber-500/40"
                  : "bg-white hover:bg-amber-50 text-amber-800 border-amber-300 shadow-sm"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              title="Próximo prêmio"
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark
                  ? "bg-[#0b1d38] hover:bg-[#1E3A5F] text-amber-400 border-amber-500/40"
                  : "bg-white hover:bg-amber-50 text-amber-800 border-amber-300 shadow-sm"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Conteúdo Dinâmico do Slide (com transição suave) */}
        <div key={currentSlide.year} className="transition-all duration-300">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest">
              🏆 {currentSlide.badge}
            </span>
            <span
              className={`text-xs font-semibold ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {currentSlide.location}
            </span>
          </div>

          {/* Título do Artigo */}
          <h2
            className={`text-xl sm:text-2xl font-black tracking-tight leading-tight mb-3 ${
              isDark ? "text-white" : "text-slate-950"
            }`}
          >
            {currentSlide.title}
          </h2>

          {/* Autores Detalhados */}
          <div className="mb-4 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {currentSlide.authorsDetailed.map((author, aIdx) => (
                <span
                  key={aIdx}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    author.highlight
                      ? isDark
                        ? "bg-[#0b1d38] text-amber-300 border-amber-500/50 font-bold"
                        : "bg-amber-50 text-amber-950 border-amber-300 font-bold shadow-sm"
                      : isDark
                      ? "bg-[#0b1d38]/80 text-slate-200 border-slate-700/80 font-medium"
                      : "bg-white text-slate-800 border-slate-200 shadow-sm font-medium"
                  }`}
                >
                  {author.highlight ? "🎓" : "👨‍🏫"} {author.name}
                  <span className="ml-1 text-[10px] font-normal opacity-80">
                    ({author.role})
                  </span>
                </span>
              ))}
            </div>

            <p
              className={`text-xs italic ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              📖 {currentSlide.venue}
            </p>
          </div>

          {/* Resumo do Impacto Científico */}
          <p
            className={`text-xs sm:text-sm leading-relaxed mb-5 ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            {currentSlide.description}
          </p>

          {/* Tags e Ações */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-amber-500/20">
            <div className="flex flex-wrap items-center gap-1.5">
              {currentSlide.tags.map((t, tIdx) => {
                let badgeCls = "";
                if (t.color === "blue") {
                  badgeCls = isDark
                    ? "bg-blue-900/40 text-blue-200 border-blue-700/40"
                    : "bg-blue-100 text-blue-950 border-blue-200";
                } else if (t.color === "orange") {
                  badgeCls = isDark
                    ? "bg-orange-500/20 text-orange-300 border-orange-500/30"
                    : "bg-orange-100 text-orange-950 border-orange-300";
                } else if (t.color === "emerald") {
                  badgeCls = isDark
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-emerald-100 text-emerald-950 border-emerald-300";
                } else {
                  badgeCls = isDark
                    ? "bg-cyan-900/40 text-cyan-200 border-cyan-700/40"
                    : "bg-cyan-100 text-cyan-950 border-cyan-200";
                }
                return (
                  <span
                    key={tIdx}
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${badgeCls}`}
                  >
                    {t.label}
                  </span>
                );
              })}
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={handleCopyBibtex}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 shadow-sm ${
                  copied
                    ? "bg-emerald-600 text-white border-emerald-500"
                    : isDark
                    ? "bg-[#0F233F] hover:bg-[#1E3A5F] text-amber-300 border-amber-500/40"
                    : "bg-white hover:bg-amber-50 text-amber-900 border-amber-300"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copiado!
                  </>
                ) : (
                  <>
                    <Quote className="w-3.5 h-3.5 text-amber-400" /> Citar BibTeX
                  </>
                )}
              </button>

              <a
                href={currentSlide.newsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-[#FB6602] hover:from-amber-600 hover:to-[#e05b02] text-slate-950 text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Notícia Oficial no Portal
              </a>

              {onNavigateToFeed && (
                <button
                  onClick={() => onNavigateToFeed(currentSlide.pubId)}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 ${
                    isDark
                      ? "bg-[#08172D] hover:bg-[#1E3A5F] text-slate-300 border-[#1E3A5F]"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#FB6602]" /> Ver no Feed
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
