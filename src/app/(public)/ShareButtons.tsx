'use client';

import { useCallback } from 'react';

export default function ShareButtons({ title }: { title: string }) {
  const shareOnTwitter = useCallback(() => {
    const url = window.location.href;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer,width=600,height=400'
    );
  }, [title]);

  const shareOnFacebook = useCallback(() => {
    const url = window.location.href;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer,width=600,height=400'
    );
  }, []);

  return (
    <div className="share-buttons">
      <button className="vintage-btn share-btn" onClick={shareOnTwitter} type="button">
        𝕏 Twitter
      </button>
      <button className="vintage-btn share-btn" onClick={shareOnFacebook} type="button">
        📘 Facebook
      </button>
    </div>
  );
}
