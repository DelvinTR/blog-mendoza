'use client';

import { Editor } from '@tiptap/react';
import styles from '../admin.module.css';

const IMAGE_SIZES = [
  { label: '25%', value: '25%' },
  { label: '50%', value: '50%' },
  { label: '65%', value: '65%' },
  { label: '75%', value: '75%' },
  { label: '100%', value: '100%' },
];

interface ImageResizerProps {
  editor: Editor;
}

export default function ImageResizer({ editor }: ImageResizerProps) {
  const isImage = editor.isActive('resizableImage');
  if (!isImage) return null;

  const currentWidth =
    editor.getAttributes('resizableImage')?.width || '65%';

  return (
    <div className={styles.imageResizeToolbar}>
      {IMAGE_SIZES.map((size) => (
        <button
          key={size.value}
          type="button"
          className={`${styles.imageResizeBtn} ${
            currentWidth === size.value ? styles.imageResizeBtnActive : ''
          }`}
          onClick={() =>
            editor
              .chain()
              .focus()
              .updateAttributes('resizableImage', { width: size.value })
              .run()
          }
          title={`Redimensionner à ${size.label}`}
        >
          {size.label}
        </button>
      ))}
    </div>
  );
}
