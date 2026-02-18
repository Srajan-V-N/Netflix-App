import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useTransform, useScroll } from "framer-motion";
import { Bell, Search, ChevronDown, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user, logout } = useAuth();
  const { scrollY } = useScroll();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Background opacity: transparent at top, glass nav when scrolled
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <motion.nav
      className="fixed top-0 z-50 w-full"
      style={{ pointerEvents: "auto" }}
    >
      {/* Permanent top gradient — always visible regardless of scroll */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
      {/* Glass background that fades in on scroll */}
      <motion.div
        className="glass-nav absolute inset-0"
        style={{ opacity: bgOpacity }}
      />

      <div className="relative flex items-center justify-between px-4 py-4 md:px-12">
        {/* Logo */}
        <motion.a
          href="/"
          className="text-2xl tracking-wider text-netflix-red"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          NETFLIX
        </motion.a>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Search"
          >
            <Search size={20} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </motion.button>

          {/* Profile chip + dropdown */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <motion.button
                onClick={() => setDropdownOpen((v) => !v)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 glass-panel rounded-full px-3 py-1.5"
                aria-label="Profile menu"
                aria-expanded={dropdownOpen}
              >
                <img
                  src="/avatar.jpg"
                  alt="Profile"
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20"
                />
                <span className="hidden text-xs text-white/80 sm:block">
                  {user.name.split(" ")[0]}
                </span>
                <motion.div
                  animate={{ rotate: dropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={12} className="text-white/60" />
                </motion.div>
              </motion.button>

              {/* Dropdown panel */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 glassy-card w-44 rounded-xl p-1"
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    {/* User name header */}
                    <div className="px-3 py-2 text-xs text-white/50 border-b border-white/10">
                      {user.name}
                    </div>

                    {/* Account item */}
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm
                                 text-white/80 hover:text-white transition-colors"
                    >
                      <Settings size={14} />
                      Account
                    </motion.button>

                    {/* Sign out item */}
                    <motion.button
                      onClick={() => { setDropdownOpen(false); logout(); }}
                      whileHover={{ backgroundColor: "rgba(229,9,20,0.15)" }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm
                                 text-white/80 hover:text-netflix-red transition-colors"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
