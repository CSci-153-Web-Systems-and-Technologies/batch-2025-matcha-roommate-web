"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomImageGalleryProps {
  images: string[] | null;
  title: string;
}

export function RoomImageGallery({ images, title }: RoomImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Safety Check: If no images, show a placeholder
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center text-gray-400 gap-2">
        <ImageIcon className="w-12 h-12 opacity-50" />
        <span className="text-sm font-medium">No photos provided</span>
      </div>
    );
  }

  // 2. Navigation Handlers
  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link clicks if wrapped
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-full group bg-gray-100">
      {/* Active Image */}
      <Image
        src={images[currentIndex]}
        alt={`${title} - Image ${currentIndex + 1}`}
        fill
        className="object-cover transition-opacity duration-300"
        priority
      />

      {/* Navigation Controls (Only render if > 1 image) */}
      {images.length > 1 && (
        <>
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentIndex(idx);
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all shadow-sm",
                  idx === currentIndex ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"
                )}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
          
          {/* Image Counter Badge (Optional but helpful) */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}