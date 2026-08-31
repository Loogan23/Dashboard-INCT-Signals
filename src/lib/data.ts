import publications from "../../public/data/publications.json";
import { Publication, FilterState } from "@/types";

export const COLORS = {
  navy: "#08172D",
  card: "#0F233F",
  accent: "#FB6602",
  blue: "#2D82B5",
  border: "#1E3A5F",
  axisColors: ["#FB6602", "#2D82B5", "#06B6D4", "#8B5CF6", "#EC4899", "#F59E0B"],
} as const;

export function getPublications(): Publication[] {
  return publications as Publication[];
}

export function filterPublications(
  data: Publication[],
  filters: FilterState
): Publication[] {
  const filtered = data.filter((p) => {
    const search = filters.search.toLowerCase();
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search) ||
      p.authors.toLowerCase().includes(search) ||
      p.venue.toLowerCase().includes(search) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(search));

    const matchAxis =
      !filters.axis ||
      (p.thematic_axes || []).includes(filters.axis);

    const matchWp =
      !filters.wp || (p.work_packages || []).includes(filters.wp);

    const matchInst =
      !filters.institution ||
      (p.institutions || []).includes(filters.institution);

    const matchType = !filters.type || p.type === filters.type;

    const matchYear =
      !filters.year || p.year.toString() === filters.year;

    const matchTag =
      !filters.tag || (p.tags || []).includes(filters.tag);

    return (
      matchSearch &&
      matchAxis &&
      matchWp &&
      matchInst &&
      matchType &&
      matchYear &&
      matchTag
    );
  });

  filtered.sort((a, b) => {
    if (filters.sortBy === "year-desc") return b.year - a.year;
    if (filters.sortBy === "year-asc") return a.year - b.year;
    if (filters.sortBy === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  return filtered;
}

export function getAnalyticsData(data: Publication[]) {
  // Por ano & tipo
  const years = [...new Set(data.map((p) => p.year))].sort();
  const yearJournals = years.map(
    (y) => data.filter((p) => p.year === y && p.type === "Periódico").length
  );
  const yearIntConf = years.map(
    (y) =>
      data.filter((p) => p.year === y && p.type === "Conferência Internacional")
        .length
  );
  const yearNatConf = years.map(
    (y) =>
      data.filter(
        (p) => p.year === y && p.type === "Conferência Nacional (SBrT)"
      ).length
  );

  // Por eixo
  const axisMap: Record<string, number> = {};
  data.forEach((p) =>
    (p.thematic_axes || []).forEach(
      (ax) => (axisMap[ax] = (axisMap[ax] || 0) + 1)
    )
  );

  // Por WP
  const wpMap: Record<string, number> = { WP1: 0, WP2: 0, WP3: 0, WP4: 0 };
  data.forEach((p) =>
    (p.work_packages || []).forEach((w) => (wpMap[w] = (wpMap[w] || 0) + 1))
  );

  // Por instituição
  const uniMap: Record<string, number> = {
    UFC: 0, ITA: 0, UFRGS: 0, PUCRS: 0, UNIPAMPA: 0,
  };
  data.forEach((p) =>
    (p.institutions || []).forEach(
      (u) => (uniMap[u] = (uniMap[u] || 0) + 1)
    )
  );

  return { years, yearJournals, yearIntConf, yearNatConf, axisMap, wpMap, uniMap };
}

export function getAllTags(data: Publication[]): string[] {
  const tags = new Set<string>();
  data.forEach((p) => (p.tags || []).forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}

export function downloadBibTeX(data: Publication[]) {
  const text = data.map((p) => p.bibtex).join("\n\n");
  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `inct_signals_${new Date().toISOString().slice(0, 10)}.bib`;
  a.click();
}

export function downloadCSV(data: Publication[]) {
  const header =
    "ID;Tipo;Titulo;Autores;Veiculo;Ano;Status;Eixos;WorkPackages;Instituicoes;Link\n";
  const rows = data
    .map(
      (p) =>
        `"${p.id}";"${p.type}";"${p.title.replace(/"/g, '""')}";"${p.authors.replace(/"/g, '""')}";"${p.venue.replace(/"/g, '""')}";"${p.year}";"${p.status}";"${(p.thematic_axes || []).join(", ")}";"${(p.work_packages || []).join(", ")}";"${(p.institutions || []).join(", ")}";"${p.link || ""}"`
    )
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `inct_signals_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

// === Novas Funções para Visualizações Interativas ===

import { CollaborationNode, CollaborationEdge, TagWeight, GeoLocationNode } from "@/types";

const INST_META: Record<string, { fullName: string; city: string; state: string; color: string }> = {
  UFC: { fullName: "Universidade Federal do Ceará", city: "Fortaleza", state: "CE", color: "#FB6602" },
  ITA: { fullName: "Instituto Tecnológico de Aeronáutica", city: "São José dos Campos", state: "SP", color: "#2D82B5" },
  UFRGS: { fullName: "Universidade Federal do Rio Grande do Sul", city: "Porto Alegre", state: "RS", color: "#8B5CF6" },
  PUCRS: { fullName: "Pontifícia Universidade Católica do RS", city: "Porto Alegre", state: "RS", color: "#EC4899" },
  UNIPAMPA: { fullName: "Universidade Federal do Pampa", city: "Alegrete", state: "RS", color: "#06B6D4" },
};

export function getCollaborationNetworkData(data: Publication[]): {
  nodes: CollaborationNode[];
  edges: CollaborationEdge[];
} {
  const instKeys = Object.keys(INST_META);
  const nodeCounts: Record<string, number> = { UFC: 0, ITA: 0, UFRGS: 0, PUCRS: 0, UNIPAMPA: 0 };
  const edgeMap: Record<string, { weight: number; titles: string[] }> = {};

  data.forEach((p) => {
    const insts = (p.institutions || []).filter((i) => instKeys.includes(i));
    insts.forEach((i) => {
      nodeCounts[i] = (nodeCounts[i] || 0) + 1;
    });

    for (let i = 0; i < insts.length; i++) {
      for (let j = i + 1; j < insts.length; j++) {
        const u1 = insts[i] < insts[j] ? insts[i] : insts[j];
        const u2 = insts[i] < insts[j] ? insts[j] : insts[i];
        const edgeKey = `${u1}---${u2}`;
        if (!edgeMap[edgeKey]) {
          edgeMap[edgeKey] = { weight: 0, titles: [] };
        }
        edgeMap[edgeKey].weight += 1;
        if (!edgeMap[edgeKey].titles.includes(p.title)) {
          edgeMap[edgeKey].titles.push(p.title);
        }
      }
    }
  });

  const nodes: CollaborationNode[] = instKeys.map((key) => ({
    id: key,
    name: key,
    fullName: INST_META[key].fullName,
    city: INST_META[key].city,
    state: INST_META[key].state,
    count: nodeCounts[key] || 0,
    color: INST_META[key].color,
  }));

  const edges: CollaborationEdge[] = Object.entries(edgeMap).map(([key, val]) => {
    const [source, target] = key.split("---");
    return {
      source,
      target,
      weight: val.weight,
      pubTitles: val.titles,
    };
  });

  return { nodes, edges };
}

export function getTagCloudData(data: Publication[]): TagWeight[] {
  const tagCounts: Record<string, number> = {};
  let totalTags = 0;

  data.forEach((p) => {
    (p.tags || []).forEach((t) => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
      totalTags++;
    });
  });

  const tagList = Object.entries(tagCounts)
    .map(([tag, count]) => ({
      tag,
      count,
      percentage: totalTags > 0 ? Math.round((count / data.length) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return tagList;
}

export function getGeoMapData(data: Publication[]): GeoLocationNode[] {
  const { uniMap } = getAnalyticsData(data);

  // Coordenadas relativas (x%, y%) otimizadas para visualização em canvas/SVG do Brasil + Conexões Internacionais
  const geoNodes: GeoLocationNode[] = [
    {
      id: "UFC",
      name: "UFC",
      fullName: "Universidade Federal do Ceará (Coordenação Geral)",
      city: "Fortaleza",
      stateCountry: "Ceará, Brasil",
      lat: -3.74,
      lng: -38.51,
      x: 75,
      y: 22,
      type: "core",
      count: uniMap["UFC"] || 0,
      color: "#FB6602",
    },
    {
      id: "ITA",
      name: "ITA",
      fullName: "Instituto Tecnológico de Aeronáutica (Vice-Coordenação)",
      city: "São José dos Campos",
      stateCountry: "São Paulo, Brasil",
      lat: -23.21,
      lng: -45.87,
      x: 62,
      y: 65,
      type: "core",
      count: uniMap["ITA"] || 0,
      color: "#2D82B5",
    },
    {
      id: "UFRGS",
      name: "UFRGS",
      fullName: "Univ. Federal do Rio Grande do Sul",
      city: "Porto Alegre",
      stateCountry: "Rio Grande do Sul, Brasil",
      lat: -30.03,
      lng: -51.22,
      x: 48,
      y: 84,
      type: "core",
      count: uniMap["UFRGS"] || 0,
      color: "#8B5CF6",
    },
    {
      id: "PUCRS",
      name: "PUCRS",
      fullName: "Pontifícia Univ. Católica do RS",
      city: "Porto Alegre",
      stateCountry: "Rio Grande do Sul, Brasil",
      lat: -30.06,
      lng: -51.17,
      x: 52,
      y: 86,
      type: "core",
      count: uniMap["PUCRS"] || 0,
      color: "#EC4899",
    },
    {
      id: "UNIPAMPA",
      name: "UNIPAMPA",
      fullName: "Univ. Federal do Pampa (Lab. de Antenas)",
      city: "Alegrete",
      stateCountry: "Rio Grande do Sul, Brasil",
      lat: -29.78,
      lng: -55.79,
      x: 35,
      y: 82,
      type: "core",
      count: uniMap["UNIPAMPA"] || 0,
      color: "#06B6D4",
    },
    {
      id: "DLR",
      name: "DLR",
      fullName: "Centro Aeroespacial Alemão (DLR)",
      city: "Oberpfaffenhofen",
      stateCountry: "Alemanha",
      lat: 48.08,
      lng: 11.28,
      x: 88,
      y: 12,
      type: "international",
      count: 6,
      color: "#10B981",
    },
    {
      id: "UESTC",
      name: "UESTC",
      fullName: "Univ. de Ciência e Tec. Eletrônica da China",
      city: "Chengdu",
      stateCountry: "China",
      lat: 30.65,
      lng: 104.06,
      x: 94,
      y: 28,
      type: "international",
      count: 4,
      color: "#F59E0B",
    },
    {
      id: "Skoltech",
      name: "Skoltech",
      fullName: "Instituto Skolkovo de Ciência e Tecnologia",
      city: "Moscou",
      stateCountry: "Rússia",
      lat: 55.75,
      lng: 37.61,
      x: 90,
      y: 6,
      type: "international",
      count: 3,
      color: "#6366F1",
    },
  ];

  return geoNodes;
}

