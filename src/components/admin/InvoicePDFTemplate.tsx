// src/components/admin/InvoicePDFTemplate.tsx
import { formatShortDateTime } from '@/lib/format';

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
    quote_id: string | null;
    created_at: string;
  };
  items: Array<{
    id: string;
    product_name: string;
    product_description: string | null;
    sku: string | null;
    quantity: number;
    unit: string | null;
    unit_price: number;
    discount_amount: number | null;
    line_total: number;
  }>;
  companyInfo: {
    name_th: string;
    name_en: string | null;
    address_th: string | null;
    address_en: string | null;
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
  salePerson?: {
    full_name: string | null;
    position: string | null;
    signature_url: string | null;
    show_signature_on_quotes: boolean | null;
  };
  bankAccounts?: Array<{
    bank_name: string;
    account_number: string;
    account_name: string;
    branch: string | null;
    account_type: string | null;
    is_default: boolean;
  }>;
  quoteNumber?: string;
}

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
  companyInfo,
  salePerson,
  bankAccounts,
  quoteNumber,
}: InvoicePDFTemplateProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

  const isOverdue = invoice.due_date &&
    invoice.status !== 'paid' &&
    invoice.status !== 'cancelled' &&
    new Date(invoice.due_date) < new Date();

  return (
    <div
      id="invoice-pdf-template"
      className="bg-white p-8 max-w-4xl mx-auto"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-4 border-b-2 border-blue-600">
        <div className="flex items-start gap-4 flex-1">
          {companyInfo.logo_url && (
            <img src={companyInfo.logo_url} alt={companyInfo.name_th} className="w-20 h-20 object-contain" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-blue-600 mb-1">{companyInfo.name_th}</h1>
            {companyInfo.name_en && <p className="text-sm text-gray-700 italic mb-2">{companyInfo.name_en}</p>}
            {companyInfo.address_th && <p className="text-xs text-gray-600 leading-relaxed">{companyInfo.address_th}</p>}
            <div className="flex flex-wrap gap-x-3 text-xs text-gray-600 mt-1">
              {companyInfo.phone && <span>โทร: {companyInfo.phone}</span>}
              {companyInfo.fax && <span>แฟกซ์: {companyInfo.fax}</span>}
              {companyInfo.email && <span>Email: {companyInfo.email}</span>}
            </div>
            {companyInfo.website && <p className="text-xs text-gray-600">เว็บไซต์: {companyInfo.website}</p>}
            {companyInfo.tax_id && (
              <p className="text-xs text-gray-700 mt-1">
                เลขประจำตัวผู้เสียภาษี: <span className="font-semibold">{companyInfo.tax_id}</span>
                {companyInfo.branch_type === 'head_office' && ' (สำนักงานใหญ่)'}
                {companyInfo.branch_type === 'branch' && companyInfo.branch_name && ` (สาขา: ${companyInfo.branch_name})`}
              </p>
            )}
          </div>
        </div>
        <div className="text-right ml-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">ใบวางบิล/ใบแจ้งหนี้</h2>
          <p className="text-sm text-gray-500">INVOICE</p>
          <div className="mt-2 inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded text-xs font-semibold">
            {getTypeLabel(invoice.invoice_type)}
            {invoice.invoice_type === 'downpayment' && invoice.downpayment_percent != null && ` ${invoice.downpayment_percent}%`}
            {invoice.invoice_type === 'installment' && invoice.installment_number != null && ` ${invoice.installment_number}/${invoice.installment_total}`}
          </div>
        </div>
      </div>

      {/* Customer + Meta */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">ลูกค้า</h3>
          <p className="font-semibold text-base">{invoice.customer_name}</p>
          {invoice.customer_company && <p className="text-sm text-gray-700">{invoice.customer_company}</p>}
          {invoice.customer_address && <p className="text-xs text-gray-600 leading-relaxed mt-1 whitespace-pre-line">{invoice.customer_address}</p>}
          {invoice.customer_tax_id && (
            <p className="text-xs text-gray-700 mt-1">
              เลขประจำตัวผู้เสียภาษี: <span className="font-mono">{invoice.customer_tax_id}</span>
              {invoice.customer_branch_type === 'head_office' && ' (สำนักงานใหญ่)'}
              {invoice.customer_branch_type === 'branch' && invoice.customer_branch_name && ` (สาขา: ${invoice.customer_branch_name})`}
            </p>
          )}
          <div className="text-xs text-gray-600 mt-1">
            {invoice.customer_phone && <p>โทร: {invoice.customer_phone}</p>}
            {invoice.customer_email && <p>Email: {invoice.customer_email}</p>}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">รายละเอียด</h3>
          <table className="text-sm w-full">
            <tbody>
              <tr>
                <td className="text-gray-600 py-0.5">เลขที่:</td>
                <td className="text-right font-semibold font-mono">{invoice.invoice_number}</td>
              </tr>
              {quoteNumber && (
                <tr>
                  <td className="text-gray-600 py-0.5">อ้างอิงใบเสนอราคา:</td>
                  <td className="text-right font-mono text-xs">{quoteNumber}</td>
                </tr>
              )}
              <tr>
                <td className="text-gray-600 py-0.5">วันที่ออก:</td>
                <td className="text-right">
                  {new Date(invoice.invoice_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                </td>
              </tr>
              {invoice.due_date && (
                <tr>
                  <td className="text-gray-600 py-0.5">ครบกำหนดชำระ:</td>
                  <td className={`text-right ${isOverdue ? 'text-red-600 font-semibold' : ''}`}>
                    {new Date(invoice.due_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                    {isOverdue && ' (เกินกำหนด)'}
                  </td>
                </tr>
              )}
              {invoice.payment_terms && (
                <tr>
                  <td className="text-gray-600 py-0.5">เงื่อนไขชำระ:</td>
                  <td className="text-right">{invoice.payment_terms}</td>
                </tr>
              )}
              {invoice.po_number && (
                <tr>
                  <td className="text-gray-600 py-0.5">PO No:</td>
                  <td className="text-right font-mono text-xs">{invoice.po_number}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-6 border-collapse">
        <thead>
          <tr className="bg-blue-600 text-white">
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
                {item.product_description && <p className="text-xs text-gray-600 whitespace-pre-line mt-0.5">{item.product_description}</p>}
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

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <table className="text-sm">
          <tbody>
            <tr>
              <td className="py-1 pr-8 text-gray-700">ยอดรวม:</td>
              <td className="py-1 text-right font-semibold w-32">{formatCurrency(invoice.subtotal)} บาท</td>
            </tr>
            {(invoice.discount_amount || 0) > 0 && (
              <tr>
                <td className="py-1 pr-8 text-green-700">ส่วนลด {invoice.discount_percent ? `${invoice.discount_percent}%` : ''}:</td>
                <td className="py-1 text-right text-green-700">-{formatCurrency(invoice.discount_amount || 0)} บาท</td>
              </tr>
            )}
            {(invoice.vat_amount || 0) > 0 && (
              <tr>
                <td className="py-1 pr-8 text-gray-700">VAT {invoice.vat_percent || 7}%:</td>
                <td className="py-1 text-right">{formatCurrency(invoice.vat_amount || 0)} บาท</td>
              </tr>
            )}
            {(invoice.withholding_tax_amount || 0) > 0 && (
              <tr>
                <td className="py-1 pr-8 text-orange-700">หัก ณ ที่จ่าย {invoice.withholding_tax_percent || 3}%:</td>
                <td className="py-1 text-right text-orange-700">-{formatCurrency(invoice.withholding_tax_amount || 0)} บาท</td>
              </tr>
            )}
            <tr className="border-t-2 border-gray-800">
              <td className="py-2 pr-8 font-bold text-base">รวมสุทธิ:</td>
              <td className="py-2 text-right font-bold text-base text-blue-600">{formatCurrency(invoice.grand_total)} บาท</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="space-y-4 text-sm border-t pt-4 mb-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">หมายเหตุ:</h4>
            <p className="text-gray-600 whitespace-pre-line">{invoice.notes}</p>
          </div>
        </div>
      )}

      {/* Bank Accounts */}
      {bankAccounts && bankAccounts.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-bold text-gray-800 mb-2">การชำระเงิน — โอนเข้าบัญชี:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {bankAccounts.map((bank, idx) => (
              <div key={idx} className={`text-xs p-2 rounded border ${bank.is_default ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <p className="font-semibold text-gray-800">
                  {bank.bank_name}
                  {bank.is_default && <span className="ml-2 text-[10px] text-blue-600">⭐ หลัก</span>}
                </p>
                <p className="text-gray-700 font-mono">{bank.account_number}</p>
                <p className="text-gray-600">{bank.account_name}</p>
                {bank.branch && <p className="text-gray-500">สาขา: {bank.branch}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Signature */}
      <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t">
        <div className="text-center">
          <div className="border-b border-gray-400 mb-2 pb-12"></div>
          <p className="text-sm">ผู้รับวางบิล (ลูกค้า)</p>
          <p className="text-xs text-gray-600 mt-1">วันที่: ______________</p>
        </div>
        <div className="text-center">
          {salePerson?.signature_url && salePerson?.show_signature_on_quotes !== false ? (
            <div>
              <img src={salePerson.signature_url} alt="ลายเซ็น" className="max-h-16 mx-auto mb-1" />
              <div className="border-t border-gray-400 w-48 mx-auto pt-1">
                <p className="text-sm font-medium">{salePerson.full_name || 'ผู้วางบิล'}</p>
                {salePerson.position && <p className="text-xs text-gray-600">{salePerson.position}</p>}
                <p className="text-xs text-gray-500 mt-1">ผู้วางบิล</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="border-b border-gray-400 mb-2 pb-12"></div>
              <p className="text-sm">ผู้วางบิล</p>
              <p className="text-xs text-gray-600 mt-1">วันที่: {formatShortDateTime(new Date())}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t text-center text-xs text-gray-500">
        <p>เอกสารนี้ออกโดยระบบอัตโนมัติ ไม่ต้องลงนามเพื่อให้มีผลบังคับใช้</p>
      </div>
    </div>
  );
}
