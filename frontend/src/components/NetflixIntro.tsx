import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onComplete: () => void;
}

export function NetflixIntro({ onComplete }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasCompletedRef = useRef(false);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [needsTap, setNeedsTap] = useState(false);
  const [visible, setVisible] = useState(true);

  // Skip if already played this session
  useEffect(() => {
    if (sessionStorage.getItem("netflix_intro_played")) {
      onComplete();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAudioEnd() {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    setVisible(false);
    setTimeout(() => {
      sessionStorage.setItem("netflix_intro_played", "1");
      onComplete();
    }, 700);
  }

  useEffect(() => {
    const audio = new Audio("/sounds/netflix-ta-dum.mp3");
    audioRef.current = audio;

    audio.addEventListener("ended", handleAudioEnd);
    audio.addEventListener("error", () => {
      fallbackTimerRef.current = setTimeout(handleAudioEnd, 4000);
    });

    audio.play().catch(() => {
      setNeedsTap(true);
      fallbackTimerRef.current = setTimeout(handleAudioEnd, 6000);
    });

    return () => {
      audio.removeEventListener("ended", handleAudioEnd);
      audio.pause();
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleTap() {
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    setNeedsTap(false);
    audioRef.current?.play().catch(() => {
      fallbackTimerRef.current = setTimeout(handleAudioEnd, 4000);
    });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          onClick={needsTap ? handleTap : undefined}
          style={{ cursor: needsTap ? "pointer" : "default" }}
        >
          {needsTap && (
            <motion.p
              className="text-white/60 text-sm tracking-[0.3em] uppercase select-none"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
              Click to Enter
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
