'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveArticle(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string;
  const coverImage = formData.get('coverImage') as string;
  const bgImage = formData.get('bgImage') as string;
  const authorName = formData.get('authorName') as string;
  const authorAvatar = formData.get('authorAvatar') as string;
  const tags = formData.get('tags') as string;
  const published = formData.get('published') === 'true';
  const publishedAt = formData.get('publishedAt') ? new Date(formData.get('publishedAt') as string) : new Date();

  const data = { title, content, excerpt, coverImage, bgImage, authorName, authorAvatar, tags, published, publishedAt };

  if (id) {
    await prisma.article.update({
      where: { id },
      data,
    });
  } else {
    await prisma.article.create({
      data,
    });
  }

  revalidatePath('/admin');
  revalidatePath('/blog');
  revalidatePath('/');
  redirect('/admin');
}

export async function deleteArticle(id: string) {
  await prisma.article.delete({
    where: { id },
  });

  revalidatePath('/admin');
  revalidatePath('/blog');
  revalidatePath('/');
}
