import { motion } from "framer-motion";
import { Star, Play, Info } from "lucide-react";
import { getImageUrl } from "@/api/tmdb";
import type { Movie } from "@/types/movie";

interface Props {
  movie: Movie;
}

const cardVariants = {
  rest: {},
  hover: {
    scale: 1.06,
    y: -6,
    zIndex: 10,
    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
    transition: { type: "spring" as const, stiffness: 400, damping: 30 },
  },
};

const overlayVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.2 } },
};

const actionsVariants = {
  rest: { opacity: 0, y: 8 },
  hover: { opacity: 1, y: 0, transition: { duration: 0.2, delay: 0.05 } },
};

const textVariants = {
  rest: { opacity: 0, y: 6 },
  hover: { opacity: 1, y: 0, transition: { duration: 0.25, delay: 0.08 } },
};

const ratingVariants = {
  rest: { opacity: 0, y: 6 },
  hover: { opacity: 1, y: 0, transition: { duration: 0.25, delay: 0.12 } },
};

export function MovieCard({ movie }: Props) {
  const title = movie.title ?? movie.name ?? "Untitled";
  const imageUrl = getImageUrl(movie.poster_path, "w342");
  const rating = movie.vote_average.toFixed(1);

  return (
    <motion.div
      className="relative flex-none cursor-pointer rounded-md overflow-hidden"
      style={{ width: 160, height: 240 }}
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
    >
      {/* Poster */}
      <img
        src={imageUrl}
        alt={title}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://via.placeholder.com/160x240/141414/808080?text=No+Image";
        }}
      />

      {/* Hover overlay — dark gradient, no backdrop-filter (keeps poster sharp) */}
      <motion.div
        className="absolute inset-0 movie-card-overlay flex flex-col justify-end p-3"
        variants={overlayVariants}
      >
        {/* Action buttons */}
        <motion.div
          className="mb-2 flex items-center gap-2"
          variants={actionsVariants}
        >
          <motion.button
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black
                       hover:bg-white/90 transition-colors"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Play"
          >
            <Play size={12} fill="black" />
          </motion.button>
          <motion.button
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/60
                       text-white hover:border-white transition-colors"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            aria-label="More info"
          >
            <Info size={12} />
          </motion.button>
        </motion.div>

        <motion.p
          className="line-clamp-2 text-xs font-semibold text-white leading-tight"
          variants={textVariants}
        >
          {title}
        </motion.p>
        <motion.div
          className="mt-1 flex items-center gap-1 text-yellow-400"
          variants={ratingVariants}
        >
          <Star size={10} fill="currentColor" />
          <span className="text-xs">{rating}</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
