"use client";

import { useState, useMemo } from "react";
import { Publication, TagWeight } from "@/types";
import { getTagCloudData } from "@/lib/data";
import { Tag, Search, Filter } from "lucide-react";

interface WordCloudPanelProps {
  data: Publication[];
  onSelectTag?: (tag: string) => void;
  theme?: "dark" | "light";
}

const TAG_COLOR_SCHEMES = [
  { bg: "bg-orange-500/20", border: "border-orange-500/40", text: "text-orange-400", hex: "#FB6602" },
  { bg: "bg-blue-500/20", border: "border-blue-500/40", text: "text-blue-400", hex: "#2D82B5" },
  { bg: "bg-purple-500/20", border: "border-purple-500/40", text: "text-purple-400", hex: "#8B5CF6" },
  { bg: "bg-pink-500/20", border: "border-pink-500/40", text: "text-pink-400", hex: "#EC4899" },
  { bg: "bg-cyan-500/20", border: "border-cyan-500/40", text: "text-cyan-400", hex: "#06B6D4" },
  { bg: "bg-emerald-500/20", border: "border-emerald-500/40", text: "text-emerald-400", hex: "#10B981" },
  { bg: "bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-400", hex: "#F59E0B" },
];

export function WordCloudPanel({ data, onSelectTag, theme = "dark" }: WordCloudPanelProps) {
  const isDark = theme === "dark";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<TagWeight | null>(null);

  const tagList = useMemo(() => getTagCloudData(data), [data]);

  const filteredTags = useMemo(() => {
    if (!searchTerm.trim()) return tagList;
    return tagList.filter((t) =>
      t.tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tagList, searchTerm]);

  // Artigos associados à tag selecionada
  const matchingPubs = useMemo(() => {
    if (!selectedTag) return [];
    return data.filter((p) => (p.tags || []).includes(selectedTag.tag));
  }, [data, selectedTag]);

  const cardCls = `p-6 rounded-2xl border shadow-lg transition-all duration-300 ${
    isDark
      ? "bg-[#0F233F] border-[#1E3A5F]"
      : "bg-white border-slate-200 shadow-slate-200/60"
  }`;

  return (
    <div className={cardCls}>
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div>
          <h3
            className={`text-base font-bold flex items-center gap-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            <Tag className="w-5 h-5 text-[#FB6602]" />
            Nuvem de Palavras-Chave &amp; Tecnologias Core
          </h3>
          <p
            className={`text-xs mt-0.5 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Frequência de termos e áreas temáticas emergentes nas publicações da rede INCT Signals
          </p>
        </div>

        {/* Busca interna de tags */}
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Filtrar tecnologia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-8 pr-3 py-1.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-[#FB6602] transition-colors ${
              isDark
                ? "bg-[#08172D] text-slate-200 border-[#1E3A5F]"
                : "bg-slate-50 text-slate-900 border-slate-300"
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nuvem de Palavras-Chave (2 Colunas) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-950/40 border border-slate-800/80 min-h-[280px] flex flex-wrap items-center justify-center gap-2.5 content-center">
          {filteredTags.length === 0 ? (
            <p className="text-xs text-slate-500 italic">Nenhuma palavra-chave encontrada.</p>
          ) : (
            filteredTags.map((item, idx) => {
              const color = TAG_COLOR_SCHEMES[idx % TAG_COLOR_SCHEMES.length];
              const isSelected = selectedTag?.tag === item.tag;

              // Tamanho dinâmico de fonte baseado no peso da tag
              const fontSize = Math.max(11, Math.min(20, 11 + item.count * 1.2));

              return (
                <button
                  key={item.tag}
                  onClick={() => {
                    setSelectedTag(isSelected ? null : item);
                    if (onSelectTag) onSelectTag(item.tag);
                  }}
                  style={{ fontSize: `${fontSize}px` }}
                  className={`px-3 py-1 rounded-xl border font-bold transition-all duration-300 flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#FB6602] text-slate-950 border-[#FB6602] shadow-[0_0_12px_rgba(251,102,2,0.4)] scale-105"
                      : `${color.bg} ${color.text} ${color.border} hover:scale-105 hover:border-white/50`
                  }`}
                >
                  <span>{item.tag}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isSelected
                        ? "bg-slate-950 text-[#FB6602]"
                        : "bg-black/30 text-white/90"
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Detalhes da Tag Selecionada */}
        <div className="lg:col-span-1 space-y-4">
          {selectedTag ? (
            <div
              className={`p-4 rounded-xl border transition-all ${
                isDark
                  ? "bg-[#08172D] border-[#1E3A5F] text-slate-200"
                  : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 mb-3 border-slate-700/50">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#FB6602]">
                    Tecnologia Selecionada
                  </span>
                  <h4 className="text-base font-bold">{selectedTag.tag}</h4>
                </div>
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total de Artigos:</span>
                  <span className="font-extrabold text-[#FB6602]">
                    {selectedTag.count} publicação(ões)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Presença no Acervo:</span>
                  <span className="font-bold text-cyan-400">
                    {selectedTag.percentage}% dos trabalhos
                  </span>
                </div>
              </div>

              <h5 className="text-xs font-bold mb-2 text-slate-300 flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#FB6602]" /> Artigos com esta Tag:
              </h5>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
                {matchingPubs.map((pub) => (
                  <div
                    key={pub.id}
                    className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 text-slate-300"
                  >
                    <p className="font-semibold text-slate-200 line-clamp-2">
                      {pub.title}
                    </p>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                      <span>{pub.year}</span>
                      <span className="text-amber-400 font-bold">{pub.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              className={`p-6 rounded-xl border text-center flex flex-col items-center justify-center min-h-[280px] ${
                isDark
                  ? "bg-[#08172D]/60 border-[#1E3A5F] text-slate-400"
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              <Tag className="w-8 h-8 text-[#FB6602] mb-2 opacity-80" />
              <h4 className="text-sm font-bold text-slate-200">Explorar Tags</h4>
              <p className="text-xs mt-1 max-w-xs leading-relaxed">
                Clique em qualquer palavra-chave da nuvem para listar todas as publicações científicas que abordam o tema.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
