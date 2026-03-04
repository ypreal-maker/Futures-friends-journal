"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FloatingNav from "@/components/FloatingNav";
import HeroSection from "@/components/HeroSection";
import CinematicGrid from "@/components/CinematicGrid";
import CategorySection from "@/components/CategorySection";
import { photos, categories, categoryDescriptions, type Category } from "@/data/photos";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");

  const filteredPhotos = activeCategory === "All"
    ? photos
    : photos.filter((p) => p.category === activeCategory);

  const photoCountByCategory = (cat: Category) => photos.filter((p) => p.category === cat).length;

  return (
    <main className="min-h-screen bg-obsidian">
      <FloatingNav activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      <HeroSection />

      {/* Gallery Section */}
      <section className="px-4 md:px-8 lg:px-16 xl:px-24 pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Category header when filtered */}
          {activeCategory !== "All" ? (
            <CategorySection
              category={activeCategory}
              description={categoryDescriptions[activeCategory]}
              count={photoCountByCategory(activeCategory)}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-gold/40" />
                <span className="text-[9px] tracking-[0.4em] text-gold/60 uppercase font-mono">Complete Archive</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-white/80 font-normal">
                All <span className="italic text-gradient">{photos.length}</span> frames
              </h2>
              <div className="mt-6 h-px bg-gradient-to-r from-white/[0.08] via-gold/20 to-transparent" />
            </motion.div>
          )}

          <CinematicGrid photos={filteredPhotos} activeCategory={activeCategory} />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 md:px-8 lg:px-16 xl:px-24 py-16 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-gold/30" />
            <span className="text-[9px] tracking-[0.4em] text-white/20 uppercase font-mono">Cinematic Journal</span>
          </div>
          <div className="flex items-center gap-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="text-[9px] tracking-[0.3em] text-white/15 hover:text-gold/60 uppercase font-mono transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-[9px] font-mono text-white/10 tracking-widest">
            {new Date().getFullYear()} — Private Archive
          </span>
        </div>
      </footer>
    </main>
  );
}