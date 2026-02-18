import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, MotionValue } from "framer-motion";

interface ParallaxValues {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  scrollY: MotionValue<number>;
}

export function useParallax(): ParallaxValues {
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const scrollYRaw = useMotionValue(0);

  const mouseX = useSpring(rawMouseX, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(rawMouseY, { stiffness: 50, damping: 20 });
  const scrollY = useSpring(scrollYRaw, { stiffness: 80, damping: 20 });

  const rafRef = useRef<number>(0);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const xPct = (e.clientX / window.innerWidth - 0.5) * 2;
        const yPct = (e.clientY / window.innerHeight - 0.5) * 2;
        rawMouseX.set(xPct * 20);
        rawMouseY.set(yPct * 10);
      });
    }

    function onScroll() {
      scrollYRaw.set(window.scrollY);
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [rawMouseX, rawMouseY, scrollYRaw]);

  return { mouseX, mouseY, scrollY };
}
