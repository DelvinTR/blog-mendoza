'use client';

import { useState, useEffect, useCallback } from 'react';

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'à l\'instant';
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `il y a ${Math.floor(diff / 86400)}j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function CommentSection({ articleId, isAdmin = false }: { articleId: string; isAdmin?: boolean }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?articleId=${articleId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch {
      // silently fail
    }
  }, [articleId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!author.trim()) {
      setError('Un pseudo est requis');
      return;
    }
    if (!content.trim()) {
      setError('Écris un message !');
      return;
    }
    if (content.trim().length > 1000) {
      setError('Le message est trop long (max 1000 caractères)');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, author: author.trim(), content: content.trim() }),
      });

      if (res.ok) {
        setContent('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        fetchComments();
      } else {
        const data = await res.json();
        setError(data.error || 'Erreur lors de l\'envoi');
      }
    } catch {
      setError('Erreur réseau, réessayez');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Supprimer ce commentaire ?')) return;
    setDeletingId(commentId);
    try {
      const res = await fetch(`/api/comments?id=${commentId}`, { method: 'DELETE' });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
    } catch {
      // silently fail
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="comments-section">
      <div className="comments-inner">

        {/* Header */}
        <div className="comments-header">
          <div className="comments-header-deco" />
          <h2 className="comments-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Commentaires
          </h2>
          <p className="comments-subtitle">
            {comments.length === 0
              ? 'Sois le premier à laisser un mot !'
              : `${comments.length} message${comments.length > 1 ? 's' : ''}`
            }
          </p>
          {isAdmin && (
            <span className="comments-admin-badge">Mode admin</span>
          )}
        </div>

        {/* Form */}
        <form className="comment-form" onSubmit={handleSubmit}>
          <div className="comment-form-row">
            <div className="comment-form-field">
              <label htmlFor="comment-author">Ton prénom</label>
              <input
                id="comment-author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Prénom"
                maxLength={50}
                className="comment-input"
              />
            </div>
          </div>
          <div className="comment-form-field">
            <label htmlFor="comment-content">Ton message</label>
            <textarea
              id="comment-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Un petit message ?"
              maxLength={1000}
              rows={4}
              className="comment-textarea"
            />
            <span className="comment-char-count">{content.length}/1000</span>
          </div>

          {error && <p className="comment-error">{error}</p>}
          {success && <p className="comment-success">✨ Message envoyé !</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="vintage-btn comment-submit-btn"
          >
            {isSubmitting ? 'Envoi...' : 'Envoyer'}
          </button>
        </form>

        {/* Comments List */}
        {comments.length > 0 && (
          <div className="comments-list">
            {comments.map((c, i) => (
              <article
                key={c.id}
                className="comment-card"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="comment-card-tape" />
                <div className="comment-card-header">
                  <span className="comment-card-avatar">
                    {c.author.charAt(0).toUpperCase()}
                  </span>
                  <div style={{ flex: 1 }}>
                    <span className="comment-card-author">{c.author}</span>
                    <span className="comment-card-date">{timeAgo(c.createdAt)}</span>
                  </div>
                  {isAdmin && (
                    <button
                      className="comment-delete-btn"
                      onClick={() => handleDelete(c.id)}
                      disabled={deletingId === c.id}
                      title="Supprimer ce commentaire"
                      aria-label="Supprimer ce commentaire"
                    >
                      {deletingId === c.id ? (
                        <span className="comment-delete-spinner" />
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
                <p className="comment-card-text">{c.content}</p>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
