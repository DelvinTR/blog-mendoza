'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import CharacterCount from '@tiptap/extension-character-count';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import FontFamily from '@tiptap/extension-font-family';
import Youtube from '@tiptap/extension-youtube';
import Focus from '@tiptap/extension-focus';
import { common, createLowlight } from 'lowlight';
import { useState, useRef, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Code2,
  Minus,
  Image as ImageIcon,
  Table as TableIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo2,
  Redo2,
  Palette,
  Save,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Video,
  Upload,
  X,
  ChevronDown,
  Eye,
  EyeOff,
  Clock,
  Type,
} from 'lucide-react';
import { saveArticle } from '../actions';
import { uploadPhoto } from '../gallery/actions';
import styles from '../admin.module.css';
import BubbleMenuBar from './BubbleMenuBar';
import SlashCommandMenu from './SlashCommandMenu';
import { FontSize } from './FontSizeExtension';
import { Callout } from './CalloutExtension';

const lowlight = createLowlight(common);

const FONT_FAMILIES = [
  { label: 'Sans Serif', value: 'var(--font-inter), Inter, system-ui, sans-serif' },
  { label: 'Serif', value: 'var(--font-playfair), Georgia, serif' },
  { label: 'Manuscrit (Caveat)', value: 'var(--font-caveat), cursive' },
  { label: 'Manuscrit (Shadows)', value: 'var(--font-shadows), cursive' },
  { label: 'Lora', value: 'Lora, serif' },
  { label: 'Playfair', value: 'Playfair Display, serif' },
  { label: 'Monospace', value: 'JetBrains Mono, monospace' },
];

const FONT_SIZES = [
  { label: 'Petit', value: '0.875rem' },
  { label: 'Normal', value: '1rem' },
  { label: 'Grand', value: '1.25rem' },
  { label: 'Très grand', value: '1.5rem' },
  { label: 'Énorme', value: '2rem' },
];

const TEXT_COLORS = [
  '#1a1a2e', '#374151', '#6b7280', '#e74c3c', '#dc2626',
  '#ea580c', '#f59e0b', '#16a34a', '#0d9488', '#2563eb',
  '#7c3aed', '#db2777', '#FF6E31',
];

const HIGHLIGHT_COLORS = [
  { label: 'Jaune', color: '#FDE68A' },
  { label: 'Vert', color: '#BBF7D0' },
  { label: 'Bleu', color: '#BFDBFE' },
  { label: 'Rose', color: '#FBCFE8' },
  { label: 'Orange', color: '#FED7AA' },
  { label: 'Violet', color: '#E9D5FF' },
];

export default function EditorForm({ initialData }: { initialData: any }) {
  const [published, setPublished] = useState(initialData?.published || false);
  const [saving, setSaving] = useState(false);
  const [coverImage, setCoverImage] = useState<string>(initialData?.coverImage || '');
  const [coverDragging, setCoverDragging] = useState(false);
  const [bgImage, setBgImage] = useState<string>(initialData?.bgImage || '');
  const [bgDragging, setBgDragging] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'Titre...';
          }
          return 'Écrivez ici ou tapez / pour insérer un bloc...';
        },
      }),
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Color,
      TextStyle,
      Typography,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      CharacterCount,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Superscript,
      Subscript,
      FontFamily,
      Youtube.configure({
        HTMLAttributes: {
          class: 'editor-youtube',
        },
      }),
      Focus.configure({
        className: 'has-focus',
        mode: 'deepest',
      }),
      FontSize,
      Callout,
    ],
    content: initialData?.content || '',
    immediatelyRender: false,
  });

  const addImage = useCallback(async (file: File) => {
    if (!editor) return;
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('caption', file.name);
    const res = await uploadPhoto(formData);
    if (res?.url) {
      editor.chain().focus().setImage({ src: res.url, alt: file.name }).run();
    }
  }, [editor]);

  const handleImageInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await addImage(file);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleCoverChange = async (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('caption', 'Cover Image');
    const res = await uploadPhoto(formData);
    if (res?.url) {
      setCoverImage(res.url);
    }
  };

  const handleCoverInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleCoverChange(file);
    e.target.value = '';
  };

  const handleBgChange = async (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('caption', 'Notebook Background');
    const res = await uploadPhoto(formData);
    if (res?.url) {
      setBgImage(res.url);
    }
  };

  const handleBgInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleBgChange(file);
    e.target.value = '';
  };

  const handleBgDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setBgDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await handleBgChange(file);
    }
  };

  const handleCoverDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setCoverDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await handleCoverChange(file);
    }
  };

  // Handle dropping images into the editor
  const handleEditorDrop = useCallback(async (e: React.DragEvent) => {
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        e.preventDefault();
        await addImage(file);
      }
    }
  }, [addImage]);

  if (!editor) {
    return (
      <div className={styles.editorSkeleton}>
        <div className={styles.skeletonToolbar} />
        <div className={styles.skeletonContent} />
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      if (initialData?.id) formData.set('id', initialData.id);
      formData.set('content', editor.getHTML());
      formData.set('published', String(published));
      formData.set('coverImage', coverImage);
      formData.set('bgImage', bgImage);
      await saveArticle(formData);
    } finally {
      setSaving(false);
    }
  };

  const addYoutubeVideo = () => {
    const url = window.prompt('URL de la vidéo YouTube :');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const words = editor.storage.characterCount.words();
  const chars = editor.storage.characterCount.characters();
  const readingTime = Math.max(1, Math.ceil(words / 200));

  // Determine current font label
  const currentFont = FONT_FAMILIES.find(
    (f) => editor.isActive('textStyle', { fontFamily: f.value })
  )?.label || 'Sans Serif';

  const currentSize = FONT_SIZES.find(
    (s) => editor.isActive('textStyle', { fontSize: s.value })
  )?.label || 'Normal';

  return (
    <form onSubmit={handleSave} className={styles.premiumEditorForm}>
      {/* Cover Image Zone */}
      <div
        className={`${styles.coverZone} ${coverImage ? styles.coverZoneHasImage : ''} ${coverDragging ? styles.coverZoneDragging : ''}`}
        onDragOver={(e) => { e.preventDefault(); setCoverDragging(true); }}
        onDragLeave={() => setCoverDragging(false)}
        onDrop={handleCoverDrop}
        onClick={() => !coverImage && coverInputRef.current?.click()}
      >
        {coverImage ? (
          <>
            <img src={coverImage} alt="Cover" className={styles.coverPreview} />
            <div className={styles.coverOverlay}>
              <button
                type="button"
                className={styles.coverBtn}
                onClick={(e) => { e.stopPropagation(); coverInputRef.current?.click(); }}
              >
                <Upload size={16} /> Changer
              </button>
              <button
                type="button"
                className={styles.coverBtnDanger}
                onClick={(e) => { e.stopPropagation(); setCoverImage(''); }}
              >
                <X size={16} /> Supprimer
              </button>
            </div>
          </>
        ) : (
          <div className={styles.coverPlaceholder}>
            <Upload size={32} />
            <span>Glissez une image de couverture ou cliquez pour en choisir une</span>
          </div>
        )}
        <input
          type="file"
          ref={coverInputRef}
          onChange={handleCoverInput}
          style={{ display: 'none' }}
          accept="image/*"
        />
      </div>

      {/* Notebook Background Image Zone */}
      <div
        className={`${styles.bgZone} ${bgImage ? styles.bgZoneHasImage : ''} ${bgDragging ? styles.bgZoneDragging : ''}`}
        onDragOver={(e) => { e.preventDefault(); setBgDragging(true); }}
        onDragLeave={() => setBgDragging(false)}
        onDrop={handleBgDrop}
        onClick={() => !bgImage && bgInputRef.current?.click()}
      >
        <div className={styles.bgLabel}>Arrière-plan du cahier</div>
        {bgImage ? (
          <>
            <img src={bgImage} alt="Background" className={styles.bgPreview} />
            <div className={styles.bgOverlay}>
              <button
                type="button"
                className={styles.bgBtn}
                onClick={(e) => { e.stopPropagation(); bgInputRef.current?.click(); }}
              >
                <Upload size={16} /> Changer
              </button>
              <button
                type="button"
                className={styles.coverBtnDanger}
                onClick={(e) => { e.stopPropagation(); setBgImage(''); }}
              >
                <X size={16} /> Supprimer
              </button>
            </div>
          </>
        ) : (
          <div className={styles.coverPlaceholder}>
            <ImageIcon size={24} />
            <span>Image de fond du carnet (immersion)</span>
          </div>
        )}
        <input
          type="file"
          ref={bgInputRef}
          onChange={handleBgInput}
          style={{ display: 'none' }}
          accept="image/*"
        />
      </div>

      {/* Metadata Section */}
      <div className={styles.metaSection}>
        <input
          type="text"
          name="title"
          placeholder="Titre de l'article"
          defaultValue={initialData?.title || ''}
          required
          className={styles.premiumTitleInput}
        />
        <textarea
          name="excerpt"
          placeholder="Résumé de l'article (optionnel — sera affiché dans les aperçus)"
          defaultValue={initialData?.excerpt || ''}
          className={styles.excerptInput}
          rows={2}
        />
        <div className={styles.metaRow}>
          <input
            type="text"
            name="authorName"
            placeholder="Auteur"
            defaultValue={initialData?.authorName || ''}
            className={styles.metaInput}
          />
          <input
            type="text"
            name="authorAvatar"
            placeholder="URL Avatar"
            defaultValue={initialData?.authorAvatar || ''}
            className={styles.metaInput}
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (séparés par des virgules)"
            defaultValue={initialData?.tags || ''}
            className={styles.metaInputWide}
          />
        </div>
      </div>

      {/* Editor Container */}
      <div className={styles.premiumEditorContainer} onDrop={handleEditorDrop} onDragOver={(e) => e.preventDefault()}>
        {/* Toolbar */}
        <div className={styles.premiumToolbar}>
          {/* Undo/Redo */}
          <div className={styles.toolGroup}>
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className={styles.tBtn}
              title="Annuler (Ctrl+Z)"
            >
              <Undo2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className={styles.tBtn}
              title="Rétablir (Ctrl+Shift+Z)"
            >
              <Redo2 size={16} />
            </button>
          </div>

          <div className={styles.toolDivider} />

          {/* Font Family Selector */}
          <div className={styles.dropdownWrapper}>
            <button
              type="button"
              className={styles.tBtnDropdown}
              onClick={() => { setShowFontPicker(!showFontPicker); setShowSizePicker(false); setShowColorPicker(false); setShowHighlightPicker(false); }}
              title="Police"
            >
              <Type size={14} />
              <span className={styles.dropdownLabel}>{currentFont}</span>
              <ChevronDown size={12} />
            </button>
            {showFontPicker && (
              <div className={styles.dropdownMenu}>
                {FONT_FAMILIES.map((font) => (
                  <button
                    key={font.value}
                    type="button"
                    className={styles.dropdownItem}
                    style={{ fontFamily: font.value }}
                    data-active={editor.isActive('textStyle', { fontFamily: font.value })}
                    onClick={() => {
                      editor.chain().focus().setFontFamily(font.value).run();
                      setShowFontPicker(false);
                    }}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font Size Selector */}
          <div className={styles.dropdownWrapper}>
            <button
              type="button"
              className={styles.tBtnDropdown}
              onClick={() => { setShowSizePicker(!showSizePicker); setShowFontPicker(false); setShowColorPicker(false); setShowHighlightPicker(false); }}
              title="Taille"
            >
              <span className={styles.dropdownLabel}>{currentSize}</span>
              <ChevronDown size={12} />
            </button>
            {showSizePicker && (
              <div className={styles.dropdownMenu}>
                {FONT_SIZES.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    className={styles.dropdownItem}
                    style={{ fontSize: size.value }}
                    data-active={editor.isActive('textStyle', { fontSize: size.value })}
                    onClick={() => {
                      (editor.commands as any).setFontSize(size.value);
                      setShowSizePicker(false);
                    }}
                  >
                    {size.label}
                  </button>
                ))}
                <button
                  type="button"
                  className={styles.dropdownItemReset}
                  onClick={() => {
                    (editor.commands as any).unsetFontSize();
                    setShowSizePicker(false);
                  }}
                >
                  Réinitialiser
                </button>
              </div>
            )}
          </div>

          <div className={styles.toolDivider} />

          {/* Text Formatting */}
          <div className={styles.toolGroup}>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={styles.tBtn}
              data-active={editor.isActive('bold')}
              title="Gras (Ctrl+B)"
            >
              <Bold size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={styles.tBtn}
              data-active={editor.isActive('italic')}
              title="Italique (Ctrl+I)"
            >
              <Italic size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={styles.tBtn}
              data-active={editor.isActive('underline')}
              title="Souligné (Ctrl+U)"
            >
              <UnderlineIcon size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={styles.tBtn}
              data-active={editor.isActive('strike')}
              title="Barré"
            >
              <Strikethrough size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={styles.tBtn}
              data-active={editor.isActive('superscript')}
              title="Exposant"
            >
              <SuperscriptIcon size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={styles.tBtn}
              data-active={editor.isActive('subscript')}
              title="Indice"
            >
              <SubscriptIcon size={16} />
            </button>
          </div>

          <div className={styles.toolDivider} />

          {/* Colors */}
          <div className={styles.toolGroup}>
            {/* Text Color */}
            <div className={styles.dropdownWrapper}>
              <button
                type="button"
                onClick={() => { setShowColorPicker(!showColorPicker); setShowHighlightPicker(false); setShowFontPicker(false); setShowSizePicker(false); }}
                className={styles.tBtn}
                title="Couleur du texte"
              >
                <Palette size={16} />
              </button>
              {showColorPicker && (
                <div className={styles.colorGrid}>
                  {TEXT_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={styles.colorSwatch}
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        editor.chain().focus().setColor(color).run();
                        setShowColorPicker(false);
                      }}
                    />
                  ))}
                  <button
                    type="button"
                    className={styles.colorSwatchReset}
                    onClick={() => {
                      editor.chain().focus().unsetColor().run();
                      setShowColorPicker(false);
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            {/* Highlight Color */}
            <div className={styles.dropdownWrapper}>
              <button
                type="button"
                onClick={() => { setShowHighlightPicker(!showHighlightPicker); setShowColorPicker(false); setShowFontPicker(false); setShowSizePicker(false); }}
                className={styles.tBtn}
                data-active={editor.isActive('highlight')}
                title="Surlignage"
              >
                <Highlighter size={16} />
              </button>
              {showHighlightPicker && (
                <div className={styles.highlightGrid}>
                  {HIGHLIGHT_COLORS.map((hl) => (
                    <button
                      key={hl.color}
                      type="button"
                      className={styles.highlightSwatch}
                      style={{ backgroundColor: hl.color }}
                      title={hl.label}
                      onClick={() => {
                        editor.chain().focus().toggleHighlight({ color: hl.color }).run();
                        setShowHighlightPicker(false);
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
                      setShowHighlightPicker(false);
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.toolDivider} />

          {/* Block Formatting */}
          <div className={styles.toolGroup}>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={styles.tBtn}
              data-active={editor.isActive('heading', { level: 1 })}
              title="Titre 1"
            >
              <Heading1 size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={styles.tBtn}
              data-active={editor.isActive('heading', { level: 2 })}
              title="Titre 2"
            >
              <Heading2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={styles.tBtn}
              data-active={editor.isActive('heading', { level: 3 })}
              title="Titre 3"
            >
              <Heading3 size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={styles.tBtn}
              data-active={editor.isActive('blockquote')}
              title="Citation"
            >
              <Quote size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={styles.tBtn}
              data-active={editor.isActive('codeBlock')}
              title="Bloc de code"
            >
              <Code2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className={styles.tBtn}
              title="Séparateur"
            >
              <Minus size={16} />
            </button>
          </div>

          <div className={styles.toolDivider} />

          {/* Lists */}
          <div className={styles.toolGroup}>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={styles.tBtn}
              data-active={editor.isActive('bulletList')}
              title="Liste à puces"
            >
              <List size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={styles.tBtn}
              data-active={editor.isActive('orderedList')}
              title="Liste numérotée"
            >
              <ListOrdered size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={styles.tBtn}
              data-active={editor.isActive('taskList')}
              title="Liste de tâches"
            >
              <ListChecks size={16} />
            </button>
          </div>

          <div className={styles.toolDivider} />

          {/* Alignment */}
          <div className={styles.toolGroup}>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={styles.tBtn}
              data-active={editor.isActive({ textAlign: 'left' })}
              title="Aligner à gauche"
            >
              <AlignLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={styles.tBtn}
              data-active={editor.isActive({ textAlign: 'center' })}
              title="Centrer"
            >
              <AlignCenter size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={styles.tBtn}
              data-active={editor.isActive({ textAlign: 'right' })}
              title="Aligner à droite"
            >
              <AlignRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={styles.tBtn}
              data-active={editor.isActive({ textAlign: 'justify' })}
              title="Justifier"
            >
              <AlignJustify size={16} />
            </button>
          </div>

          <div className={styles.toolDivider} />

          {/* Inserts */}
          <div className={styles.toolGroup}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={styles.tBtn}
              title="Image"
            >
              <ImageIcon size={16} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageInput}
              style={{ display: 'none' }}
              accept="image/*"
            />
            <button
              type="button"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run()
              }
              className={styles.tBtn}
              title="Tableau"
            >
              <TableIcon size={16} />
            </button>
            <button
              type="button"
              onClick={addYoutubeVideo}
              className={styles.tBtn}
              title="Vidéo YouTube"
            >
              <Video size={16} />
            </button>
          </div>
        </div>

        {/* Contextual Menus */}
        <BubbleMenuBar editor={editor} />
        <SlashCommandMenu
          editor={editor}
          onImageClick={() => fileInputRef.current?.click()}
        />

        {/* Editor Content */}
        <EditorContent editor={editor} className={styles.premiumEditorContent} />

        {/* Footer with word count + reading time */}
        <div className={styles.editorFooter}>
          <div className={styles.footerLeft}>
            <label className={styles.publishToggle}>
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
              <span className={styles.toggleSlider} />
              <span className={styles.toggleLabel}>
                {published ? (
                  <><Eye size={14} /> Publié</>
                ) : (
                  <><EyeOff size={14} /> Brouillon</>
                )}
              </span>
            </label>
          </div>
          <div className={styles.wordCount}>
            <span>{words} mot{words !== 1 ? 's' : ''}</span>
            <span className={styles.countDivider}>·</span>
            <span>{chars} caractère{chars !== 1 ? 's' : ''}</span>
            <span className={styles.countDivider}>·</span>
            <span className={styles.readingTime}>
              <Clock size={12} /> {readingTime} min de lecture
            </span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button type="submit" className={styles.premiumSaveBtn} disabled={saving}>
        <Save size={18} />
        {saving ? 'Enregistrement...' : 'Enregistrer l\'article'}
      </button>
    </form>
  );
}
