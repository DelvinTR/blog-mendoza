'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function saveArticle(formData: FormData) {
  const id = formData.get('id') as string | null;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const published = formData.get('published') === 'true';

  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  if (id) {
    await prisma.article.update({
      where: { id },
      data: { title, content, published },
    });
  } else {
    await prisma.article.create({
      data: { title, content, published },
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
