import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { z } from "zod";
import {
  TrendingUp, Shield, Users, Building2, Lock, FileText,
  CheckCircle2, Loader2, ArrowRight, Mail, Phone,
  Briefcase, Globe, Award, BarChart3, Target, Sparkles,
} from "lucide-react";
import MiniNavbar from "@/components/MiniNavbar";
import FooterCompact from "@/components/FooterCompact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/* ═══════ Schema ═══════ */
const inquirySchema = z.object({
  full_name: z.string().trim().min(2, "กรุณากรอกชื่อ-สกุล").max(100),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  position: z.string().trim().max(100).optional().or(z.literal("")),
  email: z.string().trim().email("อีเมลไม่ถูกต้อง").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  line_id: z.string().trim().max(50).optional().or(z.literal("")),
  investor_type: z.string().max(50).optional().or(z.literal("")),
  budget_range: z.string().max(50).optional().or(z.literal("")),
  timeline: z.string().max(50).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

/* ═══════ Highlights (สาธารณะ — เปิดเผยได้) ═══════ */
const highlights = [
  { icon: Building2, value: "13+", label: "ปีในวงการ B2B Industrial" },
  { icon: Users, value: "8,000+", label: "ลูกค้าองค์กร" },
  { icon: Award, value: "600+", label: "SKU สินค้าอุตสาหกรรม" },
  { icon: TrendingUp, value: "100%", label: "เติบโตต่อเนื่องทุกปี" },
];

const pillars = [
  {
    icon: Target,
    title: "ธุรกิจจริง ไม่ใช่ Startup เผาเงิน",
    desc: "ดำเนินกิจการ 13 ปี มีรายได้สม่ำเสมอ ลูกค้าองค์กรกว่า 8,000 ราย ครอบคลุมราชการ โรงงาน โรงพยาบาล และสถาบันการศึกษา",
  },
  {
    icon: Sparkles,
    title: "B2B Industrial Digital Platform",
    desc: "แพลตฟอร์มจัดซื้ออุตสาหกรรมครบวงจร — RFQ, ใบเสนอราคา, ใบสั่งซื้อ, ใบวางบิล, ใบเสร็จ ผ่านระบบเดียว",
  },
  {
    icon: BarChart3,
    title: "ตลาดที่กำลังเติบโต",
    desc: "ตลาด Industrial PC + Edge Computing ในไทยมูลค่ากว่า 12,000 ล้านบาท — เรามีส่วนแบ่งพร้อมโตได้อีกหลายเท่า",
  },
  {
    icon: Shield,
    title: "โครงสร้างการลงทุนที่ปลอดภัย",
    desc: "ระดมทุนในรูปแบบ เงินกู้ + ส่วนแบ่งรายได้ (Debt + Revenue Share) — ไม่เสียหุ้น ไม่เสียอำนาจควบคุม นักลงทุนได้ผลตอบแทนชัดเจน",
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FAF8F3" }}>
      <Helmet>
        <title>Investor Relations | ENT Group — B2B Industrial Platform</title>
        <meta
          name="description"
          content="ENT Group กำลังระดมทุนเพื่อขยาย B2B Industrial Digital Platform — 13 ปี ลูกค้าองค์กร 8,000+ ราย ขอ Pitch Deck ฉบับเต็มได้ที่นี่"
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <MiniNavbar />

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
            Investor Relations · Confidential
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6" style={{ color: "#FFFFFF" }}>
            ลงทุนใน <span style={{ color: "#C9A961" }}>ENT Group</span>
            <br />
            B2B Industrial Platform ของไทย
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl mb-10" style={{ color: "#94A3B8" }}>
            ธุรกิจ 13 ปี · ลูกค้าองค์กร 8,000+ ราย · กำลังระดมทุนเพื่อขยายแพลตฟอร์มจัดซื้ออุตสาหกรรมครบวงจร
            <br />
            <span style={{ color: "#D4B876" }}>โครงสร้างการลงทุน: เงินกู้ + ส่วนแบ่งรายได้ (ไม่เสียหุ้น)</span>
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
              ขอ Pitch Deck ฉบับเต็ม + NDA
              <ArrowRight size={16} />
            </a>
            <a
              href="#why"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-sm font-semibold transition-all"
              style={{ backgroundColor: "transparent", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              ทำไมต้อง ENT Group
            </a>
          </div>
        </div>
      </section>

      {/* ═══════ Pillars (สาธารณะ) ═══════ */}
      <section id="why" className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase mb-3 block" style={{ color: "#C9A961" }}>
              The Investment Thesis
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight" style={{ color: "#0A1628" }}>
              4 เหตุผลที่ <span style={{ color: "#C9A961" }}>นักลงทุน</span> ควรพิจารณา ENT Group
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl p-7 transition-all hover:shadow-lg"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "rgba(201, 169, 97, 0.1)", border: "1px solid rgba(201, 169, 97, 0.3)" }}
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

      {/* ═══════ Use of Funds (overview only) ═══════ */}
      <section className="py-20 px-4" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="container max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase mb-3 block" style={{ color: "#C9A961" }}>
              Use of Funds · Overview
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight mb-3" style={{ color: "#0A1628" }}>
              เงินทุนนำไปใช้ทำอะไร
            </h2>
            <p className="text-sm" style={{ color: "#64748B" }}>
              สัดส่วนการจัดสรรและจำนวนเงินที่ระดมทุนเปิดเผยในเอกสาร Pitch Deck ฉบับเต็มเท่านั้น
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {useOfFunds.map((u, i) => (
              <div
                key={u.label}
                className="rounded-xl p-6"
                style={{ backgroundColor: "#FAF8F3", border: "1px solid #E2E8F0" }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-display font-black mb-3"
                  style={{ backgroundColor: "#0A1628", color: "#C9A961" }}
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
      <section className="py-14 px-4">
        <div className="container max-w-4xl mx-auto">
          <div
            className="rounded-2xl p-8 md:p-10 text-center"
            style={{
              background: "linear-gradient(135deg, #0A1628 0%, #0F1E38 100%)",
              border: "1px solid rgba(201, 169, 97, 0.25)",
            }}
          >
            <Lock size={28} style={{ color: "#C9A961" }} className="mx-auto mb-4" />
            <h3 className="text-xl md:text-2xl font-display font-bold mb-3" style={{ color: "#FFFFFF" }}>
              ข้อมูลเชิงลึกเปิดเผยตามคำขอเท่านั้น
            </h3>
            <p className="text-sm leading-relaxed max-w-2xl mx-auto" style={{ color: "#94A3B8" }}>
              จำนวนเงินระดมทุน, โครงสร้าง Debt + Revenue Share, ผลตอบแทนคาดการณ์, งบการเงินย้อนหลัง,
              และ Term Sheet จะถูกส่งให้นักลงทุนที่ผ่านการคัดกรองและลงนาม NDA แล้วเท่านั้น
            </p>
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
              ขอ Pitch Deck ฉบับเต็ม
            </h2>
            <p className="text-sm" style={{ color: "#64748B" }}>
              กรอกข้อมูลด้านล่าง — ทีม Investor Relations จะติดต่อกลับภายใน 24 ชั่วโมง พร้อมส่ง NDA และเอกสารฉบับเต็ม
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
                เราได้รับคำขอของคุณแล้ว — ทีม IR จะติดต่อกลับภายใน 24 ชั่วโมง<br />
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
              <div className="grid md:grid-cols-2 gap-4">
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
                    บริษัท / Family Office
                  </Label>
                  <Input
                    id="company"
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    placeholder="ชื่อบริษัทหรือกองทุน"
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
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block" style={{ color: "#0A1628" }}>
                    ประเภทนักลงทุน
                  </Label>
                  <Select value={form.investor_type} onValueChange={(v) => update("investor_type", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกประเภท" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">บุคคลธรรมดา (HNWI)</SelectItem>
                      <SelectItem value="family_office">Family Office</SelectItem>
                      <SelectItem value="corporate">นิติบุคคล / บริษัท</SelectItem>
                      <SelectItem value="fund">กองทุน / Private Fund</SelectItem>
                      <SelectItem value="other">อื่นๆ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block" style={{ color: "#0A1628" }}>
                    ช่วงงบลงทุนที่สนใจ
                  </Label>
                  <Select value={form.budget_range} onValueChange={(v) => update("budget_range", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกช่วงงบ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under_5m">ต่ำกว่า 5 ลบ.</SelectItem>
                      <SelectItem value="5_10m">5 – 10 ลบ.</SelectItem>
                      <SelectItem value="10_20m">10 – 20 ลบ.</SelectItem>
                      <SelectItem value="20_30m">20 – 30 ลบ.</SelectItem>
                      <SelectItem value="over_30m">มากกว่า 30 ลบ.</SelectItem>
                      <SelectItem value="discuss">ขอหารือเพิ่มเติม</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold mb-1.5 block" style={{ color: "#0A1628" }}>
                  ระยะเวลาที่สนใจตัดสินใจ
                </Label>
                <Select value={form.timeline} onValueChange={(v) => update("timeline", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกระยะเวลา" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">พร้อมตัดสินใจทันที (ภายใน 1 เดือน)</SelectItem>
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
                  placeholder="คำถาม หรือข้อมูลเพิ่มเติมที่ต้องการ"
                  maxLength={1000}
                />
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: "rgba(201, 169, 97, 0.06)", border: "1px solid rgba(201, 169, 97, 0.2)" }}>
                <Lock size={16} style={{ color: "#C9A961" }} className="mt-0.5 shrink-0" />
                <p className="text-[11px] leading-relaxed" style={{ color: "#64748B" }}>
                  ข้อมูลของคุณจะถูกเก็บเป็นความลับและใช้สำหรับติดต่อกลับเรื่องการลงทุนเท่านั้น
                  ทีม IR จะส่ง NDA ผ่านอีเมลก่อนเปิดเผยรายละเอียดเชิงลึก
                </p>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 text-sm font-bold transition-all hover:scale-[1.01]"
                style={{ backgroundColor: "#0A1628", color: "#C9A961" }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    กำลังส่ง...
                  </>
                ) : (
                  <>
                    ส่งคำขอ Pitch Deck
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
        </div>
      </section>

      <FooterCompact />
    </div>
  );
};

export default Investors;
