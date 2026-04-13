import { formatFullDate } from '@/lib/format';

interface InvoicePDFTemplateProps {
  invoice: {
    id: string;
    invoice_number: string;
    invoice_date: string;
    due_date: string | null;
    payment_terms: string | null;
    invoice_type: string;
    status: string;
    
    customer_name: string;
    customer_company: string | null;
    customer_address: string | null;
    customer_tax_id: string | null;
    customer_branch_type: string | null;
    customer_branch_code: string | null;
    customer_branch_name: string | null;
    customer_phone: string | null;
    customer_email: string | null;
    
    subtotal: number;
    discount_percent: number | null;
    discount_amount: number | null;
    vat_percent: number | null;
    vat_amount: number | null;
    withholding_tax_percent: number | null;
    withholding_tax_amount: number | null;
    grand_total: number;
    
    installment_number: number | null;
    installment_total: number | null;
    downpayment_percent: number | null;
    
    notes: string | null;
    po_number: string | null;
    project_name: string | null;
  };
  items: Array<{
    id: string;
    product_name: string;
    product_description: string | null;
    sku: string | null;
    quantity: number;
    unit: string;
    unit_price: number;
    discount_amount: number | null;
    line_total: number;
  }>;
  company: {
    name: string;
    name_en: string | null;
    address: string;
    phone: string | null;
    email: string | null;
    tax_id: string;
    branch_type: string | null;
    branch_code: string | null;
    logo_url: string | null;
  } | null;
  bankAccounts?: Array<{
    bank_name: string;
    account_name: string;
    account_number: string;
    branch: string | null;
  }>;
}

const fmt = (n: number | null) =>
  (n || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const getTypeLabel = (t: string) => {
  const map: Record<string, string> = {
    full: 'เต็มจำนวน',
    downpayment: 'มัดจำ',
    installment: 'งวดแบ่ง',
    final: 'ส่วนที่เหลือ',
  };
  return map[t] || t;
};

export default function InvoicePDFTemplate({
  invoice,
  items,
  company,
  bankAccounts = [],
}: InvoicePDFTemplateProps) {
  return (
    <div 
      className="bg-white text-black font-sans"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '18mm 15mm',
        fontSize: '11px',
        lineHeight: '1.4',
        fontFamily: '"IBM Plex Sans Thai", "Sarabun", sans-serif',
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-gray-800">
        <div className="flex-1">
          {company?.logo_url && (
            <img 
              src={company.logo_url} 
              alt={company.name}
              style={{ maxHeight: '55px', marginBottom: '8px' }}
            />
          )}
          <div className="font-bold text-base">{company?.name || 'บริษัท อี เอ็น ที กรุ๊ป จำกัด'}</div>
          {company?.name_en && (
            <div className="text-[10px] text-gray-600">{company.name_en}</div>
          )}
          <div className="text-[10px] whitespace-pre-line mt-1">
            {company?.address || '70/5 Metro Biz Town Chaengwattana 2, Pak Kret, Nonthaburi 11120'}
          </div>
          <div className="text-[10px] mt-1">
            {company?.phone && <span>โทร: {company.phone}</span>}
            {company?.email && <span className="ml-2">Email: {company.email}</span>}
          </div>
          <div className="text-[10px]">
            เลขประจำตัวผู้เสียภาษี: {company?.tax_id || '0135558013167'}
            {company?.branch_type === 'head_office' && ' (สำนักงานใหญ่)'}
          </div>
        </div>

        <div className="text-right ml-4">
          <div className="text-2xl font-extrabold text-blue-700 mb-1">
            ใบวางบิล / ใบแจ้งหนี้
          </div>
          <div className="text-[10px] text-gray-600">INVOICE</div>
          <div className="mt-3 text-sm">
            <div className="font-mono font-bold">{invoice.invoice_number}</div>
          </div>
        </div>
      </div>

      {/* Customer + Meta */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="border border-gray-300 rounded p-3">
          <div className="text-[10px] font-semibold text-gray-500 mb-1">ลูกค้า / CUSTOMER</div>
          <div className="font-semibold text-sm">{invoice.customer_name}</div>
          {invoice.customer_company && (
            <div className="text-xs">{invoice.customer_company}</div>
          )}
          {invoice.customer_address && (
            <div className="text-[10px] whitespace-pre-line mt-1">{invoice.customer_address}</div>
          )}
          {invoice.customer_tax_id && (
            <div className="text-[10px] mt-1">
              เลขประจำตัวผู้เสียภาษี: {invoice.customer_tax_id}
              {invoice.customer_branch_type === 'head_office' && ' (สำนักงานใหญ่)'}
              {invoice.customer_branch_type === 'branch' && invoice.customer_branch_name &&
                ` (สาขา ${invoice.customer_branch_code || ''} ${invoice.customer_branch_name})`}
            </div>
          )}
          {invoice.customer_phone && (
            <div className="text-[10px]">โทร: {invoice.customer_phone}</div>
          )}
        </div>

        <div className="space-y-1 text-[11px]">
          <div className="flex justify-between">
            <span className="text-gray-600">วันที่ออก:</span>
            <span className="font-semibold">{formatFullDate(invoice.invoice_date)}</span>
          </div>
          {invoice.due_date && (
            <div className="flex justify-between">
              <span className="text-gray-600">วันครบกำหนด:</span>
              <span className="font-semibold">{formatFullDate(invoice.due_date)}</span>
            </div>
          )}
          {invoice.payment_terms && (
            <div className="flex justify-between">
              <span className="text-gray-600">เงื่อนไขชำระ:</span>
              <span>{invoice.payment_terms}</span>
            </div>
          )}
          {invoice.po_number && (
            <div className="flex justify-between">
              <span className="text-gray-600">PO No:</span>
              <span className="font-mono">{invoice.po_number}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">ประเภท:</span>
            <span className="font-semibold text-blue-700">
              {getTypeLabel(invoice.invoice_type)}
              {invoice.invoice_type === 'downpayment' && invoice.downpayment_percent != null &&
                ` ${invoice.downpayment_percent}%`}
              {invoice.invoice_type === 'installment' && invoice.installment_number != null &&
                ` (งวด ${invoice.installment_number}/${invoice.installment_total})`}
            </span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse text-[11px] mb-4">
        <thead>
          <tr className="bg-gray-100 border-y-2 border-gray-600">
            <th className="border-x border-gray-400 py-2 px-2 w-8 text-center">#</th>
            <th className="border-x border-gray-400 py-2 px-2 text-left">รายการ</th>
            <th className="border-x border-gray-400 py-2 px-2 w-16 text-center">จำนวน</th>
            <th className="border-x border-gray-400 py-2 px-2 w-16 text-center">หน่วย</th>
            <th className="border-x border-gray-400 py-2 px-2 w-24 text-right">ราคา/หน่วย</th>
            <th className="border-x border-gray-400 py-2 px-2 w-24 text-right">รวม</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="border-x border-gray-200 py-1.5 px-2 text-center align-top">{idx + 1}</td>
              <td className="border-x border-gray-200 py-1.5 px-2 align-top">
                <div className="font-medium">{item.product_name}</div>
                {item.sku && <div className="text-[9px] text-gray-500">SKU: {item.sku}</div>}
                {item.product_description && (
                  <div className="text-[9px] text-gray-600 whitespace-pre-line">{item.product_description}</div>
                )}
              </td>
              <td className="border-x border-gray-200 py-1.5 px-2 text-center align-top">{item.quantity}</td>
              <td className="border-x border-gray-200 py-1.5 px-2 text-center align-top">{item.unit}</td>
              <td className="border-x border-gray-200 py-1.5 px-2 text-right align-top font-mono">{fmt(item.unit_price)}</td>
              <td className="border-x border-gray-200 py-1.5 px-2 text-right align-top font-mono font-semibold">{fmt(item.line_total)}</td>
            </tr>
          ))}
          {items.length < 8 && Array.from({ length: 8 - items.length }).map((_, i) => (
            <tr key={`empty-${i}`} className="border-b border-gray-200">
              <td className="border-x border-gray-200 py-1.5 px-2">&nbsp;</td>
              <td className="border-x border-gray-200 py-1.5 px-2"></td>
              <td className="border-x border-gray-200 py-1.5 px-2"></td>
              <td className="border-x border-gray-200 py-1.5 px-2"></td>
              <td className="border-x border-gray-200 py-1.5 px-2"></td>
              <td className="border-x border-gray-200 py-1.5 px-2"></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary + Notes */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Notes + Bank */}
        <div className="space-y-3">
          {invoice.notes && (
            <div className="border border-gray-300 rounded p-2 text-[10px]">
              <div className="font-semibold text-gray-600 mb-1">หมายเหตุ:</div>
              <div className="whitespace-pre-line">{invoice.notes}</div>
            </div>
          )}
          {bankAccounts.length > 0 && (
            <div className="border border-gray-300 rounded p-2 text-[10px]">
              <div className="font-semibold text-gray-600 mb-1">การชำระเงิน - โอนเข้าบัญชี:</div>
              {bankAccounts.map((b, i) => (
                <div key={i} className="mt-0.5">
                  <span className="font-semibold">{b.bank_name}</span>
                  {b.branch && <span className="text-gray-500"> ({b.branch})</span>}
                  <div>เลขบัญชี: <span className="font-mono font-semibold">{b.account_number}</span></div>
                  <div>ชื่อบัญชี: {b.account_name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="text-[11px]">
          <div className="flex justify-between py-1">
            <span>รวมเป็นเงิน:</span>
            <span className="font-mono">{fmt(invoice.subtotal)} บาท</span>
          </div>
          {(invoice.discount_amount || 0) > 0 && (
            <div className="flex justify-between py-1 text-red-600">
              <span>ส่วนลดรวม:</span>
              <span className="font-mono">-{fmt(invoice.discount_amount)} บาท</span>
            </div>
          )}
          {(invoice.vat_amount || 0) > 0 && (
            <div className="flex justify-between py-1">
              <span>ภาษีมูลค่าเพิ่ม {invoice.vat_percent || 7}%:</span>
              <span className="font-mono">{fmt(invoice.vat_amount)} บาท</span>
            </div>
          )}
          {(invoice.withholding_tax_amount || 0) > 0 && (
            <div className="flex justify-between py-1 text-orange-600">
              <span>หัก ณ ที่จ่าย {invoice.withholding_tax_percent || 3}%:</span>
              <span className="font-mono">-{fmt(invoice.withholding_tax_amount)} บาท</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-t-2 border-b-2 border-gray-800 font-bold text-sm mt-2">
            <span>จำนวนเงินรวมทั้งสิ้น:</span>
            <span className="font-mono">{fmt(invoice.grand_total)} บาท</span>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 mt-12 pt-4">
        <div className="text-center">
          <div className="border-t border-gray-400 pt-1 mt-8">
            <div className="text-[10px]">ผู้รับวางบิล (ลูกค้า)</div>
            <div className="text-[9px] text-gray-500 mt-2">วันที่ ........./........./.........</div>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 pt-1 mt-8">
            <div className="text-[10px]">ผู้วางบิล</div>
            <div className="text-[10px] font-semibold mt-1">{company?.name || ''}</div>
            <div className="text-[9px] text-gray-500 mt-2">วันที่ {formatFullDate(invoice.invoice_date)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
