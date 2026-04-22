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
            <div className="footer-brand-name">Vinot&apos;s Blog</div>
            <p>
              Voyages authentiques, photos captivantes et histoires inspirantes.
              Un regard vintage sur le monde d&apos;aujourd&apos;hui.
            </p>
          </div>
          <div className="footer-col">
            <h4>Navigation</h4>
            <div className="footer-col-links">
              <a href="/">Accueil</a>
              <a href="/#blog">Articles</a>
              <a href="/#gallery">Galerie</a>
              <a href="/gallery">Scrapbook</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>À propos</h4>
            <div className="footer-col-links">
              <a href="/">Le blog</a>
              <a href="/">L&apos;auteur</a>
              <a href="/admin">Admin</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Vinot&apos;s Blog — Tous droits réservés.</p>
          <div className="footer-socials">
            {/* Instagram */}
            <a href="#" className="footer-social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="5"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            {/* Twitter / X */}
            <a href="#" className="footer-social-link" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* Pinterest */}
            <a href="#" className="footer-social-link" aria-label="Pinterest">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.4 9.29-.09-.78-.17-1.98.03-2.83.19-.77 1.27-5.37 1.27-5.37s-.32-.65-.32-1.6c0-1.5.87-2.63 1.96-2.63.92 0 1.37.7 1.37 1.53 0 .93-.59 2.32-.9 3.61-.25 1.08.54 1.96 1.6 1.96 1.91 0 3.39-2.01 3.39-4.92 0-2.57-1.85-4.37-4.49-4.37-3.06 0-4.86 2.3-4.86 4.67 0 .92.36 1.91.8 2.45.09.11.1.21.07.32l-.3 1.21c-.05.2-.16.24-.37.14-1.39-.65-2.26-2.68-2.26-4.31 0-3.51 2.55-6.73 7.35-6.73 3.86 0 6.86 2.75 6.86 6.42 0 3.83-2.41 6.91-5.76 6.91-1.12 0-2.18-.58-2.54-1.27l-.69 2.59c-.25.96-.93 2.17-1.39 2.9.74.23 1.53.35 2.34.35 5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
