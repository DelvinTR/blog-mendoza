import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ArticleCarousel from './ArticleCarousel';
import RetroTvFrame from './RetroTvFrame';
import RetroCameraFrame from './RetroCameraFrame';
import HomePhotoSlider from './HomePhotoSlider';
import { StarSticker, PeaceSticker, FlowerSticker, SmileySticker } from './Stickers';

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
      <section id="hero" className="hero-section">
        <StarSticker top="12%" left="42%" size={140} rotation={15} stickerIndex={12} />
        <PeaceSticker bottom="35%" left="-30px" size={150} rotation={25} stickerIndex={19} />

        <div className="hero-content">
          <p className="hero-eyebrow">Blog de voyage vintage</p>
          <h1 className="hero-title">
            Vinot&apos;s Blog
          </h1>
          <p className="hero-subtitle">
            Explorez le monde à travers des récits authentiques, des photos captivantes et des aventures inspirantes. Un voyage vintage, une histoire à la fois.
          </p>
          <div className="hero-cta-group">
            <a href="#blog" className="vintage-btn">
              Lire les articles
            </a>
            <a href="#gallery" className="article-back-link" style={{ marginBottom: 0, fontSize: '0.88rem' }}>
              Voir la galerie
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Phone container */}
        <div className="hero-phone-wrapper">
          <div className="hero-phone-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/phone.png" alt="Retro Phone" className="hero-phone-img" />

            {/* Screen Area */}
            <div className={`hero-phone-screen ${latestPost?.coverImage ? 'has-bg' : ''}`}>
              {latestPost?.coverImage && (
                <div 
                  className="phone-screen-bg" 
                  style={{ backgroundImage: `url(${latestPost.coverImage})` }}
                />
              )}
              <div className="phone-screen-content">
                {latestPost ? (
                  <>
                    <div className="phone-new-badge">
                      <span className="phone-pulse-dot"></span>
                      Nouveau POST
                    </div>
                    <div className="phone-title">
                      <h3>{latestPost.title}</h3>
                    </div>
                    <Link href={`/blog/${latestPost.id}`} className="phone-cta">
                      Ouvrir l&apos;article
                    </Link>
                  </>
                ) : (
                  <div className="phone-empty">
                    Pas encore de post
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Blog Feed Section */}
      <section id="blog" className="blog-section">
        <PeaceSticker top="-5%" left="12%" size={160} rotation={-15} stickerIndex={2} />
        <SmileySticker bottom="-10%" right="8%" size={180} rotation={12} stickerIndex={17} />

        <div className="section-header">
          <p className="section-eyebrow">Articles récents</p>
          <h2 className="section-title">Aventures & Récits</h2>
          <p className="section-subtitle">Des histoires de voyage authentiques, racontées avec passion</p>
        </div>

        <RetroTvFrame>
          <ArticleCarousel articles={articles} />
        </RetroTvFrame>

        {/* Mobile: show carousel directly without TV */}
        <div className="mobile-carousel-fallback">
          <ArticleCarousel articles={articles} />
        </div>

        <div className="blog-section-cta">
          <Link href="/blog" className="vintage-btn">
            Voir tous les articles
          </Link>
        </div>
      </section>

      {/* 3. Photo Gallery Section — Camera Frame */}
      <section id="gallery" className="gallery-section">
        <StarSticker top="-8%" left="8%" size={170} rotation={10} stickerIndex={1} />
        <FlowerSticker top="60%" left="-30px" size={180} rotation={-8} stickerIndex={9} />
        <PeaceSticker bottom="-10%" right="-20px" size={150} rotation={35} stickerIndex={14} />

        <h2 className="gallery-title animate-fade-in-up">Galerie Photo</h2>

        <RetroCameraFrame>
          <HomePhotoSlider photos={photos.map(p => ({ id: p.id, url: p.url, caption: p.caption }))} />
        </RetroCameraFrame>

        <div className="gallery-section-cta">
          <Link href="/gallery" className="vintage-btn">
            Voir le scrapbook complet
          </Link>
        </div>
      </section>

    </div>
  );
}
