'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { put, del } from '@vercel/blob';
import { writeFile } from 'fs/promises';
import { join } from 'path';

/**
 * Generic image upload helper. 
 * Uses Vercel Blob in production, or falls back to local /public/uploads in development.
 */
export async function uploadImageOnly(formData: FormData) {
  const photo = formData.get('photo') as File;
  if (!photo) return { error: 'Aucun fichier fourni' };

  // Fallback for local development if Vercel Blob is not configured
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    if (process.env.NODE_ENV === 'development') {
      try {
        const bytes = await photo.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${photo.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        // Ensure the uploads directory exists (we can rely on the fact that public/uploads exists, or create it)
        const filepath = join(process.cwd(), 'public', 'uploads', filename);
        await writeFile(filepath, buffer);
        return { url: `/uploads/${filename}` };
      } catch (err: any) {
        return { error: `Erreur d'upload local: ${err.message}` };
      }
    }
    return { error: "Vercel Blob: BLOB_READ_WRITE_TOKEN manquant dans le .env." };
  }

  try {
    const blob = await put(photo.name, photo, { access: 'public', addRandomSuffix: true });
    return { url: blob.url };
  } catch (err: any) {
    return { error: `Erreur Vercel Blob: ${err.message}` };
  }
}

/**
 * Uploads to gallery AND saves to the database.
 */
export async function uploadPhoto(formData: FormData) {
  const caption = formData.get('caption') as string;
  const res = await uploadImageOnly(formData);

  if (res.error) {
    return { error: res.error };
  }

  if (res.url) {
    await prisma.photo.create({
      data: { url: res.url, caption },
    });
    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    return { url: res.url };
  }

  return { error: 'Erreur inconnue lors de l\'upload' };
}

export async function deletePhoto(id: string, url: string) {
  await prisma.photo.delete({
    where: { id },
  });

  try {
    if (url.startsWith('http') && process.env.BLOB_READ_WRITE_TOKEN) {
      await del(url);
    }
  } catch (err) { }

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
}

