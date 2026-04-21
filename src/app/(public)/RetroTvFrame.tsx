export default function RetroTvFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="retro-tv-wrapper">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/old-tv.png" alt="Vintage TV" className="retro-tv-img" />

      {/* Écran (Superposé à l'emplacement exact de la vitre de la télé) */}
      <div className="retro-tv-screen">
        {/* Scanlines layer for authentic CRT vibe */}
        <div className="retro-tv-scanlines"></div>

        {/* Le Contenu (Le Carrousel) vient s'insérer ici ! */}
        <div className="retro-tv-content">
          <div className="retro-tv-zoom">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
