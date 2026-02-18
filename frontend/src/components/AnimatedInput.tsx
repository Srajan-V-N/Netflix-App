import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function AnimatedInput({ label, error, className, value, onChange, ...rest }: Props) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const hasValue = value !== undefined ? String(value).length > 0 : false;
  const floated = focused || hasValue;

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            "peer w-full rounded-xl px-4 pb-2 pt-6 text-sm text-white",
            "appearance-none outline-none",
            "bg-black/[0.42]",
            "border",
            focused
              ? "border-netflix-red/60"
              : error
                ? "border-red-500/60"
                : "border-white/[0.09] hover:border-white/20",
            "placeholder-transparent",
            className
          )}
          style={{
            boxShadow: focused
              ? "inset 0 2px 8px rgba(0,0,0,0.55), inset 0 1px 0 rgba(0,0,0,0.25), 0 0 0 2px rgba(229,9,20,0.22), 0 0 14px rgba(229,9,20,0.14)"
              : "inset 0 2px 8px rgba(0,0,0,0.55), inset 0 1px 0 rgba(0,0,0,0.25)",
            transition: "box-shadow 0.3s ease, border-color 0.3s ease",
          }}
          placeholder={label}
          {...rest}
        />
        <motion.label
          htmlFor={id}
          animate={floated ? "float" : "rest"}
          variants={{
            rest: { y: 0, scale: 1, color: "rgba(255,255,255,0.5)" },
            float: { y: -12, scale: 0.82, color: focused ? "#E50914" : "rgba(255,255,255,0.7)" },
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ originX: 0 }}
          className="pointer-events-none absolute left-4 top-4 text-sm font-medium"
        >
          {label}
        </motion.label>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1 text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
