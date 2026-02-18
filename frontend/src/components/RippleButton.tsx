import { useRef, type ReactNode, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

export function RippleButton({ children, className, variant = "primary", onClick, ...rest }: Props) {
  const btnRef = useRef<HTMLButtonElement>(null);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = btnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const span = document.createElement("span");
    span.className = "ripple-span";
    span.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
    btn.appendChild(span);
    span.addEventListener("animationend", () => span.remove());

    onClick?.(e);
  }

  const variantClasses = {
    primary:
      "bg-netflix-red hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-900/30",
    secondary:
      "bg-white/90 hover:bg-white text-black font-semibold",
    ghost:
      "bg-white/10 hover:bg-white/20 text-white border border-white/20",
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      className={cn(
        "ripple-container relative px-6 py-3 rounded-lg transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-netflix-red",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
