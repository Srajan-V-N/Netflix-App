import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  heavy?: boolean;
}

export function GlassCard({ children, className, heavy = false }: Props) {
  return (
    <div className={cn(heavy ? "glassy-card" : "glass-panel rounded-xl", className)}>
      {children}
    </div>
  );
}
