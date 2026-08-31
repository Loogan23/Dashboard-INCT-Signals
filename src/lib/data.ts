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
