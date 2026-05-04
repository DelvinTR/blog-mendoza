/**
 * Shared pagination algorithm used by both NotebookReader (public) and the editor.
 * This is THE single source of truth for page break calculations.
 *
 * IMPORTANT: Any change here affects both the public reader AND the editor preview.
 */

export const PAGE_HEIGHT = 520;
export const DEFAULT_VIEW_WIDTH = 360;
export const GAP_BETWEEN_ELEMENTS = 25;

/**
 * Inject styles needed by the probe element for accurate measurement.
 * These mirror ArticleNotebook.css .page-text rules exactly.
 */
function ensureProbeStyles(): void {
  if (typeof document === 'undefined') return;
  const styleId = '__paginate-probe-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .paginate-probe { box-sizing: border-box; }
    .paginate-probe p { margin: 0 0 30px 0; line-height: 30px; text-transform: none; font-weight: 400; }
    .paginate-probe img {
      display: block; max-width: 65%; margin: 16px auto;
      border: 4px solid #fdfaf3; box-sizing: border-box;
    }
    .paginate-probe img[width="25%"] { max-width: 25%; }
    .paginate-probe img[width="50%"] { max-width: 50%; }
    .paginate-probe img[width="75%"] { max-width: 75%; }
    .paginate-probe img[width="100%"] { max-width: 100%; }
    .paginate-probe blockquote { margin: 0.8rem 0; padding: 12px 16px; }
    .paginate-probe ul, .paginate-probe ol { padding-left: 1.4rem; margin: 0 0 30px 0; }
    .paginate-probe li { margin-bottom: 0; }
    .paginate-probe h1, .paginate-probe h2, .paginate-probe h3 {
      margin: 30px 0 0 0; line-height: 30px; font-weight: 400;
    }
    .paginate-probe h1 { font-size: 26px; }
    .paginate-probe h2 { font-size: 22px; }
    .paginate-probe h3 { font-size: 20px; }
  `;
  document.head.appendChild(style);
}

/**
 * Paginate an HTML string into an array of page HTML strings.
 * Uses the same algorithm as the original NotebookReader.
 */
export async function paginateContent(
  html: string,
  viewWidth: number = DEFAULT_VIEW_WIDTH,
): Promise<string[]> {
  if (!html || typeof document === 'undefined') return [];

  ensureProbeStyles();

  // Wait for fonts
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  // Container to parse the HTML
  const container = document.createElement('div');
  container.className = 'paginate-probe';
  container.innerHTML = html;
  container.style.cssText = `position:absolute;visibility:hidden;width:${viewWidth}px;font-family:var(--font-caveat,cursive);font-size:19px;line-height:30px;padding:0;`;
  document.body.appendChild(container);

  // Wait for all images to load (critical for accurate height measurement)
  const images = Array.from(container.querySelectorAll('img'));
  await Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }),
  );

  // Reusable probe for measuring individual elements
  const probe = document.createElement('div');
  probe.className = 'paginate-probe';
  probe.style.cssText = `position:absolute;visibility:hidden;width:${viewWidth}px;font-family:var(--font-caveat,cursive);font-size:19px;line-height:30px;box-sizing:border-box;`;
  document.body.appendChild(probe);

  const measureHTML = (h: string): number => {
    probe.innerHTML = h;
    return probe.getBoundingClientRect().height;
  };

  const pagesArr: string[] = [];
  let currentPageHTML = '';
  let currentHeight = 0;

  const pushPage = () => {
    if (currentPageHTML !== '') {
      pagesArr.push(currentPageHTML);
      currentPageHTML = '';
      currentHeight = 0;
    }
  };

  const addHTML = (h: string, height: number) => {
    currentPageHTML += h;
    currentHeight += height;
  };

  const nodes = Array.from(container.childNodes);

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim()) continue;

    // Handle page break nodes
    if (node instanceof Element && node.hasAttribute('data-page-break')) {
      if (currentHeight > 0) {
        pushPage();
      }
      continue;
    }

    const nodeHTML =
      node instanceof Element ? node.outerHTML : `<p>${node.textContent}</p>`;
    const nodeHeight = measureHTML(nodeHTML);

    if (nodeHeight <= 5) continue;

    const gap = currentHeight > 0 ? GAP_BETWEEN_ELEMENTS : 0;

    if (currentHeight + nodeHeight + gap <= PAGE_HEIGHT) {
      addHTML(nodeHTML, nodeHeight + gap);
    } else {
      if (currentHeight > 0) {
        pushPage();
      }

      if (nodeHeight <= PAGE_HEIGHT) {
        addHTML(nodeHTML, nodeHeight);
      } else {
        // Handle splitting for paragraphs only
        if (
          node instanceof Element &&
          node.tagName.toLowerCase() === 'p'
        ) {
          const words = (node.textContent || '').split(' ');
          let currentChunk = '';

          for (const word of words) {
            const testChunk = currentChunk
              ? `${currentChunk} ${word}`
              : word;
            const testHeight = measureHTML(`<p>${testChunk}</p>`);

            if (currentHeight + testHeight + 10 > PAGE_HEIGHT) {
              if (currentChunk) {
                const chunkH = measureHTML(`<p>${currentChunk}</p>`);
                addHTML(`<p>${currentChunk}</p>`, chunkH);
                pushPage();
              }
              currentChunk = word;
            } else {
              currentChunk = testChunk;
            }
          }
          if (currentChunk.trim()) {
            const finalChunkH = measureHTML(`<p>${currentChunk}</p>`);
            addHTML(`<p>${currentChunk}</p>`, finalChunkH);
          }
        } else {
          addHTML(nodeHTML, nodeHeight);
        }
      }
    }
  }

  if (currentPageHTML) {
    pagesArr.push(currentPageHTML);
  }

  // Clean up
  document.body.removeChild(probe);
  document.body.removeChild(container);

  return pagesArr;
}
