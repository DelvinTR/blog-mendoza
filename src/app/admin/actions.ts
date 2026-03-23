'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function saveArticle(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const authorName = formData.get('authorName') as string;
  const authorAvatar = formData.get('authorAvatar') as string;
  const tags = formData.get('tags') as string;

  if (id) {
    await prisma.article.update({
      where: { id },
      data: { title, content, authorName, authorAvatar, tags },
    });
  } else {
    await prisma.article.create({
      data: { title, content, authorName, authorAvatar, tags },
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
