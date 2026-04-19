import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Lock, Loader2, AlertTriangle, TrendingUp, Building2, Users, Award,
  BarChart3, Target, Sparkles, Shield, CheckCircle2, FileText, Mail,
  ArrowRight, Briefcase, LineChart, Layers, Globe2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface VerifyResult {
  valid: boolean;
  reason: string;
  recipient_name: string | null;
  recipient_company: string | null;
  recipient_email: string | null;
}

const reasonMessages: Record<string, string> = {
  not_found: "ลิงก์ไม่ถูกต้อง — โปรดตรวจสอบ URL อีกครั้ง",
  revoked: "ลิงก์นี้ถูกยกเลิกการใช้งานแล้ว",
  expired: "ลิงก์นี้หมดอายุแล้ว",
  max_views_reached: "ลิงก์นี้ถูกเปิดใช้งานครบจำนวนครั้งสูงสุดแล้ว",
};

const InvestorBrief = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerifyResult | null>(null);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setResult({ valid: false, reason: "not_found", recipient_name: null, recipient_company: null, recipient_email: null });
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase.rpc("verify_investor_token", {
          _token: token,
          _ua: typeof navigator !== "undefined" ? navigator.userAgent : null,
          _ref: typeof document !== "undefined" ? document.referrer : null,
        });
        if (error) throw error;
        const row = Array.isArray(data) ? data[0] : data;
        setResult(row as VerifyResult);
      } catch {
        setResult({ valid: false, reason: "not_found", recipient_name: null, recipient_company: null, recipient_email: null });
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0A1628" }}>
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={32} style={{ color: "#C9A961" }} />
          <p className="text-sm" style={{ color: "#94A3B8" }}>กำลังตรวจสอบสิทธิ์การเข้าถึง...</p>
        </div>
      </div>
    );
  }

  if (!result?.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#0A1628" }}>
        <Helmet>
          <title>Access Denied | ENT Group IR</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div
          className="max-w-md w-full rounded-2xl p-10 text-center"
          style={{ backgroundColor: "#0F1E38", border: "1px solid rgba(220, 38, 38, 0.3)" }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: "rgba(220, 38, 38, 0.1)" }}
          >
            <Lock size={28} style={{ color: "#DC2626" }} />
          </div>
          <h1 className="text-xl font-display font-bold mb-3" style={{ color: "#FFFFFF" }}>
            ไม่สามารถเข้าถึงเอกสารนี้ได้
          </h1>
          <p className="text-sm mb-6" style={{ color: "#94A3B8" }}>
            {reasonMessages[result?.reason ?? "not_found"] || "ไม่สามารถเข้าถึงเอกสารนี้ได้"}
          </p>
          <p className="text-[11px] mb-6 leading-relaxed" style={{ color: "#64748B" }}>
            หากท่านเชื่อว่าเป็นข้อผิดพลาด กรุณาติดต่อทีม Investor Relations เพื่อขอลิงก์ใหม่
          </p>
          <a
            href="mailto:ir@entgroup.co.th"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: "#C9A961", color: "#0A1628" }}
          >
            <Mail size={14} /> ir@entgroup.co.th
          </a>
        </div>
      </div>
    );
  }

  const recipientName = result.recipient_name || "Investor";
  const recipientCompany = result.recipient_company;

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: "#FAF8F3" }}>
      <Helmet>
        <title>Confidential Brief — {recipientName} | ENT Group</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Watermark */}
      <div
        className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none"
        aria-hidden="true"
        style={{ opacity: 0.06 }}
      >
        <div
          className="absolute inset-0 flex flex-wrap content-around justify-around"
          style={{
            transform: "rotate(-30deg) scale(1.4)",
            transformOrigin: "center",
          }}
        >
          {Array.from({ length: 60 }).map((_, i) => (
            <span
              key={i}
              className="text-xs font-bold whitespace-nowrap mx-8"
              style={{ color: "#0A1628" }}
            >
              CONFIDENTIAL · {recipientName.toUpperCase()} · {new Date().toLocaleDateString("th-TH")}
            </span>
          ))}
        </div>
      </div>

      {/* Top bar */}
      <div
        className="w-full px-4 py-3 sticky top-0 z-40"
        style={{ backgroundColor: "#0A1628", borderBottom: "1px solid rgba(201, 169, 97, 0.3)" }}
      >
        <div className="container max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock size={14} style={{ color: "#C9A961" }} />
            <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "#D4B876" }}>
              Confidential · {recipientName}{recipientCompany ? ` (${recipientCompany})` : ""}
            </span>
          </div>
          <span className="text-[10px]" style={{ color: "#64748B" }}>
            ENT Group · IR Brief v1.0
          </span>
        </div>
      </div>

      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0A1628 0%, #0F1E38 60%, #1E3A5F 100%)" }}
      >
        <div className="container max-w-6xl mx-auto px-4 py-16 md:py-24 relative">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase mb-6"
            style={{ backgroundColor: "rgba(201, 169, 97, 0.12)", color: "#D4B876", border: "1px solid rgba(201, 169, 97, 0.3)" }}
          >
            <Lock size={12} /> Strategic Partnership Brief
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight mb-5" style={{ color: "#FFFFFF" }}>
            <span style={{ color: "#C9A961" }}>ENT Group</span> — Confidential Investor Brief
          </h1>
          <p className="text-sm md:text-base leading-relaxed max-w-2xl" style={{ color: "#94A3B8" }}>
            จัดทำขึ้นเป็นการเฉพาะสำหรับ <strong style={{ color: "#D4B876" }}>{recipientName}</strong>
            {recipientCompany && <> ({recipientCompany})</>} —
            ห้ามเปิดเผย ส่งต่อ หรือคัดลอก ข้อมูลโดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษรจากบริษัท
          </p>
        </div>
      </section>

      {/* COMPANY SNAPSHOT */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <SectionLabel>1. Company Snapshot</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-8" style={{ color: "#0A1628" }}>
            ภาพรวมธุรกิจ
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { icon: Building2, value: "13+", label: "ปีดำเนินธุรกิจ" },
              { icon: Users, value: "8,000+", label: "ลูกค้าองค์กร" },
              { icon: Award, value: "600+", label: "SKU สินค้า" },
              { icon: TrendingUp, value: "100%", label: "เติบโตต่อเนื่อง" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-5" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
                <s.icon size={18} style={{ color: "#C9A961" }} className="mb-2" />
                <div className="text-2xl font-display font-black" style={{ color: "#0A1628" }}>{s.value}</div>
                <div className="text-[11px] mt-1" style={{ color: "#64748B" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl p-7" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <h3 className="text-lg font-display font-bold mb-3" style={{ color: "#0A1628" }}>บริษัท อีเอ็นที กรุ๊ป จำกัด</h3>
            <ul className="text-sm space-y-2" style={{ color: "#475569" }}>
              <li>• ก่อตั้งปี 2555 — ดำเนินธุรกิจต่อเนื่อง 13 ปี</li>
              <li>• B2B Industrial Distribution: Industrial PC, Edge Computing, Network & Security, Rugged Devices</li>
              <li>• ลูกค้าหลัก: หน่วยงานราชการ, โรงงานอุตสาหกรรม, โรงพยาบาล, สถาบันการศึกษา, SI Partners</li>
              <li>• สำนักงานใหญ่: จังหวัดนครปฐม | Sales Coverage: ทั่วประเทศ</li>
            </ul>
          </div>
        </div>
      </section>

      {/* MARKET & MOAT */}
      <section className="py-16 px-4" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="container max-w-6xl mx-auto">
          <SectionLabel>2. Market Position & Moat</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-8" style={{ color: "#0A1628" }}>
            ตำแหน่งทางการตลาดและความได้เปรียบ
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { icon: Target, title: "Niche Specialization", desc: "เชี่ยวชาญเฉพาะด้าน Industrial Computing — แตกต่างจาก IT distributors ทั่วไป มี technical pre-sales support เฉพาะทาง" },
              { icon: Shield, title: "Sticky B2B Relationships", desc: "ลูกค้าองค์กรที่ผ่านการจัดซื้อแบบ TOR / e-Bidding มี switching cost สูง — ทำให้ retention อยู่ในระดับดีมาก" },
              { icon: Layers, title: "Vertical Integration Roadmap", desc: "กำลังขยายจาก distribution ไปสู่ value-added services: ระบบ B2B Platform, AI Tools, After-sales Service Network" },
              { icon: Globe2, title: "Brand Authority", desc: "มี case studies กับองค์กรชั้นนำในไทย — ทำให้ได้รับความไว้วางใจในการ pilot โครงการใหม่ๆ ก่อน competitor" },
            ].map((p) => (
              <div key={p.title} className="rounded-xl p-6" style={{ backgroundColor: "#FAF8F3", border: "1px solid #E2E8F0" }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: "rgba(201, 169, 97, 0.1)", border: "1px solid rgba(201, 169, 97, 0.3)" }}>
                  <p.icon size={18} style={{ color: "#C9A961" }} />
                </div>
                <h3 className="text-base font-display font-bold mb-1.5" style={{ color: "#0A1628" }}>{p.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GROWTH PLAN */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <SectionLabel>3. Strategic Growth Plan</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-8" style={{ color: "#0A1628" }}>
            แผนการขยายธุรกิจ 3 ปี
          </h2>
          <div className="space-y-3">
            {[
              { yr: "Year 1", focus: "Foundation Scale", points: ["ขยาย Stock & Inventory รองรับโครงการขนาดใหญ่", "เพิ่มทีม Sales Engineer 50% ครอบคลุมภูมิภาคหลัก", "ปล่อย B2B Platform เวอร์ชันสมบูรณ์เปิดใช้กับลูกค้าองค์กร"] },
              { yr: "Year 2", focus: "Market Expansion", points: ["เปิดสาขา/Service Center ภาคตะวันออก-ภาคเหนือ", "ขยาย Product Line: GPU Server, AI Edge, Network Security", "Launch Affiliate Program & Channel Partner Network"] },
              { yr: "Year 3", focus: "Platform Leadership", points: ["AI-powered Procurement Tools สำหรับลูกค้าองค์กร", "ASEAN Soft Launch (กัมพูชา, ลาว, เมียนมา ผ่าน partner)", "เตรียมความพร้อมสู่ LiVE Exchange (ก.ล.ต.)"] },
            ].map((y) => (
              <div key={y.yr} className="rounded-xl p-6 flex flex-col md:flex-row gap-5" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
                <div className="md:w-48 shrink-0">
                  <div className="text-[10px] font-semibold tracking-widest uppercase mb-1" style={{ color: "#C9A961" }}>{y.yr}</div>
                  <div className="text-lg font-display font-bold" style={{ color: "#0A1628" }}>{y.focus}</div>
                </div>
                <ul className="flex-1 space-y-1.5 text-sm" style={{ color: "#475569" }}>
                  {y.points.map((p) => (
                    <li key={p} className="flex gap-2"><CheckCircle2 size={14} style={{ color: "#C9A961" }} className="mt-0.5 shrink-0" />{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USE OF FUNDS */}
      <section className="py-16 px-4" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="container max-w-6xl mx-auto">
          <SectionLabel>4. Use of Strategic Capital</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3" style={{ color: "#0A1628" }}>
            ทิศทางการใช้เงินทุน (Indicative Allocation)
          </h2>
          <p className="text-xs mb-8" style={{ color: "#64748B" }}>
            สัดส่วนเบื้องต้น — ปรับเปลี่ยนได้ตามโครงสร้างความร่วมมือที่ตกลงกัน
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { pct: "40%", label: "Stock & Inventory", icon: Briefcase },
              { pct: "25%", label: "Platform & R&D", icon: Sparkles },
              { pct: "20%", label: "Sales & Service Network", icon: Users },
              { pct: "15%", label: "Marketing & Brand", icon: BarChart3 },
            ].map((u) => (
              <div key={u.label} className="rounded-xl p-6" style={{ backgroundColor: "#FAF8F3", border: "1px solid #E2E8F0" }}>
                <u.icon size={18} style={{ color: "#C9A961" }} className="mb-3" />
                <div className="text-3xl font-display font-black mb-1" style={{ color: "#0A1628" }}>{u.pct}</div>
                <div className="text-xs" style={{ color: "#64748B" }}>{u.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERSHIP STRUCTURE */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <SectionLabel>5. Partnership Structures (Indicative)</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3" style={{ color: "#0A1628" }}>
            รูปแบบความร่วมมือที่เป็นไปได้
          </h2>
          <p className="text-xs mb-8" style={{ color: "#64748B" }}>
            โครงสร้างเหล่านี้เป็นกรอบเริ่มต้น — รายละเอียดเงื่อนไข อัตราผลตอบแทน
            และสัญญา จะหารือเป็นรายบุคคลภายใต้กรอบ พ.ร.บ. หลักทรัพย์ฯ
            และจะลงนามในสัญญา Bilateral Loan Agreement / Equity Subscription Agreement ตามที่เลือก
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "Strategic Loan", desc: "เงินกู้ระยะกลาง 2-3 ปี พร้อมหลักประกัน (สต๊อก/ลูกหนี้การค้า) และผลตอบแทนคงที่ในกรอบกฎหมายกำหนด" },
              { name: "Hybrid Partnership", desc: "ผสมเงินกู้ + ส่วนแบ่งผลกำไรจริง (ตามผลประกอบการ) ภายใต้สัญญาแบบเฉพาะรายบุคคล" },
              { name: "Equity Participation", desc: "ถือหุ้นสามัญ Pre-IPO ก่อนเข้า LiVE Exchange — เหมาะกับผู้ลงทุนระยะยาวที่ต้องการ upside เต็ม" },
            ].map((s) => (
              <div key={s.name} className="rounded-xl p-6" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: "#0A1628" }}>
                  <LineChart size={18} style={{ color: "#C9A961" }} />
                </div>
                <h3 className="text-base font-display font-bold mb-2" style={{ color: "#0A1628" }}>{s.name}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEXT STEPS */}
      <section className="py-16 px-4" style={{ backgroundColor: "#0A1628" }}>
        <div className="container max-w-4xl mx-auto text-center">
          <SectionLabel light>6. Next Steps</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-6" style={{ color: "#FFFFFF" }}>
            ขั้นตอนต่อไป
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-10 text-left">
            {[
              { n: "01", t: "ลงนาม NDA", d: "เพื่อรับเอกสารฉบับสมบูรณ์ (งบการเงินย้อนหลัง 3 ปี, รายการลูกค้า, Pipeline)" },
              { n: "02", t: "Management Meeting", d: "พบทีมผู้บริหาร — Q&A, Site Visit, Demo ระบบ B2B Platform" },
              { n: "03", t: "Due Diligence & Term Sheet", d: "ประสานงานกับทนายและที่ปรึกษาทางการเงินของทั้งสองฝ่าย" },
            ].map((s) => (
              <div key={s.n} className="rounded-xl p-5" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(201, 169, 97, 0.25)" }}>
                <div className="text-xs font-display font-black mb-2" style={{ color: "#C9A961" }}>{s.n}</div>
                <div className="text-sm font-bold mb-1" style={{ color: "#FFFFFF" }}>{s.t}</div>
                <div className="text-[11px] leading-relaxed" style={{ color: "#94A3B8" }}>{s.d}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="mailto:ir@entgroup.co.th"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-sm font-bold"
              style={{ backgroundColor: "#C9A961", color: "#0A1628" }}
            >
              <Mail size={16} /> ติดต่อทีม IR
              <ArrowRight size={14} />
            </a>
            <Link
              to="/investors"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: "transparent", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <FileText size={16} /> หน้า Public IR
            </Link>
          </div>
        </div>
      </section>

      {/* LEGAL FOOTER */}
      <section className="py-10 px-4" style={{ backgroundColor: "#1A1410" }}>
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-start gap-3">
            <AlertTriangle size={16} style={{ color: "#C9A961" }} className="mt-0.5 shrink-0" />
            <div className="text-[10px] leading-relaxed" style={{ color: "#A0826D" }}>
              <p className="mb-2">
                <strong>Legal Notice:</strong> เอกสารฉบับนี้จัดทำขึ้นเป็นการเฉพาะสำหรับผู้รับที่ระบุไว้
                ภายใต้ข้อตกลงการรักษาความลับ (NDA) มิใช่การเสนอขายหลักทรัพย์ต่อประชาชน
                ตาม พ.ร.บ. หลักทรัพย์และตลาดหลักทรัพย์ พ.ศ. 2535
                และ พ.ร.ก. การกู้ยืมเงินที่เป็นการฉ้อโกงประชาชน พ.ศ. 2527
              </p>
              <p>
                ข้อมูลทั้งหมดเป็นการประมาณการเบื้องต้น ไม่ถือเป็นการรับประกันผลตอบแทน
                ผู้ลงทุนควรศึกษาข้อมูลและปรึกษาที่ปรึกษาการเงิน/ทนายความก่อนตัดสินใจ
                การลงทุนทุกประเภทมีความเสี่ยง
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const SectionLabel = ({ children, light }: { children: React.ReactNode; light?: boolean }) => (
  <span
    className="text-[10px] font-semibold tracking-widest uppercase mb-2 block"
    style={{ color: light ? "#C9A961" : "#C9A961" }}
  >
    {children}
  </span>
);

export default InvestorBrief;
