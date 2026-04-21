'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileNav from './MobileNav';

export default function StickyHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <Link href="/" className="header-logo">
          Vinot&apos;s Blog
        </Link>
        <nav className="nav-links">
          <Link href="/">Accueil</Link>
          <Link href="/#blog">Articles</Link>
          <Link href="/#gallery">Galerie</Link>
          <Link href="/gallery">Scrapbook</Link>
          <Link href="/admin" className="signin-btn">Admin</Link>
        </nav>
        <MobileNav />
      </header>
      <div className="header-spacer" />
    </>
  );
}
