import type { Movie, OmdbSearchResponse } from "../types/movie";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = "https://www.omdbapi.com/";

export async function searchMovies(query: string, page = 1): Promise<Movie[]> {
  if (!query.trim()) return [];

  const url = `${BASE_URL}?s=${encodeURIComponent(query)}&type=movie&page=${page}&apikey=${API_KEY}`;
  const res = await fetch(url);
  const data: OmdbSearchResponse = await res.json();

  if (data.Response === "False" || !data.Search) {
    return [];
  }

  return data.Search
    .filter((m) => m.Poster && m.Poster !== "N/A") // on garde que les films avec une vraie affiche
    .map((m) => ({
      id: m.imdbID,
      title: m.Title,
      year: m.Year,
      poster: m.Poster,
    }));
}