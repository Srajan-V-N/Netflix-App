import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { NetflixIntro } from "@/components/NetflixIntro";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

// ─── Protected Route ─────────────────────────────────────────────
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// ─── Landing wrapper with intro gate ─────────────────────────────
function LandingWithIntro() {
  const [introPlayed, setIntroPlayed] = useState(
    () => !!sessionStorage.getItem("netflix_intro_played")
  );

  return (
    <>
      {/* Landing renders underneath — revealed when intro exits */}
      <Landing />

      {/* Intro overlay: fixed on top until animation completes */}
      <AnimatePresence>
        {!introPlayed && (
          <NetflixIntro
            onComplete={() => {
              sessionStorage.setItem("netflix_intro_played", "1");
              setIntroPlayed(true);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Animated Routes (needs location from router context) ─────────
function AnimatedRoutes() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <LandingWithIntro />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

// ─── Root App (must wrap with BrowserRouter BEFORE useAuth) ───────
function AppInner() {
  return <AnimatedRoutes />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
