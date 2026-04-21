"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  caption: string | null;
}

export default function HomePhotoSlider({ photos }: { photos: Photo[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Restart auto-advance when user clicks
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (photos.length > 1) {
      timerRef.current = setInterval(goNext, 3500);
    }
  }, [goNext, photos.length]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const handleNextClick = () => {
    goNext();
    resetTimer();
  };

  const handlePrevClick = () => {
    goPrev();
    resetTimer();
  };

  if (photos.length === 0) {
    return (
      <div className="camera-slider-empty">
        <span>📷</span>
        <p>Pas encore de photos</p>
      </div>
    );
  }

  return (
    <div className="camera-slider">
      {photos.map((photo, i) => (
        <div
          key={photo.id}
          className={`camera-slider-slide ${i === currentIndex ? 'active' : ''}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.url} alt={photo.caption || 'Photo de voyage'} />
        </div>
      ))}

      {/* Navigation Arrows */}
      {photos.length > 1 && (
        <>
          <button className="camera-slider-btn prev" onClick={handlePrevClick} aria-label="Photo précédente">
            <ChevronLeft size={20} />
          </button>
          <button className="camera-slider-btn next" onClick={handleNextClick} aria-label="Photo suivante">
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Counter badge */}
      <div className="camera-slider-counter">
        {currentIndex + 1}/{photos.length}
      </div>

      {/* Caption */}
      {photos[currentIndex]?.caption && (
        <div className="camera-slider-caption">
          {photos[currentIndex].caption}
        </div>
      )}
    </div>
  );
}
