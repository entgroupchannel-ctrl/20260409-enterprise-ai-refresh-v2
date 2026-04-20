import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { z } from "zod";
import {
  TrendingUp, Shield, Users, Building2, Lock,
  CheckCircle2, Loader2, ArrowRight, Mail,
  Award, BarChart3, Target, Sparkles, AlertTriangle,
} from "lucide-react";
import MiniNavbar from "@/components/MiniNavbar";
import FooterCompact from "@/components/FooterCompact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import StrategicVisionTabs from "@/components/investors/StrategicVisionTabs";
import UnlockVisionDialog from "@/components/investors/UnlockVisionDialog";
import FontSizeControl from "@/components/investors/FontSizeControl";

/* ═══════ Schema ═══════ */
const inquirySchema = z.object({
  full_name: z.string().trim().min(2, "กรุณากรอกชื่อ-สกุล").max(100),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  position: z.string().trim().max(100).optional().or(z.literal("")),
  email: z.string().trim().email("อีเมลไม่ถูกต้อง").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  line_id: z.string().trim().max(50).optional().or(z.literal("")),
  investor_type: z.string().min(1, "กรุณาเลือกประเภทผู้ลงทุนที่ตรงกับคุณสมบัติ").max(50),
  budget_range: z.string().max(50).optional().or(z.literal("")),
  timeline: z.string().max(50).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

/* ═══════ Highlights (เปิดเผยได้ — ข้อเท็จจริงทางธุรกิจ) ═══════ */
const highlights = [
  { icon: Building2, value: "10+", label: "ปีดำเนินธุรกิจ (จดทะเบียน 2558)" },
  { icon: Users, value: "8,000+", label: "ลูกค้าองค์กร" },
  { icon: Award, value: "600+", label: "SKU สินค้าอุตสาหกรรม" },
  { icon: TrendingUp, value: "เติบโต", label: "ต่อเนื่องทุกปี" },
];

const pillars = [
  {
    icon: Target,
    title: "ธุรกิจจริง ดำเนินงานต่อเนื่องกว่า 10 ปี",
    desc: "มีรายได้สม่ำเสมอจากลูกค้าองค์กรกว่า 8,000 ราย ครอบคลุมหน่วยงานราชการ โรงงาน โรงพยาบาล และสถาบันการศึกษา",
  },
  {
    icon: Sparkles,
    title: "B2B Industrial Digital Platform",
    desc: "แพลตฟอร์มจัดซื้ออุตสาหกรรมครบวงจร — RFQ, ใบเสนอราคา, ใบสั่งซื้อ, ใบวางบิล, ใบเสร็จ ผ่านระบบเดียว",
  },
  {
    icon: BarChart3,
    title: "ตลาดที่กำลังเติบโต",
    desc: "ตลาด Industrial PC + Edge Computing ในไทย มีมูลค่าระดับหมื่นล้านบาท พร้อมโอกาสในการขยายส่วนแบ่งตลาด",
  },
  {
    icon: Shield,
    title: "พร้อมขยายความร่วมมือเชิงกลยุทธ์",
    desc: "บริษัทกำลังเปิดรับการพูดคุยกับพันธมิตรเชิงกลยุทธ์เป็นการเฉพาะกลุ่ม — รายละเอียดทั้งหมดเปิดเผยเฉพาะผู้ที่ผ่านการคัดกรองคุณสมบัติและลงนาม NDA แล้วเท่านั้น",
  },
];

const useOfFunds = [
  { label: "ขยาย Stock & Inventory", desc: "นำเข้าสินค้ารองรับโครงการขนาดใหญ่" },
  { label: "พัฒนา Platform & R&D", desc: "ยกระดับระบบ B2B และ AI Tools" },
  { label: "ขยายทีมขาย", desc: "เพิ่ม Sales Engineer ครอบคลุมพื้นที่ทั่วประเทศ" },
  { label: "Marketing & Brand", desc: "สร้างการรับรู้แบรนด์ในกลุ่มองค์กร" },
];

const Investors = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [eligibilityConfirmed, setEligibilityConfirmed] = useState(false);
  const [ndaAccepted, setNdaAccepted] = useState(false);
  const [visionUnlocked, setVisionUnlocked] = useState<boolean>(() => {
    try { return !!localStorage.getItem("investor_unlocked_at"); } catch { return false; }
  });
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    company: "",
    position: "",
    email: "",
    phone: "",
    line_id: "",
    investor_type: "",
    budget_range: "",
    timeline: "",
    message: "",
  });

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!eligibilityConfirmed) {
      toast({
        title: "กรุณายืนยันคุณสมบัติ",
        description: "ต้องยืนยันว่าคุณเป็นผู้ลงทุนที่เข้าเกณฑ์ตามประกาศ ก.ล.ต.",
        variant: "destructive",
      });
      return;
    }
    if (!ndaAccepted) {
      toast({
        title: "กรุณายอมรับเงื่อนไขการรักษาความลับ",
        description: "ต้องยอมรับเงื่อนไขก่อนส่งคำขอ",
        variant: "destructive",
      });
      return;
    }

    const parsed = inquirySchema.safeParse(form);
    if (!parsed.success) {
      const firstErr = parsed.error.errors[0]?.message ?? "ข้อมูลไม่ถูกต้อง";
      toast({ title: "กรุณาตรวจสอบข้อมูล", description: firstErr, variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("investor_inquiries").insert({
        full_name: parsed.data.full_name,
        company: parsed.data.company || null,
        position: parsed.data.position || null,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        line_id: parsed.data.line_id || null,
        investor_type: parsed.data.investor_type || null,
        budget_range: parsed.data.budget_range || null,
        timeline: parsed.data.timeline || null,
        message: parsed.data.message || null,
        source: "investors_page",
      });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: "ส่งคำขอเรียบร้อย ✓",
        description: "ทีม IR จะติดต่อกลับภายใน 24 ชั่วโมง",
      });
    } catch (err: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: err?.message ?? "กรุณาลองใหม่",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="investor-content-root" className="min-h-screen flex flex-col" style={{ backgroundColor: "#FAF8F3" }}>
      <Helmet>
        <title>Strategic Partnership Inquiry | ENT Group</title>
        <meta
          name="description"
          content="ENT Group — B2B Industrial Platform จดทะเบียน 2558 ลูกค้าองค์กร 8,000+ ราย ข้อมูลรายละเอียดเปิดเผยเฉพาะพันธมิตรที่ผ่านการคัดกรองคุณสมบัติเท่านั้น"
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <MiniNavbar />

      {/* ═══════ LEGAL DISCLAIMER BAR (top, non-dismissable) ═══════ */}
      <div
        className="w-full px-4 py-3"
        style={{
          backgroundColor: "#1A1410",
          borderBottom: "1px solid rgba(201, 169, 97, 0.3)",
        }}
      >
        <div className="container max-w-6xl mx-auto flex items-start gap-3">
          <AlertTriangle size={16} style={{ color: "#C9A961" }} className="mt-0.5 shrink-0" />
          <p className="text-[11px] leading-relaxed" style={{ color: "#D4B876" }}>
            <strong>ประกาศทางกฎหมาย:</strong> ข้อมูลในหน้านี้ <u>มิใช่</u> การเสนอขายหลักทรัพย์ หุ้น หุ้นกู้ หรือการเชิญชวนให้ลงทุนต่อประชาชนทั่วไป
            ตาม พ.ร.บ. หลักทรัพย์และตลาดหลักทรัพย์ พ.ศ. 2535 และ พ.ร.ก. การกู้ยืมเงินที่เป็นการฉ้อโกงประชาชน พ.ศ. 2527
            จัดทำเพื่อการสื่อสารกับ <strong>พันธมิตรเชิงกลยุทธ์เฉพาะกลุ่ม</strong> (ผู้ลงทุนสถาบัน / ผู้ลงทุนรายใหญ่พิเศษตามนิยามของ ก.ล.ต. / บุคคลที่ได้รับเชิญเป็นการเฉพาะ) เท่านั้น
          </p>
        </div>
      </div>

      {/* ═══════ HERO ═══════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0A1628 0%, #0F1E38 60%, #1E3A5F 100%)",
        }}
      >
        {/* Gold accent texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #C9A961 1px, transparent 1px), radial-gradient(circle at 80% 70%, #C9A961 1px, transparent 1px)",
            backgroundSize: "60px 60px, 90px 90px",
          }}
        />
        <div className="relative container max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase mb-6"
            style={{ backgroundColor: "rgba(201, 169, 97, 0.12)", color: "#D4B876", border: "1px solid rgba(201, 169, 97, 0.3)" }}>
            <Lock size={12} />
            Strategic Partnership · By Invitation Only
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6" style={{ color: "#FFFFFF" }}>
            <span style={{ color: "#C9A961" }}>ENT Group</span>
            <br />
            B2B Industrial Platform ของไทย
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl mb-10" style={{ color: "#94A3B8" }}>
            จดทะเบียน 2558 · ลูกค้าองค์กร 8,000+ ราย · เปิดรับการพูดคุยกับพันธมิตรเชิงกลยุทธ์เฉพาะกลุ่ม เพื่อขยายแพลตฟอร์มจัดซื้ออุตสาหกรรมครบวงจร
            <br />
            <span style={{ color: "#D4B876" }}>รายละเอียดเปิดเผยเฉพาะผู้ที่ผ่านการคัดกรองคุณสมบัติและลงนาม NDA</span>
          </p>

          {/* Highlights strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
            {highlights.map((h) => (
              <div
                key={h.label}
                className="rounded-xl p-5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(201, 169, 97, 0.2)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <h.icon size={18} style={{ color: "#C9A961" }} className="mb-2" />
                <div className="text-2xl md:text-3xl font-display font-black" style={{ color: "#FFFFFF" }}>
                  {h.value}
                </div>
                <div className="text-[11px] mt-1" style={{ color: "#94A3B8" }}>
                  {h.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#request-deck"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-sm font-bold transition-all hover:scale-[1.02] shadow-lg"
              style={{ backgroundColor: "#C9A961", color: "#0A1628" }}
            >
              ขอข้อมูลเพิ่มเติม (สำหรับผู้ที่เข้าเกณฑ์)
              <ArrowRight size={16} />
            </a>
            <a
              href="#why"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-sm font-semibold transition-all"
              style={{ backgroundColor: "transparent", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              เกี่ยวกับ ENT Group
            </a>
          </div>
        </div>
      </section>

      {/* ═══════ Pillars (สาธารณะ) ═══════ */}
      <section
        id="why"
        className="relative py-20 px-4 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #FAF8F3 0%, #F5F1E8 50%, #FAF8F3 100%)",
        }}
      >
        {/* Decorative gold radial blobs */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.08] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, #C9A961 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-[0.06] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, #1E3A5F 0%, transparent 70%)",
            transform: "translate(-30%, 30%)",
          }}
        />

        <div className="relative container max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="h-px w-8" style={{ backgroundColor: "#C9A961" }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#C9A961" }}>
                Company Overview
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight" style={{ color: "#0A1628" }}>
              ทำไมพันธมิตรเชิงกลยุทธ์ จึงเลือก <span style={{ color: "#C9A961" }}>ENT Group</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="group relative rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background:
                    "linear-gradient(135deg, #FFFFFF 0%, #FDFCF8 100%)",
                  border: "1px solid #E8E0CC",
                  boxShadow:
                    "0 1px 3px rgba(10, 22, 40, 0.04), 0 8px 24px rgba(201, 169, 97, 0.06)",
                }}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-7 right-7 h-[2px] rounded-full opacity-60 transition-opacity group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, #C9A961 50%, transparent 100%)",
                  }}
                />
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(201, 169, 97, 0.15) 0%, rgba(201, 169, 97, 0.05) 100%)",
                    border: "1px solid rgba(201, 169, 97, 0.35)",
                    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.6)",
                  }}
                >
                  <p.icon size={22} style={{ color: "#C9A961" }} />
                </div>
                <h3 className="text-lg font-display font-bold mb-2" style={{ color: "#0A1628" }}>
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ STRATEGIC VISION (Vision · SWOT · Landscape · Strategy · ESG) ═══════ */}
      <section className="py-16 px-4" style={{ backgroundColor: "#FAF8F3" }}>
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold tracking-widest uppercase mb-3 block" style={{ color: "#C9A961" }}>
              Strategic Vision 2026–2028
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3" style={{ color: "#0A1628" }}>
              ทิศทางเชิงกลยุทธ์ของ ENT Group
            </h2>
            <p className="text-sm max-w-2xl mx-auto" style={{ color: "#64748B" }}>
              วิสัยทัศน์ · SWOT · ภาพการแข่งขัน · กลยุทธ์ · แผน ESG — ครบทุกมุมในที่เดียว
            </p>
          </div>
          {visionUnlocked ? (
            <StrategicVisionTabs />
          ) : (
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0A1628 0%, #0F1E38 100%)",
                border: "1px solid rgba(201, 169, 97, 0.25)",
              }}
            >
              {/* Blurred preview */}
              <div className="absolute inset-0 opacity-20 blur-md pointer-events-none select-none">
                <StrategicVisionTabs />
              </div>
              <div className="relative px-6 py-14 md:py-20 text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: "rgba(201, 169, 97, 0.12)", border: "1px solid rgba(201, 169, 97, 0.3)" }}
                >
                  <Lock size={22} style={{ color: "#C9A961" }} />
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold mb-3" style={{ color: "#FFFFFF" }}>
                  เนื้อหานี้สงวนสำหรับนักลงทุนที่สนใจ
                </h3>
                <p className="text-sm leading-relaxed max-w-xl mx-auto mb-7" style={{ color: "#94A3B8" }}>
                  วิสัยทัศน์ · SWOT · ภาพการแข่งขัน · กลยุทธ์ 2026–2028 · แผน ESG<br />
                  กดปุ่มด้านล่างเพื่อกรอกข้อมูลติดต่อสั้นๆ — เราจะเปิดให้ดูทันที พร้อมส่งลิงก์ฉบับเต็มไปอีเมล
                </p>
                <Button
                  onClick={() => setUnlockOpen(true)}
                  className="h-12 px-8 text-sm font-bold transition-all hover:scale-[1.02] shadow-lg"
                  style={{ backgroundColor: "#C9A961", color: "#0A1628" }}
                >
                  <Lock size={14} className="mr-2" /> เปิดดู Strategic Vision
                </Button>
                <p className="text-[11px] mt-4" style={{ color: "#64748B" }}>
                  ใช้เวลาไม่ถึง 30 วินาที · ข้อมูลของท่านเป็นความลับ
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <UnlockVisionDialog
        open={unlockOpen}
        onOpenChange={setUnlockOpen}
        onUnlocked={() => setVisionUnlocked(true)}
      />

      {/* ═══════ Areas of Strategic Focus (overview only) ═══════ */}
      <section
        className="relative py-20 px-4 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #FFFFFF 0%, #FBF9F2 100%)",
        }}
      >
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #0A1628 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative container max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="h-px w-8" style={{ backgroundColor: "#C9A961" }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#C9A961" }}>
                Areas of Strategic Focus
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight mb-3" style={{ color: "#0A1628" }}>
              ทิศทางการขยายธุรกิจ
            </h2>
            <p className="text-sm" style={{ color: "#64748B" }}>
              ภาพรวมพื้นที่ที่บริษัทมุ่งขยาย — รายละเอียดเชิงลึก โครงสร้างความร่วมมือ
              และเงื่อนไขทางการเงิน เปิดเผยเฉพาะในเอกสารสำหรับพันธมิตรที่ผ่านการคัดกรองและลงนาม NDA แล้วเท่านั้น
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {useOfFunds.map((u, i) => (
              <div
                key={u.label}
                className="group relative rounded-xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background:
                    "linear-gradient(160deg, #FFFFFF 0%, #FAF6EB 100%)",
                  border: "1px solid #E8E0CC",
                  boxShadow:
                    "0 1px 2px rgba(10, 22, 40, 0.04), 0 6px 20px rgba(201, 169, 97, 0.05)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center text-base font-display font-black mb-3 transition-all group-hover:scale-110"
                  style={{
                    background:
                      "linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)",
                    color: "#C9A961",
                    boxShadow:
                      "0 4px 12px rgba(10, 22, 40, 0.25), inset 0 1px 0 rgba(201, 169, 97, 0.2)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-sm font-bold mb-1.5" style={{ color: "#0A1628" }}>
                  {u.label}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>
                  {u.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ Confidentiality Notice ═══════ */}
      <section
        className="relative py-14 px-4 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #FBF9F2 0%, #FAF8F3 100%)",
        }}
      >
        <div className="container max-w-4xl mx-auto">
          <div
            className="relative rounded-2xl p-8 md:p-10 text-center overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #0A1628 0%, #0F1E38 50%, #1A2B4A 100%)",
              border: "1px solid rgba(201, 169, 97, 0.35)",
              boxShadow:
                "0 20px 60px rgba(10, 22, 40, 0.25), inset 0 1px 0 rgba(201, 169, 97, 0.15)",
            }}
          >
            {/* Inner gold glow */}
            <div
              className="absolute top-0 left-1/2 w-[300px] h-[300px] opacity-20 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, #C9A961 0%, transparent 70%)",
                transform: "translate(-50%, -50%)",
              }}
            />
            {/* Subtle grid texture */}
            <div
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 40%, #C9A961 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(201, 169, 97, 0.2) 0%, rgba(201, 169, 97, 0.05) 100%)",
                  border: "1px solid rgba(201, 169, 97, 0.4)",
                  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                }}
              >
                <Lock size={24} style={{ color: "#C9A961" }} />
              </div>
              <h3 className="text-xl md:text-2xl font-display font-bold mb-3" style={{ color: "#FFFFFF" }}>
                ข้อมูลเชิงลึกเปิดเผยเฉพาะผู้ที่เข้าเกณฑ์เท่านั้น
              </h3>
              <p className="text-sm leading-relaxed max-w-2xl mx-auto" style={{ color: "#94A3B8" }}>
                โครงสร้างความร่วมมือ เงื่อนไขทางการเงิน ผลประกอบการย้อนหลัง และเอกสารประกอบการตัดสินใจ
                จะถูกส่งให้ <strong style={{ color: "#D4B876" }}>เฉพาะผู้ที่มีคุณสมบัติเป็นผู้ลงทุนสถาบัน
                ผู้ลงทุนรายใหญ่พิเศษตามประกาศ ก.ล.ต. ทจ. 8/2566 หรือบุคคลที่ได้รับเชิญเป็นการเฉพาะ</strong>
                {" "}และลงนามในข้อตกลงรักษาความลับ (NDA) เรียบร้อยแล้ว
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ REQUEST FORM ═══════ */}
      <section id="request-deck" className="py-20 px-4" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold tracking-widest uppercase mb-3 block" style={{ color: "#C9A961" }}>
              Request Confidential Materials
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3" style={{ color: "#0A1628" }}>
              ขอข้อมูลเพิ่มเติม
            </h2>
            <p className="text-sm" style={{ color: "#64748B" }}>
              สำหรับผู้ที่เข้าเกณฑ์เท่านั้น — ทีม Investor Relations จะติดต่อกลับภายใน 24 ชั่วโมง
              พร้อมส่ง NDA และเอกสารฉบับเต็มหลังยืนยันคุณสมบัติ
            </p>
          </div>

          {success ? (
            <div
              className="rounded-2xl p-10 text-center"
              style={{ backgroundColor: "#FAF8F3", border: "1px solid rgba(16, 185, 129, 0.3)" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
              >
                <CheckCircle2 size={32} style={{ color: "#10B981" }} />
              </div>
              <h3 className="text-xl font-display font-bold mb-2" style={{ color: "#0A1628" }}>
                ขอบคุณสำหรับความสนใจ
              </h3>
              <p className="text-sm mb-6" style={{ color: "#64748B" }}>
                เราได้รับคำขอของคุณแล้ว — ทีม IR จะตรวจสอบคุณสมบัติและติดต่อกลับภายใน 24 ชั่วโมง<br />
                ผ่านอีเมลที่ระบุไว้
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#C9A961" }}
              >
                กลับหน้าหลัก <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl p-6 md:p-8 space-y-5"
              style={{ backgroundColor: "#FAF8F3", border: "1px solid #E2E8F0" }}
            >
              {/* ═══ ELIGIBILITY GATE — ต้องเลือกก่อน ═══ */}
              <div
                className="rounded-lg p-5"
                style={{
                  backgroundColor: "rgba(220, 38, 38, 0.04)",
                  border: "1px solid rgba(220, 38, 38, 0.25)",
                }}
              >
                <div className="flex items-start gap-2 mb-3">
                  <AlertTriangle size={16} style={{ color: "#DC2626" }} className="mt-0.5 shrink-0" />
                  <h3 className="text-sm font-bold" style={{ color: "#0A1628" }}>
                    การยืนยันคุณสมบัติผู้ลงทุน <span style={{ color: "#DC2626" }}>*</span>
                  </h3>
                </div>
                <p className="text-[11px] mb-4 leading-relaxed" style={{ color: "#64748B" }}>
                  ตามประกาศคณะกรรมการกำกับตลาดทุน ที่ ทจ. 8/2566 และที่แก้ไขเพิ่มเติม
                  กรุณาเลือกประเภทที่ตรงกับคุณสมบัติของคุณ:
                </p>
                <Label className="text-xs font-semibold mb-1.5 block" style={{ color: "#0A1628" }}>
                  ประเภทผู้ลงทุน <span style={{ color: "#DC2626" }}>*</span>
                </Label>
                <Select value={form.investor_type} onValueChange={(v) => update("investor_type", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเภทที่ตรงกับคุณสมบัติของท่าน" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="institutional">
                      ผู้ลงทุนสถาบัน (Institutional Investor) — บลจ. ประกัน กองทุน ธนาคาร
                    </SelectItem>
                    <SelectItem value="ultra_hnw">
                      ผู้ลงทุนรายใหญ่พิเศษ (UHNW) — สินทรัพย์สุทธิ {">"} 70 ลบ. หรือรายได้ {">"} 10 ลบ./ปี
                    </SelectItem>
                    <SelectItem value="hnw">
                      ผู้ลงทุนรายใหญ่ (HNW) — สินทรัพย์สุทธิ {">"} 30 ลบ. หรือรายได้ {">"} 3 ลบ./ปี
                    </SelectItem>
                    <SelectItem value="invited">
                      บุคคลที่ได้รับเชิญเป็นการเฉพาะจาก ENT Group
                    </SelectItem>
                    <SelectItem value="not_qualified">
                      ฉันไม่ได้อยู่ในกลุ่มข้างต้น (จะไม่สามารถส่งคำขอได้)
                    </SelectItem>
                  </SelectContent>
                </Select>

                {form.investor_type === "not_qualified" && (
                  <div className="mt-3 p-3 rounded-md" style={{ backgroundColor: "rgba(220, 38, 38, 0.08)" }}>
                    <p className="text-[11px] leading-relaxed" style={{ color: "#7F1D1D" }}>
                      ขออภัย — ขณะนี้ ENT Group เปิดรับการพูดคุยเฉพาะผู้ลงทุนสถาบัน ผู้ลงทุนรายใหญ่
                      ตามนิยามของ ก.ล.ต. หรือบุคคลที่ได้รับเชิญเป็นการเฉพาะเท่านั้น
                      หากท่านสนใจสินค้าและบริการของเรา กรุณาติดต่อทีมขายผ่านหน้าหลักของเว็บไซต์
                    </p>
                  </div>
                )}
              </div>

              {/* ═══ Eligibility checkbox ═══ */}
              <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: "rgba(10, 22, 40, 0.04)", border: "1px solid #E2E8F0" }}>
                <Checkbox
                  id="eligibility"
                  checked={eligibilityConfirmed}
                  onCheckedChange={(v) => setEligibilityConfirmed(v === true)}
                  className="mt-0.5"
                />
                <Label htmlFor="eligibility" className="text-[11px] leading-relaxed cursor-pointer" style={{ color: "#0A1628" }}>
                  ข้าพเจ้ายืนยันว่ามีคุณสมบัติตรงตามประเภทที่เลือกไว้ข้างต้น และเข้าใจว่าข้อมูลที่จะได้รับ
                  เป็นการสื่อสารกับผู้ลงทุนเฉพาะกลุ่ม <strong>มิใช่</strong> การเสนอขายหลักทรัพย์ต่อประชาชนทั่วไป
                  ตาม พ.ร.บ. หลักทรัพย์ฯ พ.ศ. 2535
                </Label>
              </div>

              {/* ═══ NDA checkbox ═══ */}
              <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: "rgba(10, 22, 40, 0.04)", border: "1px solid #E2E8F0" }}>
                <Checkbox
                  id="nda"
                  checked={ndaAccepted}
                  onCheckedChange={(v) => setNdaAccepted(v === true)}
                  className="mt-0.5"
                />
                <Label htmlFor="nda" className="text-[11px] leading-relaxed cursor-pointer" style={{ color: "#0A1628" }}>
                  ข้าพเจ้ายอมรับว่าเอกสารและข้อมูลทั้งหมดที่ได้รับจาก ENT Group เป็น
                  <strong> ข้อมูลความลับทางธุรกิจ</strong> และจะไม่เปิดเผย ส่งต่อ คัดลอก
                  หรือนำไปใช้ในวัตถุประสงค์อื่น โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษรจากบริษัท
                  และพร้อมลงนามในเอกสาร NDA ฉบับสมบูรณ์เมื่อได้รับ
                </Label>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div>
                  <Label htmlFor="full_name" className="text-xs font-semibold mb-1.5 block" style={{ color: "#0A1628" }}>
                    ชื่อ-สกุล <span style={{ color: "#DC2626" }}>*</span>
                  </Label>
                  <Input
                    id="full_name"
                    required
                    value={form.full_name}
                    onChange={(e) => update("full_name", e.target.value)}
                    placeholder="คุณสมชาย ใจดี"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs font-semibold mb-1.5 block" style={{ color: "#0A1628" }}>
                    อีเมล <span style={{ color: "#DC2626" }}>*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="text-xs font-semibold mb-1.5 block" style={{ color: "#0A1628" }}>
                    บริษัท / Family Office / สถาบัน
                  </Label>
                  <Input
                    id="company"
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    placeholder="ชื่อนิติบุคคลหรือกองทุน"
                  />
                </div>
                <div>
                  <Label htmlFor="position" className="text-xs font-semibold mb-1.5 block" style={{ color: "#0A1628" }}>
                    ตำแหน่ง
                  </Label>
                  <Input
                    id="position"
                    value={form.position}
                    onChange={(e) => update("position", e.target.value)}
                    placeholder="Managing Partner / CIO"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-xs font-semibold mb-1.5 block" style={{ color: "#0A1628" }}>
                    เบอร์โทร
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="08x-xxx-xxxx"
                  />
                </div>
                <div>
                  <Label htmlFor="line_id" className="text-xs font-semibold mb-1.5 block" style={{ color: "#0A1628" }}>
                    LINE ID
                  </Label>
                  <Input
                    id="line_id"
                    value={form.line_id}
                    onChange={(e) => update("line_id", e.target.value)}
                    placeholder="@yourid"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold mb-1.5 block" style={{ color: "#0A1628" }}>
                  ระยะเวลาที่สนใจหารือ
                </Label>
                <Select value={form.timeline} onValueChange={(v) => update("timeline", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกระยะเวลา" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">พร้อมพูดคุยทันที (ภายใน 1 เดือน)</SelectItem>
                    <SelectItem value="1_3_months">1 – 3 เดือน</SelectItem>
                    <SelectItem value="3_6_months">3 – 6 เดือน</SelectItem>
                    <SelectItem value="exploring">ศึกษาข้อมูลก่อน</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message" className="text-xs font-semibold mb-1.5 block" style={{ color: "#0A1628" }}>
                  ข้อความเพิ่มเติม
                </Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="คำถามหรือข้อมูลเพิ่มเติมที่ต้องการทราบ"
                  maxLength={1000}
                />
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: "rgba(201, 169, 97, 0.06)", border: "1px solid rgba(201, 169, 97, 0.2)" }}>
                <Lock size={16} style={{ color: "#C9A961" }} className="mt-0.5 shrink-0" />
                <p className="text-[11px] leading-relaxed" style={{ color: "#64748B" }}>
                  ข้อมูลของท่านจะถูกเก็บเป็นความลับและใช้สำหรับการตรวจสอบคุณสมบัติและติดต่อกลับเท่านั้น
                  ทีม IR จะส่ง NDA ฉบับสมบูรณ์ผ่านอีเมลก่อนเปิดเผยรายละเอียดเชิงลึกใดๆ
                </p>
              </div>

              <Button
                type="submit"
                disabled={submitting || form.investor_type === "not_qualified" || !form.investor_type}
                className="w-full h-12 text-sm font-bold transition-all hover:scale-[1.01] disabled:hover:scale-100 disabled:opacity-50"
                style={{ backgroundColor: "#0A1628", color: "#C9A961" }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    กำลังส่ง...
                  </>
                ) : (
                  <>
                    ส่งคำขอข้อมูล
                    <ArrowRight className="ml-2" size={16} />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Direct contact alternative */}
          <div className="mt-8 text-center">
            <p className="text-xs mb-3" style={{ color: "#64748B" }}>
              หรือติดต่อทีม Investor Relations โดยตรง
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <a
                href="mailto:ir@entgroup.co.th"
                className="inline-flex items-center gap-1.5 font-semibold"
                style={{ color: "#0A1628" }}
              >
                <Mail size={13} /> ir@entgroup.co.th
              </a>
            </div>
          </div>

          {/* Final legal footer */}
          <div className="mt-12 pt-6 border-t text-center" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-[10px] leading-relaxed max-w-2xl mx-auto" style={{ color: "#94A3B8" }}>
              <strong>คำสงวนสิทธิ์ทางกฎหมาย:</strong> เว็บเพจนี้และข้อมูลที่ปรากฏ มิใช่หนังสือชี้ชวน (Prospectus)
              มิใช่การเสนอขาย หรือการเชิญชวนให้เสนอซื้อหลักทรัพย์ หุ้น หุ้นกู้ ตราสารทางการเงิน
              หรือการกู้ยืมเงินใดๆ ต่อประชาชนทั่วไป จัดทำเพื่อการสื่อสารกับพันธมิตรเชิงกลยุทธ์
              ที่มีคุณสมบัติเข้าเกณฑ์ตามกฎหมาย ก.ล.ต. และที่ได้รับเชิญเป็นการเฉพาะเท่านั้น
              บริษัทขอสงวนสิทธิ์ในการพิจารณาเปิดเผยข้อมูลเชิงลึกตามดุลพินิจของบริษัท
            </p>
          </div>
        </div>
      </section>

      <FooterCompact />
      <FontSizeControl targetId="investor-content-root" />
    </div>
  );
};

export default Investors;
