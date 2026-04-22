'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <button
        className="hamburger-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Ouvrir le menu"
      >
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>

      {isOpen && (
        <div className="mobile-nav-overlay">
          <button
            className="mobile-nav-close"
            onClick={() => setIsOpen(false)}
            aria-label="Fermer le menu"
          >
            ✕
          </button>
          <Link href="/" onClick={() => setIsOpen(false)}>Accueil</Link>
          <Link href="/#blog" onClick={() => setIsOpen(false)}>Blog</Link>
          <Link href="/#gallery" onClick={() => setIsOpen(false)}>Galerie</Link>
          <Link href="/admin" onClick={() => setIsOpen(false)} prefetch={false}>Admin</Link>
        </div>
      )}
    </>
  );
}
