/**
 * Partner Application — 5-stage wizard
 * Auto-saves draft to partner_applications every 5s while editing.
 * Anonymous users get a session_token; logged-in users link via user_id.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight, Camera, CheckCircle2, Cloud, Loader2, Save, ScanLine, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/contexts/I18nContext";
import LangToggle from "@/components/LangToggle";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { pf, PRODUCT_CATEGORIES, CERTS, PARTNERSHIP_TYPES } from "@/lib/partner-i18n";
import { cn } from "@/lib/utils";

const SESSION_KEY = "partner_app_session";
const DRAFT_KEY = "partner_app_draft_id";
const FREE_EMAIL = /@(gmail|yahoo|hotmail|outlook|qq|163|126|sina|foxmail|live|aol)\./i;

interface FormState {
  // Stage 1
  company_name_local: string; company_name_en: string;
  business_license_no: string; legal_representative: string;
  registered_capital_cny: string; established_year: string;
  company_address: string; city: string; province: string; website: string;
  contact_name: string; contact_position: string; contact_email: string;
  contact_phone: string; contact_wechat: string; contact_whatsapp: string;
  // Stage 2
  product_categories: string[]; main_products: string;
  oem_capable: boolean; odm_capable: boolean;
  monthly_capacity: string; factory_size_sqm: string;
  staff_count: string; qa_staff_count: string; rd_staff_count: string;
  // Stage 3
  certifications: string[]; export_countries: string;
  major_clients: string; annual_export_value_usd: string;
  has_thailand_experience: boolean; thailand_experience_detail: string;
  // Stage 4
  exclusivity_preference: "exclusive" | "non_exclusive" | "negotiable" | "";
  min_order_quantity: string; payment_terms_preference: string;
  sample_policy: string; warranty_terms: string;
  expected_partnership_type: string[];
  // Stage 5
  why_partner_with_us: string; additional_notes: string; heard_about_us_from: string;
  agreed: boolean;
}

const empty: FormState = {
  company_name_local: "", company_name_en: "", business_license_no: "", legal_representative: "",
  registered_capital_cny: "", established_year: "", company_address: "", city: "", province: "", website: "",
  contact_name: "", contact_position: "", contact_email: "", contact_phone: "", contact_wechat: "", contact_whatsapp: "",
  product_categories: [], main_products: "", oem_capable: false, odm_capable: false,
  monthly_capacity: "", factory_size_sqm: "", staff_count: "", qa_staff_count: "", rd_staff_count: "",
  certifications: [], export_countries: "", major_clients: "", annual_export_value_usd: "",
  has_thailand_experience: false, thailand_experience_detail: "",
  exclusivity_preference: "", min_order_quantity: "", payment_terms_preference: "",
  sample_policy: "", warranty_terms: "", expected_partnership_type: [],
  why_partner_with_us: "", additional_notes: "", heard_about_us_from: "",
  agreed: false,
};

interface UploadedFile { id: string; file_category: string; file_name: string; file_path: string; }

export default function PartnerApply() {
  const { lang } = useI18n();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const L = (k: any) => pf(k, lang);

  const [stage, setStage] = useState(1);
  const [data, setData] = useState<FormState>(empty);
  const [capitalCurrency, setCapitalCurrency] = useState<"CNY" | "USD" | "THB">("CNY");
  const [appId, setAppId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploadingCat, setUploadingCat] = useState<string | null>(null);
  const dirtyRef = useRef(false);

  // Session token for anonymous users
  const sessionToken = useMemo(() => {
    let t = localStorage.getItem(SESSION_KEY);
    if (!t) { t = crypto.randomUUID(); localStorage.setItem(SESSION_KEY, t); }
    return t;
  }, []);

  // Load existing draft
  useEffect(() => {
    (async () => {
      const existingId = localStorage.getItem(DRAFT_KEY);
      if (!existingId) return;
      const { data: row } = await supabase
        .from("partner_applications")
        .select("*")
        .eq("id", existingId)
        .maybeSingle();
      if (row && row.status === "draft") {
        setAppId(row.id);
        setData((d) => ({
          ...d,
          ...Object.fromEntries(
            Object.entries(row).filter(([k]) => k in empty).map(([k, v]) => [k, v ?? (Array.isArray((empty as any)[k]) ? [] : typeof (empty as any)[k] === "boolean" ? false : "")])
          ) as any,
        }));
        const { data: fileRows } = await supabase
          .from("partner_application_files").select("*").eq("application_id", row.id);
        if (fileRows) setFiles(fileRows as any);
      }
    })();
  }, []);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    dirtyRef.current = true;
  };

  // Auto-save every 5s when dirty
  useEffect(() => {
    const t = setInterval(() => { if (dirtyRef.current) saveDraft(); }, 5000);
    return () => clearInterval(t);
  });

  const saveDraft = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const payload: any = {
        ...data,
        registered_capital_cny: data.registered_capital_cny ? Number(data.registered_capital_cny) : null,
        established_year: data.established_year ? Number(data.established_year) : null,
        factory_size_sqm: data.factory_size_sqm ? Number(data.factory_size_sqm) : null,
        staff_count: data.staff_count ? Number(data.staff_count) : null,
        qa_staff_count: data.qa_staff_count ? Number(data.qa_staff_count) : null,
        rd_staff_count: data.rd_staff_count ? Number(data.rd_staff_count) : null,
        annual_export_value_usd: data.annual_export_value_usd ? Number(data.annual_export_value_usd) : null,
        exclusivity_preference: data.exclusivity_preference || null,
        language: lang,
        current_stage: stage,
        last_saved_at: new Date().toISOString(),
      };
      delete payload.agreed;

      if (appId) {
        await supabase.from("partner_applications").update(payload).eq("id", appId);
      } else {
        const insertPayload = {
          ...payload,
          user_id: user?.id ?? null,
          session_token: user?.id ? null : sessionToken,
          status: "draft",
        };
        const { data: row, error } = await supabase
          .from("partner_applications").insert(insertPayload).select().single();
        if (error) throw error;
        setAppId(row.id);
        localStorage.setItem(DRAFT_KEY, row.id);
      }
      dirtyRef.current = false;
      setLastSaved(new Date());
    } catch (e: any) {
      console.error("draft save", e);
    } finally { setSaving(false); }
  };

  const ensureAppId = async (): Promise<string | null> => {
    if (appId) return appId;
    await saveDraft();
    return appId;
  };

  // ── File upload ──────────────────────────────────────
  const uploadFile = async (category: string, file: File) => {
    const id = await ensureAppId();
    if (!id) {
      toast({ title: "บันทึกร่างก่อนอัปโหลดไฟล์", variant: "destructive" });
      return;
    }
    setUploadingCat(category);
    try {
      const path = `${id}/${category}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage
        .from("partner-applications").upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      const { data: row, error } = await supabase
        .from("partner_application_files")
        .insert({
          application_id: id, file_category: category,
          file_name: file.name, file_path: path,
          file_size: file.size, mime_type: file.type,
          uploaded_by: user?.id ?? null,
        })
        .select().single();
      if (error) throw error;
      setFiles((f) => [...f, row as any]);
      toast({ title: "อัปโหลดสำเร็จ" });
    } catch (e: any) {
      toast({ title: "อัปโหลดไม่สำเร็จ", description: e.message, variant: "destructive" });
    } finally { setUploadingCat(null); }
  };

  const removeFile = async (f: UploadedFile) => {
    await supabase.storage.from("partner-applications").remove([f.file_path]);
    await supabase.from("partner_application_files").delete().eq("id", f.id);
    setFiles((arr) => arr.filter((x) => x.id !== f.id));
  };

  // ── Validation ────────────────────────────────────────
  const validateStage = (s: number): string | null => {
    if (s === 1) {
      if (!data.company_name_local && !data.company_name_en) return L("errCompanyName");
      if (!data.business_license_no) return L("errLicense");
      if (!data.contact_email || !/^[^@]+@[^@]+\.[^@]+$/.test(data.contact_email) || FREE_EMAIL.test(data.contact_email)) return L("errEmail");
    }
    if (s === 5 && !data.agreed) return L("errAgree");
    return null;
  };

  const goNext = async () => {
    const err = validateStage(stage);
    if (err) { toast({ title: err, variant: "destructive" }); return; }
    await saveDraft();
    setStage((s) => Math.min(5, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    const err = validateStage(5);
    if (err) { toast({ title: err, variant: "destructive" }); return; }
    setSubmitting(true);
    try {
      const id = await ensureAppId();
      if (!id) throw new Error("Failed to save");
      const { error } = await supabase
        .from("partner_applications")
        .update({ status: "submitted", current_stage: 5 })
        .eq("id", id);
      if (error) throw error;
      localStorage.removeItem(DRAFT_KEY);
      setDone(true);
    } catch (e: any) {
      toast({ title: "ส่งไม่สำเร็จ", description: e.message, variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  // ── Done screen ──────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-lg text-center">
          <CardContent className="p-10 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
            <h1 className="text-2xl font-bold">{L("submitted")}</h1>
            <p className="text-muted-foreground">{L("submittedDesc")}</p>
            <Button onClick={() => navigate("/partner")} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />{lang === "zh" ? "返回" : lang === "th" ? "กลับ" : "Back"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────
  const stageNames = [L("step1"), L("step2"), L("step3"), L("step4"), L("step5")];

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>{L("applyTitle")} — ENT Group</title></Helmet>

      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/partner" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> ENT Group · Partner Program
          </Link>
          <div className="flex items-center gap-3">
            {saving ? (
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />{lang === "zh" ? "保存中" : "Saving"}</span>
            ) : lastSaved ? (
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Cloud className="w-3 h-3" />{L("draftSaved")}</span>
            ) : null}
            <LangToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{L("applyTitle")}</h1>
          <p className="text-muted-foreground">{L("applySubtitle")}</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={(stage / 5) * 100} className="h-2" />
          <div className="flex justify-between mt-3 text-xs">
            {stageNames.map((n, i) => (
              <div key={i} className={cn("flex-1 text-center", i + 1 === stage ? "text-primary font-semibold" : "text-muted-foreground")}>
                {i + 1}. {n}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-6 space-y-5">
            {stage === 1 && <Stage1 data={data} update={update} L={L} />}
            {stage === 2 && <Stage2 data={data} update={update} L={L} lang={lang} />}
            {stage === 3 && <Stage3 data={data} update={update} L={L} lang={lang} />}
            {stage === 4 && <Stage4 data={data} update={update} L={L} lang={lang} />}
            {stage === 5 && (
              <Stage5
                data={data} update={update} L={L} files={files}
                onUpload={uploadFile} onRemove={removeFile} uploadingCat={uploadingCat}
              />
            )}
          </CardContent>
        </Card>

        {/* Nav buttons */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => setStage((s) => Math.max(1, s - 1))} disabled={stage === 1}>
            <ArrowLeft className="w-4 h-4 mr-2" />{L("prev")}
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={saveDraft} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />{L("saveDraft")}
            </Button>
            {stage < 5 ? (
              <Button onClick={goNext}>{L("next")}<ArrowRight className="w-4 h-4 ml-2" /></Button>
            ) : (
              <Button onClick={submit} disabled={submitting || !data.agreed}>
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                {L("submit")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Stage Components
// ────────────────────────────────────────────────────────

const Field = ({ label, required, children }: any) => (
  <div className="space-y-1.5">
    <Label className="text-sm">{label}{required && <span className="text-destructive ml-1">*</span>}</Label>
    {children}
  </div>
);

function Stage1({ data, update, L, capitalCurrency, setCapitalCurrency }: any) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);
  const [cardPreview, setCardPreview] = useState<string | null>(null);

  const handleCardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setCardPreview(base64);
      setScanning(true);
      try {
        const { data: res, error } = await supabase.functions.invoke("scan-business-card", { body: { image: base64 } });
        if (error) throw error;
        const ex = (res as any)?.data || {};
        // Map to form fields
        if (ex.name) update("contact_name", ex.name);
        if (ex.email) update("contact_email", ex.email);
        if (ex.phone) update("contact_phone", ex.phone);
        if (ex.company) update("company_name_en", ex.company);
        if (ex.position) update("contact_position", ex.position);
        if (ex.whatsapp) update("contact_whatsapp", ex.whatsapp);
        if (ex.website) update("website", ex.website);
        if (ex.address) update("company_address", ex.address);
        toast({ title: "✅ สแกนนามบัตรสำเร็จ", description: "ระบบกรอกข้อมูลให้แล้ว — โปรดตรวจสอบความถูกต้อง" });
      } catch (err: any) {
        toast({ title: "สแกนไม่สำเร็จ", description: err.message || "กรุณากรอกข้อมูลด้วยตนเอง", variant: "destructive" });
      } finally {
        setScanning(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <h2 className="text-xl font-semibold">{L("step1")}</h2>

      {/* Business Card Scanner */}
      <div className="p-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleCardUpload}
        />
        {!cardPreview ? (
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-primary">
              <ScanLine className="w-4 h-4" />
              📇 สแกนนามบัตร — กรอกฟอร์มผู้ติดต่ออัตโนมัติ
            </div>
            <p className="text-xs text-muted-foreground">
              ถ่ายรูปหรืออัปโหลดนามบัตร AI จะดึง ชื่อ / อีเมล / โทร / บริษัท ให้ทันที
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={scanning}
            >
              <Camera className="w-4 h-4 mr-2" />
              เลือกรูปนามบัตร
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative rounded-lg overflow-hidden border border-border">
              <img src={cardPreview} alt="นามบัตร" className="w-full h-auto max-h-40 object-contain bg-white" />
              {scanning && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    กำลังอ่านนามบัตร...
                  </div>
                </div>
              )}
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => setCardPreview(null)} disabled={scanning}>
              <X className="w-3.5 h-3.5 mr-1" />
              ลบ / อัปโหลดใหม่
            </Button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label={L("companyNameLocal")} required>
          <Input value={data.company_name_local} onChange={(e) => update("company_name_local", e.target.value)} />
        </Field>
        <Field label={L("companyNameEn")}>
          <Input value={data.company_name_en} onChange={(e) => update("company_name_en", e.target.value)} />
        </Field>
        <Field label={L("businessLicense")} required>
          <Input value={data.business_license_no} onChange={(e) => update("business_license_no", e.target.value)} />
        </Field>
        <Field label={L("legalRep")}>
          <Input value={data.legal_representative} onChange={(e) => update("legal_representative", e.target.value)} />
        </Field>
        <Field label={`${L("capital")} (${capitalCurrency})`}>
          <div className="flex gap-2">
            <Input
              type="number"
              className="flex-1"
              value={data.registered_capital_cny}
              onChange={(e) => update("registered_capital_cny", e.target.value)}
            />
            <select
              value={capitalCurrency}
              onChange={(e) => setCapitalCurrency(e.target.value as any)}
              className="h-10 rounded-md border border-input bg-background px-2 text-sm"
            >
              <option value="CNY">CNY ¥</option>
              <option value="USD">USD $</option>
              <option value="THB">THB ฿</option>
            </select>
          </div>
          {capitalCurrency !== "CNY" && data.registered_capital_cny && (
            <p className="text-[11px] text-muted-foreground mt-1">
              ≈ ¥{Math.round(Number(data.registered_capital_cny) * (capitalCurrency === "USD" ? 7.2 : 0.2)).toLocaleString()} CNY
            </p>
          )}
        </Field>
        <Field label={L("established")}>
          <Input type="number" value={data.established_year} onChange={(e) => update("established_year", e.target.value)} />
        </Field>
        <Field label={L("city")}>
          <Input value={data.city} onChange={(e) => update("city", e.target.value)} />
        </Field>
        <Field label={L("province")}>
          <Input value={data.province} onChange={(e) => update("province", e.target.value)} />
        </Field>
        <div className="md:col-span-2">
          <Field label={L("address")}>
            <Input value={data.company_address} onChange={(e) => update("company_address", e.target.value)} />
          </Field>
        </div>
        <Field label={L("website")}>
          <Input type="url" placeholder="https://" value={data.website} onChange={(e) => update("website", e.target.value)} />
        </Field>
        <Field label={L("contactName")} required>
          <Input value={data.contact_name} onChange={(e) => update("contact_name", e.target.value)} />
        </Field>
        <Field label={L("contactPosition")}>
          <Input value={data.contact_position} onChange={(e) => update("contact_position", e.target.value)} />
        </Field>
        <Field label={L("contactPhone")}>
          <Input value={data.contact_phone} onChange={(e) => update("contact_phone", e.target.value)} />
        </Field>
        <div className="md:col-span-2">
          <Field label={L("contactEmail")} required>
            <Input type="email" value={data.contact_email} onChange={(e) => update("contact_email", e.target.value)} />
            <p className="text-xs text-muted-foreground mt-1">{L("emailWarning")}</p>
          </Field>
        </div>
        <Field label={L("contactWechat")}>
          <Input value={data.contact_wechat} onChange={(e) => update("contact_wechat", e.target.value)} />
        </Field>
        <Field label={L("contactWhatsapp")}>
          <Input value={data.contact_whatsapp} onChange={(e) => update("contact_whatsapp", e.target.value)} />
        </Field>
      </div>
    </>
  );
}

function Stage2({ data, update, L, lang }: any) {
  const toggleCat = (id: string) => {
    const arr = data.product_categories.includes(id)
      ? data.product_categories.filter((x: string) => x !== id)
      : [...data.product_categories, id];
    update("product_categories", arr);
  };
  return (
    <>
      <h2 className="text-xl font-semibold">{L("step2")}</h2>
      <Field label={L("productCats")} required>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {PRODUCT_CATEGORIES.map((c) => (
            <label key={c.id} className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer text-sm",
              data.product_categories.includes(c.id) ? "border-primary bg-primary/5" : "border-border"
            )}>
              <Checkbox checked={data.product_categories.includes(c.id)} onCheckedChange={() => toggleCat(c.id)} />
              <span>{(c as any)[lang]}</span>
            </label>
          ))}
        </div>
      </Field>
      <Field label={L("mainProducts")}>
        <Textarea rows={3} value={data.main_products} onChange={(e) => update("main_products", e.target.value)} />
      </Field>
      <div className="grid md:grid-cols-2 gap-4">
        <label className="flex items-center gap-2 p-3 border rounded-md cursor-pointer">
          <Checkbox checked={data.oem_capable} onCheckedChange={(v) => update("oem_capable", !!v)} />
          <span>{L("oem")}</span>
        </label>
        <label className="flex items-center gap-2 p-3 border rounded-md cursor-pointer">
          <Checkbox checked={data.odm_capable} onCheckedChange={(v) => update("odm_capable", !!v)} />
          <span>{L("odm")}</span>
        </label>
        <Field label={L("monthlyCapacity")}>
          <Input value={data.monthly_capacity} onChange={(e) => update("monthly_capacity", e.target.value)} />
        </Field>
        <Field label={L("factorySize")}>
          <Input type="number" value={data.factory_size_sqm} onChange={(e) => update("factory_size_sqm", e.target.value)} />
        </Field>
        <Field label={L("staffCount")}>
          <Input type="number" value={data.staff_count} onChange={(e) => update("staff_count", e.target.value)} />
        </Field>
        <Field label={L("qaStaff")}>
          <Input type="number" value={data.qa_staff_count} onChange={(e) => update("qa_staff_count", e.target.value)} />
        </Field>
        <Field label={L("rdStaff")}>
          <Input type="number" value={data.rd_staff_count} onChange={(e) => update("rd_staff_count", e.target.value)} />
        </Field>
      </div>
    </>
  );
}

function Stage3({ data, update, L }: any) {
  const toggleCert = (c: string) => {
    const arr = data.certifications.includes(c)
      ? data.certifications.filter((x: string) => x !== c)
      : [...data.certifications, c];
    update("certifications", arr);
  };
  return (
    <>
      <h2 className="text-xl font-semibold">{L("step3")}</h2>
      <Field label={L("certs")}>
        <div className="flex flex-wrap gap-2">
          {CERTS.map((c) => (
            <label key={c} className={cn(
              "px-3 py-1.5 rounded-full border text-sm cursor-pointer",
              data.certifications.includes(c) ? "border-primary bg-primary/10 text-primary" : "border-border"
            )}>
              <Checkbox className="hidden" checked={data.certifications.includes(c)} onCheckedChange={() => toggleCert(c)} />
              <span onClick={() => toggleCert(c)}>{c}</span>
            </label>
          ))}
        </div>
      </Field>
      <Field label={L("exportCountries")}>
        <Input placeholder="USA, Germany, Japan…" value={data.export_countries} onChange={(e) => update("export_countries", e.target.value)} />
      </Field>
      <Field label={L("majorClients")}>
        <Textarea rows={2} value={data.major_clients} onChange={(e) => update("major_clients", e.target.value)} />
      </Field>
      <Field label={L("exportValue")}>
        <Input type="number" value={data.annual_export_value_usd} onChange={(e) => update("annual_export_value_usd", e.target.value)} />
      </Field>
      <label className="flex items-center gap-2 p-3 border rounded-md cursor-pointer">
        <Checkbox checked={data.has_thailand_experience} onCheckedChange={(v) => update("has_thailand_experience", !!v)} />
        <span>{L("thailandExp")}</span>
      </label>
      {data.has_thailand_experience && (
        <Field label={L("thailandExpDetail")}>
          <Textarea rows={3} value={data.thailand_experience_detail} onChange={(e) => update("thailand_experience_detail", e.target.value)} />
        </Field>
      )}
    </>
  );
}

function Stage4({ data, update, L, lang }: any) {
  const togglePT = (id: string) => {
    const arr = data.expected_partnership_type.includes(id)
      ? data.expected_partnership_type.filter((x: string) => x !== id)
      : [...data.expected_partnership_type, id];
    update("expected_partnership_type", arr);
  };
  return (
    <>
      <h2 className="text-xl font-semibold">{L("step4")}</h2>
      <Field label={L("exclusivity")}>
        <RadioGroup value={data.exclusivity_preference} onValueChange={(v) => update("exclusivity_preference", v)}>
          <label className="flex items-center gap-2 p-2"><RadioGroupItem value="exclusive" /> {L("exclYes")}</label>
          <label className="flex items-center gap-2 p-2"><RadioGroupItem value="non_exclusive" /> {L("exclNo")}</label>
          <label className="flex items-center gap-2 p-2"><RadioGroupItem value="negotiable" /> {L("exclNeg")}</label>
        </RadioGroup>
      </Field>
      <Field label={L("partnershipType")}>
        <div className="flex flex-wrap gap-2">
          {PARTNERSHIP_TYPES.map((p) => (
            <label key={p.id} className={cn(
              "px-3 py-1.5 rounded-full border text-sm cursor-pointer",
              data.expected_partnership_type.includes(p.id) ? "border-primary bg-primary/10 text-primary" : "border-border"
            )} onClick={() => togglePT(p.id)}>
              {(p as any)[lang]}
            </label>
          ))}
        </div>
      </Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label={L("moq")}>
          <Input value={data.min_order_quantity} onChange={(e) => update("min_order_quantity", e.target.value)} />
        </Field>
        <Field label={L("paymentTerms")}>
          <Input placeholder="T/T 30/70, L/C…" value={data.payment_terms_preference} onChange={(e) => update("payment_terms_preference", e.target.value)} />
        </Field>
      </div>
      <Field label={L("samplePolicy")}>
        <Textarea rows={2} value={data.sample_policy} onChange={(e) => update("sample_policy", e.target.value)} />
      </Field>
      <Field label={L("warranty")}>
        <Textarea rows={2} value={data.warranty_terms} onChange={(e) => update("warranty_terms", e.target.value)} />
      </Field>
    </>
  );
}

function Stage5({ data, update, L, files, onUpload, onRemove, uploadingCat }: any) {
  const FILE_CATS = [
    { id: "business_license", label: L("uploadLicense"), accept: ".pdf,.jpg,.jpeg,.png" },
    { id: "factory_photo",    label: L("uploadFactory"), accept: "image/*", multiple: true },
    { id: "factory_video",    label: L("uploadVideo"),   accept: "video/mp4,video/quicktime,video/webm" },
    { id: "certification",    label: L("uploadCert"),    accept: ".pdf,.jpg,.jpeg,.png", multiple: true },
    { id: "product_catalog",  label: L("uploadCatalog"), accept: ".pdf" },
  ];
  return (
    <>
      <h2 className="text-xl font-semibold">{L("step5")}</h2>

      {/* Files */}
      <div>
        <h3 className="font-medium mb-3">{L("uploadTitle")}</h3>
        <div className="space-y-3">
          {FILE_CATS.map((cat) => {
            const catFiles = files.filter((f: UploadedFile) => f.file_category === cat.id);
            const uploading = uploadingCat === cat.id;
            return (
              <div key={cat.id} className="border rounded-md p-3">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm">{cat.label}</Label>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept={cat.accept}
                      multiple={cat.multiple}
                      disabled={uploading}
                      onChange={(e) => {
                        const fs = Array.from(e.target.files || []);
                        fs.forEach((f) => onUpload(cat.id, f));
                        e.target.value = "";
                      }}
                    />
                    <span className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                      {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                      {L("uploadHint")}
                    </span>
                  </label>
                </div>
                {catFiles.length > 0 && (
                  <ul className="space-y-1">
                    {catFiles.map((f: UploadedFile) => (
                      <li key={f.id} className="flex items-center justify-between text-xs bg-muted/40 px-2 py-1 rounded">
                        <span className="truncate">{f.file_name}</span>
                        <button onClick={() => onRemove(f)} className="text-muted-foreground hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Field label={L("why")}>
        <Textarea rows={3} value={data.why_partner_with_us} onChange={(e) => update("why_partner_with_us", e.target.value)} />
      </Field>
      <Field label={L("notes")}>
        <Textarea rows={2} value={data.additional_notes} onChange={(e) => update("additional_notes", e.target.value)} />
      </Field>
      <Field label={L("heardFrom")}>
        <Input value={data.heard_about_us_from} onChange={(e) => update("heard_about_us_from", e.target.value)} />
      </Field>

      <label className="flex items-start gap-2 p-3 border rounded-md cursor-pointer bg-muted/30">
        <Checkbox checked={data.agreed} onCheckedChange={(v) => update("agreed", !!v)} className="mt-0.5" />
        <span className="text-sm">{L("agreement")}</span>
      </label>
    </>
  );
}
