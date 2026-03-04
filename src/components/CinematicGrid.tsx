"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { type Photo, type Category } from "@/data/photos";
import { cn } from "@/lib/utils";
import DetailView from "./DetailView";

interface CinematicGridProps {
  photos: Photo[];
  activeCategory: Category | "All";
}

function PhotoCard({ photo, index, onClick }: { photo: Photo; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  const getColSpan = () => {
    if (photo.featured) return "md:col-span-2";
    if (photo.aspectRatio === "wide") return "md:col-span-2";
    return "col-span-1";
  };

  const getAspectClass = () => {
    switch (photo.aspectRatio) {
      case "portrait": return "aspect-[3/4]";
      case "square": return "aspect-square";
      case "wide": return "aspect-[21/9]";
      default: return "aspect-[4/3]";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={cn("group cursor-pointer", getColSpan())}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={cn("relative overflow-hidden rounded-xl", getAspectClass())}>
        {/* Shared Layout Image */}
        <motion.div layoutId={`photo-${photo.id}`} className="absolute inset-0">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </motion.div>

        {/* Hover overlay */}
        <motion.div
          initial={false}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
        />

        {/* Hover content */}
        <motion.div
          initial={false}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-0 right-0 p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-5 bg-gold/60" />
            <span className="text-[9px] tracking-[0.35em] text-gold/80 uppercase font-mono">{photo.category}</span>
          </div>
          <h3 className="font-serif text-lg text-white leading-tight mb-2">{photo.title}</h3>
          {photo.location && (
            <div className="flex items-center gap-1.5 text-white/40">
              <MapPin className="w-3 h-3" strokeWidth={1.5} />
              <span className="text-[10px] font-mono tracking-wider">{photo.location}</span>
            </div>
          )}
        </motion.div>

        {/* Corner accent */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-6 h-6 rounded-full glass-gold flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CinematicGrid({ photos, activeCategory }: CinematicGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const filteredPhotos = activeCategory === "All"
    ? photos
    : photos.filter((p) => p.category === activeCategory);

  return (
    <>
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
      >
        <AnimatePresence mode="popLayout">
          {filteredPhotos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              index={index}
              onClick={() => setSelectedPhoto(photo)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <DetailView photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </>
  );
}