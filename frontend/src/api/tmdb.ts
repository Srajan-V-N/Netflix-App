import axios from "axios";
import type { TMDBResponse, Movie } from "@/types/movie";

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL as string;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY, language: "en-US" },
});

async function get<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
  const { data } = await tmdb.get<T>(endpoint, { params });
  return data;
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

export function getImageUrl(path: string | null, size: string = "w500"): string {
  if (!path) return "/placeholder-movie.jpg";
  const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE as string;
  return `${IMAGE_BASE}/${size}${path}`;
}
