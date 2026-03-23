import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import ArticleCarousel from './ArticleCarousel';

const prisma = new PrismaClient();

export default async function HomePage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  });

  const latestPost = articles.length > 0 ? articles[0] : null;

  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Hero Section */}
      <section id="hero" style={{ padding: '6rem 5% 4rem 5%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center', backgroundColor: 'var(--bg-color)', borderBottom: '4px solid var(--text-primary)' }}>
        <div>
          <h1 style={{ fontSize: '4rem', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Vintage<br/>Exhibition
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem', maxWidth: '500px' }}>
            LOREM IPSUM DOLOR SIT AMET CONSECTETUR. AMET NUNC TINCIDUNT IN TRISTIQUE. SENECTUS ID TINCIDUNT TEMPUS LACUS TEMPOR NIBH EGESTAS SIT POSUERE.
          </p>
          <a href="#blog" className="vintage-btn">
            READ ADVENTURES
          </a>
        </div>
        
        {/* Telephone container */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px', margin: '0 auto', transform: 'rotate(5deg)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/phone.png" alt="Retro Phone" style={{ width: '100%', height: 'auto', display: 'block', filter: 'drop-shadow(10px 10px 0px var(--text-primary))' }} />
          
          {/* Screen Area (Absolute overlay) */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '18%',
            right: '18%',
            bottom: '41%',
            backgroundColor: '#fff',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            overflow: 'hidden',
            borderRadius: '4px',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
          }}>
            {latestPost ? (
              <>
                <div style={{ background: 'var(--accent-green)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', alignSelf: 'center', display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center', textTransform: 'uppercase' }}>
                  <span style={{ height: '8px', width: '8px', borderRadius: '50%', background: 'white', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
                  NEW MESSAGE
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.3, textTransform: 'none', textAlign: 'center' }}>
                    {latestPost.title}
                  </h3>
                </div>
                <Link href={`/blog/${latestPost.id}`} style={{ background: 'var(--accent-orange)', color: 'white', textDecoration: 'none', padding: '10px', textAlign: 'center', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem', width: '100%' }}>
                  OPEN ADVENTURE
                </Link>
              </>
            ) : (
              <div style={{ textAlign: 'center', margin: 'auto', color: '#999', fontSize: '0.9rem' }}>
                No posts yet
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Blog Feed Section */}
      <section id="blog" style={{ padding: '5rem 5%', backgroundColor: '#F3D4A0', borderBottom: '4px solid var(--text-primary)' }}>
        <ArticleCarousel articles={articles} />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
          <Link href="/blog" className="vintage-btn" style={{ fontSize: '1.2rem', padding: '0.8rem 2.5rem' }}>
            SHOW ALL
          </Link>
        </div>
      </section>

      {/* 3. Photo Gallery Section */}
      <section id="gallery" style={{ padding: '5rem 5% 8rem 5%', backgroundColor: '#EAD0A3' }}>
        <h2 style={{ textAlign: 'center', fontSize: '3.5rem', marginBottom: '4rem' }}>Photo Gallery</h2>
        
        {photos.length === 0 ? (
          <p style={{ textAlign: 'center' }}>Gallery is empty.</p>
        ) : (
          <div style={{ columnCount: 3, columnGap: '1.5rem' }}>
            {photos.map((photo: any, i: number) => (
              <div key={photo.id} className="vintage-card" style={{ 
                marginBottom: '1.5rem', 
                breakInside: 'avoid',
                padding: '1rem',
                backgroundColor: i % 3 === 0 ? 'var(--bg-color)' : i % 3 === 1 ? 'var(--accent-green)' : 'var(--accent-blue)'
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={photo.url} 
                  alt={photo.caption || 'Travel memory'} 
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    border: '2px solid var(--text-primary)',
                    display: 'block' 
                  }} 
                />
                {photo.caption && (
                  <p style={{ 
                    marginTop: '1rem', 
                    fontSize: '1.1rem',
                    textAlign: 'center'
                  }}>
                    {photo.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
