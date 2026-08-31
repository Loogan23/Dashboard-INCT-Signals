"use client";

import { useEffect, useRef } from "react";
import { Publication } from "@/types";
import { X, Copy, Download } from "lucide-react";

interface BibtexModalProps {
  pub: Publication | null;
  onClose: () => void;
  theme?: "dark" | "light";
}

export function BibtexModal({ pub, onClose, theme = "dark" }: BibtexModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!pub) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pub.bibtex);
  };

  const downloadSingle = () => {
    const blob = new Blob([pub.bibtex], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${pub.id}.bib`;
    a.click();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={ref}
        className={`border rounded-2xl max-w-xl w-full shadow-2xl transition-colors duration-300 ${
          isDark
            ? "bg-[#0F233F] border-[#1E3A5F]"
            : "bg-white border-slate-200"
        }`}
      >
        {/* Cabeçalho */}
        <div
          className={`flex items-center justify-between px-5 pt-5 pb-4 border-b ${
            isDark ? "border-[#1E3A5F]" : "border-slate-200"
          }`}
        >
          <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Citação BibTeX
          </h3>
          <button
            onClick={onClose}
            className={`transition-colors ${
              isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prévia do título */}
        <div className={`px-5 py-3 ${isDark ? "bg-[#08172D]/50" : "bg-slate-50"}`}>
          <p className={`text-xs font-medium line-clamp-2 ${isDark ? "text-slate-300" : "text-slate-800"}`}>
            {pub.title}
          </p>
          <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
            {pub.authors}
          </p>
        </div>

        {/* Código BibTeX */}
        <pre
          className={`m-4 p-4 text-xs font-mono rounded-xl border overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto transition-colors ${
            isDark
              ? "bg-[#08172D] text-emerald-400 border-[#1E3A5F]"
              : "bg-slate-900 text-emerald-300 border-slate-700"
          }`}
        >
          {pub.bibtex}
        </pre>

        {/* Ações */}
        <div className="flex justify-end gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              isDark
                ? "bg-[#08172D] hover:bg-slate-800 text-slate-300 border-[#1E3A5F]"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
            }`}
          >
            Fechar
          </button>
          <button
            onClick={downloadSingle}
            className="px-4 py-2 bg-[#2D82B5] hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3 h-3" /> Baixar .bib
          </button>
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-[#FB6602] hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
          >
            <Copy className="w-3 h-3" /> Copiar BibTeX
          </button>
        </div>
      </div>
    </div>
  );
}
