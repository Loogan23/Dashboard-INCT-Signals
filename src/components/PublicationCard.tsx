"use client";

import { Publication } from "@/types";
import { ExternalLink, Quote, CheckCircle, Clock, Send } from "lucide-react";

interface PublicationCardProps {
  pub: Publication;
  onBibtex: (pub: Publication) => void;
  theme?: "dark" | "light";
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  "Publicado": <CheckCircle className="w-3 h-3 text-emerald-500" />,
  "Aceito": <CheckCircle className="w-3 h-3 text-blue-500" />,
  "Aceito / No Prelo": <Clock className="w-3 h-3 text-amber-500" />,
  "Submetido": <Send className="w-3 h-3 text-rose-500" />,
};

const INST_COLORS_DARK: Record<string, string> = {
  UFC: "bg-blue-900/60 text-blue-200 border-blue-700/50",
  ITA: "bg-indigo-900/60 text-indigo-200 border-indigo-700/50",
  UFRGS: "bg-cyan-900/60 text-cyan-200 border-cyan-700/50",
  PUCRS: "bg-teal-900/60 text-teal-200 border-teal-700/50",
  UNIPAMPA: "bg-sky-900/60 text-sky-200 border-sky-700/50",
};

const INST_COLORS_LIGHT: Record<string, string> = {
  UFC: "bg-blue-100 text-blue-950 border-blue-300 font-bold",
  ITA: "bg-indigo-100 text-indigo-950 border-indigo-300 font-bold",
  UFRGS: "bg-cyan-100 text-cyan-950 border-cyan-300 font-bold",
  PUCRS: "bg-teal-100 text-teal-950 border-teal-300 font-bold",
  UNIPAMPA: "bg-sky-100 text-sky-950 border-sky-300 font-bold",
};

export function PublicationCard({ pub, onBibtex, theme = "dark" }: PublicationCardProps) {
  const isDark = theme === "dark";

  // Badges de tipo
  const getTypeBadgeClass = (type: string) => {
    if (isDark) {
      if (type === "Periódico") return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      if (type.includes("SBrT")) return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    } else {
      if (type === "Periódico") return "bg-emerald-100 text-emerald-950 border-emerald-300 font-bold";
      if (type.includes("SBrT")) return "bg-amber-100 text-amber-950 border-amber-300 font-bold";
      return "bg-purple-100 text-purple-950 border-purple-300 font-bold";
    }
  };

  return (
    <article
      className={`p-4.5 rounded-2xl border transition-all duration-300 shadow-md space-y-3 ${
        isDark
          ? "bg-[#0F233F] border-[#1E3A5F] hover:border-[#2D82B5]/60"
          : "bg-white border-slate-300 hover:border-[#2D82B5] shadow-slate-200/70"
      }`}
    >
      {/* Linha Superior: Tipo, Ano, Status, Instituições */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getTypeBadgeClass(
              pub.type
            )}`}
          >
            {pub.type}
          </span>
          <span
            className={`font-extrabold ${
              isDark ? "text-slate-200" : "text-slate-900"
            }`}
          >
            {pub.year}
          </span>
          <span
            className={`flex items-center gap-1 text-[11px] font-semibold ${
              isDark ? "text-slate-300" : "text-slate-800"
            }`}
          >
            {STATUS_ICONS[pub.status] || STATUS_ICONS["Publicado"]}
            {pub.status}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {(pub.institutions || []).map((inst) => (
            <span
              key={inst}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                isDark
                  ? INST_COLORS_DARK[inst] || "bg-slate-700 text-slate-300 border-slate-600"
                  : INST_COLORS_LIGHT[inst] || "bg-slate-200 text-slate-900 border-slate-300 font-bold"
              }`}
            >
              {inst}
            </span>
          ))}
          {(pub.work_packages || []).map((wp) => (
            <span
              key={wp}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                isDark
                  ? "bg-orange-500/10 text-orange-300 border-orange-500/20"
                  : "bg-orange-100 text-orange-950 border-orange-300 font-extrabold"
              }`}
            >
              {wp}
            </span>
          ))}
        </div>
      </div>

      {/* Título do Artigo (Alto contraste em Light Mode) */}
      <h4
        className={`text-sm font-bold leading-snug hover:text-[#FB6602] transition-colors ${
          isDark ? "text-white" : "text-slate-950 font-extrabold"
        }`}
      >
        {pub.title}
      </h4>

      {/* Autores (Texto Escuro e Nítido em Light Mode) */}
      <p
        className={`text-xs leading-relaxed font-medium ${
          isDark ? "text-slate-300" : "text-slate-800 font-semibold"
        }`}
      >
        <span className="text-slate-500 mr-1">✍</span>
        {pub.authors}
      </p>

      {/* Veículo de Publicação */}
      <p
        className={`text-xs italic leading-snug ${
          isDark ? "text-slate-400" : "text-slate-700 font-medium"
        }`}
      >
        <span className="text-slate-500 mr-1">📖</span>
        {pub.venue}
      </p>

      {/* Linha Inferior: Eixos/Tags + Botões de Ação */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t ${
          isDark ? "border-[#1E3A5F]/60" : "border-slate-200"
        }`}
      >
        <div className="flex flex-wrap gap-1">
          {(pub.thematic_axes || []).map((ax) => (
            <span
              key={ax}
              className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                isDark
                  ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                  : "bg-blue-100 text-blue-950 border-blue-300 font-semibold"
              }`}
            >
              {ax.split(",")[0].trim()}
            </span>
          ))}
          {(pub.tags || []).map((tag) => (
            <span
              key={tag}
              className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                isDark
                  ? "bg-slate-700/50 text-slate-400 border-slate-600/30"
                  : "bg-slate-200 text-slate-900 border-slate-300 font-semibold"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onBibtex(pub)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-colors font-semibold flex items-center gap-1 ${
              isDark
                ? "bg-[#08172D] hover:bg-[#2D82B5]/30 text-slate-200 border-[#1E3A5F]"
                : "bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300 shadow-sm"
            }`}
          >
            <Quote className="w-3 h-3 text-[#FB6602]" /> BibTeX
          </button>
          {pub.link && (
            <a
              href={pub.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 bg-[#FB6602] hover:bg-amber-600 text-xs text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
            >
              <ExternalLink className="w-3 h-3" /> Ver Artigo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
