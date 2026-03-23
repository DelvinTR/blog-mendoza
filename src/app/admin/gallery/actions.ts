'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { put, del } from '@vercel/blob';

const prisma = new PrismaClient();

export async function uploadPhoto(formData: FormData) {
  const photo = formData.get('photo') as File;
  const caption = formData.get('caption') as string;

  if (!photo) return;

  const blob = await put(photo.name, photo, { access: 'public' });
  const url = blob.url;

  await prisma.photo.create({
    data: { url, caption },
  });

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
  return { url };
}

export async function deletePhoto(id: string, url: string) {
  await prisma.photo.delete({
    where: { id },
  });

  try {
    // Delete from Vercel Blob
    await del(url);
  } catch (err) {}

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
}
