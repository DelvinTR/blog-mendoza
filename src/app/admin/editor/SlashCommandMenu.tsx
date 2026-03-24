'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Editor } from '@tiptap/react';
import {
  Type,
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
  Video,
  Info,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';
import styles from '../admin.module.css';

interface SlashMenuItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  action: (editor: Editor) => void;
}

interface SlashCommandMenuProps {
  editor: Editor;
  onImageClick: () => void;
}

export default function SlashCommandMenu({ editor, onImageClick }: SlashCommandMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const items: SlashMenuItem[] = [
    {
      title: 'Texte',
      description: 'Paragraphe simple',
      icon: <Type size={20} />,
      category: 'Basique',
      action: (ed) => ed.chain().focus().setParagraph().run(),
    },
    {
      title: 'Titre 1',
      description: 'Grand titre de section',
      icon: <Heading1 size={20} />,
      category: 'Basique',
      action: (ed) => ed.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      title: 'Titre 2',
      description: 'Sous-titre',
      icon: <Heading2 size={20} />,
      category: 'Basique',
      action: (ed) => ed.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      title: 'Titre 3',
      description: 'Petit titre',
      icon: <Heading3 size={20} />,
      category: 'Basique',
      action: (ed) => ed.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      title: 'Liste à puces',
      description: 'Liste non ordonnée',
      icon: <List size={20} />,
      category: 'Listes',
      action: (ed) => ed.chain().focus().toggleBulletList().run(),
    },
    {
      title: 'Liste numérotée',
      description: 'Liste ordonnée',
      icon: <ListOrdered size={20} />,
      category: 'Listes',
      action: (ed) => ed.chain().focus().toggleOrderedList().run(),
    },
    {
      title: 'Liste de tâches',
      description: 'Cases à cocher',
      icon: <ListChecks size={20} />,
      category: 'Listes',
      action: (ed) => ed.chain().focus().toggleTaskList().run(),
    },
    {
      title: 'Image',
      description: 'Insérer une image',
      icon: <ImageIcon size={20} />,
      category: 'Médias',
      action: () => onImageClick(),
    },
    {
      title: 'Vidéo YouTube',
      description: 'Embarquer une vidéo',
      icon: <Video size={20} />,
      category: 'Médias',
      action: (ed) => {
        const url = window.prompt('URL YouTube :');
        if (url) ed.chain().focus().setYoutubeVideo({ src: url }).run();
      },
    },
    {
      title: 'Citation',
      description: 'Bloc de citation',
      icon: <Quote size={20} />,
      category: 'Blocs',
      action: (ed) => ed.chain().focus().toggleBlockquote().run(),
    },
    {
      title: 'Code',
      description: 'Bloc de code avec coloration',
      icon: <Code2 size={20} />,
      category: 'Blocs',
      action: (ed) => ed.chain().focus().toggleCodeBlock().run(),
    },
    {
      title: 'Séparateur',
      description: 'Ligne horizontale',
      icon: <Minus size={20} />,
      category: 'Blocs',
      action: (ed) => ed.chain().focus().setHorizontalRule().run(),
    },
    {
      title: 'Tableau',
      description: 'Grille de données',
      icon: <TableIcon size={20} />,
      category: 'Blocs',
      action: (ed) =>
        ed.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
    {
      title: 'Callout Info',
      description: 'Bloc informatif bleu',
      icon: <Info size={20} />,
      category: 'Callouts',
      action: (ed) => (ed as any).chain().focus().setCallout({ type: 'info' }).run(),
    },
    {
      title: 'Callout Attention',
      description: 'Bloc d\'avertissement orange',
      icon: <AlertTriangle size={20} />,
      category: 'Callouts',
      action: (ed) => (ed as any).chain().focus().setCallout({ type: 'warning' }).run(),
    },
    {
      title: 'Callout Succès',
      description: 'Bloc de confirmation vert',
      icon: <CheckCircle2 size={20} />,
      category: 'Callouts',
      action: (ed) => (ed as any).chain().focus().setCallout({ type: 'success' }).run(),
    },
    {
      title: 'Callout Astuce',
      description: 'Bloc conseil violet',
      icon: <Lightbulb size={20} />,
      category: 'Callouts',
      action: (ed) => (ed as any).chain().focus().setCallout({ type: 'tip' }).run(),
    },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  const executeCommand = useCallback(
    (index: number) => {
      const item = filteredItems[index];
      if (item) {
        // Delete the slash character and search text
        const { state } = editor;
        const { from } = state.selection;
        const textBefore = state.doc.textBetween(
          Math.max(0, from - search.length - 1),
          from,
          '\0'
        );
        const slashPos = textBefore.lastIndexOf('/');
        if (slashPos >= 0) {
          const deleteFrom = from - search.length - 1;
          editor.chain().focus().deleteRange({ from: deleteFrom, to: from }).run();
        }
        item.action(editor);
        setIsOpen(false);
        setSearch('');
        setSelectedIndex(0);
      }
    },
    [editor, filteredItems, search]
  );

  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        executeCommand(selectedIndex);
      } else if (event.key === 'Escape') {
        setIsOpen(false);
        setSearch('');
        setSelectedIndex(0);
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, selectedIndex, filteredItems, executeCommand]);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      const { state } = editor;
      const { from } = state.selection;
      const textBefore = state.doc.textBetween(
        Math.max(0, from - 50),
        from,
        '\0'
      );

      const slashMatch = textBefore.match(/\/([^\s/]*)$/);

      if (slashMatch) {
        setSearch(slashMatch[1]);
        setIsOpen(true);
        setSelectedIndex(0);

        // Get cursor position for menu placement
        const coords = editor.view.coordsAtPos(from);
        const editorRect = editor.view.dom.closest(`.${styles.premiumEditorContainer}`)?.getBoundingClientRect();
        if (editorRect) {
          setPosition({
            top: coords.bottom - editorRect.top + 8,
            left: coords.left - editorRect.left,
          });
        }
      } else {
        if (isOpen) {
          setIsOpen(false);
          setSearch('');
          setSelectedIndex(0);
        }
      }
    };

    editor.on('update', handleUpdate);
    editor.on('selectionUpdate', handleUpdate);
    return () => {
      editor.off('update', handleUpdate);
      editor.off('selectionUpdate', handleUpdate);
    };
  }, [editor, isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (!menuRef.current) return;
    const selectedEl = menuRef.current.querySelector(`[data-index="${selectedIndex}"]`);
    selectedEl?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!isOpen || filteredItems.length === 0) return null;

  // Group items by category
  const categories = [...new Set(filteredItems.map((item) => item.category))];

  let globalIndex = 0;

  return (
    <div
      ref={menuRef}
      className={styles.slashMenu}
      style={{ top: position.top, left: position.left }}
    >
      <div className={styles.slashMenuHeader}>
        <span>Blocs</span>
        <kbd className={styles.slashKbd}>↑↓ pour naviguer</kbd>
      </div>
      <div className={styles.slashMenuScroll}>
        {categories.map((category) => (
          <div key={category} className={styles.slashCategory}>
            <div className={styles.slashCategoryLabel}>{category}</div>
            {filteredItems
              .filter((item) => item.category === category)
              .map((item) => {
                const itemIndex = globalIndex++;
                return (
                  <button
                    key={item.title}
                    type="button"
                    className={styles.slashItem}
                    data-index={itemIndex}
                    data-selected={itemIndex === selectedIndex}
                    onClick={() => executeCommand(itemIndex)}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                  >
                    <div className={styles.slashItemIcon}>{item.icon}</div>
                    <div className={styles.slashItemText}>
                      <span className={styles.slashItemTitle}>{item.title}</span>
                      <span className={styles.slashItemDesc}>{item.description}</span>
                    </div>
                  </button>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}
