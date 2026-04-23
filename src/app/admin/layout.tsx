import Link from 'next/link';
import { redirect } from 'next/navigation';
import styles from './admin.module.css';
import { isAdminAuthenticated } from '@/lib/auth';
import LogoutButton from './components/LogoutButton';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    redirect('/admin/login');
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <div className={styles.adminContainer}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>Admin Panel</h2>
          </div>
          <nav className={styles.navLinks}>
            <Link href="/admin">Articles</Link>
            <Link href="/admin/gallery">Gallery</Link>
            <Link href="/" target="_blank">View Site ↗</Link>
            <LogoutButton />
          </nav>
        </aside>
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </>
  );
}
