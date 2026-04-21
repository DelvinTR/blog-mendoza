import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Securité : Seul Zapier/Make.com avec ce jeton pourra créer des articles
const WEBHOOK_SECRET = process.env.EVERNOTE_WEBHOOK_SECRET || 'super-secret-token-1234';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    // Vérification primitive du jeton secret
    if (!authHeader || authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, published } = body;

    // Validation des données requises
    if (!title || !content) {
      return NextResponse.json({ error: 'Missing title or content' }, { status: 400 });
    }

    // Création de l'article dans la base de données SQLite
    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        // Sauvegardé en "Brouillon" par défaut, à moins que Zapier n'envoie "true"
        published: published === true || published === 'true', 
      },
    });

    // Mettre à jour le cache de Next.js pour afficher le nouvel article instantanément
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/admin');

    return NextResponse.json({ success: true, articleId: newArticle.id }, { status: 201 });
  } catch (error) {
    console.error('Evernote Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
