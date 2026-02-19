import { lazy, Suspense } from "react";
import { useTMDB } from "@/hooks/useTMDB";
import { SkeletonRow } from "@/components/SkeletonRow";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";

const HeroBanner = lazy(() => import("@/components/HeroBanner").then(m => ({ default: m.HeroBanner })));
const MovieRow   = lazy(() => import("@/components/MovieRow").then(m => ({ default: m.MovieRow })));

export default function Landing() {
  const { rows, heroes, isLoading, error } = useTMDB();

  return (
    <>
      <Navbar />
      <PageTransition>
      <div className="min-h-screen bg-netflix-dark">

        {/* Hero Section */}
        {isLoading ? (
          <div className="h-[85vh] min-h-[500px] skeleton-shimmer" />
        ) : heroes.length > 0 ? (
          <Suspense fallback={<div className="h-[85vh] min-h-[500px] skeleton-shimmer" />}>
            <HeroBanner movies={heroes} />
          </Suspense>
        ) : null}

        {/* Movie Rows */}
        <div className="relative z-10 mt-8 pb-16">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          ) : (
            <Suspense fallback={Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}>
              {rows.map((row) => (
                <MovieRow key={row.title} title={row.title} movies={row.movies} />
              ))}
            </Suspense>
          )}
        </div>
      </div>
      </PageTransition>
    </>
  );
}
