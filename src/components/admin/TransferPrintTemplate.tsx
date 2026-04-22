import { useCompanySettings } from '@/hooks/useCompanySettings';

interface TransferData {
  transfer_number: string;
  supplier_name: string;
  amount: number;
  currency: string;
  exchange_rate: number | null;
  amount_thb: number | null;
  total_cost_thb: number | null;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string | null;
  swift_code: string;
  iban: string | null;
  bank_address: string | null;
  intermediary_bank: string | null;
  intermediary_swift: string | null;
  purpose: string;
  invoice_reference: string | null;
  due_date: string | null;
  requested_transfer_date: string | null;
  priority: string | null;
  transfer_fee: number | null;
  bank_fee: number | null;
  other_fee: number | null;
  total_fee: number | null;
  notes: string | null;
  status: string;
  created_at: string;
}

interface Props {
  transfer: TransferData;
  poNumbers?: string[];
  piNumbers?: string[];
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyTaxId?: string;
  logoUrl?: string;
}

const fmt = (n: number | null) =>
  n != null ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-';

const fmtDate = (d: string | null) => {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' });
};

const priorityLabel: Record<string, string> = {
  low: 'Low', normal: 'Normal', high: 'High', urgent: 'Urgent',
};

export default function TransferPrintTemplate({
  transfer,
  poNumbers = [],
  piNumbers = [],
  companyName,
  companyAddress,
  companyPhone,
  companyEmail,
  companyTaxId,
  logoUrl,
}: Props) {
  return (
    <div
      id="transfer-print-template"
      style={{
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '12px',
        lineHeight: '1.5',
        color: '#1a1a1a',
        maxWidth: '210mm',
        margin: '0 auto',
        padding: '15mm 15mm 10mm',
        background: '#fff',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '3px solid #2563eb', paddingBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          {logoUrl && (
            <img src={logoUrl} alt="logo" style={{ height: '40px', marginBottom: '6px' }} crossOrigin="anonymous"  loading="lazy" decoding="async"/>
          )}
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{companyName || 'บริษัท'}</div>
          {companyAddress && <div style={{ fontSize: '10px', color: '#666', maxWidth: '300px' }}>{companyAddress}</div>}
          <div style={{ fontSize: '10px', color: '#666' }}>
            {companyPhone && <span>โทร: {companyPhone}</span>}
            {companyEmail && <span style={{ marginLeft: '12px' }}>Email: {companyEmail}</span>}
          </div>
          {companyTaxId && <div style={{ fontSize: '10px', color: '#666' }}>เลขประจำตัวผู้เสียภาษี: {companyTaxId}</div>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>
            คำขอโอนเงินต่างประเทศ
          </div>
          <div style={{ fontSize: '10px', color: '#666' }}>International Transfer Request</div>
          <div style={{ marginTop: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', fontFamily: 'monospace' }}>
              {transfer.transfer_number}
            </span>
          </div>
          <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
            วันที่: {fmtDate(transfer.created_at)}
          </div>
          {transfer.priority && transfer.priority !== 'normal' && (
            <div style={{
              display: 'inline-block',
              marginTop: '4px',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 'bold',
              background: transfer.priority === 'urgent' ? '#fee2e2' : transfer.priority === 'high' ? '#fef3c7' : '#e0f2fe',
              color: transfer.priority === 'urgent' ? '#dc2626' : transfer.priority === 'high' ? '#d97706' : '#2563eb',
            }}>
              Priority: {priorityLabel[transfer.priority] || transfer.priority}
            </div>
          )}
        </div>
      </div>

      {/* Beneficiary & Transfer Info - 2 columns */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        {/* Beneficiary */}
        <div style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: '6px', padding: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#2563eb', marginBottom: '8px', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px' }}>
            ข้อมูลผู้รับเงิน (Beneficiary)
          </div>
          <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
            <tbody>
              <Row label="Supplier" value={transfer.supplier_name} bold />
              <Row label="Bank Name" value={transfer.bank_name} />
              <Row label="Account No." value={transfer.bank_account_number} mono />
              {transfer.bank_account_name && <Row label="Account Name" value={transfer.bank_account_name} />}
              <Row label="SWIFT / BIC" value={transfer.swift_code} mono />
              {transfer.iban && <Row label="IBAN" value={transfer.iban} mono />}
              {transfer.bank_address && <Row label="Bank Address" value={transfer.bank_address} />}
              {transfer.intermediary_bank && <Row label="Intermediary Bank" value={transfer.intermediary_bank} />}
              {transfer.intermediary_swift && <Row label="Intermediary SWIFT" value={transfer.intermediary_swift} mono />}
            </tbody>
          </table>
        </div>

        {/* Transfer Details */}
        <div style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: '6px', padding: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#2563eb', marginBottom: '8px', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px' }}>
            รายละเอียดการโอน (Transfer Details)
          </div>
          <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
            <tbody>
              <Row label="จำนวนเงิน" value={`${transfer.currency} ${fmt(transfer.amount)}`} bold />
              {transfer.exchange_rate != null && transfer.exchange_rate > 0 && (
                <Row label="อัตราแลกเปลี่ยน" value={`1 ${transfer.currency} = ${fmt(transfer.exchange_rate)} THB`} />
              )}
              {transfer.amount_thb != null && transfer.amount_thb > 0 && (
                <Row label="เทียบเป็น THB" value={`฿${fmt(transfer.amount_thb)}`} />
              )}
              {transfer.requested_transfer_date && (
                <Row label="วันที่โอน" value={fmtDate(transfer.requested_transfer_date)} />
              )}
              {transfer.due_date && (
                <Row label="วันครบกำหนด" value={fmtDate(transfer.due_date)} />
              )}
              {transfer.invoice_reference && (
                <Row label="Invoice Ref." value={transfer.invoice_reference} mono />
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PO References */}
      {poNumbers.length > 0 && (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '12px', marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#2563eb', marginBottom: '6px' }}>
            ใบสั่งซื้อที่เกี่ยวข้อง (Related Purchase Orders)
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {poNumbers.map((po, i) => (
              <span key={i} style={{
                fontFamily: 'monospace',
                fontSize: '11px',
                padding: '2px 8px',
                background: '#f0f4ff',
                borderRadius: '4px',
                border: '1px solid #dbeafe',
              }}>
                {po}
                {piNumbers[i] && <span style={{ color: '#666', marginLeft: '6px' }}>(PI: {piNumbers[i]})</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Purpose */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '12px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#2563eb', marginBottom: '6px' }}>
          วัตถุประสงค์ (Purpose)
        </div>
        <div style={{ fontSize: '11px' }}>{transfer.purpose}</div>
      </div>

      {/* Fees Summary */}
      {(transfer.total_fee ?? 0) > 0 && (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '12px', marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#2563eb', marginBottom: '6px' }}>
            ค่าธรรมเนียม (Fees)
          </div>
          <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
            <tbody>
              {(transfer.transfer_fee ?? 0) > 0 && <Row label="ค่าโอน" value={`฿${fmt(transfer.transfer_fee)}`} />}
              {(transfer.bank_fee ?? 0) > 0 && <Row label="ค่าธนาคาร" value={`฿${fmt(transfer.bank_fee)}`} />}
              {(transfer.other_fee ?? 0) > 0 && <Row label="อื่นๆ" value={`฿${fmt(transfer.other_fee)}`} />}
            </tbody>
          </table>
        </div>
      )}

      {/* Grand Total */}
      <div style={{
        background: '#f0f4ff',
        border: '2px solid #2563eb',
        borderRadius: '6px',
        padding: '12px 16px',
        marginBottom: '16px',
      }}>
        <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ fontWeight: 'bold' }}>ยอดโอน ({transfer.currency})</td>
              <td style={{ textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace' }}>
                {transfer.currency} {fmt(transfer.amount)}
              </td>
            </tr>
            {(transfer.total_cost_thb ?? 0) > 0 && (
              <tr>
                <td style={{ fontWeight: 'bold', fontSize: '14px', paddingTop: '4px', borderTop: '1px solid #bfdbfe' }}>
                  รวมทั้งหมด (THB)
                </td>
                <td style={{
                  textAlign: 'right',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  fontFamily: 'monospace',
                  color: '#2563eb',
                  paddingTop: '4px',
                  borderTop: '1px solid #bfdbfe',
                }}>
                  ฿{fmt(transfer.total_cost_thb)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Notes */}
      {transfer.notes && (
        <div style={{ fontSize: '10px', color: '#666', marginBottom: '16px' }}>
          <strong>หมายเหตุ:</strong> {transfer.notes}
        </div>
      )}

      {/* Signatures */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '20px' }}>
        <div style={{ textAlign: 'center', width: '30%' }}>
          <div style={{ borderTop: '1px solid #999', paddingTop: '6px', marginTop: '50px' }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold' }}>ผู้จัดทำ</div>
            <div style={{ fontSize: '9px', color: '#666' }}>Prepared by</div>
            <div style={{ fontSize: '9px', color: '#666', marginTop: '4px' }}>วันที่ ___/___/______</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', width: '30%' }}>
          <div style={{ borderTop: '1px solid #999', paddingTop: '6px', marginTop: '50px' }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold' }}>ผู้ตรวจสอบ</div>
            <div style={{ fontSize: '9px', color: '#666' }}>Verified by</div>
            <div style={{ fontSize: '9px', color: '#666', marginTop: '4px' }}>วันที่ ___/___/______</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', width: '30%' }}>
          <div style={{ borderTop: '1px solid #999', paddingTop: '6px', marginTop: '50px' }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold' }}>ผู้อนุมัติ</div>
            <div style={{ fontSize: '9px', color: '#666' }}>Approved by</div>
            <div style={{ fontSize: '9px', color: '#666', marginTop: '4px' }}>วันที่ ___/___/______</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helper row component ──
function Row({ label, value, bold, mono }: { label: string; value: string; bold?: boolean; mono?: boolean }) {
  return (
    <tr>
      <td style={{ padding: '2px 0', color: '#666', width: '40%', verticalAlign: 'top' }}>{label}</td>
      <td style={{
        padding: '2px 0',
        fontWeight: bold ? 'bold' : 'normal',
        fontFamily: mono ? 'monospace' : 'inherit',
      }}>
        {value}
      </td>
    </tr>
  );
}
