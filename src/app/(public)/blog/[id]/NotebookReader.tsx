'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import './ArticleNotebook.css';

interface NotebookReaderProps {
  title: string;
  content: string;
  bgImage?: string | null;
  authorName?: string | null;
  authorAvatar?: string | null;
  date: string;
  tags: string[];
}

export default function NotebookReader({
  title,
  content,
  bgImage,
  authorName,
  authorAvatar,
  date,
  tags,
}: NotebookReaderProps) {
  const [pages, setPages] = useState<string[]>([]);
  const [currentSpread, setCurrentSpread] = useState(0); // 0 = cover + page1, 1 = page2+3, ...
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState<'next' | 'prev'>('next');
  const [totalSpreads, setTotalSpreads] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const bookRef = useRef<HTMLDivElement>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const [viewWidth, setViewWidth] = useState(360);

  const [isMobile, setIsMobile] = useState(false);

  // Resize listener to adapt text column width
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const mobile = w <= 768;
      setIsMobile(mobile);
      if (mobile) {
        // Mobile padding is 28px each side => 56px total
        setViewWidth(Math.min(w - 56, 344)); 
      } else {
        // Desktop book is 880px / 2 = 440. Paddings = ~80px => 360px
        setViewWidth(360);
      }
    };
    handleResize(); // Initial calc
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!content) { setPages([]); return; }
    
    let isCancelled = false;

    const paginate = async () => {
      // 1. Wait for custom web fonts (Caveat) to load so text metrics are accurate
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const container = document.createElement('div');
      container.className = 'page-text'; // Important for CSS inheritance (images, etc)
      container.innerHTML = content;
      container.style.cssText = `position:absolute;visibility:hidden;width:${viewWidth}px;font-family:var(--font-caveat,cursive);font-size:19px;line-height:30px;padding:32px 40px;`;
      document.body.appendChild(container);

      // 2. Wait for all images inside the content to load to get true image heights
      const images = Array.from(container.querySelectorAll('img'));
      await Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }));

      if (isCancelled) {
        document.body.removeChild(container);
        return;
      }

      const PAGE_HEIGHT = 480; // Secure internal height to adapt to 600px locked height
      const pagesArr: string[] = [];
      let currentPageHTML = '';
      let currentHeight = 0;

      const nodes = Array.from(container.childNodes);

      const measureHTML = (html: string): number => {
        const probe = document.createElement('div');
        probe.className = 'page-text'; // Essential for images to get their 50% width style
        probe.style.cssText = `position:absolute;visibility:hidden;width:${viewWidth}px;font-family:var(--font-caveat,cursive);font-size:19px;line-height:30px;`;
        probe.innerHTML = html;
        document.body.appendChild(probe);
        const h = probe.offsetHeight + 30; // base margin matches grid
        document.body.removeChild(probe);
        return h;
      };

      const pushPage = () => {
        if (currentPageHTML !== '') {
          pagesArr.push(currentPageHTML);
          currentPageHTML = '';
          currentHeight = 0;
        }
      };

      const addHTML = (html: string, height: number) => {
        currentPageHTML += html;
        currentHeight += height;
      };

      for (const node of nodes) {
        // Skip empty text nodes
        if (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim()) continue;

        let nodeHTML = node instanceof Element ? node.outerHTML : `<p>${node.textContent}</p>`;
        let nodeHeight = measureHTML(nodeHTML);

        if (currentHeight + nodeHeight <= PAGE_HEIGHT) {
          addHTML(nodeHTML, nodeHeight);
        } else {
          if (currentHeight > 0) {
            pushPage();
          }

          if (nodeHeight <= PAGE_HEIGHT) {
            addHTML(nodeHTML, nodeHeight);
          } else {
            // Un paragraphe géant qui dépasse une page entière !
            if (node instanceof Element && node.tagName.toLowerCase() === 'p') {
              const words = (node.textContent || '').split(' ');
              let currentChunk = '';

              for (const word of words) {
                const testChunk = currentChunk ? `${currentChunk} ${word}` : word;
                const testHeight = measureHTML(`<p>${testChunk}</p>`);

                if (currentHeight + testHeight > PAGE_HEIGHT) {
                  if (currentChunk) {
                    addHTML(`<p>${currentChunk}</p>`, measureHTML(`<p>${currentChunk}</p>`));
                    pushPage();
                  }
                  currentChunk = word;
                } else {
                  currentChunk = testChunk;
                }
              }
              if (currentChunk.trim()) {
                addHTML(`<p>${currentChunk}</p>`, measureHTML(`<p>${currentChunk}</p>`));
              }
            } else {
              // Un autre élément géant (image), on le laisse passer
              addHTML(nodeHTML, nodeHeight);
            }
          }
        }
      }

      if (currentPageHTML) {
        // Append an end marker to the very last page
        currentPageHTML += '<div class="page-end-label-inline">fin</div>';
        pagesArr.push(currentPageHTML);
      }

      document.body.removeChild(container);
      setPages(pagesArr);
      const mobile = window.innerWidth <= 768;
      const spreadCount = mobile 
        ? (pagesArr.length + 1) 
        : (1 + Math.ceil(Math.max(0, pagesArr.length - 1) / 2));
      setTotalSpreads(spreadCount);
    };

    paginate();

    return () => { isCancelled = true; };
  }, [content, viewWidth]);

  const flip = useCallback((dir: 'next' | 'prev') => {
    if (isFlipping) return;
    if (dir === 'next' && currentSpread >= totalSpreads - 1) return;
    if (dir === 'prev' && currentSpread <= 0) return;

    if (reducedMotion) {
      setCurrentSpread(s => dir === 'next' ? s + 1 : s - 1);
      return;
    }

    setFlipDir(dir);
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSpread(s => dir === 'next' ? s + 1 : s - 1);
      setIsFlipping(false);
    }, 600);
  }, [isFlipping, currentSpread, totalSpreads, reducedMotion]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') flip('next');
      if (e.key === 'ArrowLeft') flip('prev');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [flip]);

  // Touch / swipe
  const touchStart = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 50) flip(dx < 0 ? 'next' : 'prev');
    touchStart.current = null;
  };

  // Get content for current spread
  // spread 0 = cover page (left=cover, right=page[0])
  // spread n = pages[2n-1] left, pages[2n] right
  const getLeftContent = (): { type: 'cover' | 'page' | 'blank'; html?: string; pageNum?: number } => {
    if (isMobile) return { type: 'blank' }; // On mobile, we only use the right page slot for simplicity
    if (currentSpread === 0) return { type: 'cover' };
    const idx = currentSpread * 2 - 1;
    return { type: 'page', html: pages[idx] || '', pageNum: idx + 1 };
  };
  const getRightContent = (): { type: 'cover' | 'blank' | 'page'; html?: string; pageNum?: number } => {
    if (isMobile) {
      if (currentSpread === 0) return { type: 'cover' };
      const idx = currentSpread - 1;
      return { type: 'page', html: pages[idx] || '', pageNum: idx + 1 };
    }
    if (currentSpread === 0) return { type: 'page', html: pages[0] || '', pageNum: 1 };
    const idx = currentSpread * 2;
    if (idx >= pages.length && !pages[idx]) return { type: 'blank' };
    return { type: 'page', html: pages[idx] || '', pageNum: idx + 1 };
  };

  const left = getLeftContent();
  const right = getRightContent();

  const flipClass = isFlipping ? (flipDir === 'next' ? 'flipping-next' : 'flipping-prev') : '';

  return (
    <div className="notebook-scene" aria-label="Article en format cahier">
      {/* Background photo */}
      {bgImage && (
        <div className="notebook-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bgImage} alt="" aria-hidden="true" className="notebook-bg-img" />
          <div className="notebook-bg-overlay" />
        </div>
      )}
      {!bgImage && <div className="notebook-bg notebook-bg-default" />}

      {/* Book */}
      <div
        ref={bookRef}
        className={`notebook-book ${flipClass}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="document"
      >

        {/* LEFT PAGE */}
        <div className="notebook-half notebook-left">
          <div className="notebook-page">
            {/* Ruled lines */}
            <div className="page-lines" aria-hidden="true" />
            <div className="page-margin-line" aria-hidden="true" />

            {left.type === 'cover' ? (
              <div className="page-cover-content">
                {/* Sticker-style title block */}
                <div className="cover-deco-dot" aria-hidden="true" />
                <div className="cover-brand">Vinot&apos;s Blog</div>
                <h1 className="cover-title">{title}</h1>
                <div className="cover-meta">
                  {authorAvatar && (
                    <div className="cover-avatar">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={authorAvatar} alt={authorName || 'Avatar'} />
                    </div>
                  )}
                  <span className="cover-author">{authorName || 'Penny Lane'}</span>
                  <span className="cover-sep">·</span>
                  <span className="cover-date">{date}</span>
                </div>
                {tags.length > 0 && (
                  <div className="cover-tags">
                    {tags.map(t => <span key={t} className="cover-tag">{t}</span>)}
                  </div>
                )}
                {/* Decorative doodle lines */}
                <svg className="cover-doodle" viewBox="0 0 200 60" fill="none" aria-hidden="true">
                  <path d="M10 30 Q30 10 50 30 Q70 50 90 30 Q110 10 130 30 Q150 50 170 30 Q190 10 200 30" stroke="rgba(160,120,80,0.35)" strokeWidth="1.5" fill="none"/>
                  <path d="M10 40 Q30 20 50 40 Q70 60 90 40 Q110 20 130 40 Q150 60 170 40" stroke="rgba(160,120,80,0.2)" strokeWidth="1" fill="none"/>
                </svg>
              </div>
            ) : (
              <div className="page-content">
                {left.pageNum && (
                  <div className="page-number page-number-left">{left.pageNum}</div>
                )}
                <div
                  className="page-text"
                  dangerouslySetInnerHTML={{ __html: left.html || '' }}
                />
              </div>
            )}

            {/* Page corner fold shadow */}
            <div className="page-corner-left" aria-hidden="true" />
          </div>
        </div>

        {/* CENTER SPINE */}
        <div className="notebook-spine" aria-hidden="true">
          <div className="spine-wire" />
        </div>

        {/* RIGHT PAGE */}
        <div className="notebook-half notebook-right">
          <div className="notebook-page">
            <div className="page-lines" aria-hidden="true" />
            <div className="page-margin-line" aria-hidden="true" />
            
            {right.type === 'cover' && (
              <div className="page-cover-content">
                <div className="cover-deco-dot" aria-hidden="true" />
                <div className="cover-brand">Vinot&apos;s Blog</div>
                <h1 className="cover-title">{title}</h1>
                <div className="cover-meta">
                  {authorAvatar && (
                    <div className="cover-avatar">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={authorAvatar} alt={authorName || 'Avatar'} />
                    </div>
                  )}
                  <span className="cover-author">{authorName || 'Penny Lane'}</span>
                  <span className="cover-sep">·</span>
                  <span className="cover-date">{date}</span>
                </div>
                {tags.length > 0 && (
                  <div className="cover-tags">
                    {tags.map(t => <span key={t} className="cover-tag">{t}</span>)}
                  </div>
                )}
                <svg className="cover-doodle" viewBox="0 0 200 60" fill="none" aria-hidden="true">
                  <path d="M10 30 Q30 10 50 30 Q70 50 90 30 Q110 10 130 30 Q150 50 170 30 Q190 10 200 30" stroke="rgba(160,120,80,0.35)" strokeWidth="1.5" fill="none"/>
                </svg>
              </div>
            )}

            {right.type === 'blank' ? (
              <div className="page-blank">
                <svg className="page-blank-label-doodle" viewBox="0 0 120 120" fill="none" aria-hidden="true">
                  <circle cx="60" cy="60" r="40" stroke="rgba(160,120,80,0.1)" strokeWidth="1" strokeDasharray="4 4"/>
                </svg>
              </div>
            ) : (
              <div className="page-content">
                {right.pageNum && (
                  <div className="page-number page-number-right">{right.pageNum}</div>
                )}
                <div
                  className="page-text"
                  dangerouslySetInnerHTML={{ __html: right.html || '' }}
                />
              </div>
            )}

            <div className="page-corner-right" aria-hidden="true" />
          </div>
        </div>

        {/* FLIP ANIMATION LAYER */}
        {isFlipping && (
          <div className={`notebook-flap ${flipDir === 'next' ? 'flap-next' : 'flap-prev'}`} aria-hidden="true">
            <div className="notebook-page flap-page">
              <div className="page-lines" />
              <div className="page-margin-line" />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="notebook-nav" aria-label="Navigation du cahier">
        <button
          className="notebook-nav-btn"
          onClick={() => flip('prev')}
          disabled={currentSpread === 0 || isFlipping}
          aria-label="Page précédente"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          <span>Précédent</span>
        </button>

        {/* Dots */}
        <div className="notebook-dots" role="tablist" aria-label="Pages">
          {Array.from({ length: totalSpreads }).map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === currentSpread}
              className={`notebook-dot ${i === currentSpread ? 'active' : ''}`}
              onClick={() => {
                if (!isFlipping) {
                  const dir = i > currentSpread ? 'next' : 'prev';
                  setFlipDir(dir);
                  if (!reducedMotion) {
                    setIsFlipping(true);
                    setTimeout(() => { setCurrentSpread(i); setIsFlipping(false); }, 600);
                  } else {
                    setCurrentSpread(i);
                  }
                }
              }}
              aria-label={`Aller à la page ${i + 1}`}
            />
          ))}
        </div>

        <button
          className="notebook-nav-btn"
          onClick={() => flip('next')}
          disabled={currentSpread >= totalSpreads - 1 || isFlipping}
          aria-label="Page suivante"
        >
          <span>Suivant</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </nav>

      {/* Keyboard hint */}
      <p className="notebook-hint" aria-live="polite">
        Utilisez <kbd>←</kbd> <kbd>→</kbd> pour tourner les pages · Glissez sur mobile
      </p>
    </div>
  );
}
