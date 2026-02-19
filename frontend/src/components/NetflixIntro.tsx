import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onComplete: () => void;
}

export function NetflixIntro({ onComplete }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
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

  function handleVideoEnd() {
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
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener("ended", handleVideoEnd);
    video.addEventListener("error", () => {
      fallbackTimerRef.current = setTimeout(handleVideoEnd, 4000);
    });

    video.play().catch(() => {
      setNeedsTap(true);
      fallbackTimerRef.current = setTimeout(handleVideoEnd, 6000);
    });

    return () => {
      video.removeEventListener("ended", handleVideoEnd);
      video.pause();
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleTap() {
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    setNeedsTap(false);
    videoRef.current?.play().catch(() => {
      fallbackTimerRef.current = setTimeout(handleVideoEnd, 4000);
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
          <video
            ref={videoRef}
            src="/sounds/netflix.mp4"
            playsInline
            className="max-w-[400px] w-full"
          />
          {needsTap && (
            <motion.p
              className="absolute text-white/60 text-sm tracking-[0.3em] uppercase select-none"
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
