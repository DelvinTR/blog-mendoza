import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function HomePage() {
  const latestPost = await prisma.article.findFirst({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  });

  const featuredPosts = await prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    skip: latestPost ? 1 : 0,
    take: 3
  });

  return (
    <div style={{ padding: '5%', display: 'flex', flexDirection: 'column', gap: '4rem' }}>

      {/* Hero Section */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '4rem', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Vintage<br />Exhibition
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem', maxWidth: '500px' }}>
            LOREM IPSUM DOLOR SIT AMET CONSECTETUR. AMET NUNC TINCIDUNT IN TRISTIQUE. SENECTUS ID TINCIDUNT TEMPUS LACUS TEMPOR NIBH EGESTAS SIT POSUERE.
          </p>
          <Link href="/blog" className="vintage-btn">
            READ ADVENTURES
          </Link>
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
                <div style={{ background: '#ef4444', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', alignSelf: 'center', display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center', textTransform: 'uppercase' }}>
                  <span style={{ height: '8px', width: '8px', borderRadius: '50%', background: 'white', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
                  NEW MESSAGE
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.3, fontFamily: 'var(--font-inter), sans-serif', textTransform: 'none', textAlign: 'center' }}>
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

      {/* Featured Section */}
      {featuredPosts.length > 0 && (
        <section style={{ marginTop: '4rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem' }}>Latest From Blog</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '3rem' }}>
            {featuredPosts.map((post: any, i: number) => (
              <div key={post.id} className="vintage-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: i % 2 === 0 ? 'var(--bg-color)' : 'var(--accent-pink)' }}>
                <div style={{ border: '2px solid var(--text-primary)', height: '150px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '2rem' }}>📝</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{post.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <Link href={`/blog/${post.id}`} className="vintage-btn" style={{ textAlign: 'center', width: '100%', fontSize: '1rem', marginTop: 'auto' }}>READ</Link>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/blog" className="vintage-btn" style={{ padding: '0.5rem 4rem' }}>SHOW ALL</Link>
          </div>
        </section>
      )}

    </div>
  );
}
