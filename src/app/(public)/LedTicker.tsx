"use client";

import { useEffect, useState, useRef } from "react";

interface TickerComment {
  id: string;
  author: string;
  content: string;
}

export default function LedTicker() {
  const [comments, setComments] = useState<TickerComment[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchAllComments() {
      try {
        // Fetch comments from all articles
        const res = await fetch("/api/comments/all");
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch {
        // silently fail
      }
    }
    fetchAllComments();
  }, []);

  if (comments.length === 0) return null;

  // Build the ticker text: duplicate for seamless loop
  const tickerItems = comments.map(
    (c) => `${c.author}: "${c.content}"`
  );

  return (
    <div className="led-ticker" aria-label="Commentaires des lecteurs" role="marquee">
      {/* LED frame decoration */}
      <div className="led-ticker-frame">
        {/* Corner LEDs */}
        <span className="led-ticker-dot led-ticker-dot--tl" />
        <span className="led-ticker-dot led-ticker-dot--tr" />
        <span className="led-ticker-dot led-ticker-dot--bl" />
        <span className="led-ticker-dot led-ticker-dot--br" />

        {/* Label */}
        <span className="led-ticker-label">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" className="led-ticker-record">
            <circle cx="5" cy="5" r="5" />
          </svg>
          EN DIRECT
        </span>

        {/* Scrolling track */}
        <div className="led-ticker-viewport">
          <div className="led-ticker-track" ref={trackRef}>
            {/* Render items twice for seamless infinite loop */}
            {[...tickerItems, ...tickerItems].map((text, i) => (
              <span key={i} className="led-ticker-item">
                <span className="led-ticker-separator">★</span>
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
