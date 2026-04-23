import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/comments?articleId=xxx
export async function GET(req: NextRequest) {
  const articleId = req.nextUrl.searchParams.get('articleId');

  if (!articleId) {
    return NextResponse.json({ error: 'articleId is required' }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { articleId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(comments);
}

// POST /api/comments
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { articleId, author, content } = body;

    // Validation
    if (!articleId || typeof articleId !== 'string') {
      return NextResponse.json({ error: 'articleId est requis' }, { status: 400 });
    }
    if (!author || typeof author !== 'string' || author.trim().length === 0) {
      return NextResponse.json({ error: 'Un pseudo est requis' }, { status: 400 });
    }
    if (author.trim().length > 50) {
      return NextResponse.json({ error: 'Le pseudo ne peut pas dépasser 50 caractères' }, { status: 400 });
    }
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Le message ne peut pas être vide' }, { status: 400 });
    }
    if (content.trim().length > 1000) {
      return NextResponse.json({ error: 'Le message ne peut pas dépasser 1000 caractères' }, { status: 400 });
    }

    // Verify article exists
    const article = await prisma.article.findUnique({ where: { id: articleId } });
    if (!article) {
      return NextResponse.json({ error: 'Article introuvable' }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        author: author.trim(),
        content: content.trim(),
        articleId,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE /api/comments?id=xxx
export async function DELETE(req: NextRequest) {
  try {
    const commentId = req.nextUrl.searchParams.get('id');

    if (!commentId) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

