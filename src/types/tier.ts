import type { Movie } from "./movie";

export interface Tier {
  id: string;
  label: string;
  color: string;
}

export interface TierListData {
  tiers: Tier[];
  // clé = tierId ou "pool" pour les non-classés, valeur = liste d'ids de films
  assignments: Record<string, string[]>;
  movies: Record<string, Movie>;
}

export const DEFAULT_TIERS: Tier[] = [
  { id: "S", label: "S", color: "#ff7f7f" },
  { id: "A", label: "A", color: "#ffbf7f" },
  { id: "B", label: "B", color: "#ffdf7f" },
  { id: "C", label: "C", color: "#bfff7f" },
  { id: "D", label: "D", color: "#7fbfff" },
];