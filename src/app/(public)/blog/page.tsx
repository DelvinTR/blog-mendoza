import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function BlogFeed() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div style={{ padding: '5%' }}>
      <h1 style={{ fontSize: '3.5rem', textAlign: 'center', marginBottom: '4rem' }}>All Adventures</h1>
      
      {articles.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No articles published yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '3rem' }}>
          {articles.map((article: any, i: number) => (
            <div key={article.id} className="vintage-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: i%2===0 ? 'var(--bg-color)' : 'var(--accent-pink)' }}>
              <div style={{ border: '2px solid var(--text-primary)', height: '180px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '3rem' }}>📷</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', minHeight: '3rem' }}>{article.title}</h2>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {new Date(article.createdAt).toLocaleDateString()}
              </div>
              <Link href={`/blog/${article.id}`} className="vintage-btn" style={{ textAlign: 'center', width: '100%', fontSize: '1rem', marginTop: 'auto' }}>
                READ
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
