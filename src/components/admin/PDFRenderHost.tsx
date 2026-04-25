// src/components/admin/PDFRenderHost.tsx
// Render QuotePDFTemplate inside a hidden offscreen iframe at exact A4 inner-width (720px).
// This isolates the template from parent layout (Dialog, admin chrome, Tailwind) so html2canvas
// captures predictable geometry. Exposes a ref API for download / print.
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import QuotePDFTemplate from './QuotePDFTemplate';

export interface PDFRenderHostHandle {
  /** Download as PDF using pdf-helper (with running header/footer/page numbers) */
  download: (filename: string, headerLeft: string, headerRight: string, footerCenter?: string) => Promise<void>;
  /** Open native browser print dialog from iframe */
  print: () => void;
  /** True when iframe content (DOM + fonts + images) is ready to capture */
  isReady: boolean;
}

interface PDFRenderHostProps {
  quote: any;
  revision: any;
  companyInfo: any;
  salePerson?: any;
  bankAccounts?: any[];
}

/** Width in CSS px = A4 portrait (210mm) - 15mm margins × 2 = 180mm ≈ 680px @ 96dpi.
 *  We use 720px to give a small visual buffer; pdf-helper's html2canvas windowWidth=794 (full A4)
 *  so the iframe content fits comfortably inside the canvas viewport. */
const IFRAME_WIDTH = 720;

const PDFRenderHost = forwardRef<PDFRenderHostHandle, PDFRenderHostProps>(function PDFRenderHost(
  { quote, revision, companyInfo, salePerson, bankAccounts },
  ref
) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize iframe document once mounted
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const setup = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      doc.open();
      doc.write(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background: #fff;
        font-family: 'IBM Plex Sans Thai', Arial, Helvetica, sans-serif;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      #pdf-mount {
        width: ${IFRAME_WIDTH}px;
        margin: 0 auto;
      }
      #pdf-mount #quote-pdf-template {
        width: ${IFRAME_WIDTH}px !important;
        max-width: ${IFRAME_WIDTH}px !important;
        padding: 0 !important;
        margin: 0 !important;
        box-sizing: border-box;
      }
      @page { size: A4 portrait; margin: 12mm; }
    </style>
  </head>
  <body>
    <div id="pdf-mount"></div>
  </body>
</html>`);
      doc.close();

      const mount = doc.getElementById('pdf-mount');
      if (mount) setMountNode(mount as HTMLElement);
    };

    if (iframe.contentDocument?.readyState === 'complete') {
      setup();
    } else {
      iframe.addEventListener('load', setup, { once: true });
    }
  }, []);

  // Track readiness: fonts + images inside iframe loaded
  useEffect(() => {
    if (!mountNode) {
      setIsReady(false);
      return;
    }
    const win = iframeRef.current?.contentWindow as any;
    const doc = iframeRef.current?.contentDocument;
    if (!win || !doc) return;

    let cancelled = false;
    const checkReady = async () => {
      try {
        await (doc as any).fonts?.ready;
        const imgs = Array.from(doc.images || []) as HTMLImageElement[];
        await Promise.all(
          imgs.map((img) =>
            img.complete && img.naturalWidth > 0
              ? Promise.resolve()
              : new Promise<void>((res) => {
                  img.addEventListener('load', () => res(), { once: true });
                  img.addEventListener('error', () => res(), { once: true });
                  setTimeout(() => res(), 3000);
                })
          )
        );
        // Wait one frame for layout to settle after React renders into portal
        await new Promise<void>((res) => setTimeout(res, 100));
        if (!cancelled) setIsReady(true);
      } catch {
        if (!cancelled) setIsReady(true);
      }
    };
    // Re-check whenever children of mountNode change (template mounted/updated)
    setIsReady(false);
    const obs = new MutationObserver(() => {
      setIsReady(false);
      checkReady();
    });
    obs.observe(mountNode, { childList: true, subtree: true });
    checkReady();

    return () => {
      cancelled = true;
      obs.disconnect();
    };
  }, [mountNode, quote, revision, companyInfo, salePerson, bankAccounts]);

  // Wait until isReady; with a hard timeout fallback
  const waitReady = useCallback(async () => {
    const start = Date.now();
    while (!isReady && Date.now() - start < 5000) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }, [isReady]);

  useImperativeHandle(ref, () => ({
    isReady,
    download: async (filename, headerLeft, headerRight, footerCenter) => {
      await waitReady();
      const doc = iframeRef.current?.contentDocument;
      const el = doc?.getElementById('quote-pdf-template') as HTMLElement | null;
      if (!el) throw new Error('PDF template not found in iframe');
      const { generatePDFWithHeaderFooter } = await import('@/lib/pdf-helper');
      await generatePDFWithHeaderFooter(el, {
        filename,
        headerLeft,
        headerRight,
        footerCenter,
      });
    },
    print: () => {
      const win = iframeRef.current?.contentWindow;
      if (!win) return;
      try {
        win.focus();
        win.print();
      } catch (e) {
        console.error('iframe print failed:', e);
      }
    },
  }), [isReady, waitReady]);

  return (
    <>
      <iframe
        ref={iframeRef}
        title="pdf-render-host"
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-99999px',
          top: 0,
          width: `${IFRAME_WIDTH}px`,
          // Tall enough for any reasonable quote; html2canvas captures full scrollHeight regardless.
          height: '5000px',
          border: 0,
          visibility: 'hidden',
        }}
      />
      {mountNode &&
        createPortal(
          <QuotePDFTemplate
            quote={quote}
            revision={revision}
            companyInfo={companyInfo}
            salePerson={salePerson}
            bankAccounts={bankAccounts}
          />,
          mountNode
        )}
    </>
  );
});

export default PDFRenderHost;
