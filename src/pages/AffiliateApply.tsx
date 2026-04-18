import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Lock, Sparkles } from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const STEPS = ["profile", "professional", "network", "promotion", "review"] as const;

const PROMOTION_CHANNELS = [
  "LinkedIn",
  "Facebook",
  "YouTube",
  "TikTok",
  "Personal Website / Blog",
  "Email Newsletter",
  "Sales Network (B2B)",
  "Industry Events",
  "Line Official Account",
  "Other",
];

const EXPERTISE_AREAS = [
  "Manufacturing / Industrial Automation",
  "Logistics & Warehouse",
  "Smart City / Government",
  "Retail / POS",
  "Healthcare",
  "Energy & Utilities",
  "Transportation",
  "Edge AI / Computer Vision",
  "Networking & Security",
  "System Integration",
];

const schema = z.object({
  full_name: z.string().trim().min(2, "ระบุชื่อ-สกุล").max(100),
  phone: z.string().trim().min(9, "เบอร์โทรไม่ถูกต้อง").max(20),
  linkedin_url: z
    .string()
    .trim()
    .url("LinkedIn URL ไม่ถูกต้อง")
    .max(255)
    .refine((v) => v.includes("linkedin.com"), "ต้องเป็นลิงก์ LinkedIn"),
  current_company: z.string().trim().max(150).optional().or(z.literal("")),
  current_position: z.string().trim().max(150).optional().or(z.literal("")),
  years_experience: z.coerce.number().min(0).max(60),
  professional_bio: z.string().trim().min(50, "อย่างน้อย 50 ตัวอักษร").max(1000),
  expertise_areas: z.array(z.string()).min(1, "เลือกอย่างน้อย 1 หมวด").max(5),
  customer_network_description: z.string().trim().min(50, "อย่างน้อย 50 ตัวอักษร").max(1000),
  expected_monthly_leads: z.coerce.number().min(1).max(500),
  promotion_channels: z.array(z.string()).min(1, "เลือกอย่างน้อย 1 ช่องทาง"),
  competitive_affiliations: z.array(z.string()).default([]),
  why_affiliate: z.string().trim().min(50, "อย่างน้อย 50 ตัวอักษร").max(1000),
  agree_terms: z.literal(true, { errorMap: () => ({ message: "กรุณายอมรับเงื่อนไข" }) }),
});

type FormData = z.input<typeof schema>;

const initialData: FormData = {
  full_name: "",
  phone: "",
  linkedin_url: "",
  current_company: "",
  current_position: "",
  years_experience: 0,
  professional_bio: "",
  expertise_areas: [],
  customer_network_description: "",
  expected_monthly_leads: 5,
  promotion_channels: [],
  competitive_affiliations: [],
  why_affiliate: "",
  agree_terms: false as unknown as true,
};

const AffiliateApply = () => {
  const { lang } = useI18n();
  const isEn = lang === "en";
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(0);
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [existingStatus, setExistingStatus] = useState<string | null>(null);
  const [competitorInput, setCompetitorInput] = useState("");

  // Pre-fill from profile
  useEffect(() => {
    if (profile) {
      setData((d) => ({
        ...d,
        full_name: d.full_name || profile.full_name || "",
        phone: d.phone || profile.phone || "",
      }));
    }
  }, [profile]);

  // Check if user already applied
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: existing } = await supabase
        .from("affiliates")
        .select("status")
        .eq("user_id", user.id)
        .maybeSingle();
      if (existing) setExistingStatus(existing.status);
    })();
  }, [user]);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key as string]: "" }));
  };

  const toggleArr = (key: "expertise_areas" | "promotion_channels", value: string) => {
    setData((d) => {
      const arr = d[key] as string[];
      const next = arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
      return { ...d, [key]: next };
    });
  };

  const validateStep = (s: number): boolean => {
    const fieldsByStep: Record<number, (keyof FormData)[]> = {
      0: ["full_name", "phone", "linkedin_url"],
      1: ["current_company", "current_position", "years_experience", "professional_bio", "expertise_areas"],
      2: ["customer_network_description", "expected_monthly_leads"],
      3: ["promotion_channels"],
      4: ["why_affiliate", "agree_terms"],
    };
    const fields = fieldsByStep[s];
    const partial = schema.safeParse(data);
    if (partial.success) return true;
    const stepErrors: Record<string, string> = {};
    for (const issue of partial.error.issues) {
      const field = issue.path[0] as string;
      if (fields.includes(field as keyof FormData)) {
        stepErrors[field] = issue.message;
      }
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const allErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        allErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(allErrors);
      toast.error("กรุณาตรวจสอบข้อมูลให้ครบถ้วน");
      return;
    }
    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    setSubmitting(true);
    try {
      // Generate code via DB function
      const { data: codeData, error: codeErr } = await supabase.rpc("generate_affiliate_code", {
        _full_name: parsed.data.full_name,
      } as never);
      if (codeErr) throw codeErr;

      // Insert affiliate
      const { data: aff, error: affErr } = await supabase
        .from("affiliates")
        .insert({
          user_id: user.id,
          email: user.email!,
          full_name: parsed.data.full_name,
          phone: parsed.data.phone,
          linkedin_url: parsed.data.linkedin_url,
          current_company: parsed.data.current_company || null,
          current_position: parsed.data.current_position || null,
          years_experience: parsed.data.years_experience,
          professional_bio: parsed.data.professional_bio,
          expertise_areas: parsed.data.expertise_areas,
          affiliate_code: codeData as string,
          status: "pending",
          tier: "bronze",
        })
        .select("id")
        .single();
      if (affErr) throw affErr;

      // Insert application
      const { error: appErr } = await supabase.from("affiliate_applications").insert({
        affiliate_id: aff.id,
        customer_network_description: parsed.data.customer_network_description,
        expected_monthly_leads: parsed.data.expected_monthly_leads,
        promotion_channels: parsed.data.promotion_channels,
        competitive_affiliations: parsed.data.competitive_affiliations,
        why_affiliate: parsed.data.why_affiliate,
      });
      if (appErr) throw appErr;

      setDone(true);
      toast.success("ส่งใบสมัครเรียบร้อย!");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  // Auth gate
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNavbar />
        <div className="container max-w-md mx-auto px-6 py-20">
          <Card>
            <CardContent className="pt-8 text-center">
              <Lock className="mx-auto text-primary mb-4" size={36} />
              <h1 className="text-2xl font-bold mb-2">{isEn ? "Sign in required" : "ต้องเข้าสู่ระบบก่อน"}</h1>
              <p className="text-muted-foreground mb-6">
                {isEn
                  ? "Create an account or sign in to apply for the Affiliate Program"
                  : "สร้างบัญชีหรือเข้าสู่ระบบก่อนสมัครเข้าร่วมโปรแกรม Affiliate"}
              </p>
              <div className="flex gap-2 justify-center">
                <Button asChild>
                  <Link to={`/login?redirect=/affiliate/apply`}>{isEn ? "Sign In" : "เข้าสู่ระบบ"}</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to={`/register?redirect=/affiliate/apply`}>{isEn ? "Register" : "สมัครสมาชิก"}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Already applied
  if (existingStatus) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNavbar />
        <div className="container max-w-md mx-auto px-6 py-20">
          <Card>
            <CardContent className="pt-8 text-center">
              <CheckCircle2 className="mx-auto text-primary mb-4" size={36} />
              <h1 className="text-2xl font-bold mb-2">
                {isEn ? "Application submitted" : "คุณได้ส่งใบสมัครแล้ว"}
              </h1>
              <p className="text-muted-foreground mb-2">
                {isEn ? "Status:" : "สถานะ:"} <span className="font-semibold text-foreground">{existingStatus}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                {isEn
                  ? "We'll review and reply within 3–5 business days."
                  : "ทีมงานจะตรวจสอบและตอบกลับภายใน 3–5 วันทำการ"}
              </p>
              <Button asChild>
                <Link to="/affiliate">{isEn ? "Back to Affiliate" : "กลับหน้าโปรแกรม"}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Success
  if (done) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNavbar />
        <div className="container max-w-md mx-auto px-6 py-20">
          <Card>
            <CardContent className="pt-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="text-primary" size={32} />
              </div>
              <h1 className="text-2xl font-bold mb-2">
                {isEn ? "Application received! 🎉" : "ส่งใบสมัครเรียบร้อย! 🎉"}
              </h1>
              <p className="text-muted-foreground mb-6">
                {isEn
                  ? "Our team will review your application and reply within 3–5 business days. Check your email for updates."
                  : "ทีมงานจะตรวจสอบและตอบกลับภายใน 3–5 วันทำการ โปรดตรวจสอบอีเมลของคุณ"}
              </p>
              <div className="flex gap-2 justify-center">
                <Button asChild>
                  <Link to="/affiliate">{isEn ? "Back to Program" : "กลับหน้าโปรแกรม"}</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/">{isEn ? "Home" : "หน้าหลัก"}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const stepLabels = isEn
    ? ["Profile", "Professional", "Network", "Promotion", "Review"]
    : ["โปรไฟล์", "อาชีพ", "เครือข่าย", "ช่องทาง", "ตรวจสอบ"];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={isEn ? "Apply — Affiliate Program" : "สมัครโปรแกรม Affiliate"}
        description={
          isEn
            ? "Apply to become an ENT Group Affiliate Partner."
            : "สมัครเข้าร่วมโปรแกรม Affiliate กับ ENT Group"
        }
        path="/affiliate/apply"
        noindex
      />
      <SiteNavbar />

      <div className="container max-w-3xl mx-auto px-6 py-10">
        <Link
          to="/affiliate"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft size={14} />
          {isEn ? "Back to program" : "กลับหน้าโปรแกรม"}
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {isEn ? "Affiliate Application" : "ใบสมัคร Affiliate"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isEn
              ? `Step ${step + 1} of ${STEPS.length}: ${stepLabels[step]}`
              : `ขั้นตอนที่ ${step + 1} จาก ${STEPS.length}: ${stepLabels[step]}`}
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div key={i} className="flex-1 flex items-center gap-2">
              <div
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            </div>
          ))}
        </div>

        <Card>
          <CardContent className="pt-6 space-y-5">
            {/* Step 0: Profile */}
            {step === 0 && (
              <>
                <h2 className="text-lg font-semibold">{isEn ? "Personal Profile" : "ข้อมูลส่วนตัว"}</h2>
                <Field label={isEn ? "Full name *" : "ชื่อ-สกุล *"} error={errors.full_name}>
                  <Input
                    value={data.full_name}
                    onChange={(e) => update("full_name", e.target.value)}
                    maxLength={100}
                  />
                </Field>
                <Field label={isEn ? "Phone *" : "เบอร์โทร *"} error={errors.phone}>
                  <Input
                    value={data.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="08x-xxx-xxxx"
                    maxLength={20}
                  />
                </Field>
                <Field
                  label="LinkedIn URL *"
                  hint={isEn ? "Required for verification" : "จำเป็นสำหรับยืนยันตัวตน"}
                  error={errors.linkedin_url}
                >
                  <Input
                    value={data.linkedin_url}
                    onChange={(e) => update("linkedin_url", e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    maxLength={255}
                  />
                </Field>
              </>
            )}

            {/* Step 1: Professional */}
            {step === 1 && (
              <>
                <h2 className="text-lg font-semibold">{isEn ? "Professional Background" : "ข้อมูลอาชีพ"}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label={isEn ? "Current company" : "บริษัทปัจจุบัน"} error={errors.current_company}>
                    <Input
                      value={data.current_company || ""}
                      onChange={(e) => update("current_company", e.target.value)}
                      maxLength={150}
                    />
                  </Field>
                  <Field label={isEn ? "Position" : "ตำแหน่ง"} error={errors.current_position}>
                    <Input
                      value={data.current_position || ""}
                      onChange={(e) => update("current_position", e.target.value)}
                      maxLength={150}
                    />
                  </Field>
                </div>
                <Field
                  label={isEn ? "Years of experience *" : "ประสบการณ์ (ปี) *"}
                  error={errors.years_experience}
                >
                  <Input
                    type="number"
                    min={0}
                    max={60}
                    value={data.years_experience}
                    onChange={(e) => update("years_experience", Number(e.target.value) as never)}
                  />
                </Field>
                <Field
                  label={isEn ? "Professional bio *" : "แนะนำตัว / ผลงาน *"}
                  hint={`${data.professional_bio.length}/1000`}
                  error={errors.professional_bio}
                >
                  <Textarea
                    rows={4}
                    value={data.professional_bio}
                    onChange={(e) => update("professional_bio", e.target.value)}
                    maxLength={1000}
                    placeholder={
                      isEn
                        ? "Tell us about your work, achievements, and clients you've helped..."
                        : "เล่าเกี่ยวกับงาน ความสำเร็จ และลูกค้าที่เคยช่วย..."
                    }
                  />
                </Field>
                <Field
                  label={isEn ? "Expertise areas * (max 5)" : "หมวดความเชี่ยวชาญ * (สูงสุด 5)"}
                  error={errors.expertise_areas}
                >
                  <div className="flex flex-wrap gap-2">
                    {EXPERTISE_AREAS.map((area) => {
                      const active = data.expertise_areas.includes(area);
                      return (
                        <button
                          key={area}
                          type="button"
                          onClick={() => toggleArr("expertise_areas", area)}
                          disabled={!active && data.expertise_areas.length >= 5}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            active
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                          }`}
                        >
                          {area}
                        </button>
                      );
                    })}
                  </div>
                </Field>
              </>
            )}

            {/* Step 2: Network */}
            {step === 2 && (
              <>
                <h2 className="text-lg font-semibold">{isEn ? "Customer Network" : "เครือข่ายลูกค้า"}</h2>
                <Field
                  label={isEn ? "Describe your customer network *" : "อธิบายเครือข่ายลูกค้าของคุณ *"}
                  hint={`${data.customer_network_description.length}/1000`}
                  error={errors.customer_network_description}
                >
                  <Textarea
                    rows={5}
                    value={data.customer_network_description}
                    onChange={(e) => update("customer_network_description", e.target.value)}
                    maxLength={1000}
                    placeholder={
                      isEn
                        ? "Industries, company sizes, regions, decision-maker access..."
                        : "อุตสาหกรรม ขนาดบริษัท พื้นที่ ระดับผู้ติดต่อ..."
                    }
                  />
                </Field>
                <Field
                  label={isEn ? "Expected qualified leads / month *" : "Lead ที่ผ่านเกณฑ์คาดการณ์ / เดือน *"}
                  error={errors.expected_monthly_leads}
                >
                  <Input
                    type="number"
                    min={1}
                    max={500}
                    value={data.expected_monthly_leads}
                    onChange={(e) => update("expected_monthly_leads", Number(e.target.value) as never)}
                  />
                </Field>
              </>
            )}

            {/* Step 3: Promotion */}
            {step === 3 && (
              <>
                <h2 className="text-lg font-semibold">{isEn ? "Promotion Channels" : "ช่องทางโปรโมต"}</h2>
                <Field
                  label={isEn ? "How will you promote? *" : "คุณจะโปรโมตผ่านช่องทางใด? *"}
                  error={errors.promotion_channels}
                >
                  <div className="grid md:grid-cols-2 gap-2">
                    {PROMOTION_CHANNELS.map((ch) => {
                      const active = data.promotion_channels.includes(ch);
                      return (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => toggleArr("promotion_channels", ch)}
                          className={`px-3 py-2 rounded-md text-sm border text-left transition-colors ${
                            active
                              ? "bg-primary/10 border-primary text-primary font-medium"
                              : "bg-background border-border hover:bg-muted"
                          }`}
                        >
                          {active && "✓ "}
                          {ch}
                        </button>
                      );
                    })}
                  </div>
                </Field>
                <Field
                  label={isEn ? "Competing affiliations (optional)" : "พันธมิตรกับแบรนด์คู่แข่ง (ไม่บังคับ)"}
                  hint={
                    isEn
                      ? "Brands you currently promote. Type and press Enter."
                      : "แบรนด์ที่โปรโมตอยู่ พิมพ์แล้วกด Enter"
                  }
                >
                  <Input
                    value={competitorInput}
                    onChange={(e) => setCompetitorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && competitorInput.trim()) {
                        e.preventDefault();
                        update("competitive_affiliations", [
                          ...data.competitive_affiliations,
                          competitorInput.trim(),
                        ]);
                        setCompetitorInput("");
                      }
                    }}
                    maxLength={100}
                  />
                  {data.competitive_affiliations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {data.competitive_affiliations.map((c, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-xs"
                        >
                          {c}
                          <button
                            type="button"
                            onClick={() =>
                              update(
                                "competitive_affiliations",
                                data.competitive_affiliations.filter((_, idx) => idx !== i),
                              )
                            }
                            className="text-muted-foreground hover:text-destructive"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </Field>
              </>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <>
                <h2 className="text-lg font-semibold">{isEn ? "Final Step" : "ขั้นตอนสุดท้าย"}</h2>
                <Field
                  label={isEn ? "Why do you want to be an Affiliate? *" : "ทำไมอยากเป็น Affiliate? *"}
                  hint={`${data.why_affiliate.length}/1000`}
                  error={errors.why_affiliate}
                >
                  <Textarea
                    rows={5}
                    value={data.why_affiliate}
                    onChange={(e) => update("why_affiliate", e.target.value)}
                    maxLength={1000}
                    placeholder={
                      isEn
                        ? "Your motivation and what you bring to the table..."
                        : "แรงจูงใจและสิ่งที่คุณนำเสนอได้..."
                    }
                  />
                </Field>

                <div className="rounded-lg border border-border p-4 bg-muted/30 space-y-2 text-sm">
                  <p className="font-semibold">{isEn ? "Summary" : "สรุปข้อมูล"}</p>
                  <Row label={isEn ? "Name" : "ชื่อ"} value={data.full_name} />
                  <Row label={isEn ? "Phone" : "เบอร์"} value={data.phone} />
                  <Row label="LinkedIn" value={data.linkedin_url} />
                  <Row
                    label={isEn ? "Experience" : "ประสบการณ์"}
                    value={`${data.years_experience} ${isEn ? "years" : "ปี"}`}
                  />
                  <Row label={isEn ? "Expertise" : "ความเชี่ยวชาญ"} value={data.expertise_areas.join(", ")} />
                  <Row
                    label={isEn ? "Channels" : "ช่องทาง"}
                    value={data.promotion_channels.join(", ")}
                  />
                  <Row
                    label={isEn ? "Expected leads/mo" : "Leads/เดือน"}
                    value={String(data.expected_monthly_leads)}
                  />
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <Checkbox
                    id="agree"
                    checked={data.agree_terms === true}
                    onCheckedChange={(v) => update("agree_terms", (v === true) as never)}
                  />
                  <Label htmlFor="agree" className="text-sm leading-relaxed cursor-pointer">
                    {isEn
                      ? "I agree to the Affiliate Program terms, commission structure (per-lead + per-sale), and data processing policy."
                      : "ฉันยอมรับเงื่อนไขโปรแกรม Affiliate โครงสร้างค่าตอบแทน (ต่อ Lead + ต่อยอดขาย) และนโยบายการใช้ข้อมูล"}
                  </Label>
                </div>
                {errors.agree_terms && (
                  <p className="text-sm text-destructive">{errors.agree_terms}</p>
                )}
              </>
            )}

            {/* Nav buttons */}
            <div className="flex justify-between pt-4 border-t border-border">
              <Button variant="outline" onClick={back} disabled={step === 0 || submitting}>
                <ArrowLeft size={16} /> {isEn ? "Back" : "ย้อนกลับ"}
              </Button>
              {step < STEPS.length - 1 ? (
                <Button onClick={next}>
                  {isEn ? "Next" : "ถัดไป"} <ArrowRight size={16} />
                </Button>
              ) : (
                <Button onClick={submit} disabled={submitting}>
                  {submitting && <Loader2 className="animate-spin" size={16} />}
                  {isEn ? "Submit Application" : "ส่งใบสมัคร"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

const Field = ({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <Label className="text-sm font-medium">{label}</Label>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
    {children}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-2">
    <span className="text-muted-foreground min-w-[110px]">{label}:</span>
    <span className="font-medium break-all">{value || "—"}</span>
  </div>
);

export default AffiliateApply;
