import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { warmTMDB } from "@/hooks/useTMDB";
import { AnimatedInput } from "@/components/AnimatedInput";
import { RippleButton } from "@/components/RippleButton";
import { PageTransition } from "@/components/PageTransition";
import { LiquidGlassCard } from "@/components/LiquidGlassCard";

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function Login() {
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();
    await login({ email, password }, () => {
      warmTMDB();        // kick off TMDB fetch while video plays
      setShowIntro(true);
    });
  }

  return (
    <PageTransition>
      {showIntro && (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center">
          <video
            autoPlay
            playsInline
            src="/sounds/netflix.mp4"
            className="max-w-full max-h-full object-contain"
            onEnded={() => {
              sessionStorage.setItem("netflix_intro_played", "1");
              navigate("/");
            }}
            onError={() => {
              sessionStorage.setItem("netflix_intro_played", "1");
              navigate("/");
            }}
          />
        </div>
      )}
      <div className="auth-bg relative flex min-h-screen items-center justify-center px-4">

        {/* Drifting ambient glow — fixed behind everything */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
          <div className="auth-drift-glow" />
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
                  <p className="mt-2 text-sm text-white/50">Sign in to continue watching</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-5">
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
                      autoComplete="current-password"
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

                  {error && (
                    <motion.div
                      variants={staggerItem}
                      className="rounded-lg px-4 py-2 text-sm text-red-300"
                      style={{
                        background: "rgba(229,9,20,0.10)",
                        border: "1px solid rgba(229,9,20,0.30)",
                        boxShadow: "inset 0 0 8px 1px rgba(229,9,20,0.10)",
                      }}
                    >
                      {error}
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
                          <LogIn size={16} />
                          Sign In
                        </>
                      )}
                    </RippleButton>
                  </motion.div>
                </form>

                <motion.p variants={staggerItem} className="mt-6 text-center text-sm text-white/40">
                  New to Netflix?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-white hover:text-netflix-red transition-colors"
                  >
                    Sign up now
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
