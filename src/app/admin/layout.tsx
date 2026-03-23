import Link from 'next/link';
import styles from './admin.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Admin Panel</h2>
        </div>
        <nav className={styles.navLinks}>
          <Link href="/admin">Articles</Link>
          <Link href="/admin/gallery">Gallery</Link>
          <Link href="/" target="_blank">View Site ↗</Link>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
