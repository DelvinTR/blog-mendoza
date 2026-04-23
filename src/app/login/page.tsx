'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError('Mot de passe incorrect');
      }
    } catch {
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #2d1a0a 0%, #4a2c10 50%, #2d1a0a 100%)',
      padding: '1rem',
    }}>
      <div style={{
        background: 'rgba(45, 26, 10, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(253, 232, 196, 0.2)',
        borderRadius: '16px',
        padding: '3rem 2.5rem',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '50px',
            height: '3px',
            background: 'linear-gradient(90deg, #FCBC42, #FFD175)',
            borderRadius: '2px',
            margin: '0 auto 1rem',
          }} />
          <h1 style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontStyle: 'italic',
            fontSize: '1.8rem',
            fontWeight: 700,
            color: '#FDE8C4',
            marginBottom: '0.4rem',
          }}>
            Administration
          </h1>
          <p style={{
            fontSize: '0.85rem',
            color: 'rgba(253, 232, 196, 0.55)',
          }}>
            Connexion requise
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label htmlFor="admin-password" style={{
              fontSize: '0.75rem',
              color: 'rgba(253, 232, 196, 0.6)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 600,
            }}>
              Mot de passe
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              style={{
                fontSize: '1.1rem',
                padding: '0.75rem 1rem',
                border: '1px solid rgba(253, 232, 196, 0.2)',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.06)',
                color: '#FDE8C4',
                outline: 'none',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(252, 188, 66, 0.5)';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = '0 0 0 3px rgba(252, 188, 66, 0.12)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(253, 232, 196, 0.2)';
                e.target.style.background = 'rgba(255, 255, 255, 0.06)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {error && (
            <p style={{
              fontSize: '0.82rem',
              color: '#ff6b6b',
              padding: '0.5rem 0.75rem',
              background: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid rgba(255, 107, 107, 0.2)',
              borderRadius: '8px',
              margin: 0,
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="vintage-btn"
            style={{
              width: '100%',
              marginTop: '0.5rem',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
