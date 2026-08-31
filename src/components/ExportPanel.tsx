"use client";

import { Publication } from "@/types";
import { downloadBibTeX, downloadCSV } from "@/lib/data";
import { FileDown, Table2, Quote } from "lucide-react";

interface ExportPanelProps {
  filtered: Publication[];
  theme?: "dark" | "light";
}

export function ExportPanel({ filtered, theme = "dark" }: ExportPanelProps) {
  const isDark = theme === "dark";

  const previewText = filtered
    .slice(0, 5)
    .map((p) => p.bibtex)
    .join("\n\n");

  const cardCls = `p-5 rounded-2xl border shadow-md transition-all duration-300 ${
    isDark
      ? "bg-[#0F233F] border-[#1E3A5F]"
      : "bg-white border-slate-200 shadow-slate-200/50"
  }`;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Cards de Exportação */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className={`${cardCls} text-center`}>
          <Quote className="w-10 h-10 text-amber-500 mx-auto mb-2" />
          <h4 className={`text-sm font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
            Arquivo BibTeX (.bib)
          </h4>
          <p className={`text-[11px] mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Exporta <span className="font-bold text-[#FB6602]">{filtered.length}</span> citações no padrão LaTeX/Overleaf
          </p>
          <button
            onClick={() => downloadBibTeX(filtered)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow flex items-center justify-center gap-1.5"
          >
            <FileDown className="w-4 h-4" /> Baixar BibTeX (.bib)
          </button>
        </div>

        <div className={`${cardCls} text-center`}>
          <Table2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h4 className={`text-sm font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
            Planilha CSV (.csv)
          </h4>
          <p className={`text-[11px] mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Exporta <span className="font-bold text-emerald-500">{filtered.length}</span> linhas com metadados completos
          </p>
          <button
            onClick={() => downloadCSV(filtered)}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow flex items-center justify-center gap-1.5"
          >
            <FileDown className="w-4 h-4" /> Baixar CSV (.csv)
          </button>
        </div>
      </div>

      {/* Pré-visualização do BibTeX */}
      <div className={cardCls}>
        <h4 className={`text-xs font-bold mb-3 flex items-center gap-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
          <Quote className="w-4 h-4 text-[#FB6602]" />
          Pré-visualização do BibTeX (primeiros 5 registros filtrados)
        </h4>
        <pre
          className={`text-xs font-mono p-4 rounded-xl border max-h-72 overflow-y-auto whitespace-pre-wrap leading-relaxed transition-colors ${
            isDark
              ? "bg-[#08172D] text-emerald-400 border-[#1E3A5F]"
              : "bg-slate-900 text-emerald-300 border-slate-700"
          }`}
        >
          {previewText || "Nenhuma publicação encontrada com os filtros atuais."}
        </pre>
      </div>
    </div>
  );
}
