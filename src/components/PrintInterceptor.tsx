import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

/**
 * Intercepts native browser print (Ctrl/Cmd+P, File → Print) on document pages
 * inside the admin/portal area. We can't legally block the print dialog itself
 * (browsers always allow it), but we:
 *   1. Show a toast pointing the user to the in-app "พิมพ์ / PDF" button which
 *      uses QuotePDFTemplate + html2pdf for properly formatted output.
 *   2. Rely on the global @media print CSS (in index.css) to strip admin chrome
 *      so any forced browser-print still produces a clean page.
 *
 * Mounted once at the App root.
 */
const DOCUMENT_ROUTE_PATTERNS = [
  /^\/admin\/quotes\/[^/]+/,
  /^\/admin\/invoices\/[^/]+/,
  /^\/admin\/sale-orders\/[^/]+/,
  /^\/admin\/receipts\/[^/]+/,
  /^\/admin\/tax-invoices\/[^/]+/,
  /^\/admin\/credit-notes\/[^/]+/,
  /^\/my-account\/(quotes|invoices|documents)\//,
  /^\/quote\//,
];

const isDocumentRoute = (pathname: string) =>
  DOCUMENT_ROUTE_PATTERNS.some((re) => re.test(pathname));

export function PrintInterceptor() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isDocumentRoute(pathname)) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const isPrintShortcut =
        (e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P');
      if (!isPrintShortcut) return;

      // Don't block — but warn. Toast is non-blocking so the user can still
      // use the native dialog if they really want to.
      toast.message('แนะนำให้ใช้ปุ่ม "พิมพ์ / PDF" ของระบบ', {
        description:
          'จะได้ PDF รูปแบบที่ถูกต้อง (ไม่มีแถบเมนูแอดมิน). ถ้ายืนยันใช้ Ctrl+P ระบบจะตัดส่วน UI ออกให้อัตโนมัติ',
        duration: 4500,
      });
    };

    const onBeforePrint = () => {
      // Helps html-to-image / html2canvas style consumers if they listen.
      document.body.classList.add('is-printing');
    };
    const onAfterPrint = () => {
      document.body.classList.remove('is-printing');
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('beforeprint', onBeforePrint);
    window.addEventListener('afterprint', onAfterPrint);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('beforeprint', onBeforePrint);
      window.removeEventListener('afterprint', onAfterPrint);
    };
  }, [pathname]);

  return null;
}

export default PrintInterceptor;
