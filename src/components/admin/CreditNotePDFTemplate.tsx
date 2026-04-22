const REASON_LABELS: Record<string, string> = {
  return: 'สินค้าคืน',
  damaged: 'ของเสียหาย',
  price_correction: 'ปรับปรุงราคา',
  quantity_error: 'จำนวนผิดพลาด',
  additional_discount: 'ส่วนลดเพิ่มเติม',
  service_cancelled: 'ยกเลิกบริการ',
  other: 'อื่นๆ',
};

interface Props {
  creditNote: {
    credit_note_number: string;
    credit_note_date: string;
    customer_name: string;
    customer_company: string | null;
    customer_address: string | null;
    customer_tax_id: string | null;
    customer_branch_type: string | null;
    customer_branch_code: string | null;
    customer_branch_name: string | null;
    reason_code: string;
    reason_detail: string;
    subtotal: number;
    vat_amount: number;
    grand_total: number;
    adjustment_target: string;
    status: string;
    notes: string | null;
  };
  items: Array<{
    product_name: string;
    product_description: string | null;
    sku: string | null;
    quantity: number;
    unit: string;
    unit_price: number;
    line_total: number;
  }>;
  companyInfo: {
    name_th: string;
    name_en: string | null;
    address_th: string | null;
    phone: string | null;
    fax: string | null;
    email: string | null;
    tax_id: string | null;
    branch_type: string | null;
    branch_code: string | null;
    branch_name: string | null;
    logo_url: string | null;
  };
  originalTaxInvoiceNumber?: string;
}

export default function CreditNotePDFTemplate({
  creditNote,
  items,
  companyInfo,
  originalTaxInvoiceNumber,
}: Props) {
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });

  const branchDisplay = () => {
    if (!creditNote.customer_branch_code) return null;
    if (creditNote.customer_branch_code === '00000') return 'สำนักงานใหญ่ (00000)';
    return `${creditNote.customer_branch_code}${creditNote.customer_branch_name ? ` (${creditNote.customer_branch_name})` : ''}`;
  };

  const companyBranchDisplay = () => {
    if (companyInfo.branch_type === 'head_office') return ' (สำนักงานใหญ่)';
    if (companyInfo.branch_type === 'branch' && companyInfo.branch_name) return ` (สาขา: ${companyInfo.branch_name})`;
    return '';
  };

  const isVoided = creditNote.status === 'voided';

  return (
    <div
      id="credit-note-pdf-template"
      className="bg-white p-8 max-w-4xl mx-auto relative"
      style={{ fontFamily: "'IBM Plex Sans Thai', Arial, sans-serif" }}
    >
      {isVoided && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span className="text-red-300 text-8xl font-black rotate-[-30deg] opacity-30 select-none">
            ยกเลิก
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-red-600">
        <div className="flex items-start gap-4 flex-1">
          {companyInfo.logo_url && (
            <img src={companyInfo.logo_url} alt={companyInfo.name_th} className="w-20 h-20 object-contain"  loading="lazy" decoding="async"/>
          )}
          <div>
            <h1 className="text-2xl font-bold text-red-700 mb-1">{companyInfo.name_th}</h1>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-0.5">ใบลดหนี้</h2>
          <p className="text-sm text-gray-500 mb-2">Credit Note</p>
          <div className="inline-block px-3 py-1 rounded text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
            ต้นฉบับ (ORIGINAL)
          </div>
        </div>
      </div>

      {/* Customer + Meta */}
      <div className="grid grid-cols-2 gap-8 mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">ผู้ซื้อ</h3>
          <p className="font-semibold text-base">{creditNote.customer_name}</p>
          {creditNote.customer_company && <p className="text-sm text-gray-700">{creditNote.customer_company}</p>}
          {creditNote.customer_address && (
            <p className="text-xs text-gray-600 leading-relaxed mt-1 whitespace-pre-line">{creditNote.customer_address}</p>
          )}
          {creditNote.customer_tax_id && (
            <p className="text-xs text-gray-700 mt-1">
              เลขประจำตัวผู้เสียภาษี: <span className="font-mono font-semibold">{creditNote.customer_tax_id}</span>
            </p>
          )}
          {branchDisplay() && (
            <p className="text-xs text-gray-600">สาขา: {branchDisplay()}</p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">รายละเอียด</h3>
          <table className="text-sm w-full">
            <tbody>
              <tr>
                <td className="text-gray-600 py-0.5">เลขที่:</td>
                <td className="text-right font-semibold font-mono">{creditNote.credit_note_number}</td>
              </tr>
              <tr>
                <td className="text-gray-600 py-0.5">วันที่:</td>
                <td className="text-right">{formatDate(creditNote.credit_note_date)}</td>
              </tr>
              {originalTaxInvoiceNumber && (
                <tr>
                  <td className="text-gray-600 py-0.5">อ้างอิง TI:</td>
                  <td className="text-right font-mono text-xs">{originalTaxInvoiceNumber}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reason */}
      <div className="bg-red-50 border border-red-200 p-3 mb-4 rounded">
        <p className="text-sm">
          <strong>เหตุผล:</strong> {REASON_LABELS[creditNote.reason_code] || creditNote.reason_code}
        </p>
        <p className="text-sm mt-1">
          <strong>รายละเอียด:</strong> {creditNote.reason_detail}
        </p>
      </div>

      {/* Items Table */}
      <table className="w-full mb-6 border-collapse">
        <thead>
          <tr className="bg-red-600 text-white">
            <th className="text-left p-2 text-sm w-10">ลำดับ</th>
            <th className="text-left p-2 text-sm">รายการที่ลดหนี้</th>
            <th className="text-center p-2 text-sm w-16">จำนวน</th>
            <th className="text-right p-2 text-sm w-24">ราคา/หน่วย</th>
            <th className="text-right p-2 text-sm w-28">รวม</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} className="border-b border-gray-200">
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
              <td className="p-2 text-sm text-right align-top font-semibold">{formatCurrency(item.line_total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <table className="text-sm">
          <tbody>
            <tr>
              <td className="py-1 pr-8 text-gray-700">มูลค่าสินค้า/บริการ:</td>
              <td className="py-1 text-right font-semibold w-32">{formatCurrency(creditNote.subtotal)} บาท</td>
            </tr>
            <tr>
              <td className="py-1 pr-8 text-gray-700">ภาษีมูลค่าเพิ่ม 7%:</td>
              <td className="py-1 text-right">{formatCurrency(creditNote.vat_amount)} บาท</td>
            </tr>
            <tr className="border-t-2 border-gray-800">
              <td className="py-2 pr-8 font-bold text-base text-red-700">ยอดลดหนี้รวม:</td>
              <td className="py-2 text-right font-bold text-base text-red-700">-{formatCurrency(creditNote.grand_total)} บาท</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Grand total box */}
      <div className="mt-4 p-3 border-2 border-dashed border-red-400 text-center rounded">
        <p className="text-sm text-gray-700">จำนวนเงินที่ลดหนี้รวมทั้งสิ้น:</p>
        <p className="text-xl font-bold text-red-700">-฿{formatCurrency(creditNote.grand_total)}</p>
      </div>

      {/* Notes */}
      {creditNote.notes && (
        <div className="space-y-4 text-sm border-t pt-4 mt-4 mb-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">หมายเหตุ:</h4>
            <p className="text-gray-600 whitespace-pre-line">{creditNote.notes}</p>
          </div>
        </div>
      )}

      {/* Signature */}
      <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t">
        <div className="text-center">
          <div className="border-b border-gray-400 mb-2 pb-12"></div>
          <p className="text-sm">ผู้รับเอกสาร</p>
          <p className="text-xs text-gray-600 mt-1">วันที่: ______________</p>
        </div>
        <div className="text-center">
          <div className="border-b border-gray-400 mb-2 pb-12"></div>
          <p className="text-sm">ผู้ออกเอกสาร</p>
          <p className="text-xs text-gray-600 mt-1">วันที่: ______________</p>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t text-center text-xs text-gray-500">
        <p>เอกสารนี้ออกโดยระบบอัตโนมัติ</p>
      </div>
    </div>
  );
}
