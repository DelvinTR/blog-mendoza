import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article || !article.published) {
    notFound();
  }

  return (
    <article style={{ padding: '5%', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/blog" style={{ color: 'var(--accent-orange)', textDecoration: 'none', fontWeight: 'bold', marginBottom: '2rem', display: 'inline-block' }}>
        ← Back to Blog
      </Link>
      
      <h1 style={{ fontSize: '4rem', lineHeight: 1.1, marginBottom: '1rem' }}>{article.title}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontWeight: 'bold' }}>
        {new Date(article.createdAt).toLocaleDateString()}
      </p>

      <div 
        className="memimas-content"
        style={{ fontSize: '1.2rem', lineHeight: 1.8 }}
        dangerouslySetInnerHTML={{ __html: article.content }} 
      />
      
      <div style={{ marginTop: '5rem', borderTop: '2px solid var(--text-secondary)', paddingTop: '2rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Share this adventure</h3>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="vintage-btn" style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>Twitter</button>
          <button className="vintage-btn" style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>Facebook</button>
        </div>
      </div>
    </article>
  );
}
