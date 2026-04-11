// src/components/admin/QuotePDFTemplate.tsx
import { formatFullDate, formatShortDateTime } from '@/lib/format';

interface Product {
  model: string;
  description: string;
  qty: number;
  unit_price: number;
  discount_percent: number;
  line_total: number;
  notes?: string;
}

interface QuoteData {
  quote_number: string;
  customer_name: string;
  customer_company: string | null;
  customer_address: string | null;
  customer_phone: string | null;
  customer_email: string;
  customer_tax_id: string | null;
  products: Product[];
  subtotal: number;
  discount_amount: number;
  vat_amount: number;
  grand_total: number;
  payment_terms: string | null;
  delivery_terms: string | null;
  warranty_terms: string | null;
  notes: string | null;
  valid_until: string | null;
  created_at: string;
}

interface QuotePDFTemplateProps {
  data: QuoteData;
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
}

export default function QuotePDFTemplate({ data, companyInfo, salePerson, bankAccounts }: QuotePDFTemplateProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
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
        </div>
      </div>

      {/* Quote Info */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 border-b pb-1">ข้อมูลลูกค้า</h3>
          <div className="space-y-1 text-sm">
            <p><strong>ชื่อ:</strong> {data.customer_name}</p>
            {data.customer_company && (
              <p><strong>บริษัท:</strong> {data.customer_company}</p>
            )}
            {data.customer_address && (
              <p><strong>ที่อยู่:</strong> {data.customer_address}</p>
            )}
            {data.customer_phone && (
              <p><strong>โทรศัพท์:</strong> {data.customer_phone}</p>
            )}
            <p><strong>อีเมล:</strong> {data.customer_email}</p>
            {(data as any).customer_line && (
              <p><strong>LINE:</strong> {(data as any).customer_line}</p>
            )}
            {data.customer_tax_id && (
              <p><strong>เลขประจำตัวผู้เสียภาษี:</strong> {data.customer_tax_id}</p>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 border-b pb-1">รายละเอียด</h3>
          <div className="space-y-1 text-sm">
            <p><strong>เลขที่:</strong> {data.quote_number}</p>
            <p>
              <strong>วันที่:</strong>{' '}
              {formatFullDate(data.created_at)}
            </p>
            {data.valid_until && (
              <p>
                <strong>ใช้ได้ถึง:</strong>{' '}
                {formatFullDate(data.valid_until)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border border-blue-700 p-2 text-left text-sm">ลำดับ</th>
              <th className="border border-blue-700 p-2 text-left text-sm">รายการ</th>
              <th className="border border-blue-700 p-2 text-center text-sm w-20">จำนวน</th>
              <th className="border border-blue-700 p-2 text-right text-sm w-28">ราคา/หน่วย</th>
              <th className="border border-blue-700 p-2 text-center text-sm w-20">ส่วนลด</th>
              <th className="border border-blue-700 p-2 text-right text-sm w-32">จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((product, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2 text-center text-sm">{index + 1}</td>
                <td className="border border-gray-300 p-2 text-sm">
                  <div>
                    <strong>{product.model}</strong>
                    {product.description && (
                      <p className="text-xs text-gray-600">{product.description}</p>
                    )}
                    {product.notes && (
                      <p className="text-xs text-blue-600 mt-1">* {product.notes}</p>
                    )}
                  </div>
                </td>
                <td className="border border-gray-300 p-2 text-center text-sm">{product.qty}</td>
                <td className="border border-gray-300 p-2 text-right text-sm">
                  {formatCurrency(product.unit_price)}
                </td>
                <td className="border border-gray-300 p-2 text-center text-sm">
                  {product.discount_percent > 0 ? `${product.discount_percent}%` : '-'}
                </td>
                <td className="border border-gray-300 p-2 text-right text-sm font-semibold">
                  {formatCurrency(product.line_total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end mb-6">
        <div className="w-80">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1">
              <span className="text-gray-600">ยอดรวม:</span>
              <span className="font-semibold">{formatCurrency(data.subtotal)} บาท</span>
            </div>
            {data.discount_amount > 0 && (
              <div className="flex justify-between py-1 text-green-600">
                <span>ส่วนลด:</span>
                <span className="font-semibold">-{formatCurrency(data.discount_amount)} บาท</span>
              </div>
            )}
            <div className="flex justify-between py-1">
              <span className="text-gray-600">ภาษีมูลค่าเพิ่ม 7%:</span>
              <span className="font-semibold">{formatCurrency(data.vat_amount)} บาท</span>
            </div>
            <div className="flex justify-between py-2 border-t-2 border-blue-600 text-lg">
              <span className="font-bold text-blue-600">ยอดรวมทั้งสิ้น:</span>
              <span className="font-bold text-blue-600">
                {formatCurrency(data.grand_total)} บาท
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="space-y-4 text-sm border-t pt-4">
        {data.payment_terms && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">เงื่อนไขการชำระเงิน:</h4>
            <p className="text-gray-600">{data.payment_terms}</p>
          </div>
        )}
        
        {data.delivery_terms && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">เงื่อนไขการจัดส่ง:</h4>
            <p className="text-gray-600">{data.delivery_terms}</p>
          </div>
        )}
        
        {data.warranty_terms && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">การรับประกัน:</h4>
            <p className="text-gray-600">{data.warranty_terms}</p>
          </div>
        )}
        
        {data.notes && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">หมายเหตุ:</h4>
            <p className="text-gray-600">{data.notes}</p>
          </div>
        )}
      </div>

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
