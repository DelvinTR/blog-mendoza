"use client";
import { useState, useEffect, useCallback } from 'react';

interface Photo {
  id: string;
  url: string;
  caption: string | null;
}

export default function CameraCarousel({ photos }: { photos: Photo[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  const goTo = useCallback((index: number) => {
    if (isTransitioning || photos.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, photos.length]);

  const goNext = useCallback(() => {
    goTo((currentIndex + 1) % photos.length);
  }, [currentIndex, photos.length, goTo]);

  const goPrev = useCallback(() => {
    goTo((currentIndex - 1 + photos.length) % photos.length);
  }, [currentIndex, photos.length, goTo]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || photos.length <= 1) return;
    const interval = setInterval(goNext, 4000);
    return () => clearInterval(interval);
  }, [autoPlay, goNext, photos.length]);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goNext();
    } else if (isRightSwipe) {
      goPrev();
    }
  };

  if (photos.length === 0) return null;

  return (
    <div
      className="camera-carousel-section"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Left Arrow */}
      <button
        className="camera-nav-arrow camera-nav-prev"
        onClick={goPrev}
        aria-label="Photo précédente"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Camera Body */}
      <div className="camera-wrapper">
        <div className="camera-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/camera.png" alt="Appareil photo" className="camera-img" />

          {/* Screen Area */}
          <div className="camera-screen">
            <div className="camera-screen-inner">
              {photos.map((photo, i) => (
                <div
                  key={photo.id}
                  className={`camera-slide ${i === currentIndex ? 'active' : ''} ${
                    i === (currentIndex - 1 + photos.length) % photos.length ? 'prev' : ''
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt={photo.caption || 'Photo de voyage'} />
                </div>
              ))}

              {/* Photo counter */}
              <div className="camera-counter">
                <span>{String(currentIndex + 1).padStart(2, '0')}</span>
                <span className="camera-counter-sep">/</span>
                <span>{String(photos.length).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Arrow */}
      <button
        className="camera-nav-arrow camera-nav-next"
        onClick={goNext}
        aria-label="Photo suivante"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </button>

      {/* Dots */}
      <div className="camera-dots">
        {photos.map((_, i) => (
          <button
            key={i}
            className={`camera-dot ${i === currentIndex ? 'active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Photo ${i + 1}`}
          />
        ))}
      </div>

      {/* Caption */}
      {photos[currentIndex]?.caption && (
        <div className="camera-caption-bar" key={currentIndex}>
          <span className="camera-caption-icon">📸</span>
          <p className="camera-caption-text">{photos[currentIndex].caption}</p>
        </div>
      )}
    </div>
  );
}
