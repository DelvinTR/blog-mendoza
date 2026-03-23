import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function PublicGallery() {
  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div style={{ padding: '5%' }}>
      <h1 style={{ fontSize: '3.5rem', textAlign: 'center', marginBottom: '4rem' }}>Photo Gallery</h1>
      
      {photos.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Gallery is empty.</p>
      ) : (
        <div style={{ 
          columnCount: 3, 
          columnGap: '1.5rem'
        }}>
          {photos.map((photo: any, i: number) => (
            <div key={photo.id} className="vintage-card" style={{ 
              marginBottom: '1.5rem', 
              breakInside: 'avoid',
              padding: '1rem',
              backgroundColor: i % 3 === 0 ? 'var(--bg-color)' : i % 3 === 1 ? 'var(--accent-pink)' : 'white'
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={photo.url} 
                alt={photo.caption || 'Travel memory'} 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  border: '2px solid var(--text-primary)',
                  display: 'block' 
                }} 
              />
              {photo.caption && (
                <p style={{ 
                  marginTop: '1rem', 
                  fontFamily: 'var(--font-righteous), cursive',
                  fontSize: '1.1rem',
                  textAlign: 'center'
                }}>
                  {photo.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
