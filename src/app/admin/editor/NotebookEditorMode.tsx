'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { paginateContent, PAGE_HEIGHT, DEFAULT_VIEW_WIDTH } from '@/lib/paginateContent';
import styles from '../admin.module.css';

interface NotebookEditorModeProps {
  editor: Editor;
  enabled: boolean;
}

/**
 * NotebookEditorMode overlays a paginated preview on top of the TipTap editor
 * when notebook mode is active. It uses the shared paginator to split the content
 * into pages and displays them in fixed-height containers that exactly match
 * the public NotebookReader rendering.
 */
export default function NotebookEditorMode({ editor, enabled }: NotebookEditorModeProps) {
  const [pages, setPages] = useState<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastHtmlRef = useRef<string>('');

  const recalculate = useCallback(async () => {
    if (!editor || editor.isDestroyed || !enabled) return;

    const html = editor.getHTML();
    if (html === lastHtmlRef.current) return;
    lastHtmlRef.current = html;

    const result = await paginateContent(html, DEFAULT_VIEW_WIDTH);
    setPages(result);
  }, [editor, enabled]);

  const debouncedRecalculate = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(recalculate, 300);
  }, [recalculate]);

  // Listen to editor updates
  useEffect(() => {
    if (!editor || !enabled) return;

    editor.on('update', debouncedRecalculate);
    // Initial calculation
    const timeout = setTimeout(recalculate, 200);

    return () => {
      editor.off('update', debouncedRecalculate);
      clearTimeout(timeout);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [editor, enabled, recalculate, debouncedRecalculate]);

  // Force recalculate when toggling mode
  useEffect(() => {
    if (enabled) {
      lastHtmlRef.current = '';
      recalculate();
    }
  }, [enabled, recalculate]);

  if (!enabled) return null;

  return (
    <div className={styles.notebookPreviewContainer}>
      <div className={styles.notebookPreviewLabel}>
        Aperçu des pages ({pages.length} page{pages.length !== 1 ? 's' : ''})
      </div>
      <div className={styles.notebookPagesGrid}>
        {pages.map((pageHtml, i) => (
          <div key={i} className={styles.notebookPageCard}>
            <div className={styles.notebookPageHeader}>
              <span className={styles.notebookPageNumber}>Page {i + 1}</span>
            </div>
            <div className={styles.notebookPageBody}>
              {/* Ruled lines background */}
              <div className={styles.notebookRuledLines} aria-hidden="true" />
              {/* Margin line */}
              <div className={styles.notebookMarginLine} aria-hidden="true" />
              {/* Page content */}
              <div
                className={styles.notebookPageText}
                dangerouslySetInnerHTML={{ __html: pageHtml }}
              />
            </div>
          </div>
        ))}
        {pages.length === 0 && (
          <div className={styles.notebookEmptyState}>
            Commencez à écrire pour voir l&apos;aperçu des pages...
          </div>
        )}
      </div>
    </div>
  );
}
