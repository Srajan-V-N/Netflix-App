import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info } from "lucide-react";
import { getImageUrl } from "@/api/tmdb";
import { RippleButton } from "./RippleButton";
import type { Movie } from "@/types/movie";

interface Props {
  movies: Movie[];
}

const contentVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function HeroBanner({ movies }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-cycle every 6 seconds
  useEffect(() => {
    if (movies.length <= 1) return;
    const t = setInterval(() => {
      setActiveIndex((i) => (i + 1) % movies.length);
    }, 6000);
    return () => clearInterval(t);
  }, [movies.length]);

  if (movies.length === 0) return null;

  const movie = movies[activeIndex];
  const title = movie.title ?? movie.name ?? "Untitled";
  const backdropUrl = getImageUrl(movie.backdrop_path, "original");

  return (
    <div className="relative h-[85vh] min-h-[500px] overflow-hidden bg-netflix-dark">
      {/* Crossfading background */}
      <AnimatePresence mode="sync">
        <motion.div
          key={activeIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-[-40px]">
            <img
              src={backdropUrl}
              alt={title}
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="hero-gradient absolute inset-0 z-[1]" />

      {/* Content re-animates per movie */}
      <motion.div
        key={`content-${activeIndex}`}
        className="absolute bottom-[15%] left-4 z-[2] max-w-xl px-4 md:left-12 md:px-0"
        variants={contentVariants}
        initial="hidden"
        animate="show"
      >
        <motion.h1
          variants={itemVariants}
          className="mb-4 text-3xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl"
          style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 4px 40px rgba(0,0,0,0.5)" }}
        >
          {title}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mb-6 line-clamp-3 text-sm text-gray-200 md:text-base"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}
        >
          {movie.overview}
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
          <RippleButton variant="primary" className="flex items-center gap-2 px-8">
            <Play size={18} fill="white" />
            Play
          </RippleButton>
          <RippleButton variant="ghost" className="flex items-center gap-2 px-6">
            <Info size={18} />
            More Info
          </RippleButton>
        </motion.div>
      </motion.div>

      {/* Progress dots */}
      {movies.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-[2] flex -translate-x-1/2 gap-2">
          {movies.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-8 bg-netflix-red"
                  : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
