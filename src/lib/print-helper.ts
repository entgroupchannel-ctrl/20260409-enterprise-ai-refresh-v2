/**
 * Open a print window that mirrors the on-screen preview.
 * Copies all stylesheets/fonts from the host document so Tailwind layout,
 * colors, and Thai fonts render exactly the same in the popup.
 */
export interface PrintPreviewOptions {
  /** Element to print (its outerHTML is copied) */
  element: HTMLElement;
  /** Window/document title (also used as filename in browser print dialog) */
  title: string;
  /** A4 side margin in mm (default 12) */
  pageMargin?: number;
  /** Inner content width in mm (default = 210 - 2*pageMargin) */
  contentWidth?: number;
  /** Optional callback fired when print dialog closes / window unloads */
  onDone?: () => void;
}

export function openPrintPreview({
  element,
  title,
  pageMargin = 12,
  contentWidth,
  onDone,
}: PrintPreviewOptions): boolean {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    onDone?.();
    return false;
  }

  const width = contentWidth ?? 210 - pageMargin * 2;

  // Copy <link rel="stylesheet"> and <style> tags so Tailwind CSS reaches the popup.
  // For external stylesheets (link), inline their resolved cssText when available so
  // the popup doesn't need to re-fetch them (which races with print()).
  const styleNodes = Array.from(
    document.querySelectorAll('link[rel="stylesheet"], style')
  );
  const styleTags = styleNodes
    .map((node) => {
      if (node.tagName === 'LINK') {
        const link = node as HTMLLinkElement;
        try {
          const sheet = link.sheet as CSSStyleSheet | null;
          if (sheet && sheet.cssRules) {
            const css = Array.from(sheet.cssRules).map((r) => r.cssText).join('\n');
            return `<style data-href="${link.href}">${css}</style>`;
          }
        } catch {
          // Cross-origin sheet — fall back to <link> tag
        }
      }
      return node.outerHTML;
    })
    .join('\n');

  const templateId = element.id || 'print-template';
  // Ensure clone has an id so our overrides apply
  const html = element.outerHTML.includes(`id="${templateId}"`)
    ? element.outerHTML
    : element.outerHTML.replace(/^<(\w+)/, `<$1 id="${templateId}"`);

  printWindow.document.write(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&display=swap" rel="stylesheet" />
    ${styleTags}
    <style>
      @page { size: A4 portrait; margin: ${pageMargin}mm; }
      html, body {
        margin: 0;
        padding: 0;
        background: #fff;
        font-family: 'IBM Plex Sans Thai', Arial, sans-serif;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      #print-root {
        width: ${width}mm;
        margin: 0 auto;
      }
      #print-root #${templateId} {
        width: 100% !important;
        min-height: auto !important;
        padding: 0 !important;
        margin: 0 !important;
        box-sizing: border-box;
      }
      @media print {
        html, body { width: ${width}mm; }
      }
    </style>
  </head>
  <body>
    <div id="print-root">${html}</div>
  </body>
</html>`);
  printWindow.document.close();

  const triggerPrint = () => {
    const doc: any = printWindow.document;
    const ready = doc.fonts?.ready ?? Promise.resolve();
    Promise.resolve(ready).then(() => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 250);
    });
    printWindow.onafterprint = () => {
      printWindow.close();
      onDone?.();
    };
    // Fallback if onafterprint never fires (some browsers)
    printWindow.addEventListener('beforeunload', () => onDone?.());
  };

  if (printWindow.document.readyState === 'complete') {
    triggerPrint();
  } else {
    printWindow.onload = triggerPrint;
  }

  return true;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
