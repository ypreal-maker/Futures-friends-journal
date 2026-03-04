"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, MapPin, Calendar } from "lucide-react";
import { type Photo } from "@/data/photos";

interface DetailViewProps {
  photo: Photo | null;
  onClose: () => void;
}

export default function DetailView({ photo, onClose }: DetailViewProps) {
  useEffect(() => {
    if (photo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [photo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const getAspectRatio = (ar: string) => {
    switch (ar) {
      case "portrait": return "3/4";
      case "square": return "1/1";
      case "wide": return "21/9";
      default: return "16/9";
    }
  };

  return (
    <AnimatePresence>
      {photo && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl"
            onClick={onClose}
          />
          <motion.div
            key="detail-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-y-auto"
          >
            <div
              className="relative w-full max-w-6xl flex flex-col lg:flex-row gap-6 lg:gap-12 items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Shared Layout Image */}
              <motion.div
                layoutId={`photo-${photo.id}`}
                className="relative w-full lg:w-[55%] flex-shrink-0 overflow-hidden rounded-2xl"
                style={{ aspectRatio: getAspectRatio(photo.aspectRatio) }}
                transition={{ type: "spring", stiffness: 300, damping: 35, mass: 0.8 }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </motion.div>

              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full lg:w-[45%] flex flex-col gap-6 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-gold/60" />
                  <span className="text-[10px] tracking-[0.4em] text-gold/80 uppercase font-mono">{photo.category}</span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight">{photo.title}</h2>
                <p className="text-white/50 text-sm md:text-base leading-[1.9] font-light">{photo.narrative}</p>
                <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2 text-white/25">
                    <Calendar className="w-3 h-3" strokeWidth={1.5} />
                    <span className="text-xs font-mono tracking-widest">{photo.date}</span>
                  </div>
                  {photo.location && (
                    <div className="flex items-center gap-2 text-white/25">
                      <MapPin className="w-3 h-3" strokeWidth={1.5} />
                      <span className="text-xs font-mono tracking-widest">{photo.location}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="mt-4 flex items-center gap-2 text-white/30 hover:text-white/70 transition-colors group w-fit"
                >
                  <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" strokeWidth={1.5} />
                  <span className="text-xs tracking-[0.3em] uppercase font-mono">Close</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}