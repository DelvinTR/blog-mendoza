import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function BlogFeed() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="blog-list-page">
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-sm)' }}>
        <p className="section-eyebrow">Journal de voyage</p>
      </div>
      <h1 className="blog-list-title">Tous les articles</h1>

      {articles.length === 0 ? (
        <p style={{
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-body)',
          fontSize: '1.1rem',
          marginTop: 'var(--space-2xl)'
        }}>
          Aucun article publié pour l&apos;instant — revenez bientôt !
        </p>
      ) : (
        <div className="blog-list-grid">
          {articles.map((article: any, i: number) => {
            const tagsArray = article.tags
              ? article.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
              : [];

            return (
              <Link
                key={article.id}
                href={`/blog/${article.id}`}
                className="blog-list-card"
                style={{ textDecoration: 'none', animationDelay: `${i * 0.08}s` }}
              >
                {/* Cover */}
                <div className="blog-card-cover-wrapper">
                  {article.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="blog-card-cover"
                    />
                  ) : (
                    <div className="blog-card-cover-placeholder">
                      {/* Placeholder SVG — no emoji */}
                      <svg
                        className="blog-card-cover-placeholder-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
                        <circle cx="12" cy="13" r="3" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="blog-card-body">
                  {tagsArray.length > 0 && (
                    <div className="blog-card-tags">
                      {tagsArray.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="blog-card-tag">{tag}</span>
                      ))}
                    </div>
                  )}

                  <h2 className="blog-card-title">{article.title}</h2>

                  {article.excerpt && (
                    <p className="blog-card-excerpt">{article.excerpt}</p>
                  )}

                  <div className="blog-card-footer">
                    <span className="blog-card-meta">
                      {new Date(article.createdAt).toLocaleDateString('fr-FR', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="blog-card-read-btn">
                      Lire
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
