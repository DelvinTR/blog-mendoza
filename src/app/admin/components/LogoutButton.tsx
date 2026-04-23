'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        background: 'none',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        color: '#ef4444',
        cursor: 'pointer',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        fontSize: '0.85rem',
        marginTop: '1rem',
        transition: 'all 0.2s ease',
        width: '100%',
        textAlign: 'center',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'none';
        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
      }}
    >
      Se déconnecter
    </button>
  );
}
