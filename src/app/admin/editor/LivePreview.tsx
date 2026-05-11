'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { Eye, EyeOff, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { paginateContent, DEFAULT_VIEW_WIDTH } from '@/lib/paginateContent';
import styles from '../admin.module.css';

interface LivePreviewProps {
  editor: Editor;
  title: string;
  coverImage: string;
  authorName: string;
  authorAvatar: string;
  tags: string;
  publishedAt: string;
}

export default function LivePreview({
  editor,
  title,
  coverImage,
  authorName,
  authorAvatar,
  tags,
  publishedAt,
}: LivePreviewProps) {
  const [visible, setVisible] = useState(false);
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastHtmlRef = useRef<string>('');

  const formattedDate = (() => {
    try {
      return new Date(publishedAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  })();

  const tagsArray = tags
    ? tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const recalculate = useCallback(async () => {
    if (!editor || editor.isDestroyed || !visible) return;

    const html = editor.getHTML();
    if (html === lastHtmlRef.current) return;
    lastHtmlRef.current = html;

    const result = await paginateContent(html, DEFAULT_VIEW_WIDTH);
    setPages(result);
  }, [editor, visible]);

  const debouncedRecalculate = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(recalculate, 400);
  }, [recalculate]);

  // Listen to editor updates
  useEffect(() => {
    if (!editor || !visible) return;

    editor.on('update', debouncedRecalculate);
    // Initial calculation
    const timeout = setTimeout(recalculate, 200);

    return () => {
      editor.off('update', debouncedRecalculate);
      clearTimeout(timeout);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [editor, visible, recalculate, debouncedRecalculate]);

  // Reset on toggle
  useEffect(() => {
    if (visible) {
      lastHtmlRef.current = '';
      setCurrentPage(0);
      recalculate();
    }
  }, [visible, recalculate]);

  // Clamp currentPage
  useEffect(() => {
    if (currentPage >= pages.length && pages.length > 0) {
      setCurrentPage(pages.length - 1);
    }
  }, [pages, currentPage]);

  return (
    <>
      {/* Toggle Button */}
      <button
        type="button"
        className={`${styles.livePreviewToggle} ${visible ? styles.livePreviewToggleActive : ''}`}
        onClick={() => setVisible(!visible)}
        title={visible ? 'Masquer l\'aperçu' : 'Aperçu en direct'}
      >
        {visible ? <EyeOff size={14} /> : <Eye size={14} />}
        Aperçu
      </button>

      {/* Floating Preview Panel */}
      {visible && (
        <div className={styles.livePreviewPanel}>
          {/* Header */}
          <div className={styles.livePreviewHeader}>
            <div className={styles.livePreviewTitle}>
              <Eye size={14} />
              <span>Aperçu en direct</span>
              <span className={styles.livePreviewBadge}>LIVE</span>
            </div>
            <button
              type="button"
              className={styles.livePreviewClose}
              onClick={() => setVisible(false)}
              title="Fermer l'aperçu"
            >
              <X size={16} />
            </button>
          </div>

          {/* Preview Content */}
          <div className={styles.livePreviewContent}>
            {/* Mini notebook scene */}
            <div className={styles.livePreviewNotebook}>
              {/* Cover or Page */}
              {currentPage === 0 ? (
                /* Cover Page */
                <div className={styles.livePreviewCover}>
                  {coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={coverImage}
                      alt=""
                      className={styles.livePreviewCoverImg}
                    />
                  )}
                  <div className={styles.livePreviewCoverContent}>
                    <span className={styles.livePreviewBrand}>Vinot&apos;s Blog</span>
                    <h3 className={styles.livePreviewCoverTitle}>
                      {title || 'Sans titre'}
                    </h3>
                    <div className={styles.livePreviewCoverMeta}>
                      {authorAvatar && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={authorAvatar}
                          alt=""
                          className={styles.livePreviewAvatar}
                        />
                      )}
                      <span>{authorName || 'Auteur'}</span>
                      {formattedDate && (
                        <>
                          <span className={styles.livePreviewSep}>·</span>
                          <span>{formattedDate}</span>
                        </>
                      )}
                    </div>
                    {tagsArray.length > 0 && (
                      <div className={styles.livePreviewTags}>
                        {tagsArray.map((t) => (
                          <span key={t} className={styles.livePreviewTag}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Content Page */
                <div className={styles.livePreviewPage}>
                  <div className={styles.livePreviewRuled} />
                  <div className={styles.livePreviewMargin} />
                  <div className={styles.livePreviewPageNum}>
                    {currentPage}
                  </div>
                  <div
                    className={styles.livePreviewText}
                    dangerouslySetInnerHTML={{
                      __html: pages[currentPage - 1] || '',
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Navigation Footer */}
          <div className={styles.livePreviewNav}>
            <button
              type="button"
              className={styles.livePreviewNavBtn}
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft size={14} />
            </button>

            <span className={styles.livePreviewPageCounter}>
              {currentPage === 0 ? 'Couverture' : `Page ${currentPage}`} / {pages.length} pages
            </span>

            <button
              type="button"
              className={styles.livePreviewNavBtn}
              onClick={() =>
                setCurrentPage((p) => Math.min(pages.length, p + 1))
              }
              disabled={currentPage >= pages.length}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
