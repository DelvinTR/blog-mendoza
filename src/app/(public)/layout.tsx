import Link from 'next/link';
import './public.css';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="header">
        <Link href="/" className="header-logo">
          ✦ Vinot Blog ✦
        </Link>
        <nav className="nav-links">
          <Link href="/">Accueil</Link>
          <Link href="/#blog">Blog</Link>
          <Link href="/#gallery">Galerie</Link>
          <Link href="/admin" className="signin-btn">Admin</Link>
        </nav>
      </header>
      <main>
        {children}
      </main>
      <footer className="footer">
        <p>© 2026 Vinot Blog ALL RIGHTS RESERVED.</p>
      </footer>
    </>
  );
}
