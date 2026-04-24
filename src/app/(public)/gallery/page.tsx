import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import ScrapbookGrid from './ScrapbookGrid';
export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  let photos: any[] = [];

  try {
    photos = await prisma.photo.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error("Erreur lors du chargement des photos:", error);
    // On continue avec un tableau vide pour ne pas faire planter le build
  }

  return (
    <article style={{ padding: '6% 5%', minHeight: '80vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background Decor */}


      <Link href="/" className="article-back-link" style={{ marginBottom: '3rem', display: 'inline-flex' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Retour à l&apos;accueil
      </Link>

      <h1 className="blog-list-title" style={{ marginBottom: '4rem' }}>Galerie</h1>

      {photos.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: '1.1rem', position: 'relative', zIndex: 10 }}>
          Aucune photo pour l&apos;instant — revenez bientôt !
        </p>
      ) : (
        <ScrapbookGrid photos={photos} />
      )}
    </article>
  );
}
