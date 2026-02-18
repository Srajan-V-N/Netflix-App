import { useTMDB } from "@/hooks/useTMDB";
import { HeroBanner } from "@/components/HeroBanner";
import { MovieRow } from "@/components/MovieRow";
import { SkeletonRow } from "@/components/SkeletonRow";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";

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
          <HeroBanner movies={heroes} />
        ) : null}

        {/* Movie Rows */}
        <div className="relative z-10 -mt-16 pb-16">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          ) : (
            rows.map((row) => (
              <MovieRow key={row.title} title={row.title} movies={row.movies} />
            ))
          )}
        </div>
      </div>
      </PageTransition>
    </>
  );
}
