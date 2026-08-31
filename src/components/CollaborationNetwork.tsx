"use client";

import { useState, useMemo } from "react";
import { Publication, CollaborationNode, CollaborationEdge } from "@/types";
import { getCollaborationNetworkData } from "@/lib/data";
import { Users, Info, Sparkles } from "lucide-react";

interface CollaborationNetworkProps {
  data: Publication[];
  theme?: "dark" | "light";
}

// Layout em pentágono regular em viewBox 600x420
const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  UFC: { x: 300, y: 70 },       // Topo (Centro)
  ITA: { x: 490, y: 190 },      // Superior Direito
  PUCRS: { x: 420, y: 350 },    // Inferior Direito
  UFRGS: { x: 180, y: 350 },    // Inferior Esquerdo
  UNIPAMPA: { x: 110, y: 190 }, // Superior Esquerdo
};

export function CollaborationNetwork({ data, theme = "dark" }: CollaborationNetworkProps) {
  const isDark = theme === "dark";
  const { nodes, edges } = useMemo(() => getCollaborationNetworkData(data), [data]);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<CollaborationEdge | null>(null);

  // Mapeia nós com posições SVG 2D
  const positionedNodes: CollaborationNode[] = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      x: NODE_POSITIONS[node.id]?.x || 300,
      y: NODE_POSITIONS[node.id]?.y || 210,
    }));
  }, [nodes]);

  // Arestas filtradas ou destacadas
  const activeEdges = useMemo(() => {
    if (!selectedNode) return edges;
    return edges.filter(
      (e) => e.source === selectedNode || e.target === selectedNode
    );
  }, [edges, selectedNode]);

  // Detalhes da seleção atual
  const selectedNodeData = useMemo(
    () => positionedNodes.find((n) => n.id === selectedNode),
    [positionedNodes, selectedNode]
  );

  const cardCls = `p-6 rounded-2xl border shadow-lg transition-all duration-300 ${
    isDark
      ? "bg-[#0F233F] border-[#1E3A5F]"
      : "bg-white border-slate-200 shadow-slate-200/60"
  }`;

  return (
    <div className={cardCls}>
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h3
            className={`text-base font-bold flex items-center gap-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            <Users className="w-5 h-5 text-[#FB6602]" />
            Grafo de Rede &amp; Colaboração Interinstitucional
          </h3>
          <p
            className={`text-xs mt-0.5 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Conexões e publicações co-autoradas entre os polos do INCT Signals (UFC, ITA, UFRGS, PUCRS, UNIPAMPA)
          </p>
        </div>
        {selectedNode || selectedEdge ? (
          <button
            onClick={() => {
              setSelectedNode(null);
              setSelectedEdge(null);
            }}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
          >
            Limpar Seleção
          </button>
        ) : (
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3" /> Clique nos nós ou conexões para detalhar
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Grafo SVG Interativo (2 Colunas no Desktop) */}
        <div className="lg:col-span-2 relative flex items-center justify-center p-2 rounded-xl bg-slate-950/40 border border-slate-800/80 overflow-hidden">
          <svg
            viewBox="0 0 600 420"
            className="w-full h-auto max-h-[420px] select-none"
          >
            <defs>
              <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Arestas de Conexão */}
            {edges.map((edge) => {
              const sourceNode = NODE_POSITIONS[edge.source];
              const targetNode = NODE_POSITIONS[edge.target];
              if (!sourceNode || !targetNode) return null;

              const isSelected =
                selectedEdge?.source === edge.source &&
                selectedEdge?.target === edge.target;

              const isHighlighted =
                !selectedNode ||
                edge.source === selectedNode ||
                edge.target === selectedNode;

              const strokeWidth = Math.max(2, Math.min(10, edge.weight * 1.5));

              return (
                <g key={`${edge.source}-${edge.target}`}>
                  {/* Linha visível */}
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={
                      isSelected
                        ? "#FB6602"
                        : isHighlighted
                        ? isDark
                          ? "#38BDF8"
                          : "#2563EB"
                        : isDark
                        ? "#1E293B"
                        : "#E2E8F0"
                    }
                    strokeWidth={strokeWidth}
                    strokeOpacity={isSelected ? 1 : isHighlighted ? 0.7 : 0.2}
                    strokeDasharray={isSelected ? "6 3" : undefined}
                    className="transition-all duration-300 cursor-pointer hover:stroke-[#FB6602]"
                    onClick={() => {
                      setSelectedEdge(edge);
                      setSelectedNode(null);
                    }}
                  />
                  {/* Rótulo numérico de peso da aresta se relevante */}
                  {edge.weight > 2 && (
                    <text
                      x={(sourceNode.x + targetNode.x) / 2}
                      y={(sourceNode.y + targetNode.y) / 2 - 6}
                      fill={isDark ? "#94A3B8" : "#475569"}
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      {edge.weight}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nós das Instituições */}
            {positionedNodes.map((node) => {
              const isSelected = selectedNode === node.id;
              const isConnected =
                !selectedNode ||
                activeEdges.some(
                  (e) => e.source === node.id || e.target === node.id
                );

              const radius = 28 + Math.min(18, node.count / 3);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer group"
                  onClick={() => {
                    setSelectedNode(node.id === selectedNode ? null : node.id);
                    setSelectedEdge(null);
                  }}
                >
                  {/* Anel de destaque com animação */}
                  {isSelected && (
                    <circle
                      r={radius + 8}
                      fill="none"
                      stroke="#FB6602"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      className="animate-spin-slow"
                    />
                  )}

                  {/* Círculo Principal do Nó */}
                  <circle
                    r={radius}
                    fill={node.color}
                    fillOpacity={isConnected ? 0.9 : 0.3}
                    stroke={isSelected ? "#FFFFFF" : isDark ? "#0F233F" : "#FFFFFF"}
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all duration-300 group-hover:scale-110"
                  />

                  {/* Sigla da Instituição */}
                  <text
                    y={-2}
                    fill="#FFFFFF"
                    fontSize="13"
                    fontWeight="800"
                    textAnchor="middle"
                    className="pointer-events-none drop-shadow-md"
                  >
                    {node.name}
                  </text>

                  {/* Quantidade de Publicações */}
                  <text
                    y={13}
                    fill="#F1F5F9"
                    fontSize="9.5"
                    fontWeight="600"
                    textAnchor="middle"
                    className="pointer-events-none opacity-90"
                  >
                    {node.count} pubs
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Painel Lateral de Informações da Seleção */}
        <div className="lg:col-span-1 space-y-4">
          {selectedNodeData ? (
            <div
              className={`p-4 rounded-xl border transition-all ${
                isDark
                  ? "bg-[#08172D] border-[#1E3A5F] text-slate-200"
                  : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 mb-3 border-slate-700/50">
                <div>
                  <span
                    className="px-2.5 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider"
                    style={{ backgroundColor: selectedNodeData.color }}
                  >
                    {selectedNodeData.id}
                  </span>
                  <h4 className="text-sm font-bold mt-1">{selectedNodeData.fullName}</h4>
                  <p className="text-xs text-slate-400">
                    📍 {selectedNodeData.city} - {selectedNodeData.state}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total de Publicações:</span>
                  <span className="font-extrabold text-[#FB6602]">
                    {selectedNodeData.count}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Instituições Conectadas:</span>
                  <span className="font-bold">
                    {
                      edges.filter(
                        (e) =>
                          e.source === selectedNodeData.id ||
                          e.target === selectedNodeData.id
                      ).length
                    }{" "}
                    polos
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/50">
                <h5 className="text-xs font-bold mb-2 text-slate-300">
                  Coautoria Direta com Outros Polos:
                </h5>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {edges
                    .filter(
                      (e) =>
                        e.source === selectedNodeData.id ||
                        e.target === selectedNodeData.id
                    )
                    .map((edge) => {
                      const other =
                        edge.source === selectedNodeData.id
                          ? edge.target
                          : edge.source;
                      return (
                        <div
                          key={other}
                          onClick={() => setSelectedEdge(edge)}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 hover:bg-slate-800/60 cursor-pointer text-xs border border-slate-800 transition-colors"
                        >
                          <span className="font-semibold text-slate-200">
                            🤝 {other}
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                            {edge.weight} artigos
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : selectedEdge ? (
            <div
              className={`p-4 rounded-xl border transition-all ${
                isDark
                  ? "bg-[#08172D] border-[#1E3A5F] text-slate-200"
                  : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <div className="border-b pb-3 mb-3 border-slate-700/50">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FB6602]">
                  <span>{selectedEdge.source}</span>
                  <span>🤝</span>
                  <span>{selectedEdge.target}</span>
                </div>
                <h4 className="text-sm font-bold mt-1">
                  Parceria Científica Conjunta
                </h4>
                <p className="text-xs text-slate-400">
                  {selectedEdge.weight} publicação(ões) co-autorada(s)
                </p>
              </div>

              <h5 className="text-xs font-bold mb-2 text-slate-300">
                Artigos em Coautoria ({selectedEdge.pubTitles.length}):
              </h5>
              <ul className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
                {selectedEdge.pubTitles.map((title, i) => (
                  <li
                    key={i}
                    className="p-2 rounded bg-slate-900/50 border border-slate-800/80 text-slate-300 font-medium leading-relaxed"
                  >
                    📄 {title}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div
              className={`p-6 rounded-xl border text-center flex flex-col items-center justify-center min-h-[260px] ${
                isDark
                  ? "bg-[#08172D]/60 border-[#1E3A5F] text-slate-400"
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              <Info className="w-8 h-8 text-[#FB6602] mb-2 opacity-80" />
              <h4 className="text-sm font-bold text-slate-200">
                Explorar Colaborações
              </h4>
              <p className="text-xs mt-1 max-w-xs leading-relaxed">
                Clique nos círculos do grafo ou nas linhas de conexão para visualizar os dados de coautoria entre universidades parceiras.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
