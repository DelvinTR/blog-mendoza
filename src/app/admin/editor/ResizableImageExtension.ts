import Image from '@tiptap/extension-image';

/**
 * ResizableImage extends TipTap's Image with a `width` attribute.
 * The width is stored as a string like "25%", "50%", "75%", "100%", or "65%" (default).
 * This attribute is rendered as both a CSS style and an HTML attribute
 * so it can be read by both the editor CSS and the NotebookReader paginator.
 */
export const ResizableImage = Image.extend({
  name: 'resizableImage',

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '65%',
        parseHTML: (element: HTMLElement) =>
          element.getAttribute('width') || element.style.maxWidth || '65%',
        renderHTML: (attributes: Record<string, string>) => {
          return {
            width: attributes.width,
            style: `max-width: ${attributes.width}; display: block; margin: 16px auto;`,
          };
        },
      },
    };
  },
});
