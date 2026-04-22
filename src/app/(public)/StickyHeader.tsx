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
          BLOG MENDOZA
        </Link>
        <nav className="nav-links">
          <Link href="/">Accueil</Link>
          <Link href="/#blog">Articles</Link>
          <Link href="/#gallery">Moments de vie</Link>
          <Link href="/gallery">Galerie</Link>
          <Link href="/admin" className="signin-btn" prefetch={false}>Admin</Link>
        </nav>
        <MobileNav />
      </header>
      <div className="header-spacer" />
    </>
  );
}
