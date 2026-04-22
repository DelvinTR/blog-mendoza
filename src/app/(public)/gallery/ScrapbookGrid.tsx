"use client";

import { useState, useEffect } from 'react';

export default function ScrapbookGrid({ photos }: { photos: any[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Allow closing the lightbox with the Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    if (selectedImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
        {photos.map((photo: any, i: number) => {
          const rotation = i % 2 === 0 ? (i % 3 === 0 ? '-4deg' : '3deg') : (i % 5 === 0 ? '5deg' : '-2deg');
          const tapeType = i % 3 === 0 ? 'blue-yellow' : i % 3 === 1 ? 'pink' : 'green';
          
          return (
            <div 
              key={photo.id} 
              className="polaroid" 
              style={{ 
                width: '360px', 
                transform: `rotate(${rotation})`,
                cursor: 'zoom-in',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, z-index 0s',
                zIndex: 1,
              }}
              onClick={() => setSelectedImage(photo.url)}
              onMouseEnter={(e) => { 
                e.currentTarget.style.zIndex = '50'; 
                e.currentTarget.style.transform = `scale(1.05) rotate(0deg)`; 
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.zIndex = '1'; 
                e.currentTarget.style.transform = `rotate(${rotation})`; 
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div className={`tape ${tapeType}`}></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt={photo.caption || 'Photo de voyage'} style={{ width: '100%', display: 'block' }} />
              <div className="polaroid-caption">{photo.caption}</div>
            </div>
          );
        })}
      </div>

      {/* Fullscreen Lightbox */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(10, 5, 0, 0.90)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
            padding: '2rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {/* Close button icon */}
          <button 
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
            style={{ 
              position: 'absolute', 
              top: '20px', 
              right: '30px', 
              background: 'none', 
              border: 'none', 
              color: '#fdfaf3', 
              cursor: 'pointer',
              padding: '10px'
            }}
            aria-label="Fermer"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={selectedImage} 
            alt="Inspection" 
            onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking exactly on the image
            style={{ 
              maxWidth: '96%', 
              maxHeight: '94vh', 
              objectFit: 'contain', 
              border: '6px solid #fdfaf3', 
              borderRadius: '2px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }} 
          />

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleUp {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
