'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function uploadPhoto(formData: FormData) {
  const file = formData.get('photo') as File;
  const caption = formData.get('caption') as string;

  if (!file) {
    throw new Error('No photo provided.');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const filepath = path.join(uploadDir, filename);

  // Ensure upload directory exists
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (err) { }

  await writeFile(filepath, buffer);

  const url = `/uploads/${filename}`;

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
    const filename = url.replace('/uploads/', '');
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
    await unlink(filepath);
  } catch (err) {}

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
}
