import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ArticleCarousel from './ArticleCarousel';
import RetroTvFrame from './RetroTvFrame';
import RetroCameraFrame from './RetroCameraFrame';
import HomePhotoSlider from './HomePhotoSlider';


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


        <div className="hero-content">
          <p className="hero-eyebrow">Quête secondaire :</p>
          <h1 className="hero-title">
            AVENTURE MENDOZA
          </h1>
          <p className="hero-subtitle">
            Retrouvez sur ce blog, des photos, des histoires, des anectodes, des voyages, et surtout du vintage !
          </p>
          <div className="hero-cta-group">
            <a href="#blog" className="vintage-btn">
              Lire les articles
            </a>
            <a href="#gallery" className="article-back-link" style={{ marginBottom: 0, fontSize: '0.88rem' }}>
              Voir la galerie
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
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


        <div className="section-header">
          <p className="section-eyebrow">Articles récents</p>
          <h2 className="section-title">Aventures & Récits</h2>
          <p className="section-subtitle">Des histoires de voyage et de vie, racontées par Vinot</p>
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


        <h2 className="gallery-title animate-fade-in-up">Moments de vie</h2>

        <RetroCameraFrame>
          <HomePhotoSlider photos={photos.map(p => ({ id: p.id, url: p.url, caption: p.caption }))} />
        </RetroCameraFrame>

        <div className="gallery-section-cta">
          <Link href="/gallery" className="vintage-btn">
            Voir toutes les photos
          </Link>
        </div>
      </section>

    </div>
  );
}
