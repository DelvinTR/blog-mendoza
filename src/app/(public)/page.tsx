import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import ArticleCarousel from './ArticleCarousel';
import RetroTvFrame from './RetroTvFrame';
import { StarSticker, PeaceSticker, FlowerSticker, SmileySticker } from './Stickers';

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
      <section id="hero" style={{ padding: '6rem 5% 4rem 5%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center', backgroundColor: 'var(--bg-color)', borderBottom: '4px solid var(--text-primary)', position: 'relative' }}>

        <StarSticker top="10%" left="40%" color="var(--accent-green)" size={45} rotation={20} />
        <FlowerSticker bottom="8%" left="45%" color="var(--accent-blue)" size={70} rotation={-15} />

        <div>
          <h1 style={{ fontSize: '4rem', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Vinot's Blog ⭐
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem', maxWidth: '500px' }}>
            LOREM IPSUM DOLOR SIT AMET CONSECTETUR. AMET NUNC TINCIDUNT IN TRISTIQUE. SENECTUS ID TINCIDUNT TEMPUS LACUS TEMPOR NIBH EGESTAS SIT POSUERE.
          </p>
          <a href="#blog" className="vintage-btn">
            Lire les articles
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
                <div style={{ background: '#D9381E', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', alignSelf: 'center', display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center', textTransform: 'uppercase' }}>
                  <span style={{ height: '8px', width: '8px', borderRadius: '50%', background: 'white', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
                  Nouveau POST
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.3, textTransform: 'none', textAlign: 'center' }}>
                    {latestPost.title}
                  </h3>
                </div>
                <Link href={`/blog/${latestPost.id}`} style={{ background: 'var(--accent-orange)', color: 'white', textDecoration: 'none', padding: '10px', textAlign: 'center', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem', width: '100%' }}>
                  Ouvrir l'article
                </Link>
              </>
            ) : (
              <div style={{ textAlign: 'center', margin: 'auto', color: '#999', fontSize: '0.9rem' }}>
                Pas encore de post
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Blog Feed Section */}
      <section id="blog" style={{ padding: '5rem 5%', backgroundColor: 'var(--accent-green)', borderBottom: '4px solid var(--text-primary)', position: 'relative' }}>
        <PeaceSticker top="8%" left="15%" color="var(--accent-orange)" size={65} rotation={-10} />
        <SmileySticker bottom="10%" right="10%" color="var(--bg-color)" size={75} rotation={15} />

        <RetroTvFrame>
          <ArticleCarousel articles={articles} />
        </RetroTvFrame>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
          <Link href="/blog" className="vintage-btn" style={{ fontSize: '1.2rem', padding: '0.8rem 2.5rem' }}>
            Voir tous les articles
          </Link>
        </div>
      </section>

      {/* 3. Photo Gallery Section */}
      <section id="gallery" style={{ padding: '5rem 5% 8rem 5%', backgroundColor: 'var(--accent-blue)', position: 'relative', overflow: 'hidden' }}>
        <StarSticker top="-5%" left="10%" color="var(--accent-orange)" size={70} rotation={15} />
        <SmileySticker top="10%" right="15%" color="var(--accent-green)" size={60} rotation={-15} />
        <PeaceSticker bottom="5%" left="20%" color="var(--accent-blue)" size={80} rotation={10} />
        <StarSticker bottom="15%" right="10%" color="#ff9eaa" size={50} rotation={45} />
        <FlowerSticker top="45%" left="-20px" color="var(--bg-color)" size={90} rotation={-5} />
        <SmileySticker top="55%" right="-10px" color="var(--accent-orange)" size={70} rotation={25} />

        <h2 style={{ textAlign: 'center', fontSize: '3.5rem', marginBottom: '4rem', position: 'relative', zIndex: 10 }}>Galerie</h2>

        {photos.length === 0 ? (
          <p style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>La gallerie est vide :(</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
            {photos.map((photo: any, i: number) => {
              const rotation = i % 2 === 0 ? (i % 3 === 0 ? '-4deg' : '3deg') : (i % 5 === 0 ? '5deg' : '-2deg');
              const tapeType = i % 3 === 0 ? 'blue-yellow' : i % 3 === 1 ? 'pink' : 'green';

              return (
                <div key={photo.id} className="polaroid" style={{ width: '300px', transform: `rotate(${rotation})` }}>
                  <div className={`tape ${tapeType}`}></div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt={photo.caption || 'Travel memory'} />
                  <div className="polaroid-caption">{photo.caption}</div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}
