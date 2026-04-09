import { CreditCard, Building2, Phone, Mail, AlertCircle, Send, Info, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import FooterCompact from "@/components/FooterCompact";
import SEOHead from "@/components/SEOHead";
import ThemeToggle from "@/components/ThemeToggle";

const bankAccounts = [
  {
    bank: "ธนาคารกสิกรไทย",
    branch: "สาขาบางเดื่อ ปทุมธานี",
    type: "ออมทรัพย์",
    account: "841-2-05851-9",
    color: "from-green-600 to-green-700",
  },
  {
    bank: "ธนาคารไทยพาณิชย์",
    branch: "สาขาบางเดื่อ (ปทุมธานี)",
    type: "ออมทรัพย์",
    account: "406-817747-1",
    color: "from-purple-600 to-purple-700",
  },
];

const taxNotes = [
  "อัตราค่าบริการยังไม่รวม VAT 7% (สำหรับนิติบุคคล)",
  "หากไม่ได้รับใบเสร็จ/ใบกำกับภาษีภายใน 2 สัปดาห์ กรุณาติดต่อเจ้าหน้าที่",
  "ขอสงวนสิทธิ์ในการออกใบเสร็จ/ใบกำกับภาษีย้อนหลัง",
  "กรณีหักภาษี ณ ที่จ่าย — ใบเสร็จจะส่งหลังได้รับหนังสือหักฯ แล้วเท่านั้น",
  "นิติบุคคลยอดตั้งแต่ 1,000 บ. ขึ้นไป สามารถหักภาษี ณ ที่จ่าย 3%",
];

const Payment = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="วิธีการชำระเงิน — ENT Group" description="ช่องทางชำระเงินและข้อมูลบัญชีธนาคาร บริษัท อี เอ็นที กรุ๊ป จำกัด" />

      {/* Compact Header */}
    >
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft size={14} /> หน้าแรก
            </Link>
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <CreditCard size={18} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">วิธีการชำระเงิน</h1>
              <p className="text-xs text-muted-foreground">Payment Methods — ENT Group</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-5 space-y-5">

        {/* Company Info + Bank Accounts */}
      >
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 px-1">
            <Building2 size={14} className="text-primary shrink-0" />
            <span className="font-semibold text-foreground">บริษัท อี เอ็นที กรุ๊ป จำกัด</span>
            <span className="text-muted-foreground/50">|</span>
            <span>เลขประจำตัวผู้เสียภาษี 0135558013167</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bankAccounts.map((bank, i) => (
              <div key={i} className="rounded-lg border border-border bg-background p-4">
                <span className={`inline-block px-2.5 py-0.5 rounded-full bg-gradient-to-r ${bank.color} text-white text-[10px] font-bold mb-2`}>
                  {bank.bank}
                >
                </span>
                <p className="text-[11px] text-muted-foreground">{bank.branch} · {bank.type}</p>
                <p className="text-xl font-bold text-foreground tracking-wider mt-1">{bank.account}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tax Notes — compact list */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info size={15} className="text-amber-500" />
            <h2 className="text-sm font-bold text-foreground">หมายเหตุ — ใบเสร็จ / ภาษี</h2>
          </div>
          <ul className="space-y-1.5">
            {taxNotes.map((note, i) => (
              <li key={i} className="flex gap-2 text-xs text-foreground/80 leading-relaxed">
                <AlertCircle size={12} className="text-amber-400 shrink-0 mt-0.5" />
                {note}
              >
              </li>
            ))}
          </ul>
        </div>

        {/* Transfer Notification — compact */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Send size={15} className="text-primary" />
            <h2 className="text-sm font-bold text-foreground">แจ้งการโอนเงิน</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Scan สลิป ATM หรือหลักฐานใบโอนเงิน ส่งมาที่ช่องทางด้านล่าง
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <a href="mailto:accountant@entgroup.co.th"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
              <Mail size={14} className="text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">Email</p>
                <p className="text-xs font-semibold text-foreground">accountant@entgroup.co.th</p>
              </div>
            </a>
            <a href="tel:020456104"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
              <Phone size={14} className="text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">Accountant</p>
                <p className="text-xs font-semibold text-foreground">02-045-6104</p>
              </div>
            </a>
            <a href="tel:0822497922"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
              <Phone size={14} className="text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">จัดซื้อ</p>
                <p className="text-xs font-semibold text-foreground">082-249-7922</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      <FooterCompact />
    </div>
  );
};

export default Payment;
