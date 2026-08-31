"use client";

import { useState, useMemo, useCallback } from "react";
import { Publication, FilterState } from "@/types";
import { filterPublications, getAllTags } from "@/lib/data";

const DEFAULT_FILTERS: FilterState = {
  search: "",
  axis: "",
  wp: "",
  institution: "",
  type: "",
  year: "",
  tag: "",
  sortBy: "year-desc",
};

export function useDashboard(publications: Publication[]) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [bibtexModal, setBibtexModal] = useState<Publication | null>(null);

  const filtered = useMemo(
    () => filterPublications(publications, filters),
    [publications, filters]
  );

  const allTags = useMemo(() => getAllTags(publications), [publications]);

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tag: prev.tag === tag ? "" : tag,
    }));
  }, []);

  const kpis = useMemo(() => ({
    total: publications.length,
    journals: publications.filter((p) => p.type === "Periódico").length,
    intConfs: publications.filter(
      (p) => p.type === "Conferência Internacional"
    ).length,
    natConfs: publications.filter(
      (p) => p.type === "Conferência Nacional (SBrT)"
    ).length,
    filtered: filtered.length,
  }), [publications, filtered]);

  return {
    filters,
    filtered,
    allTags,
    bibtexModal,
    kpis,
    updateFilter,
    resetFilters,
    toggleTag,
    setBibtexModal,
  };
}
