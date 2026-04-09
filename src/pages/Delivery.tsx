import { Truck, Package, ClipboardCheck, MapPin, Phone, Clock, ShieldCheck, CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import FooterCompact from "@/components/FooterCompact";
import SEOHead from "@/components/SEOHead";
import ThemeToggle from "@/components/ThemeToggle";

const deliverySteps = [
  { step: 1, title: "ยืนยันคำสั่งซื้อ", desc: "ตรวจสอบรายการสินค้าและเอกสารการชำระเงิน", icon: ClipboardCheck },
  { step: 2, title: "เตรียมสินค้า & QC", desc: "ตรวจสอบคุณภาพ ความถูกต้องของรุ่น บรรจุหีบห่อกันกระแทก", icon: Package },
  { step: 3, title: "จัดส่งสินค้า", desc: "ผ่าน Kerry, Flash Express หรือบริการขนส่งตามความเหมาะสม", icon: Truck },
  { step: 4, title: "แจ้งเลขพัสดุ", desc: "ติดตามสถานะได้ตลอดเวลาผ่านระบบของบริษัทขนส่ง", icon: MapPin },
];

const deliveryNotes = [
  "จัดส่งภายใน 1–3 วันทำการ หลังยืนยันชำระเงิน",
  "สินค้าทุกชิ้นผ่าน QC ก่อนจัดส่ง",
  "บรรจุด้วยวัสดุกันกระแทกอย่างดี",
  "กทม./ปริมณฑล 1–2 วัน · ต่างจังหวัด 2–5 วัน",
  "สินค้าเสียหายจากขนส่ง เคลมได้ภายใน 7 วัน",
];

const Delivery = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="ขั้นตอนการจัดส่งสินค้า — ENT Group" description="ขั้นตอนการจัดส่งสินค้า Industrial PC จาก ENT Group พร้อมบริการเคลมเสียหายจากการขนส่ง" />

      {/* Compact Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft size={14} /> หน้าแรก
            </Link>
            <QuoteCartButton />
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Truck size={18} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">ขั้นตอนการจัดส่งสินค้า</h1>
              <p className="text-xs text-muted-foreground">Delivery Procedure — ENT Group</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-5 space-y-5">

        {/* Delivery Steps — 4 columns */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Package size={15} className="text-primary" />
            <h2 className="text-sm font-bold text-foreground">ขั้นตอนการจัดส่ง</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {deliverySteps.map((item) => (
              <div key={item.step} className="rounded-lg border border-border bg-background p-3 text-center">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <item.icon size={16} className="text-primary" />
                </div>
                <span className="inline-block text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full mb-1">
                  {item.step}
                </span>
                <p className="text-xs font-semibold text-foreground mb-0.5">{item.title}</p>
                <p className="text-[10px] text-muted-foreground leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Notes — compact list */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={15} className="text-primary" />
            <h2 className="text-sm font-bold text-foreground">ข้อมูลการจัดส่ง</h2>
          </div>
          <ul className="space-y-1.5">
            {deliveryNotes.map((note, i) => (
              <li key={i} className="flex gap-2 text-xs text-foreground/80 leading-relaxed">
                <CheckCircle size={12} className="text-primary shrink-0 mt-0.5" />
                {note}
              </li>
            ))}
          </ul>
        </div>

        {/* Claim / Contact — compact */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={15} className="text-primary" />
            <h2 className="text-sm font-bold text-foreground">สินค้าเสียหายจากการขนส่ง?</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            แจ้งเคลมได้ภายใน 7 วันหลังรับสินค้า — ติดต่อฝ่ายบริการ
          </p>
          <div className="flex flex-wrap gap-2">
            <a href="tel:020456104"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-xs font-semibold text-foreground transition-colors">
              <Phone size={13} className="text-primary" /> 02-045-6104
            </a>
            <a href="tel:0957391053"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-xs font-semibold text-foreground transition-colors">
              <Phone size={13} className="text-primary" /> 095-739-1053
            </a>
          </div>
        </div>
      </div>

      <FooterCompact />
    </div>
  );
};

export default Delivery;
