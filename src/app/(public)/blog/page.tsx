import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { parseTags } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function BlogFeed() {
  let articles: any[] = [];

  try {
    articles = await prisma.article.findMany({
      where: { 
        published: true,
        publishedAt: { lte: new Date() }
      },
      orderBy: { publishedAt: 'desc' },
    });
  } catch (error) {
    console.error("Erreur lors du chargement des articles:", error);
    // On continue avec un tableau vide
  }

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
            const tagsArray = parseTags(article.tags);

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
                    <div className="blog-card-author">
                      {article.authorAvatar && (
                        <img 
                          src={article.authorAvatar} 
                          alt={article.authorName || 'Avatar'} 
                          className="blog-card-author-avatar" 
                        />
                      )}
                      <span className="blog-card-author-name">{article.authorName || 'Vinot'}</span>
                    </div>
                    <div className="blog-card-meta-group">
                      <span className="blog-card-meta">
                        {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
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
