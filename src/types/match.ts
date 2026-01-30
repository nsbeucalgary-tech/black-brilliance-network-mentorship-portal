/**
 * Match model used by the Matching page.
 * 
 * Mock code for data structure representation.
 * Can/will be replaced with real API data structure.
 */
export type Match = {
  id: string;
  name: string;
  title: string;
  company: string;
  matchPercent: number;
  avatarUrl: string;
  isFavourite?: boolean;
};

export type MatchTab = "TOP_MATCHES" | "FAVOURITES";
export type SortMode = "BEST_MATCH" | "NAME";
