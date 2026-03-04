"use client";

import { motion } from "framer-motion";
import { type Category } from "@/data/photos";

interface CategorySectionProps {
  category: Category;
  description: string;
  count: number;
}

export default function CategorySection({ category, description, count }: CategorySectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8 md:mb-12"
    >
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-gold/40" />
            <span className="text-[9px] tracking-[0.4em] text-gold/60 uppercase font-mono">Collection</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white/90 font-normal">{category}</h2>
          <p className="text-white/30 text-sm mt-2 font-light italic max-w-md">{description}</p>
        </div>
        <div className="text-right hidden md:block">
          <span className="font-mono text-4xl text-white/[0.06] font-bold">
            {String(count).padStart(2, "0")}
          </span>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-white/[0.08] via-gold/20 to-transparent" />
    </motion.div>
  );
}