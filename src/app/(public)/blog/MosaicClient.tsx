"use client";
import Link from 'next/link';

export default function MosaicClient({ articles }: { articles: any[] }) {
  return (
    <div className="blog-mosaic-grid">
      {articles.map((article: any, i: number) => {
        const wordCount = article.content ? article.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length : 0;
        const readingTime = Math.max(1, Math.ceil(wordCount / 200));

        return (
          <Link
            href={`/blog/${article.id}`}
            key={article.id}
            className="mosaic-card"
            style={{ animationDelay: `${(i % 5) * 0.1}s` }}
          >
            {/* Cover Image */}
            <div className="mosaic-image-wrapper">
              {article.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={article.coverImage} alt={article.title} className="mosaic-image" />
              ) : (
                <div className="mosaic-placeholder">
                  <span>✦</span>
                </div>
              )}
              <div className="mosaic-overlay">
                <h2 className="mosaic-title">{article.title}</h2>
                <div className="mosaic-meta">
                  <span>{new Date(article.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                  <span>·</span>
                  <span>{readingTime} min</span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
