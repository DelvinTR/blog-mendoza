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
              /* Apply ALL article tags to BLUE */
              backgroundColor: 'var(--accent-blue)'
            }}
          >
            <div 
              style={{
                position: 'relative',
                minHeight: '260px',
                backgroundImage: article.coverImage ? `url(${article.coverImage})` : 'none',
                backgroundColor: 'var(--bg-color)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1.5rem 1.25rem',
                borderBottom: '4px solid var(--text-primary)',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.4)'
              }}
            >
              {/* Subtle dark gradient for text readability */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.8) 100%)',
                zIndex: 1
              }} />

              <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
                <h2 
                  className="carousel-card-title"
                  style={{
                    margin: 0,
                    fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
                    fontWeight: 900,
                    color: '#fff',
                    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                    textTransform: 'uppercase',
                    lineHeight: 1.1,
                    wordBreak: 'break-word',
                    minHeight: 'auto' // Ensure it expands as needed
                  }}
                >
                  {article.title}
                </h2>
                <div 
                  className="carousel-card-date"
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--accent-orange-light)',
                    marginTop: '0.5rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    opacity: 0.9
                  }}
                >
                  {new Date(article.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
            <Link 
              href={`/blog/${article.id}`} 
              className="vintage-btn carousel-card-btn" 
              style={{ 
                textAlign: 'center', 
                width: 'calc(100% - 2rem)', 
                margin: '1rem auto', 
                backgroundColor: 'var(--bg-color)', 
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                fontSize: '0.85rem',
                padding: '0.8rem 0.5rem',
                border: '2px solid var(--text-primary)',
                boxShadow: '4px 4px 0px var(--text-primary)'
              }}
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
