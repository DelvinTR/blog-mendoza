import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReadingProgress from '../../ReadingProgress';
import NotebookReader from './NotebookReader';

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const article: any = await prisma.article.findUnique({
    where: { id },
  });

  if (!article || !article.published) {
    notFound();
  }

  const tagsArray = article.tags
    ? article.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
    : [];

  const formattedDate = new Date(article.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <ReadingProgress />

      {/* Back link — floating above the notebook scene */}
      <div style={{
        position: 'fixed',
        top: '100px',
        left: '24px',
        zIndex: 100,
      }}>
        <Link
          href="/blog"
          className="article-back-link"
          style={{
            marginBottom: 0,
            background: 'rgba(30,15,5,0.65)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            padding: '6px 16px',
            borderRadius: '24px',
            border: '1px solid rgba(253,232,196,0.15)',
            display: 'inline-flex',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Tous les articles
        </Link>
      </div>

      {/* The interactive notebook */}
      <NotebookReader
        title={article.title}
        content={article.content}
        bgImage={article.bgImage}
        authorName={article.authorName}
        date={formattedDate}
        tags={tagsArray}
      />
    </>
  );
}
