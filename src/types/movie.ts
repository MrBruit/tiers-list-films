export interface Movie {
  id: string;
  title: string;
  year: string;
  poster: string;
}

export interface OmdbSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface OmdbSearchResponse {
  Search?: OmdbSearchResult[];
  totalResults?: string;
  Response: "True" | "False";
  Error?: string;
}