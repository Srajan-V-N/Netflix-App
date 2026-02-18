import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
}

export function LiquidGlassCard({ children, className }: Props) {
  return (
    <div className={cn("liquid-glass", className)}>
      <div className="liquid-glass-inner">
        {children}
      </div>
      <div aria-hidden="true" className="grain-layer" />
    </div>
  );
}
