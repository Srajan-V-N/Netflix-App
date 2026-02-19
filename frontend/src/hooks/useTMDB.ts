import { useState, useEffect } from "react";
import {
  fetchTrending,
  fetchNetflixOriginals,
  fetchTopRated,
  fetchActionMovies,
  fetchDramaMovies,
} from "@/services/tmdb";
import type { Movie, MovieRow } from "@/types/movie";

interface TMDBState {
  rows: MovieRow[];
  heroes: Movie[];
  isLoading: boolean;
  error: string | null;
}

// --- module-level cache (persists for the tab session) ---
interface TMDBData { rows: MovieRow[]; heroes: Movie[]; }
let _cache: TMDBData | null = null;
let _pending: Promise<TMDBData> | null = null;

async function doFetch(): Promise<TMDBData> {
  const [trending, originals, topRated, action, drama] = await Promise.all([
    fetchTrending(),
    fetchNetflixOriginals(),
    fetchTopRated(),
    fetchActionMovies(),
    fetchDramaMovies(),
  ]);
  const rows: MovieRow[] = [
    { title: "Trending Now",      movies: trending  },
    { title: "Netflix Originals", movies: originals },
    { title: "Top Rated",         movies: topRated  },
    { title: "Action",            movies: action    },
    { title: "Drama",             movies: drama     },
  ];
  const heroes = trending.filter((m) => m.backdrop_path).slice(0, 5);
  return { rows, heroes };
}

/** Pre-warm the cache (call during intro video so data is ready when Landing mounts) */
export function warmTMDB(): void {
  if (_cache || _pending) return;
  _pending = doFetch().then((data) => {
    _cache = data;
    _pending = null;
    return data;
  }).catch(() => { _pending = null; return Promise.reject(); });
}

export function useTMDB(): TMDBState {
  const [state, setState] = useState<TMDBState>(() =>
    _cache
      ? { rows: _cache.rows, heroes: _cache.heroes, isLoading: false, error: null }
      : { rows: [], heroes: [], isLoading: true, error: null }
  );

  useEffect(() => {
    if (_cache) return;
    let cancelled = false;

    const p = _pending ?? doFetch();
    if (!_pending) _pending = p;

    p.then((data) => {
      _cache = data;
      _pending = null;
      if (!cancelled) setState({ rows: data.rows, heroes: data.heroes, isLoading: false, error: null });
    }).catch((err) => {
      _pending = null;
      if (!cancelled) setState((s) => ({ ...s, isLoading: false, error: err instanceof Error ? err.message : "Failed to load movies" }));
    });

    return () => { cancelled = true; };
  }, []);

  return state;
}
