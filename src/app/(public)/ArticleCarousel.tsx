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
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 5vw, 3.5rem)', marginBottom: 'max(2rem, 4vw)' }}>Les derniers articles</h2>
        <p style={{ textAlign: 'center' }}>Pas encore d'articles.</p>
      </>
    );
  }

  return (
    <div style={{ width: '100%', padding: '0 1rem' }}>

      {/* Title & Navigation Arrows Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>

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
          <svg viewBox="0 0 100 100" style={{ width: 'clamp(30px, 8vw, 60px)', height: 'clamp(30px, 8vw, 60px)', transform: 'scaleX(-1)', filter: 'drop-shadow(5px 5px 0px var(--text-primary))' }}>
            <polygon points="20,35 50,35 50,15 90,50 50,85 50,65 20,65" fill="var(--bg-color)" stroke="var(--text-primary)" strokeWidth="5" strokeLinejoin="miter" />
          </svg>
        </button>

        <h2 style={{ fontSize: 'clamp(1.2rem, 6vw, 3.5rem)', margin: '0 1rem', textAlign: 'center', color: '#2E434F', lineHeight: 1.1 }}>
          Les derniers articles
        </h2>

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
          <svg viewBox="0 0 100 100" style={{ width: 'clamp(30px, 8vw, 60px)', height: 'clamp(30px, 8vw, 60px)', filter: 'drop-shadow(5px 5px 0px var(--text-primary))' }}>
            <polygon points="20,35 50,35 50,15 90,50 50,85 50,65 20,65" fill="var(--bg-color)" stroke="var(--text-primary)" strokeWidth="5" strokeLinejoin="miter" />
          </svg>
        </button>

      </div>

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          gap: '2.5rem',
          paddingBottom: '2rem',
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none'  /* IE 10+ */
        }}
        className="hide-scrollbar"
      >
        {articles.map((article: any) => (
          <div
            key={article.id}
            className="vintage-card article-card"
            style={{
              flex: '0 0 auto',
              width: 'clamp(280px, 70vw, 320px)',
              height: 'clamp(380px, 80vh, 420px)',
              scrollSnapAlign: 'start',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              /* Apply ALL article tags to BLUE */
              backgroundColor: 'var(--accent-blue)',
              overflow: 'hidden'
            }}
          >
            <div style={{ border: '2px solid var(--text-primary)', height: 'clamp(140px, 20vw, 180px)', backgroundColor: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
              {article.coverImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={article.coverImage} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '3rem' }}>🌿</span>
              )}
            </div>
            <h2 style={{ fontSize: 'clamp(1rem, 3.5vw, 1.5rem)', minHeight: '3.5rem', lineHeight: 1.2 }}>{article.title}</h2>
            <div style={{ fontSize: '0.9rem', color: 'var(--bg-color)', fontWeight: 'bold' }}>
              {new Date(article.createdAt).toLocaleDateString()}
            </div>
            <Link href={`/blog/${article.id}`} className="vintage-btn" style={{ textAlign: 'center', width: '100%', fontSize: '1rem', marginTop: 'auto', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
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
