"use client";
import { useState, useRef, useEffect } from 'react';

export default function ImageGallery({ images }: { images: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(index);
    }
  };

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      const clientWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: index * clientWidth,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="article-image-gallery">
      <div 
        ref={scrollRef}
        className="gallery-track"
      >
        {images.map((src, idx) => (
          <div key={idx} className="gallery-slide">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`Photo ${idx + 1}`} className="split-image" />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="gallery-dots">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`gallery-dot ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => scrollTo(idx)}
              aria-label={`Voir la photo ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
