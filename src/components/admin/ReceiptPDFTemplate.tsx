import { useCompanySettings } from '@/hooks/useCompanySettings';

interface Props {
  receipt: {
    id: string;
    receipt_number: string;
    receipt_date: string;
    customer_name: string;
    customer_company: string | null;
    customer_address: string | null;
    customer_tax_id: string | null;
    amount: number;
    payment_method: string | null;
    notes: string | null;
  };
  companyInfo: {
    name_th: string;
    name_en: string | null;
    address_th: string | null;
    phone: string | null;
    fax: string | null;
    email: string | null;
    website: string | null;
    tax_id: string | null;
    branch_type: string | null;
    branch_code: string | null;
    branch_name: string | null;
    logo_url: string | null;
  };
  invoiceNumber?: string;
  taxInvoiceNumber?: string;
  copyType?: 'original' | 'copy';
}

/* ── Thai number-to-words ── */
function convertIntToThai(num: number): string {
  if (num === 0) return 'ศูนย์';
  const ones = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const positions = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน'];

  let result = '';
  const str = Math.abs(num).toString();
  const len = str.length;

  if (num >= 1_000_000) {
    const millions = Math.floor(num / 1_000_000);
    result += convertIntToThai(millions) + 'ล้าน';
    num = num % 1_000_000;
    if (num === 0) return result;
    const remainStr = num.toString();
    const remainLen = remainStr.length;
    for (let i = 0; i < remainLen; i++) {
      const d = parseInt(remainStr[i]);
      const pos = remainLen - i - 1;
      if (d === 0) continue;
      if (pos === 1 && d === 1) { result += 'สิบ'; continue; }
      if (pos === 1 && d === 2) { result += 'ยี่สิบ'; continue; }
      if (pos === 0 && d === 1 && remainLen > 1) { result += 'เอ็ด'; continue; }
      result += ones[d] + positions[pos];
    }
    return result;
  }

  for (let i = 0; i < len; i++) {
    const d = parseInt(str[i]);
    const pos = len - i - 1;
    if (d === 0) continue;
    if (pos === 1 && d === 1) { result += 'สิบ'; continue; }
    if (pos === 1 && d === 2) { result += 'ยี่สิบ'; continue; }
    if (pos === 0 && d === 1 && len > 1) { result += 'เอ็ด'; continue; }
    result += ones[d] + positions[pos];
  }
  return result;
}

function numberToThaiText(num: number): string {
  const intPart = Math.floor(Math.abs(num));
  const decimalPart = Math.round((Math.abs(num) - intPart) * 100);

  let result = convertIntToThai(intPart) + 'บาท';
  if (decimalPart === 0) {
    result += 'ถ้วน';
  } else {
    result += convertIntToThai(decimalPart) + 'สตางค์';
  }
  return result;
}

export default function ReceiptPDFTemplate({
  receipt,
  companyInfo,
  invoiceNumber,
  taxInvoiceNumber,
  copyType = 'original',
}: Props) {
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });

  const companyBranchDisplay = () => {
    if (companyInfo.branch_type === 'head_office') return ' (สำนักงานใหญ่)';
    if (companyInfo.branch_type === 'branch' && companyInfo.branch_name) return ` (สาขา: ${companyInfo.branch_name})`;
    return '';
  };

  const paymentDescription = () => {
    if (taxInvoiceNumber) return `ค่าสินค้าตามใบกำกับภาษีเลขที่ ${taxInvoiceNumber}`;
    if (invoiceNumber) return `ค่าสินค้าตามใบวางบิลเลขที่ ${invoiceNumber}`;
    return 'ค่าสินค้า/บริการ';
  };

  const paymentMethodDisplay = () => {
    if (!receipt.payment_method) return '-';
    const map: Record<string, string> = {
      bank_transfer: 'โอนผ่านธนาคาร',
      cash: 'เงินสด',
      cheque: 'เช็ค',
      credit_card: 'บัตรเครดิต',
      promptpay: 'พร้อมเพย์',
    };
    return map[receipt.payment_method] || receipt.payment_method;
  };

  return (
    <div
      id="receipt-pdf-template"
      className="bg-white p-8 max-w-4xl mx-auto"
      style={{ fontFamily: "'IBM Plex Sans Thai', Arial, sans-serif" }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-green-600">
        <div className="flex items-start gap-4 flex-1">
          {companyInfo.logo_url && (
            <img src={companyInfo.logo_url} alt={companyInfo.name_th} className="w-20 h-20 object-contain" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-green-700 mb-1">{companyInfo.name_th}</h1>
            {companyInfo.name_en && <p className="text-sm text-gray-700 italic mb-1">{companyInfo.name_en}</p>}
            {companyInfo.address_th && <p className="text-xs text-gray-600 leading-relaxed">{companyInfo.address_th}</p>}
            <div className="flex flex-wrap gap-x-3 text-xs text-gray-600 mt-1">
              {companyInfo.phone && <span>โทร: {companyInfo.phone}</span>}
              {companyInfo.fax && <span>แฟกซ์: {companyInfo.fax}</span>}
              {companyInfo.email && <span>Email: {companyInfo.email}</span>}
            </div>
            {companyInfo.tax_id && (
              <p className="text-xs text-gray-700 mt-1">
                เลขประจำตัวผู้เสียภาษี: <span className="font-semibold font-mono">{companyInfo.tax_id}</span>
                {companyBranchDisplay()}
              </p>
            )}
          </div>
        </div>
        <div className="text-right ml-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-0.5">ใบเสร็จรับเงิน</h2>
          <p className="text-sm text-gray-500 mb-2">Receipt</p>
          <div className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
            copyType === 'original'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-gray-100 text-gray-700 border border-gray-300'
          }`}>
            {copyType === 'original' ? 'ต้นฉบับ (ORIGINAL)' : 'สำเนา (COPY)'}
          </div>
        </div>
      </div>

      {/* Customer + Meta */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">ผู้จ่ายเงิน</h3>
          <p className="font-semibold text-base">{receipt.customer_name}</p>
          {receipt.customer_company && <p className="text-sm text-gray-700">{receipt.customer_company}</p>}
          {receipt.customer_address && (
            <p className="text-xs text-gray-600 leading-relaxed mt-1 whitespace-pre-line">{receipt.customer_address}</p>
          )}
          {receipt.customer_tax_id && (
            <p className="text-xs text-gray-700 mt-1">
              เลขประจำตัวผู้เสียภาษี: <span className="font-mono font-semibold">{receipt.customer_tax_id}</span>
            </p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">รายละเอียด</h3>
          <table className="text-sm w-full">
            <tbody>
              <tr>
                <td className="text-gray-600 py-0.5">เลขที่:</td>
                <td className="text-right font-semibold font-mono">{receipt.receipt_number}</td>
              </tr>
              <tr>
                <td className="text-gray-600 py-0.5">วันที่:</td>
                <td className="text-right">{formatDate(receipt.receipt_date)}</td>
              </tr>
              <tr>
                <td className="text-gray-600 py-0.5">วิธีชำระ:</td>
                <td className="text-right">{paymentMethodDisplay()}</td>
              </tr>
              {invoiceNumber && (
                <tr>
                  <td className="text-gray-600 py-0.5">อ้างอิงใบวางบิล:</td>
                  <td className="text-right font-mono text-xs">{invoiceNumber}</td>
                </tr>
              )}
              {taxInvoiceNumber && (
                <tr>
                  <td className="text-gray-600 py-0.5">อ้างอิงใบกำกับภาษี:</td>
                  <td className="text-right font-mono text-xs">{taxInvoiceNumber}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment description */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">รายการที่รับเงิน:</h4>
        <p className="text-sm text-gray-800">{paymentDescription()}</p>
      </div>

      {/* Amount block */}
      <div className="mb-8 text-center">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">จำนวนเงินที่รับ</h4>
        <div className="inline-block border-2 border-green-600 rounded-lg px-8 py-4 bg-green-50">
          <p className="text-3xl font-bold text-green-700">฿{formatCurrency(receipt.amount)}</p>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          ({numberToThaiText(receipt.amount)})
        </p>
      </div>

      {/* Notes */}
      {receipt.notes && (
        <div className="space-y-4 text-sm border-t pt-4 mb-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">หมายเหตุ:</h4>
            <p className="text-gray-600 whitespace-pre-line">{receipt.notes}</p>
          </div>
        </div>
      )}

      {/* Signature */}
      <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t">
        <div className="text-center">
          <div className="border-b border-gray-400 mb-2 pb-12"></div>
          <p className="text-sm">ผู้จ่ายเงิน</p>
          <p className="text-xs text-gray-600 mt-1">วันที่: ______________</p>
        </div>
        <div className="text-center">
          <div className="border-b border-gray-400 mb-2 pb-12"></div>
          <p className="text-sm">ผู้รับเงิน</p>
          <p className="text-xs text-gray-600 mt-1">วันที่: ______________</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t text-center text-xs text-gray-500">
        <p>เอกสารนี้ออกโดยระบบอัตโนมัติ — มาตรา 105 แห่งประมวลรัษฎากร</p>
      </div>
    </div>
  );
}
