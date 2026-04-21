import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { StarSticker, PeaceSticker, FlowerSticker, SmileySticker } from '../Stickers';

export default async function GalleryPage() {
  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <article style={{ padding: '6% 5%', minHeight: '80vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background Decor */}
      <StarSticker top="-18%" left="-40px" size={140} rotation={12} stickerIndex={5} />
      <SmileySticker top="12%" right="-20px" size={160} rotation={-18} stickerIndex={13} />
      <FlowerSticker top="55%" left="-20px" size={130} rotation={-10} stickerIndex={0} />
      <StarSticker bottom="15%" right="-30px" size={150} rotation={35} stickerIndex={7} />
      
      <Link href="/" className="article-back-link" style={{ marginBottom: '3rem', display: 'inline-flex' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Retour à l&apos;accueil
      </Link>
      
      <h1 className="blog-list-title" style={{ marginBottom: '4rem' }}>Scrapbook Complet</h1>

      {photos.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: '1.1rem', position: 'relative', zIndex: 10 }}>
          Aucune photo pour l&apos;instant — revenez bientôt !
        </p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
          {photos.map((photo: any, i: number) => {
            const rotation = i % 2 === 0 ? (i % 3 === 0 ? '-4deg' : '3deg') : (i % 5 === 0 ? '5deg' : '-2deg');
            const tapeType = i % 3 === 0 ? 'blue-yellow' : i % 3 === 1 ? 'pink' : 'green';
            
            return (
              <div key={photo.id} className="polaroid" style={{ width: '360px', transform: `rotate(${rotation})` }}>
                <div className={`tape ${tapeType}`}></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.caption || 'Photo de voyage'} />
                <div className="polaroid-caption">{photo.caption}</div>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}
