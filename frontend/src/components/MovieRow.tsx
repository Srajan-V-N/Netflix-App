import { useRef, memo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard } from "./MovieCard";
import type { Movie } from "@/types/movie";

interface Props {
  title: string;
  movies: Movie[];
}

export const MovieRow = memo(function MovieRow({ title, movies }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -480 : 480;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <motion.div
      className="mb-8 px-4 md:px-12"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <h2 className="mb-3 text-lg font-semibold text-white md:text-xl">{title}</h2>

      <div className="group relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2
                     opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>

        {/* Cards */}
        <div ref={scrollRef} className="movie-row-scroll">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2
                     opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} className="text-white" />
        </button>
      </div>
    </motion.div>
  );
});
