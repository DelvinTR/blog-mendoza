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
          ✦ Vintage.com
        </Link>
        <nav className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/admin" className="signin-btn">Admin</Link>
        </nav>
      </header>
      <main>
        {children}
      </main>
      <footer className="footer">
        <p>© 2026 VINTAGE.COM ALL RIGHTS RESERVED.</p>
        <div className="footer-links">
          <Link href="#">TERMS</Link>
          <Link href="#">PRIVACY</Link>
          <Link href="#">COOKIES</Link>
        </div>
      </footer>
    </>
  );
}
