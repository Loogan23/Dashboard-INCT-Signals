export interface Publication {
  id: string;
  type: "Journal" | "International Conference" | "Brazilian Conference (SBrT)";
  title: string;
  authors: string;
  venue: string;
  year: number;
  status: "Published" | "Accepted" | "Accepted / In Press" | "Submitted";
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
  { key: "WP1", label: "WP1 – Satellite Remote Sensing & Surveillance", color: "#8B5CF6" },
  { key: "WP2", label: "WP2 – Hardware, Antennas & RF Development", color: "#EC4899" },
  { key: "WP3", label: "WP3 – Testbeds & Platforms for UAV Sensing", color: "#10B981" },
  { key: "WP4", label: "WP4 – Signal Processing for Sensing & Comms", color: "#FB6602" },
] as const;

export const INSTITUTIONS = [
  { key: "UFC", label: "UFC – Universidade Federal do Ceará" },
  { key: "ITA", label: "ITA – Instituto Tecnológico de Aeronáutica" },
  { key: "UFRGS", label: "UFRGS – Univ. Federal do Rio Grande do Sul" },
  { key: "PUCRS", label: "PUCRS – Pontifícia Univ. Católica do RS" },
  { key: "UNIPAMPA", label: "UNIPAMPA – Universidade Federal do Pampa" },
] as const;

export const COLORS = {
  navy: "#08172D",
  card: "#0F233F",
  accent: "#FB6602",
  blue: "#2D82B5",
  border: "#1E3A5F",
  axisColors: ["#FB6602", "#2D82B5", "#10B981", "#8B5CF6", "#EC4899", "#F59E0B"],
} as const;
