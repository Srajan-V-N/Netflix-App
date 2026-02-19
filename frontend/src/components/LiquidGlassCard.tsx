import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
  variant?: "auth";
}

export function LiquidGlassCard({ children, className, variant }: Props) {
  if (variant === "auth") {
    return (
      <div className={cn("glassy-card-auth", className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn("liquid-glass", className)}>
      <div className="liquid-glass-inner">
        {children}
      </div>
      <div aria-hidden="true" className="grain-layer" />
    </div>
  );
}
