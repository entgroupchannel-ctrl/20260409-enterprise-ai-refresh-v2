// src/lib/quote-pdf-upload.ts
// Generate a Quote PDF in the browser and upload it to Supabase Storage
// so it can be linked from emails as a "ดาวน์โหลด PDF" button.

import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import { supabase } from '@/integrations/supabase/client';
import QuotePDFTemplate from '@/components/admin/QuotePDFTemplate';

interface GenerateQuotePdfParams {
  quote: any;
  revision: any;
  companyInfo: any;
  salePerson?: any;
  bankAccounts?: any[];
}

/**
 * Render the QuotePDFTemplate off-screen, generate a PDF blob via html2pdf,
 * upload it to the public 'quote-pdfs' bucket, and return the public URL.
 *
 * Returns null on failure (caller should not block email send).
 */
export async function generateAndUploadQuotePdf(
  params: GenerateQuotePdfParams
): Promise<string | null> {
  const { quote, revision, companyInfo, salePerson, bankAccounts } = params;

  // Mount off-screen container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-10000px';
  container.style.top = '0';
  container.style.width = '210mm'; // A4 width so layout matches print
  container.style.background = '#fff';
  document.body.appendChild(container);

  const root = createRoot(container);

  try {
    // Render template
    root.render(
      createElement(QuotePDFTemplate as any, {
        quote,
        revision,
        companyInfo,
        salePerson,
        bankAccounts: bankAccounts || [],
      })
    );

    // Wait for paint + any inline images to be available
    await new Promise((r) => setTimeout(r, 600));

    const element = container.querySelector('#quote-pdf-template') as HTMLElement | null;
    if (!element) {
      console.warn('[quote-pdf-upload] template element not found');
      return null;
    }

    const html2pdf = (await import('html2pdf.js')).default;
    const blob: Blob = await html2pdf()
      .set({
        margin: [15, 15, 20, 15],
        filename: `${quote.quote_number}-Rev${revision.revision_number}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      })
      .from(element)
      .outputPdf('blob');

    // Upload — overwrite if exists so re-sending always uses latest revision
    const path = `${quote.id}/${quote.quote_number}-Rev${revision.revision_number}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('quote-pdfs')
      .upload(path, blob, {
        contentType: 'application/pdf',
        upsert: true,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('[quote-pdf-upload] upload error:', uploadError);
      return null;
    }

    const { data: pub } = supabase.storage.from('quote-pdfs').getPublicUrl(path);
    return pub?.publicUrl ?? null;
  } catch (e) {
    console.error('[quote-pdf-upload] failed:', e);
    return null;
  } finally {
    // Cleanup
    try { root.unmount(); } catch {}
    try { document.body.removeChild(container); } catch {}
  }
}
