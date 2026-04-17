/**
 * html2pdf helper — generate PDF พร้อม header/footer ทุกหน้า
 *
 * ใช้แทนการเรียก html2pdf().set(...).from(el).save() ตรงๆ
 * เพื่อให้ทุกเอกสารในระบบมี:
 *   - หัวกระดาษย่อ (ชื่อบริษัท + เลขที่เอกสาร) ตั้งแต่หน้า 2
 *   - หมายเลขหน้า (เช่น 1/2, 2/2) ทุกหน้า
 */

interface PDFHeaderFooterOptions {
  filename: string;
  /** ข้อความหัวกระดาษซ้าย (ปกติคือชื่อบริษัท) */
  headerLeft: string;
  /** ข้อความหัวกระดาษขวา (ปกติคือเลขที่เอกสาร เช่น QT2026... Rev #1) */
  headerRight: string;
  /** ข้อความ footer กลาง (optional — ปกติคือ "เอกสารออกโดยระบบ") */
  footerCenter?: string;
  margin?: number; // mm
}

export async function generatePDFWithHeaderFooter(
  element: HTMLElement,
  opts: PDFHeaderFooterOptions
): Promise<void> {
  const html2pdf = (await import('html2pdf.js')).default;
  const margin = opts.margin ?? 12;

  const worker = html2pdf()
    .set({
      margin: [22, margin, 18, margin], // top เผื่อ header, bottom เผื่อ page number
      filename: opts.filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy', 'avoid-all'] },
    })
    .from(element)
    .toPdf();

  const pdfWorker = await worker.get('pdf');
  const totalPages = pdfWorker.internal.getNumberOfPages();
  const pageWidth = pdfWorker.internal.pageSize.getWidth();
  const pageHeight = pdfWorker.internal.pageSize.getHeight();

  for (let i = 1; i <= totalPages; i++) {
    pdfWorker.setPage(i);

    // ===== Header =====
    // แสดงตั้งแต่หน้า 2 เป็นต้นไป (หน้าแรกมี header เต็มอยู่แล้วใน template)
    if (i > 1) {
      pdfWorker.setFontSize(9);
      pdfWorker.setTextColor(80);
      pdfWorker.text(opts.headerLeft, margin, 12);
      pdfWorker.text(opts.headerRight, pageWidth - margin, 12, { align: 'right' });

      // เส้นใต้หัวกระดาษ
      pdfWorker.setDrawColor(180);
      pdfWorker.setLineWidth(0.3);
      pdfWorker.line(margin, 15, pageWidth - margin, 15);
    }

    // ===== Footer: หมายเลขหน้า =====
    pdfWorker.setFontSize(8);
    pdfWorker.setTextColor(120);
    const pageLabel = `หน้า ${i} / ${totalPages}`;
    pdfWorker.text(pageLabel, pageWidth - margin, pageHeight - 8, { align: 'right' });

    if (opts.footerCenter) {
      pdfWorker.text(opts.footerCenter, pageWidth / 2, pageHeight - 8, { align: 'center' });
    }
  }

  pdfWorker.save(opts.filename);
}
