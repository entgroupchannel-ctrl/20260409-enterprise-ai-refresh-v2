// src/lib/quote-pdf-upload.ts
// Generate a Quote PDF in the browser and upload it to Supabase Storage
// so it can be linked from emails as a "ดาวน์โหลด PDF" button.

import { supabase } from '@/integrations/supabase/client';
import { mergeRevisionWithQuote } from '@/lib/quote-pdf-merge';
import { getQuotePdfBlob } from '@/lib/quote-pdf-generator';

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

  try {
    const blob: Blob = await getQuotePdfBlob({
      quote,
      revision: mergeRevisionWithQuote(revision, quote),
      companyInfo,
      salePerson,
      bankAccounts: bankAccounts || [],
    });

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
  }
}
