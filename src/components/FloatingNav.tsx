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
      {/* 💡 Desktop Nav: 여백을 줄이고 더 슬림하게 만들어서 우측 버튼과 겹침 방지 */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={cn(
          "fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden lg:flex items-center gap-1 p-1.5 rounded-full transition-all duration-500 shadow-sm",
          scrolled ? "glass bg-white/80 dark:bg-white/[0.03]" : "bg-transparent"
        )}
      >
        <div className="flex items-center gap-1.5 mr-1 pr-3 pl-2 border-r border-black/10 dark:border-white/10">
          <PenTool className="w-3.5 h-3.5 text-gold" strokeWidth={1.5} />
          <span className="text-[10px] font-mono tracking-[0.2em] text-black/60 dark:text-white/60 uppercase">Journal</span>
        </div>
        {allCategories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "relative px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase transition-colors duration-300 font-medium whitespace-nowrap",
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

      {/* 💡 Mobile Nav: 우측 고정 버튼들과 겹치지 않게 좌측(left-6)으로 분리 */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="fixed top-6 left-6 z-50 flex lg:hidden items-center gap-3 px-4 py-2.5 rounded-full glass bg-white/90 dark:bg-white/[0.03] shadow-sm"
      >
        <div className="flex items-center gap-2">
          <PenTool className="w-4 h-4 text-gold" strokeWidth={1.5} />
          <span className="text-[10px] font-mono tracking-[0.2em] text-black/60 dark:text-white/60 uppercase">Journal</span>
        </div>
        <div className="w-px h-3 bg-black/10 dark:bg-white/10" />
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors p-0.5">
          {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </motion.div>

      {/* 💡 Mobile Menu Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-20 left-6 z-50 glass bg-white/95 dark:bg-[#1a1a1a] rounded-2xl p-3 lg:hidden shadow-xl w-[260px]"
          >
            <div className="flex flex-col gap-1">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { onCategoryChange(cat); setMenuOpen(false); }}
                  className={cn(
                    "px-4 py-3 rounded-xl text-xs tracking-widest uppercase font-medium transition-all duration-200 text-left",
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
