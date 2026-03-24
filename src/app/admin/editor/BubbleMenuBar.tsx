'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  Link as LinkIcon,
  Code,
  Superscript,
  Subscript,
  Palette,
} from 'lucide-react';
import styles from '../admin.module.css';

const QUICK_COLORS = [
  '#1a1a2e', '#e74c3c', '#ea580c', '#f59e0b',
  '#16a34a', '#2563eb', '#7c3aed', '#db2777',
];

const QUICK_HIGHLIGHTS = [
  '#FDE68A', '#BBF7D0', '#BFDBFE', '#FBCFE8', '#FED7AA', '#E9D5FF',
];

export default function BubbleMenuBar({ editor }: { editor: Editor }) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showHighlightPalette, setShowHighlightPalette] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    if (from === to) {
      setIsVisible(false);
      return;
    }

    // Check if selection is text (not node selection of images etc.)
    const { empty } = editor.state.selection;
    if (empty) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    // Get coordinates of the selection
    const start = editor.view.coordsAtPos(from);
    const end = editor.view.coordsAtPos(to);
    const editorContainer = editor.view.dom.closest(`.${styles.premiumEditorContainer}`);
    if (!editorContainer) return;

    const containerRect = editorContainer.getBoundingClientRect();
    const menuWidth = menuRef.current?.offsetWidth || 380;

    let left = (start.left + end.left) / 2 - containerRect.left - menuWidth / 2;
    left = Math.max(8, Math.min(left, containerRect.width - menuWidth - 8));

    setPosition({
      top: start.top - containerRect.top - 48,
      left,
    });
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    editor.on('selectionUpdate', updatePosition);
    editor.on('blur', () => setIsVisible(false));

    return () => {
      editor.off('selectionUpdate', updatePosition);
      editor.off('blur', () => setIsVisible(false));
    };
  }, [editor, updatePosition]);

  const setLink = useCallback(() => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const toggleLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    if (previousUrl) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    setShowLinkInput(true);
  };

  const transformText = (type: 'upper' | 'lower' | 'title') => {
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to);
    let transformed = text;
    if (type === 'upper') transformed = text.toUpperCase();
    else if (type === 'lower') transformed = text.toLowerCase();
    else transformed = text.replace(/\b\w/g, (c) => c.toUpperCase());
    editor.chain().focus().insertContentAt({ from, to }, transformed).run();
  };

  if (!isVisible) return null;

  return (
    <div
      ref={menuRef}
      className={styles.bubbleMenu}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        zIndex: 50,
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {showLinkInput ? (
        <div className={styles.bubbleLinkInput}>
          <input
            type="url"
            placeholder="https://..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setLink();
              }
              if (e.key === 'Escape') {
                setShowLinkInput(false);
                setLinkUrl('');
              }
            }}
            autoFocus
            className={styles.linkInput}
          />
          <button
            type="button"
            onClick={setLink}
            className={styles.linkConfirmBtn}
          >
            ✓
          </button>
          <button
            type="button"
            onClick={() => {
              setShowLinkInput(false);
              setLinkUrl('');
            }}
            className={styles.linkCancelBtn}
          >
            ✕
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={styles.bubbleBtn}
            data-active={editor.isActive('bold')}
            title="Gras"
          >
            <Bold size={15} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={styles.bubbleBtn}
            data-active={editor.isActive('italic')}
            title="Italique"
          >
            <Italic size={15} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={styles.bubbleBtn}
            data-active={editor.isActive('underline')}
            title="Souligné"
          >
            <Underline size={15} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={styles.bubbleBtn}
            data-active={editor.isActive('strike')}
            title="Barré"
          >
            <Strikethrough size={15} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={styles.bubbleBtn}
            data-active={editor.isActive('code')}
            title="Code inline"
          >
            <Code size={15} />
          </button>

          <div className={styles.bubbleDivider} />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            className={styles.bubbleBtn}
            data-active={editor.isActive('superscript')}
            title="Exposant"
          >
            <Superscript size={15} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            className={styles.bubbleBtn}
            data-active={editor.isActive('subscript')}
            title="Indice"
          >
            <Subscript size={15} />
          </button>

          <div className={styles.bubbleDivider} />

          {/* Color palette */}
          <div className={styles.bubbleDropdownWrapper}>
            <button
              type="button"
              onClick={() => { setShowColorPalette(!showColorPalette); setShowHighlightPalette(false); }}
              className={styles.bubbleBtn}
              title="Couleur du texte"
            >
              <Palette size={15} />
            </button>
            {showColorPalette && (
              <div className={styles.bubbleColorGrid}>
                {QUICK_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={styles.colorSwatch}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      editor.chain().focus().setColor(color).run();
                      setShowColorPalette(false);
                    }}
                  />
                ))}
                <button
                  type="button"
                  className={styles.colorSwatchReset}
                  onClick={() => {
                    editor.chain().focus().unsetColor().run();
                    setShowColorPalette(false);
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Highlight palette */}
          <div className={styles.bubbleDropdownWrapper}>
            <button
              type="button"
              onClick={() => { setShowHighlightPalette(!showHighlightPalette); setShowColorPalette(false); }}
              className={styles.bubbleBtn}
              data-active={editor.isActive('highlight')}
              title="Surlignage"
            >
              <Highlighter size={15} />
            </button>
            {showHighlightPalette && (
              <div className={styles.bubbleColorGrid}>
                {QUICK_HIGHLIGHTS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={styles.highlightSwatch}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      editor.chain().focus().toggleHighlight({ color }).run();
                      setShowHighlightPalette(false);
                    }}
                  >
                    A
                  </button>
                ))}
                <button
                  type="button"
                  className={styles.highlightSwatchReset}
                  onClick={() => {
                    editor.chain().focus().unsetHighlight().run();
                    setShowHighlightPalette(false);
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className={styles.bubbleDivider} />

          <button
            type="button"
            onClick={toggleLink}
            className={styles.bubbleBtn}
            data-active={editor.isActive('link')}
            title="Lien"
          >
            <LinkIcon size={15} />
          </button>

          <div className={styles.bubbleDivider} />

          {/* Text transform */}
          <button type="button" onClick={() => transformText('upper')} className={styles.bubbleBtnText} title="MAJUSCULES">
            AA
          </button>
          <button type="button" onClick={() => transformText('lower')} className={styles.bubbleBtnText} title="minuscules">
            aa
          </button>
          <button type="button" onClick={() => transformText('title')} className={styles.bubbleBtnText} title="Titre">
            Aa
          </button>
        </>
      )}
    </div>
  );
}
