"use client";
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { parseTags } from '@/lib/utils';

export default function BlogCarouselClient({ articles }: { articles: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle scroll to update active dot
  const handleScroll = () => {
    if (containerRef.current) {
      const scrollY = containerRef.current.scrollTop;
      const height = containerRef.current.clientHeight;
      const index = Math.round(scrollY / height);
      setActiveIndex(index);
    }
  };

  const scrollTo = (index: number) => {
    if (containerRef.current) {
      const height = containerRef.current.clientHeight;
      containerRef.current.scrollTo({
        top: index * height,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="blog-fullscreen-carousel" ref={containerRef}>
      {/* Pagination Dots (petits points) */}
      <div className="blog-carousel-dots">
        {articles.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === activeIndex ? 'active' : ''}`}
            onClick={() => scrollTo(i)}
            aria-label={`Aller à l'article ${i + 1}`}
          />
        ))}
      </div>

      {articles.length === 0 ? (
        <div className="blog-carousel-empty">
          <h2>Aucune aventure pour le moment.</h2>
        </div>
      ) : null}

      {articles.map((article, index) => {
        const wordCount = article.content ? article.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length : 0;
        const readingTime = Math.max(1, Math.ceil(wordCount / 200));
        const tagsArray = parseTags(article.tags);

        return (
          <section key={article.id} className="blog-carousel-section">
            <div className="blog-carousel-layout">
              {/* Left: Image (image à gauche) */}
              <div className="blog-carousel-image-pane">
                {article.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={article.coverImage} alt={article.title} className="carousel-pan-image" />
                ) : (
                  <div className="carousel-pan-placeholder">
                    <span>✦</span>
                  </div>
                )}
                {/* Scrapbook detail on image */}
                <div className="image-washi-tape" />
                <div className="image-photo-corners" />
              </div>

              {/* Right: Text (texte scrollable) */}
              <div className="blog-carousel-text-pane">
                <div className="carousel-text-content">
                  
                  {/* Decorative Elements */}
                  <div className="scrapbook-stamp">
                    <span className="stamp-num">N° {String(index + 1).padStart(2, '0')}</span>
                    <span className="stamp-text">JOURNAL</span>
                  </div>

                  <div className="carousel-meta">
                    <div className="carousel-author-info">
                      {article.authorAvatar && (
                        <img src={article.authorAvatar} alt={article.authorName || 'Avatar'} className="carousel-author-avatar" />
                      )}
                      <span className="carousel-author-name">{article.authorName || 'Vinot'}</span>
                    </div>
                    <div className="carousel-meta-details">
                      <span className="meta-date">
                        {new Date(article.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span className="meta-sep">/</span>
                      <span className="meta-read">{readingTime} min de lecture</span>
                    </div>
                  </div>

                  <h2 className="carousel-article-title">{article.title}</h2>

                  {tagsArray.length > 0 && (
                    <div className="carousel-tags">
                      {tagsArray.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="carousel-tag">{tag}</span>
                      ))}
                    </div>
                  )}

                  <p className="carousel-excerpt">
                    {article.excerpt || "Découvrez mon dernier carnet de voyage avec plein d'anecdotes et de photos fantastiques."}
                  </p>

                  <Link href={`/blog/${article.id}`} className="carousel-read-btn">
                    Lire l'aventure <span>→</span>
                  </Link>
                  
                  {/* Background map or paper details */}
                  <div className="text-pane-bg-details" />
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
