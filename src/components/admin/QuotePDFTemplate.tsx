// src/components/admin/QuotePDFTemplate.tsx
import { formatFullDate, formatShortDateTime } from '@/lib/format';

interface QuotePDFTemplateProps {
  quote: {
    id: string;
    quote_number: string;
    customer_name: string;
    customer_email: string | null;
    customer_phone: string | null;
    customer_company: string | null;
    customer_address: string | null;
    customer_tax_id: string | null;
    customer_line?: string | null;
    payment_terms: string | null;
    delivery_terms: string | null;
    warranty_terms: string | null;
    notes: string | null;
    created_at: string;
  };
  revision: {
    id: string;
    revision_number: number;
    products: any[];
    free_items: any[] | null;
    subtotal: number;
    discount_percent: number | null;
    discount_amount: number | null;
    discount_type?: 'percent' | 'baht' | null;
    vat_percent: number | null;
    vat_amount: number | null;
    grand_total: number;
    valid_until: string | null;
    created_at: string;
    created_by_name: string;
    customer_message: string | null;
  };
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
    phone: string | null;
    email: string | null;
  };
  bankAccounts?: Array<{
    bank_name: string;
    account_number: string;
    account_name: string;
    branch: string | null;
    account_type: string | null;
    is_default: boolean;
  }>;
}

export default function QuotePDFTemplate({ quote, revision, companyInfo, salePerson, bankAccounts }: QuotePDFTemplateProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div 
      id="quote-pdf-template" 
      className="bg-white p-8 max-w-4xl mx-auto"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-4 border-b-2 border-blue-600">
        <div className="flex items-start gap-4 flex-1">
          {companyInfo.logo_url && (
            <img 
              src={companyInfo.logo_url} 
              alt={companyInfo.name_th}
              className="w-20 h-20 object-contain"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-blue-600 mb-1">
              {companyInfo.name_th}
            </h1>
            {companyInfo.name_en && (
              <p className="text-sm text-gray-700 italic mb-2">{companyInfo.name_en}</p>
            )}
            {companyInfo.address_th && (
              <p className="text-xs text-gray-600 leading-relaxed">{companyInfo.address_th}</p>
            )}
            <div className="flex flex-wrap gap-x-3 text-xs text-gray-600 mt-1">
              {companyInfo.phone && <span>โทร: {companyInfo.phone}</span>}
              {companyInfo.fax && <span>แฟกซ์: {companyInfo.fax}</span>}
              {companyInfo.email && <span>Email: {companyInfo.email}</span>}
            </div>
            {companyInfo.website && (
              <p className="text-xs text-gray-600">เว็บไซต์: {companyInfo.website}</p>
            )}
            {companyInfo.tax_id && (
              <p className="text-xs text-gray-700 mt-1">
                เลขประจำตัวผู้เสียภาษี: <span className="font-semibold">{companyInfo.tax_id}</span>
                {companyInfo.branch_type === 'head_office' && ' (สำนักงานใหญ่)'}
                {companyInfo.branch_type === 'branch' && companyInfo.branch_name && 
                  ` (สาขา: ${companyInfo.branch_name})`}
              </p>
            )}
          </div>
        </div>
        <div className="text-right ml-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">ใบเสนอราคา</h2>
          <p className="text-sm text-gray-500">QUOTATION</p>
          <div className="mt-2 inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded text-xs font-semibold">
            Revision {revision.revision_number}
          </div>
        </div>
      </div>

      {/* Quote Info */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">ลูกค้า</h3>
          <p className="font-semibold text-base">{quote.customer_name}</p>
          {quote.customer_company && (
            <p className="text-sm text-gray-700">{quote.customer_company}</p>
          )}
          {quote.customer_address && (
            <p className="text-xs text-gray-600 leading-relaxed mt-1">{quote.customer_address}</p>
          )}
          {quote.customer_tax_id && (
            <p className="text-xs text-gray-700 mt-1">
              เลขประจำตัวผู้เสียภาษี: <span className="font-mono">{quote.customer_tax_id}</span>
            </p>
          )}
          <div className="text-xs text-gray-600 mt-1">
            {quote.customer_phone && <p>โทร: {quote.customer_phone}</p>}
            {quote.customer_email && <p>Email: {quote.customer_email}</p>}
            {quote.customer_line && <p>LINE: {quote.customer_line}</p>}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">รายละเอียด</h3>
          <table className="text-sm w-full">
            <tbody>
              <tr>
                <td className="text-gray-600 py-0.5">เลขที่ใบเสนอราคา:</td>
                <td className="text-right font-semibold">{quote.quote_number}</td>
              </tr>
              <tr>
                <td className="text-gray-600 py-0.5">Revision:</td>
                <td className="text-right font-semibold">#{revision.revision_number}</td>
              </tr>
              <tr>
                <td className="text-gray-600 py-0.5">วันที่:</td>
                <td className="text-right">{new Date(revision.created_at).toLocaleDateString('th-TH', { 
                  year: 'numeric', month: 'long', day: 'numeric' 
                })}</td>
              </tr>
              {revision.valid_until && (
                <tr>
                  <td className="text-gray-600 py-0.5">ใช้ได้ถึง:</td>
                  <td className="text-right">{new Date(revision.valid_until).toLocaleDateString('th-TH', { 
                    year: 'numeric', month: 'long', day: 'numeric' 
                  })}</td>
                </tr>
              )}
              <tr>
                <td className="text-gray-600 py-0.5">ผู้เสนอราคา:</td>
                <td className="text-right">{revision.created_by_name}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Products Table */}
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
          {(revision.products || []).map((p: any, idx: number) => (
            <tr key={idx} className="border-b border-gray-200">
              <td className="p-2 text-sm align-top">{idx + 1}</td>
              <td className="p-2 text-sm align-top">
                <p className="font-semibold">{p.name || p.model}</p>
                {p.description && (
                  <p className="text-xs text-gray-600 whitespace-pre-line mt-0.5">{p.description}</p>
                )}
                {p.notes && (
                  <p className="text-xs text-blue-600 mt-1">* {p.notes}</p>
                )}
              </td>
              <td className="p-2 text-sm text-center align-top">{p.quantity || p.qty}</td>
              <td className="p-2 text-sm text-right align-top">{formatCurrency(p.unit_price)}</td>
              <td className="p-2 text-sm text-right align-top">
                {(p.discount_amount && p.discount_amount > 0) ? formatCurrency(p.discount_amount) :
                 (p.discount_percent && p.discount_percent > 0) ? `${p.discount_percent}%` : '-'}
              </td>
              <td className="p-2 text-sm text-right align-top font-semibold">{formatCurrency(p.line_total || ((p.quantity || p.qty) * p.unit_price))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Free Items */}
      {revision.free_items && Array.isArray(revision.free_items) && revision.free_items.length > 0 && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded">
          <p className="text-sm font-bold text-amber-900 mb-1">🎁 ของแถม</p>
          <div className="space-y-1">
            {revision.free_items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{item.name || item.model} × {item.quantity || item.qty}</span>
                {(item.value || item.total_value) && (
                  <span className="text-gray-600">มูลค่า {formatCurrency(item.value || item.total_value)}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer message */}
      {revision.customer_message && (
        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-xs text-gray-600 mb-1">ข้อความจากลูกค้า:</p>
          <p className="text-sm italic text-gray-700">"{revision.customer_message}"</p>
        </div>
      )}

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <table className="text-sm">
          <tbody>
            <tr>
              <td className="py-1 pr-8 text-gray-700">ยอดรวม:</td>
              <td className="py-1 text-right font-semibold w-32">{formatCurrency(revision.subtotal)} บาท</td>
            </tr>
            {revision.discount_amount && revision.discount_amount > 0 && (
              <tr>
                <td className="py-1 pr-8 text-green-700">
                  ส่วนลด {revision.discount_type === 'baht'
                    ? `(฿${formatCurrency(revision.discount_amount || 0)})`
                    : revision.discount_percent 
                      ? `(${revision.discount_percent}%)` 
                      : ''}:
                </td>
                <td className="py-1 text-right text-green-700">-{formatCurrency(revision.discount_amount)} บาท</td>
              </tr>
            )}
            {revision.vat_amount && revision.vat_amount > 0 && (
              <tr>
                <td className="py-1 pr-8 text-gray-700">
                  VAT {revision.vat_percent || 7}%:
                </td>
                <td className="py-1 text-right">{formatCurrency(revision.vat_amount)} บาท</td>
              </tr>
            )}
            <tr className="border-t-2 border-gray-800">
              <td className="py-2 pr-8 font-bold text-base">รวมสุทธิ:</td>
              <td className="py-2 text-right font-bold text-base text-blue-600">
                {formatCurrency(revision.grand_total)} บาท
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Terms & Conditions */}
      {(quote.payment_terms || quote.delivery_terms || quote.warranty_terms || quote.notes) && (
        <div className="space-y-4 text-sm border-t pt-4">
          {quote.payment_terms && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">เงื่อนไขการชำระเงิน:</h4>
              <p className="text-gray-600">{quote.payment_terms}</p>
            </div>
          )}
          {quote.delivery_terms && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">เงื่อนไขการจัดส่ง:</h4>
              <p className="text-gray-600">{quote.delivery_terms}</p>
            </div>
          )}
          {quote.warranty_terms && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">การรับประกัน:</h4>
              <p className="text-gray-600">{quote.warranty_terms}</p>
            </div>
          )}
          {quote.notes && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">หมายเหตุ:</h4>
              <p className="text-gray-600">{quote.notes}</p>
            </div>
          )}
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
          {salePerson?.signature_url && salePerson?.show_signature_on_quotes !== false ? (
            <div>
              <img 
                src={salePerson.signature_url} 
                alt="ลายเซ็น" 
                className="max-h-16 mx-auto mb-1"
              />
              <div className="border-t border-gray-400 w-48 mx-auto pt-1">
                <p className="text-sm font-medium">{salePerson.full_name || 'พนักงานขาย'}</p>
                {salePerson.position && (
                  <p className="text-xs text-gray-600">{salePerson.position}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">ผู้เสนอราคา</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="border-b border-gray-400 mb-2 pb-12"></div>
              <p className="text-sm">ผู้เสนอราคา</p>
              <p className="text-xs text-gray-600 mt-1">
                วันที่: {formatShortDateTime(new Date())}
              </p>
            </div>
          )}
        </div>
        <div className="text-center">
          <div className="border-b border-gray-400 mb-2 pb-12"></div>
          <p className="text-sm">ผู้อนุมัติ</p>
          <p className="text-xs text-gray-600 mt-1">วันที่: ______________</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t text-center text-xs text-gray-500">
        <p>เอกสารนี้ออกโดยระบบอัตโนมัติ ไม่ต้องลงนามเพื่อให้มีผลบังคับใช้</p>
      </div>
    </div>
  );
}
