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
      <div style={{ padding: '2rem 1rem' }}>
        <h2 className="carousel-header-title" style={{ marginBottom: '2rem' }}>Les derniers articles</h2>
        <p style={{ textAlign: 'center' }}>Pas encore d'articles.</p>
      </div>
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
            transition: 'transform 0.1s', padding: 0
          }}
          className="carousel-arrow"
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'scaleX(-1)', filter: 'drop-shadow(3px 3px 0px var(--text-primary))' }}>
            <polygon points="20,35 50,35 50,15 90,50 50,85 50,65 20,65" fill="var(--bg-color)" stroke="var(--text-primary)" strokeWidth="5" strokeLinejoin="miter" />
          </svg>
        </button>

        <h2 className="carousel-header-title" style={{ margin: '0 0.5rem' }}>
          Les derniers articles
        </h2>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', zIndex: 10,
            transition: 'transform 0.1s', padding: 0
          }}
          className="carousel-arrow"
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', filter: 'drop-shadow(3px 3px 0px var(--text-primary))' }}>
            <polygon points="20,35 50,35 50,15 90,50 50,85 50,65 20,65" fill="var(--bg-color)" stroke="var(--text-primary)" strokeWidth="5" strokeLinejoin="miter" />
          </svg>
        </button>

      </div>

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        className="carousel-cards-container hide-scrollbar"
      >
        {articles.map((article: any) => (
          <div
            key={article.id}
            className="vintage-card flex-carousel-card"
            style={{
              flex: '0 0 auto',
              scrollSnapAlign: 'start',
              display: 'flex',
              flexDirection: 'column',
              /* Apply ALL article tags to BLUE */
              backgroundColor: 'var(--accent-blue)'
            }}
          >
            <div className="carousel-card-img-wrapper" style={{ border: '2px solid var(--text-primary)', backgroundColor: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
              {article.coverImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={article.coverImage} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '2rem' }}>🌿</span>
              )}
            </div>
            <h2 className="carousel-card-title">{article.title}</h2>
            <div className="carousel-card-date" style={{ color: 'var(--bg-color)', fontWeight: 'bold' }}>
              {new Date(article.createdAt).toLocaleDateString()}
            </div>
            <Link href={`/blog/${article.id}`} className="vintage-btn carousel-btn" style={{ textAlign: 'center', width: '100%', marginTop: 'auto', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
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
