import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/comments/all — returns latest comments across all articles
export async function GET() {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
      select: {
        id: true,
        author: true,
        content: true,
      },
    });

    return NextResponse.json(comments);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
