import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const article: any = await prisma.article.findUnique({
    where: { id },
  });

  if (!article || !article.published) {
    notFound();
  }

  const tagsArray = article.tags ? article.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];

  return (
    <article style={{ padding: '8% 5%', maxWidth: '1400px', margin: '0 auto' }}>
      <Link href="/#blog" style={{ color: 'var(--accent-orange)', textDecoration: 'none', fontWeight: 'bold', marginBottom: '4rem', display: 'inline-block' }}>
        ← BROWSE ALL ADVENTURES
      </Link>
      
      <div className="article-grid">
        
        {/* Left Editorial Sidebar */}
        <aside className="article-sidebar">
          <h4>Author</h4>
          <div className="author-info">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.authorAvatar || '/phone.png'} alt={article.authorName || 'Author'} className="author-avatar" />
            <span>{article.authorName || 'Penny Lane'}</span>
          </div>

          <h4>Date</h4>
          <div className="date">
            {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>

          {tagsArray.length > 0 && (
            <>
              <br/><br/>
              <div className="tags">
                {tagsArray.map((tag: string) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </>
          )}
        </aside>

        {/* Main Content Wrapper */}
        <div className="article-content">
          <h1 style={{ fontSize: '5rem', lineHeight: 1.1, marginBottom: '4rem', color: 'var(--text-primary)', fontFamily: 'var(--font-righteous)', textTransform: 'uppercase' }}>
            {article.title}
          </h1>
          
          <div 
            className="memimas-content"
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />
        </div>

      </div>

      {/* Share Section */}
      <div style={{ marginTop: '8rem', borderTop: '4px solid var(--text-primary)', paddingTop: '4rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Share this adventure</h3>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="vintage-btn" style={{ padding: '0.8rem 2rem', fontSize: '1.2rem' }}>Twitter</button>
          <button className="vintage-btn" style={{ padding: '0.8rem 2rem', fontSize: '1.2rem' }}>Facebook</button>
        </div>
      </div>
    </article>
  );
}
