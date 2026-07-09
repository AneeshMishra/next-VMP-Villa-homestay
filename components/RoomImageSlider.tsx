"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface RoomImage {
  src: string;
  alt: string;
}

interface Props {
  images: RoomImage[];
  badge?: string | null;
  badgeColor?: string | null;
  roomName: string;
}

export default function RoomImageSlider({ images, badge, badgeColor, roomName }: Props) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const lightboxPrev = useCallback(() => setLightboxIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const lightboxNext = useCallback(() => setLightboxIndex((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightboxPrev();
      if (e.key === "ArrowRight") lightboxNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, lightboxPrev, lightboxNext]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  return (
    <>
      {/* Slider */}
      <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
        {/* Main image */}
        <div
          className="relative w-full h-full cursor-zoom-in"
          onClick={() => openLightbox(current)}
        >
          <Image
            src={images[current].src}
            alt={images[current].alt}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={current === 0}
          />
        </div>

        {/* Badge */}
        {badge && (
          <div
            className="absolute top-4 left-4 text-white text-[10px] font-bold tracking-wide uppercase py-1 px-3 rounded z-10 pointer-events-none"
            style={{ background: badgeColor ?? undefined }}
          >
            {badge}
          </div>
        )}

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white scale-125" : "bg-white/50"}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 flex gap-1 p-1 bg-gradient-to-t from-black/60 to-transparent pt-6">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`relative flex-1 rounded overflow-hidden transition-all ${i === current ? "ring-2 ring-white" : "opacity-60 hover:opacity-90"}`}
                style={{ height: "48px" }}
                aria-label={`View image ${i + 1}`}
              >
                <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="25vw" />
              </button>
            ))}
          </div>
        )}

        {/* Zoom hint */}
        <div className="absolute top-3 right-3 z-10 bg-black/40 text-white text-[10px] px-2 py-1 rounded pointer-events-none">
          🔍 Tap to zoom
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 text-white text-3xl w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            ×
          </button>

          {/* Image */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {/* Left/right */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white text-2xl hover:bg-white/20 transition-colors"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white text-2xl hover:bg-white/20 transition-colors"
                aria-label="Next"
              >
                ›
              </button>
            </>
          )}

          {/* Caption + counter */}
          <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm">
            <div className="font-medium">{roomName}</div>
            <div className="text-white/50 text-xs mt-1">{images[lightboxIndex].alt} · {lightboxIndex + 1} / {images.length}</div>
          </div>
        </div>
      )}
    </>
  );
}
