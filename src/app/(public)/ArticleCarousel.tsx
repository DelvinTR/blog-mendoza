"use client";
import Link from 'next/link';
import { useRef } from 'react';

export default function ArticleCarousel({ articles }: { articles: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  if (articles.length === 0) {
    return (
      <>
        <h2 className="carousel-empty-title" style={{ textAlign: 'center' }}>Les derniers articles</h2>
        <p style={{ textAlign: 'center' }}>Pas encore d'articles.</p>
      </>
    );
  }

  return (
    <div style={{ width: '100%', padding: '0 1rem' }}>

      {/* Title & Navigation Arrows Header */}
      <div className="carousel-header-wrapper">

        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', zIndex: 10,
            transition: 'transform 0.1s'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg width="60" height="60" viewBox="0 0 100 100" style={{ transform: 'scaleX(-1)', filter: 'drop-shadow(5px 5px 0px var(--text-primary))' }}>
            <polygon points="20,35 50,35 50,15 90,50 50,85 50,65 20,65" fill="var(--bg-color)" stroke="var(--text-primary)" strokeWidth="5" strokeLinejoin="miter" />
          </svg>
        </button>

        <h2 className="carousel-title">Les derniers articles</h2>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', zIndex: 10,
            transition: 'transform 0.1s'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg width="60" height="60" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(5px 5px 0px var(--text-primary))' }}>
            <polygon points="20,35 50,35 50,15 90,50 50,85 50,65 20,65" fill="var(--bg-color)" stroke="var(--text-primary)" strokeWidth="5" strokeLinejoin="miter" />
          </svg>
        </button>

      </div>

      <div
        ref={scrollRef}
        className="carousel-scroll-container hide-scrollbar"
      >
        {articles.map((article: any) => (
          <div
            key={article.id}
            className="vintage-card carousel-card"
            style={{
              backgroundColor: 'var(--accent-blue)',
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              height: '100%' // Ensure card fills height
            }}
          >
            <div 
              style={{
                position: 'relative',
                flex: 1, // Fill the card
                minHeight: '220px',
                backgroundImage: article.coverImage ? `url(${article.coverImage})` : 'none',
                backgroundColor: 'var(--bg-color)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1rem'
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 100%)',
                zIndex: 1
              }} />

              <div style={{ position: 'relative', zIndex: 2, width: '100%', overflow: 'hidden' }}>
                <h2 
                  className="carousel-card-title"
                  style={{
                    margin: 0,
                    fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
                    fontFamily: 'var(--font-editorial)',
                    fontWeight: 500,
                    color: '#fff',
                    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                    textTransform: 'none',
                    lineHeight: 1.1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {article.title}
                </h2>
                <div 
                  className="carousel-card-date"
                  style={{
                    fontSize: 'clamp(0.6rem, 2vw, 0.75rem)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.8)',
                    marginTop: '0.15rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {new Date(article.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
            
            <Link 
              href={`/blog/${article.id}`} 
              className="vintage-btn carousel-action-btn"
            >
              LIRE L'ARTICLE
            </Link>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
