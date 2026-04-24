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
                height: '240px',
                backgroundImage: article.coverImage ? `url(${article.coverImage})` : 'none',
                backgroundColor: 'var(--bg-color)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1.25rem',
                borderBottom: '2px solid var(--text-primary)'
              }}
            >
              {/* Subtle dark gradient for text readability */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 100%)',
                zIndex: 1
              }} />

              <div style={{ position: 'relative', zIndex: 2 }}>
                <h2 
                  className="carousel-card-title"
                  style={{
                    margin: 0,
                    fontSize: '1rem', // Reduced from 1.4rem
                    fontWeight: 900,
                    color: '#fff',
                    textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                    textTransform: 'uppercase',
                    lineHeight: 1.1
                  }}
                >
                  {article.title}
                </h2>
                <div 
                  className="carousel-card-date"
                  style={{
                    fontSize: '0.7rem', // Reduced from 0.85rem
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.8)',
                    marginTop: '0.15rem',
                    letterSpacing: '0.02em'
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
                alignSelf: 'center',
                width: 'fit-content', 
                marginTop: 'auto', 
                marginBottom: '0.75rem',
                backgroundColor: 'var(--bg-color)', 
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                fontSize: '0.75rem', // Reduced from 0.85rem
                padding: '0.4rem 0.8rem', // Thinner
                borderRadius: '2px',
                boxShadow: 'none', // Removed orange rectangle/shadow
                border: '1px solid var(--text-primary)'
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
