"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories, type Category } from "@/data/photos";

interface FloatingNavProps {
  activeCategory: Category | "All";
  onCategoryChange: (category: Category | "All") => void;
}

export default function FloatingNav({ activeCategory, onCategoryChange }: FloatingNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const allCategories: (Category | "All")[] = ["All", ...categories];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={cn(
          "fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-1 px-3 py-2 rounded-full transition-all duration-500",
          scrolled ? "glass bg-white/70 dark:bg-white/[0.03]" : "bg-transparent"
        )}
      >
        <div className="flex items-center gap-2 mr-4 pr-4 border-r border-black/10 dark:border-white/10">
          <PenTool className="w-4 h-4 text-gold" strokeWidth={1.5} />
          <span className="text-xs font-mono tracking-[0.2em] text-black/60 dark:text-white/60 uppercase">Journal</span>
        </div>
        {allCategories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "relative px-4 py-1.5 rounded-full text-xs tracking-widest uppercase transition-colors duration-300 font-medium",
              activeCategory === cat ? "text-obsidian" : "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white/80"
            )}
          >
            {activeCategory === cat && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-0 rounded-full bg-gold"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </motion.button>
        ))}
      </motion.nav>

      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="fixed top-4 left-4 right-4 z-50 flex md:hidden items-center justify-between px-4 py-3 rounded-2xl glass bg-white/80 dark:bg-white/[0.03]"
      >
        <div className="flex items-center gap-2">
          <PenTool className="w-4 h-4 text-gold" strokeWidth={1.5} />
          <span className="text-xs font-mono tracking-[0.2em] text-black/60 dark:text-white/60 uppercase">Journal</span>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </motion.div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-20 left-4 right-4 z-50 glass bg-white/95 dark:bg-[#1a1a1a] rounded-2xl p-4 md:hidden"
          >
            <div className="grid grid-cols-2 gap-2">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { onCategoryChange(cat); setMenuOpen(false); }}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-xs tracking-widest uppercase font-medium transition-all duration-200",
                    activeCategory === cat ? "bg-gold text-obsidian" : "text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
