import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { StarSticker, PeaceSticker, FlowerSticker, SmileySticker } from '../Stickers';

const prisma = new PrismaClient();

export default async function GalleryPage() {
  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <article style={{ padding: '8% 5%', minHeight: '80vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background Decor */}
      <StarSticker top="5%" left="5%" color="var(--accent-orange)" size={80} rotation={15} />
      <SmileySticker top="20%" right="10%" color="var(--accent-green)" size={90} rotation={-15} />
      <PeaceSticker bottom="15%" left="8%" color="var(--accent-blue)" size={100} rotation={10} />
      <StarSticker bottom="25%" right="5%" color="#ff9eaa" size={60} rotation={45} />
      
      <Link href="/#gallery" style={{ color: 'var(--accent-orange)', textDecoration: 'none', fontWeight: 'bold', marginBottom: '4rem', display: 'inline-block', position: 'relative', zIndex: 10 }}>
        ← BACK TO HOME
      </Link>
      
      <h1 style={{ fontSize: '5rem', textAlign: 'center', marginBottom: '5rem', fontFamily: 'var(--font-righteous)', position: 'relative', zIndex: 10 }}>Full Scrapbook</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5rem', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
        {photos.map((photo: any, i: number) => {
          const rotation = i % 2 === 0 ? (i % 3 === 0 ? '-4deg' : '3deg') : (i % 5 === 0 ? '5deg' : '-2deg');
          const tapeType = i % 3 === 0 ? 'blue-yellow' : i % 3 === 1 ? 'pink' : 'green';
          
          return (
            <div key={photo.id} className="polaroid" style={{ width: '380px', transform: `rotate(${rotation})` }}>
              <div className={`tape ${tapeType}`}></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt={photo.caption} />
              <div className="polaroid-caption">{photo.caption}</div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
