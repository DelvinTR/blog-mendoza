export default function RetroTvFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '1100px', margin: '2rem auto', transform: 'rotate(-1deg)' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/old-tv.png" alt="Vintage TV" style={{ width: '100%', display: 'block', filter: 'drop-shadow(15px 15px 0px var(--text-primary))' }} />

      {/* Écran (Superposé à l'emplacement exact de la vitre de la télé) */}
      <div style={{
        position: 'absolute',
        top: '13%',
        left: '11%',
        right: '24%', /* Laisse la place pour les boutons à droite */
        bottom: '22%',
        backgroundColor: '#ffffffff',
        overflow: 'hidden',
        borderRadius: '1% / 1%', /* Légère courbe */
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
      }}>
        {/* Scanlines layer for authentic CRT vibe */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(rgba(0,0,0,0.03) 0px, transparent 2px, transparent 4px)', zIndex: 40 }}></div>

        {/* Le Contenu (Le Carrousel) vient s'insérer ici ! */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          zoom: 0.75 /* Effet de dezoom visuel */
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
