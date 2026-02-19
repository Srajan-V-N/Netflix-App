import type { TMDBResponse, Movie } from "@/types/movie";

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;

async function get<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  const allParams: Record<string, string> = { api_key: API_KEY, language: "en-US" };
  for (const [k, v] of Object.entries(params)) {
    allParams[k] = String(v);
  }
  const qs = new URLSearchParams(allParams).toString();
  const res = await fetch(`${BASE_URL}${endpoint}?${qs}`);
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
}

export async function fetchTrending(): Promise<Movie[]> {
  const data = await get<TMDBResponse>("/trending/all/week");
  return data.results;
}

export async function fetchNetflixOriginals(): Promise<Movie[]> {
  const data = await get<TMDBResponse>("/discover/tv", { with_networks: 213 });
  return data.results;
}

export async function fetchTopRated(): Promise<Movie[]> {
  const data = await get<TMDBResponse>("/movie/top_rated");
  return data.results;
}

export async function fetchActionMovies(): Promise<Movie[]> {
  const data = await get<TMDBResponse>("/discover/movie", { with_genres: 28 });
  return data.results;
}

export async function fetchDramaMovies(): Promise<Movie[]> {
  const data = await get<TMDBResponse>("/discover/movie", { with_genres: 18 });
  return data.results;
}

export function getImageUrl(path: string | null, size = "w500"): string {
  if (!path) return "/placeholder-movie.jpg";
  return `${IMAGE_BASE}/${size}${path}`;
}
