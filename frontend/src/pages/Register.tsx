import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AnimatedInput } from "@/components/AnimatedInput";
import { RippleButton } from "@/components/RippleButton";
import { PageTransition } from "@/components/PageTransition";
import { LiquidGlassCard } from "@/components/LiquidGlassCard";

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};
const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function Register() {
  const { register, isLoading, error, clearError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    await register({ name, email, password });
  }

  const displayError = localError ?? error;

  return (
    <PageTransition>
      <div className="auth-bg-register relative flex min-h-screen items-center justify-center px-4 py-8">

        {/* Drifting ambient glow — fixed behind everything, moves opposite direction */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
          <div className="auth-drift-glow-r" />
        </div>

        <motion.div
          className="relative z-10 w-full max-w-md"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <LiquidGlassCard variant="auth">
            <div className="p-8 md:p-10">
              <motion.div variants={staggerContainer} initial="initial" animate="animate">

                <motion.div variants={staggerItem} className="mb-8 text-center">
                  <h1
                    className="text-4xl tracking-[0.12em] text-netflix-red"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", textShadow: "0 0 30px rgba(229,9,20,0.6), 0 0 60px rgba(229,9,20,0.3)" }}
                  >
                    NETFLIX
                  </h1>
                  <p className="mt-2 text-sm text-white/50">Create your account</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div variants={staggerItem}>
                    <AnimatedInput
                      label="Full Name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <AnimatedInput
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </motion.div>

                  <motion.div variants={staggerItem} className="relative">
                    <AnimatedInput
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-4 text-white/40 hover:text-white/80 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <AnimatedInput
                      label="Confirm Password"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                  </motion.div>

                  {displayError && (
                    <motion.div
                      variants={staggerItem}
                      className="rounded-lg px-4 py-2 text-sm text-red-300"
                      style={{
                        background: "rgba(229,9,20,0.10)",
                        border: "1px solid rgba(229,9,20,0.30)",
                        boxShadow: "inset 0 0 8px 1px rgba(229,9,20,0.10)",
                      }}
                    >
                      {displayError}
                    </motion.div>
                  )}

                  <motion.div variants={staggerItem}>
                    <RippleButton
                      type="submit"
                      variant="primary"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 py-3"
                    >
                      {isLoading ? (
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <>
                          <UserPlus size={16} />
                          Create Account
                        </>
                      )}
                    </RippleButton>
                  </motion.div>
                </form>

                <motion.p variants={staggerItem} className="mt-6 text-center text-sm text-white/40">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-white hover:text-netflix-red transition-colors"
                  >
                    Sign in
                  </Link>
                </motion.p>

              </motion.div>
            </div>
          </LiquidGlassCard>
        </motion.div>
      </div>
    </PageTransition>
  );
}
