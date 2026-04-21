import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { deleteArticle } from './actions';
import DeleteButton from './components/DeleteButton';
import styles from './admin.module.css';

export default async function AdminDashboard() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Manage Articles</h1>
        <Link href="/admin/editor" className={styles.btn}>
          + New Article
        </Link>
      </div>

      <div className={styles.card}>
        {articles.length === 0 ? (
          <p>No articles found. Create your first one!</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article: any) => (
                <tr key={article.id}>
                  <td>{article.title}</td>
                  <td>{article.published ? 'Published' : 'Draft'}</td>
                  <td>{article.createdAt.toLocaleDateString()}</td>
                  <td style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link href={`/admin/editor?id=${article.id}`} style={{ color: '#FF6E31' }}>Edit</Link>
                    <form action={deleteArticle.bind(null, article.id)}>
                      <DeleteButton 
                        confirmMessage="Are you sure you want to delete this article?"
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Delete
                      </DeleteButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
