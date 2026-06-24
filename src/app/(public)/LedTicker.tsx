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

  // Fallback comments if none are in the database yet
  const displayComments = comments.length > 0 ? comments : [
    { id: "fallback-1", author: "Vinot", content: "Bienvenue sur l'aventure Mendoza ! Les commentaires défilent ici en temps réel." },
    { id: "fallback-2", author: "Chloé", content: "Un voyage vintage et des souvenirs inoubliables... Laissez vos impressions !" },
    { id: "fallback-3", author: "Marc", content: "Superbe blog ! L'ambiance vintage est parfaitement réussie." }
  ];

  // Build the ticker text: duplicate for seamless loop
  const tickerItems = displayComments.map(
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
