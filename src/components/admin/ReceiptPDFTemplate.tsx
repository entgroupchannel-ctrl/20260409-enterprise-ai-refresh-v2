interface ReceiptItem {
  id: string;
  product_name: string;
  product_description: string | null;
  sku: string | null;
  quantity: number;
  unit: string | null;
  unit_price: number;
  discount_amount: number | null;
  line_total: number;
}

interface ReceiptPDFTemplateProps {
  receipt: {
    id: string;
    receipt_number: string;
    receipt_date: string;
    amount: number;
    payment_method: string | null;
    notes: string | null;
    customer_name: string;
    customer_company: string | null;
    customer_address: string | null;
    customer_tax_id: string | null;
    customer_branch_type?: string | null;
    customer_branch_code?: string | null;
    customer_branch_name?: string | null;
  };
  items: ReceiptItem[];
  subtotal: number;
  discount_amount?: number;
  discount_percent?: number;
  vat_amount?: number;
  vat_percent?: number;
  withholding_tax_amount?: number;
  withholding_tax_percent?: number;
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

  const str = num.toString();
  const len = str.length;
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
  items,
  subtotal,
  discount_amount = 0,
  discount_percent = 0,
  vat_amount = 0,
  vat_percent = 7,
  withholding_tax_amount = 0,
  withholding_tax_percent = 3,
  companyInfo,
  invoiceNumber,
  taxInvoiceNumber,
  copyType = 'original',
}: ReceiptPDFTemplateProps) {
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });

  const companyBranchDisplay = () => {
    if (companyInfo.branch_type === 'head_office') return ' (สำนักงานใหญ่)';
    if (companyInfo.branch_type === 'branch' && companyInfo.branch_name) return ` (สาขา: ${companyInfo.branch_name})`;
    return '';
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
    <div id="receipt-pdf-template" className="bg-white text-black p-8 font-sans" style={{ width: '210mm', minHeight: '297mm', fontFamily: "'IBM Plex Sans Thai', Arial, sans-serif" }}>
      {/* Header — GREEN for Receipt */}
      <div className="flex justify-between items-start mb-8 pb-4 border-b-2 border-green-600">
        <div className="flex items-start gap-4 flex-1">
          {companyInfo.logo_url && (
            <img src={companyInfo.logo_url} alt="Logo" className="w-20 h-20 object-contain" />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-green-700 mb-1">{companyInfo.name_th}</h1>
            {companyInfo.name_en && <p className="text-sm text-gray-600 italic">{companyInfo.name_en}</p>}
            {companyInfo.address_th && <p className="text-xs text-gray-700 mt-1">{companyInfo.address_th}</p>}
            <div className="text-xs text-gray-700 mt-1 flex flex-wrap gap-x-3">
              {companyInfo.phone && <span>โทร: {companyInfo.phone}</span>}
              {companyInfo.fax && <span>แฟกซ์: {companyInfo.fax}</span>}
              {companyInfo.email && <span>Email: {companyInfo.email}</span>}
            </div>
            {companyInfo.tax_id && (
              <p className="text-xs text-gray-700 mt-1">
                เลขประจำตัวผู้เสียภาษี: <span className="font-semibold">{companyInfo.tax_id}</span>
                {companyBranchDisplay()}
              </p>
            )}
          </div>
        </div>
        <div className="shrink-0 ml-4 flex flex-col items-end">
          <h2 className="text-3xl font-bold text-green-700">ใบเสร็จรับเงิน</h2>
          <p className="text-sm text-gray-600">Receipt</p>
          <div className={`mt-2 inline-flex items-center justify-center px-4 py-1 rounded text-xs font-semibold leading-none ${
            copyType === 'original'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-gray-100 text-gray-700 border border-gray-300'
          }`}>
            <span className="text-center">
              {copyType === 'original' ? 'ต้นฉบับ (ORIGINAL)' : 'สำเนา (COPY)'}
            </span>
          </div>
        </div>
      </div>

      {/* Customer + Meta */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2 pb-1 border-b">ผู้จ่ายเงิน</h3>
          <p className="font-bold text-base">{receipt.customer_name}</p>
          {receipt.customer_company && <p className="text-sm">{receipt.customer_company}</p>}
          {receipt.customer_address && (
            <p className="text-xs text-gray-700 whitespace-pre-line mt-1">{receipt.customer_address}</p>
          )}
          {receipt.customer_tax_id && (
            <p className="text-xs text-gray-700 mt-1">
              เลขประจำตัวผู้เสียภาษี: <span className="font-semibold">{receipt.customer_tax_id}</span>
            </p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2 pb-1 border-b">รายละเอียด</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="text-gray-600 py-0.5">เลขที่:</td>
                <td className="text-right font-bold font-mono">{receipt.receipt_number}</td>
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

      {/* Items Table */}
      {items.length > 0 ? (
        <table className="w-full mb-6 border-collapse">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="text-left p-2 text-sm">ลำดับ</th>
              <th className="text-left p-2 text-sm">รายการ</th>
              <th className="text-center p-2 text-sm w-16">จำนวน</th>
              <th className="text-right p-2 text-sm w-24">ราคา/หน่วย</th>
              <th className="text-right p-2 text-sm w-24">ส่วนลด</th>
              <th className="text-right p-2 text-sm w-28">รวม</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="p-2 text-sm align-top">{idx + 1}</td>
                <td className="p-2 text-sm align-top">
                  <p className="font-semibold">{item.product_name}</p>
                  {item.sku && <p className="text-xs text-gray-500">SKU: {item.sku}</p>}
                  {item.product_description && (
                    <p className="text-xs text-gray-600 whitespace-pre-line mt-0.5">{item.product_description}</p>
                  )}
                </td>
                <td className="p-2 text-sm text-center align-top">{item.quantity} {item.unit || ''}</td>
                <td className="p-2 text-sm text-right align-top">{formatCurrency(item.unit_price)}</td>
                <td className="p-2 text-sm text-right align-top">
                  {(item.discount_amount && item.discount_amount > 0) ? formatCurrency(item.discount_amount) : '-'}
                </td>
                <td className="p-2 text-sm text-right align-top font-semibold">{formatCurrency(item.line_total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <p className="text-sm text-gray-700">
            ค่าสินค้า/บริการ
            {taxInvoiceNumber && ` ตามใบกำกับภาษีเลขที่ ${taxInvoiceNumber}`}
            {!taxInvoiceNumber && invoiceNumber && ` ตามใบวางบิลเลขที่ ${invoiceNumber}`}
          </p>
        </div>
      )}

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <table className="text-sm">
          <tbody>
            <tr>
              <td className="py-1 pr-8 text-gray-700">ยอดรวม:</td>
              <td className="py-1 text-right font-semibold w-32">{formatCurrency(subtotal)} บาท</td>
            </tr>
            {discount_amount > 0 && (
              <tr>
                <td className="py-1 pr-8 text-green-700">ส่วนลด {discount_percent ? `${discount_percent}%` : ''}:</td>
                <td className="py-1 text-right text-green-700">-{formatCurrency(discount_amount)} บาท</td>
              </tr>
            )}
            {vat_amount > 0 && (
              <tr>
                <td className="py-1 pr-8 text-gray-700">VAT {vat_percent}%:</td>
                <td className="py-1 text-right">{formatCurrency(vat_amount)} บาท</td>
              </tr>
            )}
            {withholding_tax_amount > 0 && (
              <tr>
                <td className="py-1 pr-8 text-orange-700">หัก ณ ที่จ่าย {withholding_tax_percent}%:</td>
                <td className="py-1 text-right text-orange-700">-{formatCurrency(withholding_tax_amount)} บาท</td>
              </tr>
            )}
            <tr className="border-t-2 border-gray-800">
              <td className="py-2 pr-8 font-bold text-base">จำนวนเงินที่รับ:</td>
              <td className="py-2 text-right font-bold text-base text-green-700">{formatCurrency(receipt.amount)} บาท</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Thai amount text */}
      <div className="mb-6 text-center italic text-sm text-gray-700">
        ({numberToThaiText(receipt.amount)})
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
      <div className="grid grid-cols-2 gap-8 mt-12">
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2">
            <p className="text-sm font-semibold">ผู้จ่ายเงิน</p>
            <p className="text-xs text-gray-600 mt-1">วันที่: ______________</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2">
            <p className="text-sm font-semibold">ผู้รับเงิน</p>
            <p className="text-xs text-gray-600 mt-1">วันที่: ______________</p>
          </div>
        </div>
      </div>

      {/* Footer — มาตรา 105 */}
      <div className="mt-8 pt-4 border-t text-center text-xs text-gray-500">
        เอกสารนี้ออกโดยระบบอัตโนมัติ — มาตรา 105 แห่งประมวลรัษฎากร
      </div>
    </div>
  );
}
