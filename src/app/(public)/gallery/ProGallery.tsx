"use client";
import { useState, useEffect, useCallback } from 'react';

interface Photo {
  id: string;
  url: string;
  caption: string | null;
}

export default function ProGallery({ photos }: { photos: Photo[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'recent' | 'older'>('all');

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null));
  }, [lightboxIndex, photos.length]);

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null));
  }, [lightboxIndex, photos.length]);

  // Keyboard nav
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, goNext, goPrev]);

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
      {/* Filter Bar */}
      <div className="pro-gallery-filters">
        <button
          className={`pro-gallery-filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Toutes
        </button>
        <button
          className={`pro-gallery-filter-btn ${filter === 'recent' ? 'active' : ''}`}
          onClick={() => setFilter('recent')}
        >
          Récentes
        </button>
        <button
          className={`pro-gallery-filter-btn ${filter === 'older' ? 'active' : ''}`}
          onClick={() => setFilter('older')}
        >
          Anciennes
        </button>
        <span className="pro-gallery-count">{photos.length} photos</span>
      </div>

      {/* Masonry Grid */}
      <div className="pro-gallery-grid">
        {photos.map((photo, i) => {
          // Determine size class for visual variety
          const sizeClass = i % 7 === 0 ? 'pro-gallery-item--tall' :
                            i % 5 === 0 ? 'pro-gallery-item--wide' : '';

          return (
            <div
              key={photo.id}
              className={`pro-gallery-item ${sizeClass}`}
              style={{ animationDelay: `${Math.min(i * 0.06, 1.2)}s` }}
              onClick={() => openLightbox(i)}
            >
              <div className="pro-gallery-item-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.caption || 'Souvenir de voyage'}
                  loading="lazy"
                />
                <div className="pro-gallery-item-overlay">
                  <div className="pro-gallery-item-overlay-top">
                    <span className="pro-gallery-item-number">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="pro-gallery-item-overlay-bottom">
                    {photo.caption && (
                      <p className="pro-gallery-item-caption">{photo.caption}</p>
                    )}
                    <div className="pro-gallery-item-expand">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div 
          className="pro-lightbox" 
          onClick={closeLightbox}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="pro-lightbox-inner" onClick={(e) => e.stopPropagation()}>

            {/* Close */}
            <button className="pro-lightbox-close" onClick={closeLightbox} aria-label="Fermer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Prev */}
            <button className="pro-lightbox-arrow pro-lightbox-prev" onClick={goPrev} aria-label="Précédent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Image */}
            <div className="pro-lightbox-image-container" key={lightboxIndex}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photos[lightboxIndex].url}
                alt={photos[lightboxIndex].caption || 'Photo'}
                className="pro-lightbox-img"
              />
            </div>

            {/* Next */}
            <button className="pro-lightbox-arrow pro-lightbox-next" onClick={goNext} aria-label="Suivant">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </button>

            {/* Bottom info */}
            <div className="pro-lightbox-info">
              <span className="pro-lightbox-counter">
                {lightboxIndex + 1} / {photos.length}
              </span>
              {photos[lightboxIndex].caption && (
                <p className="pro-lightbox-caption">{photos[lightboxIndex].caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
