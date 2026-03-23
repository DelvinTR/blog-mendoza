'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useState, useRef } from 'react';
import { Bold, Italic, List, ListOrdered, Heading2, Image as ImageIcon } from 'lucide-react';
import { saveArticle } from '../actions';
import { uploadPhoto } from '../gallery/actions';
import styles from '../admin.module.css';

export default function EditorForm({ initialData }: { initialData: any }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [published, setPublished] = useState(initialData?.published || false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: initialData?.content || '<p>Start writing your travel adventure...</p>',
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (initialData?.id) formData.append('id', initialData.id);
    formData.append('title', title);
    formData.append('content', editor.getHTML());
    formData.append('published', String(published));
    
    await saveArticle(formData);
  };

  const addImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('caption', 'Article Image');
      const res = await uploadPhoto(formData);
      if (res?.url) {
        editor?.chain().focus().setImage({ src: res.url }).run();
      }
    }
  };

  return (
    <form onSubmit={handleSave}>
      <div className={styles.formGroup}>
        <label>Article Title</label>
        <input
          required
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
          placeholder="My Trip to Paris"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Content</label>
        <div className={styles.editorContainer}>
          <div className={styles.editorToolbar}>
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={styles.toolbarBtn} data-active={editor.isActive('bold')}>
              <Bold size={18} style={{ pointerEvents: 'none' }} />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={styles.toolbarBtn} data-active={editor.isActive('italic')}>
              <Italic size={18} style={{ pointerEvents: 'none' }} />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={styles.toolbarBtn} data-active={editor.isActive('heading', { level: 2 })}>
              <Heading2 size={18} style={{ pointerEvents: 'none' }} />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={styles.toolbarBtn} data-active={editor.isActive('bulletList')}>
              <List size={18} style={{ pointerEvents: 'none' }} />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={styles.toolbarBtn} data-active={editor.isActive('orderedList')}>
              <ListOrdered size={18} style={{ pointerEvents: 'none' }} />
            </button>
            <button type="button" onClick={() => fileInputRef.current?.click()} className={styles.toolbarBtn}>
              <ImageIcon size={18} style={{ pointerEvents: 'none' }} />
            </button>
            <input type="file" ref={fileInputRef} onChange={addImage} style={{ display: 'none' }} accept="image/*" />
          </div>
          <EditorContent editor={editor} className={styles.editorContent} />
        </div>
      </div>

      <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        <label htmlFor="published" style={{ marginBottom: 0 }}>Publish immediately</label>
      </div>

      <button type="submit" className={styles.btn}>
        Save Article
      </button>
    </form>
  );
}
