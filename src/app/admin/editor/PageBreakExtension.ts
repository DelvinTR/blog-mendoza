import { Node, mergeAttributes } from '@tiptap/core';

/**
 * PageBreak node — rendered as a visual divider in the editor.
 * In the HTML output it produces <div data-page-break="true"></div>
 * which the paginator detects and forces a new page.
 */
export const PageBreak = Node.create({
  name: 'pageBreak',
  group: 'block',
  atom: true, // Not editable
  selectable: true,
  draggable: true,

  parseHTML() {
    return [{ tag: 'div[data-page-break]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-page-break': 'true',
        class: 'editor-page-break',
      }),
      ['span', { class: 'page-break-label' }, '— saut de page —'],
    ];
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => this.editor.commands.insertContent({ type: 'pageBreak' }),
    };
  },
});
