import { prisma } from '@/lib/prisma';
import EditorForm from './EditorForm';
import styles from '../admin.module.css';

export default async function EditorPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams; // Next.js 15 searchParams is a Promise
  let article = null;

  if (id) {
    article = await prisma.article.findUnique({
      where: { id },
    });
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        {article ? 'Edit Article' : 'Compose New Article'}
      </h1>
      <EditorForm initialData={article} />
    </div>
  );
}
