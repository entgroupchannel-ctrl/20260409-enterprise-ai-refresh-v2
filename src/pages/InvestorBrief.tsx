import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Lock, Loader2, AlertTriangle, TrendingUp, Building2, Users, Award,
  BarChart3, Target, Sparkles, Shield, CheckCircle2, FileText, Mail,
  ArrowRight, Briefcase, LineChart, Layers, Globe2,
  ShieldCheck, Wallet, Calculator, Star,
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

      {/* Watermark — sparse diagonal pattern (light, non-distracting) */}
      <div
        className="fixed inset-0 pointer-events-none z-40 overflow-hidden select-none"
        aria-hidden="true"
        style={{
          opacity: 0.05,
          backgroundImage: `repeating-linear-gradient(
            -30deg,
            transparent 0,
            transparent 280px,
            rgba(10, 22, 40, 0.6) 280px,
            rgba(10, 22, 40, 0.6) 281px,
            transparent 282px,
            transparent 560px
          )`,
        }}
      />

      {/* Center diagonal label — single, subtle */}
      <div
        className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center select-none"
        aria-hidden="true"
      >
        <span
          className="text-4xl md:text-6xl font-black tracking-[0.3em] whitespace-nowrap"
          style={{
            color: "#0A1628",
            opacity: 0.05,
            transform: "rotate(-30deg)",
          }}
        >
          CONFIDENTIAL
        </span>
      </div>

      {/* Corner stamp — recipient + date (top-right) */}
      <div
        className="fixed top-20 right-4 md:right-8 pointer-events-none z-40 select-none"
        aria-hidden="true"
        style={{ opacity: 0.55 }}
      >
        <div
          className="px-3 py-2 border-2 rounded-sm rotate-[-8deg]"
          style={{
            borderColor: "#C9A961",
            backgroundColor: "rgba(255,255,255,0.85)",
            boxShadow: "0 1px 4px rgba(10,22,40,0.15)",
          }}
        >
          <div className="text-[9px] font-black tracking-widest uppercase leading-tight" style={{ color: "#0A1628" }}>
            ✦ Confidential ✦
          </div>
          <div className="text-[10px] font-bold leading-tight mt-0.5" style={{ color: "#0A1628" }}>
            {recipientName}
          </div>
          <div className="text-[8px] font-medium tracking-wider" style={{ color: "#6B5B3E" }}>
            {new Date().toLocaleDateString("th-TH")}
          </div>
        </div>
      </div>

      {/* Bottom-left stamp — ENT Group seal */}
      <div
        className="fixed bottom-6 left-4 md:left-8 pointer-events-none z-40 select-none"
        aria-hidden="true"
        style={{ opacity: 0.45 }}
      >
        <div
          className="w-20 h-20 rounded-full border-2 flex flex-col items-center justify-center rotate-[6deg]"
          style={{
            borderColor: "#C9A961",
            backgroundColor: "rgba(255,255,255,0.7)",
          }}
        >
          <div className="text-[8px] font-black tracking-widest" style={{ color: "#0A1628" }}>ENT GROUP</div>
          <div className="text-[7px] font-bold mt-0.5" style={{ color: "#6B5B3E" }}>INVESTOR</div>
          <div className="text-[7px] font-bold" style={{ color: "#6B5B3E" }}>BRIEF · 2026</div>
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

      {/* DOWNSIDE PROTECTION (Deep-dive) */}
      <section className="py-16 px-4" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="container max-w-6xl mx-auto">
          <SectionLabel>6. Downside Protection — เนื้อหาเชิงลึก</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3" style={{ color: "#0A1628" }}>
            ถ้าธุรกิจไม่เป็นไปตามแผน — เงินของคุณจะได้อะไรคืน?
          </h2>
          <p className="text-sm mb-10 max-w-3xl" style={{ color: "#475569" }}>
            สำหรับผู้สนใจโครงสร้าง <strong>Strategic Loan / Hybrid Partnership</strong> —
            ส่วนนี้ตอบคำถามที่นักลงทุนสถาบันถามเป็นอันดับแรก: หลักประกันคืออะไร, ครอบคลุมเท่าไร,
            และเรียงลำดับการคืนเงินอย่างไรในกรณีเลวร้ายที่สุด
          </p>

          {/* Hero stat */}
          <div
            className="rounded-2xl p-8 md:p-10 mb-8 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0A1628 0%, #152948 100%)" }}
          >
            <div
              className="absolute top-0 right-0 w-2/5 h-full"
              style={{ background: "linear-gradient(115deg, transparent 40%, rgba(201,169,97,0.12))" }}
              aria-hidden
            />
            <div className="relative">
              <div className="text-[10px] font-bold tracking-[0.25em] uppercase mb-3" style={{ color: "#D4B876" }}>
                Collateral Coverage Ratio
              </div>
              <div
                className="font-display font-bold leading-none mb-3"
                style={{ color: "#FFFFFF", fontSize: "clamp(2.5rem, 6vw, 4rem)", letterSpacing: "-0.03em" }}
              >
                1.X<em style={{ fontStyle: "italic", color: "#D4B876" }}>x</em> – 2.X<em style={{ fontStyle: "italic", color: "#D4B876" }}>x</em>
              </div>
              <p className="text-sm md:text-base max-w-2xl" style={{ color: "#E2E8F0" }}>
                หลักประกันของเรา ครอบคลุมวงเงินกู้ <strong style={{ color: "#FFFFFF" }}>10–30 ล้านบาท</strong> หลายเท่า —
                ตัวเลขที่นักลงทุนสถาบันดูเป็นอันดับแรก
              </p>
            </div>
          </div>

          {/* 4 info boxes */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { title: "หลักประกันรวม", value: "฿ XX.X M", note: "สต๊อก + ลูกหนี้ + สินทรัพย์ · ณ Q2 2026", icon: ShieldCheck },
              { title: "วงเงินระดมสูงสุด", value: "฿ 30.0 M", note: "หลักประกันครอบคลุม > 1.5x", icon: Wallet },
              { title: "ระยะเวลาชำระคืน", value: "24–36 เดือน", note: "Amortization schedule ชัดเจน", icon: Calculator },
              { title: "ผลตอบแทนคาดการณ์", value: "8–12% p.a.", note: "Interest + Revenue share", icon: TrendingUp },
            ].map((b) => (
              <div key={b.title} className="rounded-xl p-5" style={{ backgroundColor: "#F8FAFC", borderLeft: "3px solid #1E3A5F" }}>
                <div className="flex items-center gap-2 mb-2">
                  <b.icon size={14} style={{ color: "#1E3A5F" }} />
                  <div className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "#1E3A5F" }}>{b.title}</div>
                </div>
                <div className="text-xl font-display font-bold mb-1" style={{ color: "#0A1628", letterSpacing: "-0.02em" }}>{b.value}</div>
                <div className="text-[11px]" style={{ color: "#64748B" }}>{b.note}</div>
              </div>
            ))}
          </div>

          <div className="rounded-md p-4 mb-12 text-[12px] italic" style={{ backgroundColor: "#F8FAFC", borderLeft: "3px solid #94A3B8", color: "#64748B" }}>
            <strong style={{ color: "#1E3A5F", fontStyle: "normal" }}>หมายเหตุ:</strong>{" "}
            ตัวเลข XX ต้องปรับตามงบการเงินจริงและหลักประกันจริงของ ENT Group ก่อนเข้าสู่ขั้นตอน Term Sheet
            — ตัวเลขสุดท้ายจะผ่านการรับรองจากผู้สอบบัญชีอิสระ
          </div>

          {/* 3 Scenarios */}
          <h3 className="text-xl font-display font-bold mb-2" style={{ color: "#0A1628" }}>
            6.1 · 3 สถานการณ์ — คุณจะได้เงินคืนเท่าไร
          </h3>
          <p className="text-sm mb-6" style={{ color: "#64748B" }}>
            จำลอง 3 สถานการณ์ตั้งแต่ดีที่สุดถึงเลวร้ายที่สุด พร้อมประมาณการผลตอบแทน
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {[
              { tag: "Best · 20%", title: "ธุรกิจโตตามแผน หรือดีกว่า", sub: "ผลตอบแทนรวม", metric: "14–18%", detail: "ENT บรรลุเป้าหมาย · Revenue share ส่งผลตอบแทนเพิ่มเติม · ได้ค่า premium จาก early buyback (optional)", color: "#059669", bg: "#F0FDF4" },
              { tag: "Base · 65%", title: "ธุรกิจเป็นไปตามแผนปกติ", sub: "ผลตอบแทนรวม", metric: "8–12%", detail: "ดอกเบี้ยครบตามสัญญา + revenue share ปานกลาง · คืนเงินต้น 100% เมื่อครบกำหนด", color: "#1E3A5F", bg: "#FFFFFF" },
              { tag: "Worst · 15%", title: "ธุรกิจชะลอ · ต้องชำระบัญชี", sub: "ได้เงินต้นคืน", metric: "85–100%", detail: "Liquidation สต๊อก + ลูกหนี้ + personal guarantee · คืนเงินต้นเกือบเต็ม", color: "#D97706", bg: "#FFFBEB" },
            ].map((s) => (
              <div key={s.tag} className="rounded-xl p-5" style={{ backgroundColor: s.bg, border: `1.5px solid ${s.color}` }}>
                <div className="inline-block px-2 py-0.5 rounded-sm text-[9px] font-bold tracking-[0.2em] uppercase mb-3" style={{ backgroundColor: s.color, color: "#FFFFFF" }}>
                  {s.tag}
                </div>
                <div className="text-base font-display font-bold mb-3 leading-tight" style={{ color: "#0A1628" }}>{s.title}</div>
                <div className="text-[10px] uppercase tracking-[0.1em] mb-1" style={{ color: "#64748B" }}>{s.sub}</div>
                <div className="text-3xl font-display font-bold mb-3" style={{ color: "#0A1628", letterSpacing: "-0.02em" }}>{s.metric}</div>
                <div className="pt-3 text-xs leading-relaxed" style={{ color: "#475569", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                  {s.detail}
                </div>
              </div>
            ))}
          </div>

          {/* Liquidation Value Table */}
          <h3 className="text-xl font-display font-bold mb-3" style={{ color: "#0A1628" }}>
            6.2 · ทำไมสถานการณ์เลวร้ายที่สุด <em style={{ fontStyle: "italic", color: "#C9A961" }}>ยังได้เงินคืน?</em>
          </h3>
          <p className="text-sm mb-4" style={{ color: "#475569" }}>
            เพราะหลักประกันของ ENT ไม่ใช่สินทรัพย์นามธรรม — เป็นสิ่งที่แปลงเป็นเงินสดได้จริงในระยะเวลาสั้น
          </p>
          <div className="overflow-x-auto mb-4 rounded-lg" style={{ border: "1px solid #E2E8F0" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#0A1628", color: "#FFFFFF" }}>
                  <th className="px-4 py-3 text-left text-xs font-semibold">ประเภทสินทรัพย์</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold">มูลค่าประมาณ</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold">Liquidation Value</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">ระยะเวลาแปลงเป็นเงินสด</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["สต๊อกสินค้า (Industrial PC)", "฿ X.X M", "70–80%", "30–60 วัน (ขายที่ 30–40% discount)"],
                  ["ลูกหนี้การค้า (Aging ≤ 90 วัน)", "฿ X.X M", "85–95%", "45–90 วัน"],
                  ["เงินสด + เทียบเท่า", "฿ X.X M", "100%", "ทันที"],
                  ["อุปกรณ์สำนักงาน", "฿ X.X M", "30–40%", "30–60 วัน"],
                ].map((r, i) => (
                  <tr key={r[0]} style={{ backgroundColor: i % 2 === 1 ? "#F8FAFC" : "#FFFFFF" }}>
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: "#1E3A5F" }}>{r[0]}</td>
                    <td className="px-4 py-3 text-right font-display font-medium" style={{ color: "#0A1628" }}>{r[1]}</td>
                    <td className="px-4 py-3 text-right font-display font-medium" style={{ color: "#0A1628" }}>{r[2]}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: "#475569" }}>{r[3]}</td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: "#0A1628", color: "#FFFFFF" }}>
                  <td className="px-4 py-3 text-sm font-bold">รวมมูลค่าหลังชำระบัญชี</td>
                  <td className="px-4 py-3 text-right font-display font-bold" style={{ color: "#D4B876" }}>฿ XX.X M</td>
                  <td className="px-4 py-3 text-right font-display font-bold" style={{ color: "#D4B876" }}>~85%</td>
                  <td className="px-4 py-3 text-sm">90–180 วัน</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="rounded-md p-4 mb-12" style={{ backgroundColor: "#ECFDF5", borderLeft: "4px solid #059669" }}>
            <div className="text-sm font-semibold mb-1" style={{ color: "#065F46" }}>📌 Key Insight</div>
            <p className="text-sm leading-relaxed" style={{ color: "#1E3A5F" }}>
              Industrial PC มี <strong>ตลาดมือสองที่ active</strong> — ไม่เหมือน inventory ประเภทเสื้อผ้า/อาหาร
              ที่มูลค่าลดเร็ว สินค้าของเราขายได้ที่ 70–80% ของราคาต้นทุนแม้ในสถานการณ์ฉุกเฉิน
              เพราะเป็น durable goods อายุการใช้งาน 5–10 ปี
            </p>
          </div>

          {/* Payment Waterfall */}
          <h3 className="text-xl font-display font-bold mb-3" style={{ color: "#0A1628" }}>
            6.3 · Payment Waterfall — <em style={{ fontStyle: "italic", color: "#C9A961" }}>ใครได้ก่อน ใครได้หลัง</em>
          </h3>
          <p className="text-sm mb-5" style={{ color: "#475569" }}>
            กฎหมายไทยกำหนดลำดับการจ่ายเงินไว้ชัดเจน — นักลงทุนของเราอยู่ในลำดับที่{" "}
            <strong>ได้รับเงินคืนก่อนผู้ถือหุ้น</strong>
          </p>
          <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
            {[
              { n: 1, title: "ภาษีและค่าธรรมเนียมกฎหมาย", desc: "ภาษีค้างชำระ · ค่าใช้จ่ายในการชำระบัญชี · ค่าทนาย", amount: "~ 3–5%", highlight: false },
              { n: 2, title: "เงินเดือนค้างจ่ายพนักงาน", desc: "ตามกฎหมายแรงงาน · ไม่เกิน X เดือน", amount: "~ 2–3%", highlight: false },
              { n: 3, title: "⭐ Secured Debt Investors (นักลงทุนของเรา)", desc: "เงินต้น + ดอกเบี้ยค้างชำระ · ได้จากสินทรัพย์หลักประกัน", amount: "85–100%", highlight: true },
              { n: 4, title: "เจ้าหนี้การค้า (suppliers)", desc: "ได้เงินจากสินทรัพย์ที่เหลือ (ถ้ามี)", amount: "?", highlight: false },
              { n: 5, title: "ผู้ถือหุ้น / ผู้ก่อตั้ง (สุดท้าย)", desc: "ได้ส่วนเหลือ (ถ้ามี) · เสียก่อนนักลงทุนเสมอ", amount: "สุดท้าย", highlight: false },
            ].map((w, idx, arr) => (
              <div
                key={w.n}
                className="flex items-center gap-4 py-3"
                style={{
                  backgroundColor: w.highlight ? "#FFFBEB" : "transparent",
                  borderRadius: w.highlight ? "4px" : 0,
                  paddingLeft: w.highlight ? "8px" : 0,
                  paddingRight: w.highlight ? "8px" : 0,
                  borderBottom: idx === arr.length - 1 ? "none" : "1px dashed #E2E8F0",
                }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-xs shrink-0"
                  style={{ backgroundColor: w.highlight ? "#C9A961" : "#0A1628", color: w.highlight ? "#0A1628" : "#FFFFFF" }}
                >
                  {w.n}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: "#0A1628" }}>{w.title}</div>
                  <div className="text-[12px] leading-snug" style={{ color: "#64748B" }}>{w.desc}</div>
                </div>
                <div className="font-display font-medium text-base whitespace-nowrap" style={{ color: "#C9A961" }}>{w.amount}</div>
              </div>
            ))}
          </div>
          <div className="rounded-md p-4 mb-12" style={{ backgroundColor: "#FFFBEB", borderLeft: "4px solid #D97706" }}>
            <div className="text-sm font-semibold mb-1" style={{ color: "#78350F" }}>💡 สิ่งที่แตกต่างจากการซื้อหุ้น (Equity)</div>
            <p className="text-sm leading-relaxed" style={{ color: "#1E3A5F" }}>
              ถ้าคุณ <strong>ซื้อหุ้น</strong> ของ ENT (Equity) — คุณจะอยู่ลำดับ <strong>ที่ 5</strong> (หลังสุด)
              เสี่ยงเสียเงิน 100% ถ้าธุรกิจเจ๊ง · แต่เมื่อคุณลงทุนในรูป <strong>Debt</strong> อยู่ลำดับที่ 3 —
              ได้เงินก่อนผู้ถือหุ้น และได้จากหลักประกันที่กำหนดไว้เฉพาะ
            </p>
          </div>

          {/* 3-Layer Collateral */}
          <h3 className="text-xl font-display font-bold mb-5" style={{ color: "#0A1628" }}>
            6.4 · หลักประกัน 3 ชั้น
          </h3>
          <div className="space-y-5 mb-12">
            {[
              { layer: "ชั้นที่ 1 · หลักประกันขั้นต้น (Primary Collateral)", left: "สต๊อก + ลูกหนี้การค้า", right: "ประเมินทุกไตรมาส", fill: "≥ 100% ของเงินต้น", width: "85%" },
              { layer: "ชั้นที่ 2 · การค้ำประกันส่วนตัว (Personal Guarantee)", left: "ผู้ก่อตั้งค้ำประกันส่วนตัว", right: "ตามขนาดการลงทุน", fill: "เพิ่ม 50–60%", width: "60%" },
              { layer: "ชั้นที่ 3 · Covenant Protection", left: "ห้ามก่อหนี้เพิ่ม · ห้ามขายสินทรัพย์", right: "แจ้งเตือนก่อนปัญหา", fill: "Early Warning System", width: "40%" },
            ].map((c) => (
              <div key={c.layer}>
                <div className="text-base font-display font-semibold mb-2" style={{ color: "#152948" }}>{c.layer}</div>
                <div className="h-7 rounded-sm overflow-hidden relative" style={{ backgroundColor: "#E2E8F0" }}>
                  <div
                    className="h-full flex items-center justify-end px-3 font-display font-bold text-xs"
                    style={{ width: c.width, background: "linear-gradient(90deg, #059669, #C9A961)", color: "#FFFFFF" }}
                  >
                    {c.fill}
                  </div>
                </div>
                <div className="flex justify-between text-xs mt-1" style={{ color: "#64748B" }}>
                  <span>{c.left}</span>
                  <span>{c.right}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Comparative Risk Table */}
          <h3 className="text-xl font-display font-bold mb-3" style={{ color: "#0A1628" }}>
            6.5 · เปรียบเทียบความเสี่ยง <em style={{ fontStyle: "italic", color: "#C9A961" }}>ต่อผลตอบแทน</em>
          </h3>
          <p className="text-sm mb-4" style={{ color: "#475569" }}>
            ผลตอบแทน 8–12% อาจฟังดูไม่สูงเท่าหุ้น — แต่เมื่อพิจารณาความเสี่ยงและหลักประกันแล้ว
            นี่คือหนึ่งในทางเลือก <strong>risk-adjusted return ดีที่สุด</strong> ในตลาด private debt
          </p>
          <div className="overflow-x-auto mb-4 rounded-lg" style={{ border: "1px solid #E2E8F0" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#0A1628", color: "#FFFFFF" }}>
                  <th className="px-4 py-3 text-left text-xs font-semibold">ทางเลือก</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold">ผลตอบแทน</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold">ความเสี่ยงขาดทุนต้น</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">หลักประกัน</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "เงินฝากธนาคาร", ret: "1–2%", risk: "~0%", riskColor: "#059669", coll: "ประกันเงินฝาก 1M" },
                  { name: "พันธบัตรรัฐบาล 3 ปี", ret: "2–3%", risk: "~0%", riskColor: "#059669", coll: "Sovereign guarantee" },
                  { name: "หุ้นกู้บริษัทมหาชน (Investment Grade)", ret: "3–5%", risk: "< 1%", riskColor: "#059669", coll: "แล้วแต่ issue" },
                  { name: "⭐ ENT Group Debt + Revenue Share", ret: "8–12%", risk: "< 15%", riskColor: "#D97706", coll: "สต๊อก + ลูกหนี้ + Personal G", highlight: true },
                  { name: "หุ้นกู้บริษัทเอกชน High Yield", ret: "7–10%", risk: "10–20%", riskColor: "#D97706", coll: "บางฉบับไม่มี" },
                  { name: "การลงทุนในหุ้น SET", ret: "6–10%", risk: "30–50%", riskColor: "#DC2626", coll: "ไม่มี" },
                  { name: "Venture Capital / Angel", ret: "0–30%", risk: "60–80%", riskColor: "#DC2626", coll: "ไม่มี" },
                ].map((r, i) => (
                  <tr
                    key={r.name}
                    style={{
                      backgroundColor: r.highlight ? "#FFFBEB" : (i % 2 === 1 ? "#F8FAFC" : "#FFFFFF"),
                      outline: r.highlight ? "2px solid #C9A961" : undefined,
                    }}
                  >
                    <td className="px-4 py-3 text-sm" style={{ color: "#1E3A5F", fontWeight: r.highlight ? 600 : 500 }}>{r.name}</td>
                    <td
                      className="px-4 py-3 text-right font-display font-medium"
                      style={{ color: r.highlight ? "#C9A961" : "#0A1628", fontSize: r.highlight ? "15px" : undefined }}
                    >
                      {r.ret}
                    </td>
                    <td className="px-4 py-3 text-right font-display font-medium" style={{ color: r.riskColor }}>{r.risk}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: "#475569", fontWeight: r.highlight ? 500 : 400 }}>{r.coll}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-md p-5" style={{ backgroundColor: "#ECFDF5", borderLeft: "4px solid #059669" }}>
            <div className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: "#065F46" }}>
              <Star size={14} style={{ color: "#059669" }} /> ทำไม ENT คือ "Sweet Spot"
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#1E3A5F" }}>
              ผลตอบแทน <strong>สูงกว่าหุ้นกู้ Investment Grade 2–3 เท่า</strong>
              แต่ความเสี่ยงต่ำกว่าหุ้นสามัญ <strong>3–5 เท่า</strong> —
              เพราะมีหลักประกันจริงและอยู่อันดับได้รับเงินก่อนผู้ถือหุ้น
            </p>
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
