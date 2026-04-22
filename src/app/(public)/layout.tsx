import './public.css';
import StickyHeader from './StickyHeader';


export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StickyHeader />
      <main>
        {children}
      </main>
      <footer className="footer" style={{ position: 'relative', overflow: 'hidden' }}>

        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-brand-name">Blog MENDOZA</div>
            <p>
              Retrouvez sur ce blog, des photos, des histoires, des anectodes, des voyages, et surtout du vintage !
            </p>
          </div>
          <div className="footer-col">
            <h4>Navigation</h4>
            <div className="footer-col-links">
              <a href="/">Accueil</a>
              <a href="/#blog">Articles</a>
              <a href="/#gallery">Moments de vie</a>
              <a href="/gallery">Galerie</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 delvinodevelopperVC — Tous droits réservés.</p>
          <div className="footer-socials">
            {/* Instagram Chloé */}
            <a href="https://instagram.com/vinot_chloe" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram Chloé">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            {/* Instagram Delvin */}
            <a href="https://instagram.com/delvin.trn" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram Delvin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
