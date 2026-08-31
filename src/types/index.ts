export interface Publication {
  id: string;
  type: "Periódico" | "Conferência Internacional" | "Conferência Nacional (SBrT)";
  title: string;
  authors: string;
  venue: string;
  year: number;
  status: "Publicado" | "Aceito" | "Aceito / No Prelo" | "Submetido";
  link: string | null;
  thematic_axes: string[];
  work_packages: string[];
  institutions: string[];
  tags: string[];
  bibtex: string;
}

export type FilterState = {
  search: string;
  axis: string;
  wp: string;
  institution: string;
  type: string;
  year: string;
  tag: string;
  sortBy: "year-desc" | "year-asc" | "title";
};

export const THEMATIC_AXES = [
  "Comunicações, Processamento de Sinais e Otimização",
  "Sensoriamento Remoto e Sistemas de Radar",
  "Monitoramento Ambiental e Climático",
  "Vigilância de Sinais, Segurança e Confiabilidade",
  "Sistemas Autônomos e Inteligentes",
  "Caracterização Eletromagnética em Comunicações",
] as const;

export const WORK_PACKAGES = [
  { key: "WP1", label: "WP1 – Sensoriamento Remoto & Vigilância por Satélite", color: "#8B5CF6" },
  { key: "WP2", label: "WP2 – Hardware, Antenas & Desenvolvimento RF", color: "#EC4899" },
  { key: "WP3", label: "WP3 – Testbeds & Plataformas para Sensoriamento com VANTs", color: "#06B6D4" },
  { key: "WP4", label: "WP4 – Processamento de Sinais para Sensoriamento & Comunicações", color: "#FB6602" },
] as const;

export const INSTITUTIONS = [
  { key: "UFC", label: "UFC – Universidade Federal do Ceará", color: "#FB6602" },
  { key: "ITA", label: "ITA – Instituto Tecnológico de Aeronáutica", color: "#2D82B5" },
  { key: "UFRGS", label: "UFRGS – Univ. Federal do Rio Grande do Sul", color: "#8B5CF6" },
  { key: "PUCRS", label: "PUCRS – Pontifícia Univ. Católica do RS", color: "#EC4899" },
  { key: "UNIPAMPA", label: "UNIPAMPA – Universidade Federal do Pampa", color: "#06B6D4" },
] as const;

export const COLORS = {
  navy: "#08172D",
  card: "#0F233F",
  accent: "#FB6602",
  blue: "#2D82B5",
  border: "#1E3A5F",
  axisColors: ["#FB6602", "#2D82B5", "#06B6D4", "#8B5CF6", "#EC4899", "#F59E0B"],
} as const;

export interface CollaborationNode {
  id: string;
  name: string;
  fullName: string;
  city: string;
  state: string;
  count: number;
  color: string;
  x?: number;
  y?: number;
}

export interface CollaborationEdge {
  source: string;
  target: string;
  weight: number;
  pubTitles: string[];
}


