/**
 * Partner Application — 5-stage wizard
 * Auto-saves draft to partner_applications every 5s while editing.
 * Anonymous users get a session_token; logged-in users link via user_id.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight, Camera, CheckCircle2, Cloud, Eye, EyeOff, KeyRound, Loader2, Mail, Save, ScanLine, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/contexts/I18nContext";
import LangToggle from "@/components/LangToggle";
import ThemeToggle from "@/components/ThemeToggle";
import FooterCompact from "@/components/FooterCompact";
import logo from "@/assets/logo-entgroup.avif";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { pf, PRODUCT_CATEGORIES, CERTS, PARTNERSHIP_TYPES, CN_PROVINCES, CONTACT_POSITIONS, HEARD_FROM_OPTIONS } from "@/lib/partner-i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { sanitizeFilename } from "@/lib/sanitize-filename";

const SESSION_KEY = "partner_app_session";
const DRAFT_KEY = "partner_app_draft_id";
const FREE_EMAIL = /@(qq|163|126|sina|foxmail)\./i;

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
  why_partner_with_us: string; additional_notes: string;
  heard_about_us_from: string; heard_about_us_other: string;
  factory_video_url: string;
  catalog_scope: "all" | "selected" | "";
  catalog_selected_categories: string[];
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
  why_partner_with_us: "", additional_notes: "",
  heard_about_us_from: "", heard_about_us_other: "",
  factory_video_url: "",
  catalog_scope: "", catalog_selected_categories: [],
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

  // Account creation dialog (for guests at submit time)
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [accountPassword, setAccountPassword] = useState("");
  const [accountPassword2, setAccountPassword2] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [emailConfirmRequired, setEmailConfirmRequired] = useState(false);

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
            Object.entries(row).filter(([k]) => k in empty).map(([k, v]) => {
              const def = (empty as any)[k];
              // DB array → form string for export_countries
              if (k === "export_countries") {
                return [k, Array.isArray(v) ? v.join(", ") : (v ?? "")];
              }
              return [k, v ?? (Array.isArray(def) ? [] : typeof def === "boolean" ? false : "")];
            })
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

  const saveDraft = async (): Promise<string | null> => {
    if (saving) return appId;
    setSaving(true);
    try {
      // Convert comma-separated export_countries (string in form) → text[] (DB)
      const exportCountriesArr = (data.export_countries || "")
        .split(/[,;\n]+/).map((s: string) => s.trim()).filter(Boolean);

      const payload: any = {
        ...data,
        registered_capital_cny: data.registered_capital_cny ? Math.round(Number(data.registered_capital_cny) * (capitalCurrency === "USD" ? 7.2 : capitalCurrency === "THB" ? 0.2 : 1)) : null,
        established_year: data.established_year ? Number(data.established_year) : null,
        factory_size_sqm: data.factory_size_sqm ? Number(data.factory_size_sqm) : null,
        staff_count: data.staff_count ? Number(data.staff_count) : null,
        qa_staff_count: data.qa_staff_count ? Number(data.qa_staff_count) : null,
        rd_staff_count: data.rd_staff_count ? Number(data.rd_staff_count) : null,
        annual_export_value_usd: data.annual_export_value_usd ? Number(data.annual_export_value_usd) : null,
        exclusivity_preference: data.exclusivity_preference || null,
        export_countries: exportCountriesArr.length ? exportCountriesArr : null,
        language: lang,
        current_stage: stage,
        last_saved_at: new Date().toISOString(),
      };
      delete payload.agreed;
      // Compose heard_about_us_from from selection + other text
      if (data.heard_about_us_from) {
        const opt = HEARD_FROM_OPTIONS.find((o) => o.id === data.heard_about_us_from);
        const base = opt ? opt.en : data.heard_about_us_from;
        payload.heard_about_us_from = data.heard_about_us_from === "other"
          ? `Other: ${data.heard_about_us_other || ""}`.trim()
          : data.heard_about_us_other ? `${base} — ${data.heard_about_us_other}` : base;
      }
      // Merge video URL + catalog scope into additional_notes (no schema change needed)
      const extras: string[] = [];
      if (data.factory_video_url) extras.push(`[Video] ${data.factory_video_url}`);
      if (data.catalog_scope === "all") extras.push(`[Catalog] Overall (all categories)`);
      if (data.catalog_scope === "selected" && data.catalog_selected_categories.length) {
        extras.push(`[Catalog] ${data.catalog_selected_categories.join(", ")}`);
      }
      if (extras.length) {
        payload.additional_notes = [data.additional_notes, ...extras].filter(Boolean).join("\n");
      }
      // Strip client-only fields from DB payload
      delete payload.heard_about_us_other;
      delete payload.factory_video_url;
      delete payload.catalog_scope;
      delete payload.catalog_selected_categories;

      if (appId) {
        await supabase.from("partner_applications").update(payload).eq("id", appId);
        dirtyRef.current = false;
        setLastSaved(new Date());
        return appId;
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
        dirtyRef.current = false;
        setLastSaved(new Date());
        return row.id;
      }
    } catch (e: any) {
      console.error("draft save", e);
      return null;
    } finally { setSaving(false); }
  };

  const ensureAppId = async (): Promise<string | null> => {
    if (appId) return appId;
    return await saveDraft();
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
      const path = `${id}/${category}/${Date.now()}-${sanitizeFilename(file.name)}`;
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
          session_token: user?.id ? null : sessionToken,
        } as any)
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

  // Finalize: mark submitted + send confirmation email. Used by both flows.
  const finalizeSubmission = async (id: string) => {
    const { error } = await supabase
      .from("partner_applications")
      .update({ status: "submitted", current_stage: 5, submitted_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;

    if (data.contact_email) {
      const { data: row } = await supabase
        .from("partner_applications")
        .select("application_number")
        .eq("id", id)
        .maybeSingle();
      supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "partner-application-received",
          recipientEmail: data.contact_email,
          idempotencyKey: `partner-app-${id}`,
          templateData: {
            name: data.contact_name,
            companyName: data.company_name_en || data.company_name_local,
            applicationNumber: row?.application_number ?? null,
            lang,
          },
        },
      }).catch((e) => console.warn("[partner] email send failed", e));
    }

    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(SESSION_KEY);
    setDone(true);
  };

  const submit = async () => {
    const err = validateStage(5);
    if (err) { toast({ title: err, variant: "destructive" }); return; }

    // Logged-in user → submit directly
    if (user) {
      setSubmitting(true);
      try {
        const id = await ensureAppId();
        if (!id) throw new Error("Failed to save");
        await finalizeSubmission(id);
      } catch (e: any) {
        toast({ title: "ส่งไม่สำเร็จ", description: e.message, variant: "destructive" });
      } finally { setSubmitting(false); }
      return;
    }

    // Guest → make sure draft is saved, then prompt for password
    setSubmitting(true);
    try {
      const id = await ensureAppId();
      if (!id) throw new Error("Failed to save");
      setAccountDialogOpen(true);
    } catch (e: any) {
      toast({ title: "บันทึกไม่สำเร็จ", description: e.message, variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  // Guest creates account → claim application → finalize
  const createAccountAndSubmit = async () => {
    if (accountPassword.length < 8) {
      toast({ title: lang === "en" ? "Password must be at least 8 characters" : lang === "zh" ? "密码至少8位" : "รหัสผ่านอย่างน้อย 8 ตัวอักษร", variant: "destructive" });
      return;
    }
    if (accountPassword !== accountPassword2) {
      toast({ title: lang === "en" ? "Passwords don't match" : lang === "zh" ? "密码不一致" : "รหัสผ่านไม่ตรงกัน", variant: "destructive" });
      return;
    }
    if (!appId) {
      toast({ title: "Application not saved", variant: "destructive" });
      return;
    }
    setCreatingAccount(true);
    try {
      // 1. Create account (Supabase sends confirmation email automatically if enabled)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.contact_email,
        password: accountPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/partner/portal`,
          data: { full_name: data.contact_name, source: "partner_application" },
        },
      });
      if (signUpError) {
        // If account already exists, ask them to sign in
        if (/already registered|already exists/i.test(signUpError.message)) {
          toast({
            title: lang === "en" ? "Email already registered" : lang === "zh" ? "邮箱已注册" : "อีเมลนี้สมัครสมาชิกแล้ว",
            description: lang === "en" ? "Please sign in to submit." : lang === "zh" ? "请登录后提交。" : "กรุณา login ก่อนส่งใบสมัคร",
            variant: "destructive",
          });
          navigate(`/login?redirect=${encodeURIComponent("/partner/apply")}`);
          return;
        }
        throw signUpError;
      }

      const newUserId = signUpData.user?.id;
      const hasSession = !!signUpData.session;

      // 2. If we have a session (email confirm disabled), claim the application now.
      // Otherwise the application stays linked by session_token + contact_email — admin can match later,
      // and the user can re-claim it after confirming email by visiting /partner/portal.
      if (hasSession && newUserId) {
        await supabase
          .from("partner_applications")
          .update({ user_id: newUserId })
          .eq("id", appId)
          .is("user_id", null);
      }

      // 3. Finalize submission (mark submitted + send thank-you email)
      await finalizeSubmission(appId);

      // 4. If email confirmation is required, show a different done state
      if (!hasSession) setEmailConfirmRequired(true);

      setAccountDialogOpen(false);
    } catch (e: any) {
      toast({ title: "ส่งไม่สำเร็จ", description: e.message, variant: "destructive" });
    } finally { setCreatingAccount(false); }
  };

  // ── Done screen ──────────────────────────────────────
  if (done) {
    const portalCta = lang === "zh" ? "进入合作伙伴门户" : lang === "en" ? "Open Partner Portal" : "เข้าสู่ Partner Portal";
    const emailNote = emailConfirmRequired
      ? (lang === "zh"
          ? "请检查您的邮箱并点击确认链接以激活账户。激活后即可登录合作伙伴门户。"
          : lang === "en"
          ? "Please check your inbox and click the confirmation link to activate your account. Once activated, you can sign in to the Partner Portal."
          : "โปรดเช็คอีเมลของคุณและคลิกลิงก์ยืนยันเพื่อเปิดใช้งานบัญชี เมื่อเปิดใช้งานแล้วจะเข้า Partner Portal ได้")
      : (lang === "zh"
          ? "我们已向您的邮箱发送确认邮件"
          : lang === "en"
          ? "A confirmation email has been sent to your inbox"
          : "เราได้ส่งอีเมลยืนยันไปยังกล่องจดหมายของคุณแล้ว");
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-lg text-center">
          <CardContent className="p-10 space-y-4">
            {emailConfirmRequired ? (
              <Mail className="w-16 h-16 text-primary mx-auto" />
            ) : (
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
            )}
            <h1 className="text-2xl font-bold">{L("submitted")}</h1>
            <p className="text-muted-foreground">{L("submittedDesc")}</p>
            <p className="text-sm text-muted-foreground italic">{emailNote}</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              {emailConfirmRequired ? (
                <Button onClick={() => navigate(`/login?redirect=${encodeURIComponent("/partner/portal")}`)}>
                  {lang === "zh" ? "前往登录" : lang === "en" ? "Go to Login" : "ไปหน้า Login"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={() => navigate("/partner/portal")}>
                  {portalCta}<ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate("/partner")}>
                <ArrowLeft className="w-4 h-4 mr-2" />{lang === "zh" ? "返回" : lang === "th" ? "กลับ" : "Back"}
              </Button>
            </div>
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
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Link to="/partner" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft size={14} />
              {lang === "zh" ? "返回" : lang === "en" ? "Back" : "กลับ"}
            </Link>
            <div className="h-6 w-px bg-border" />
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="ENT GROUP" className="h-8 w-auto" />
              <div className="hidden md:flex flex-col leading-tight">
                <span className="text-[11px] font-semibold text-foreground">ENT Group</span>
                <span className="text-[10px] text-muted-foreground">B2B Industrial Platform</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {saving ? (
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />{lang === "zh" ? "保存中" : "Saving"}</span>
            ) : lastSaved ? (
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Cloud className="w-3 h-3" />{L("draftSaved")}</span>
            ) : null}
            <LangToggle variant="full" />
            <div className="h-5 w-px bg-border" />
            <ThemeToggle />
          </div>
        </div>
      </nav>

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
            {stage === 1 && <Stage1 data={data} update={update} L={L} capitalCurrency={capitalCurrency} setCapitalCurrency={setCapitalCurrency} />}
            {stage === 2 && <Stage2 data={data} update={update} L={L} lang={lang} />}
            {stage === 3 && <Stage3 data={data} update={update} L={L} lang={lang} />}
            {stage === 4 && <Stage4 data={data} update={update} L={L} lang={lang} />}
            {stage === 5 && (
              <Stage5
                data={data} update={update} L={L} lang={lang} files={files}
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

      {/* Account creation dialog (guests only) */}
      <Dialog open={accountDialogOpen} onOpenChange={(o) => !creatingAccount && setAccountDialogOpen(o)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" />
              {lang === "zh" ? "创建账户以提交" : lang === "en" ? "Create account to submit" : "ตั้งรหัสผ่านเพื่อส่งใบสมัคร"}
            </DialogTitle>
            <DialogDescription className="space-y-2 pt-2">
              <span className="block">
                {lang === "zh"
                  ? "为了让您能跟踪申请状态并在合作伙伴门户中查看进度,请使用以下邮箱设置一个密码。"
                  : lang === "en"
                  ? "So you can track your application and access the Partner Portal, please set a password for your email."
                  : "เพื่อให้คุณติดตามสถานะใบสมัครและเข้า Partner Portal ได้ กรุณาตั้งรหัสผ่านสำหรับอีเมลของคุณ"}
              </span>
              <span className="block text-xs bg-muted px-3 py-2 rounded">
                <Mail className="inline w-3 h-3 mr-1" />
                <strong>{data.contact_email || "—"}</strong>
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div>
              <Label htmlFor="pwd1" className="text-xs">
                {lang === "zh" ? "密码 (至少8位)" : lang === "en" ? "Password (min 8 chars)" : "รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)"}
              </Label>
              <div className="relative">
                <Input
                  id="pwd1"
                  type={showPwd ? "text" : "password"}
                  value={accountPassword}
                  onChange={(e) => setAccountPassword(e.target.value)}
                  className="pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="pwd2" className="text-xs">
                {lang === "zh" ? "确认密码" : lang === "en" ? "Confirm password" : "ยืนยันรหัสผ่าน"}
              </Label>
              <Input
                id="pwd2"
                type={showPwd ? "text" : "password"}
                value={accountPassword2}
                onChange={(e) => setAccountPassword2(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              {lang === "zh"
                ? "我们会向此邮箱发送验证链接。验证后即可登录合作伙伴门户。"
                : lang === "en"
                ? "We'll send a verification link to this email. Once verified, you can sign in to the Partner Portal."
                : "เราจะส่งลิงก์ยืนยันไปที่อีเมลนี้ เมื่อยืนยันแล้วจะเข้า Partner Portal ได้"}
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setAccountDialogOpen(false)} disabled={creatingAccount}>
              {lang === "zh" ? "取消" : lang === "en" ? "Cancel" : "ยกเลิก"}
            </Button>
            <Button onClick={createAccountAndSubmit} disabled={creatingAccount}>
              {creatingAccount && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {lang === "zh" ? "创建并提交" : lang === "en" ? "Create & Submit" : "สร้างบัญชีและส่ง"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FooterCompact />
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
        <Field label={`${L("established")} (ค.ศ. / AD)`}>
          <Input
            type="number"
            min={1900}
            max={new Date().getFullYear()}
            placeholder={`เช่น ${new Date().getFullYear() - 10}`}
            value={data.established_year}
            onChange={(e) => update("established_year", e.target.value)}
          />
        </Field>
        <Field label={L("province")}>
          <Select
            value={data.province || undefined}
            onValueChange={(v) => { update("province", v); update("city", ""); }}
          >
            <SelectTrigger><SelectValue placeholder="เลือกมณฑล / 选择省份" /></SelectTrigger>
            <SelectContent className="max-h-72">
              {CN_PROVINCES.map((p) => (
                <SelectItem key={p.code} value={p.zh}>{p.zh} · {p.en}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label={L("city")}>
          {(() => {
            const sel = CN_PROVINCES.find((p) => p.zh === data.province);
            const cities = sel?.cities ?? [];
            if (cities.length > 0) {
              return (
                <>
                  <Input
                    list="cn-cities-list"
                    placeholder={cities.length ? `เช่น ${cities[0]}` : "เมือง / 城市"}
                    value={data.city}
                    onChange={(e) => update("city", e.target.value)}
                  />
                  <datalist id="cn-cities-list">
                    {cities.map((c) => <option key={c} value={c} />)}
                  </datalist>
                </>
              );
            }
            return (
              <Input
                placeholder="เลือกมณฑลก่อน / 请先选择省份"
                value={data.city}
                onChange={(e) => update("city", e.target.value)}
                disabled={!data.province}
              />
            );
          })()}
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
          <Input
            list="contact-positions-list"
            placeholder="เช่น Sales Manager / 销售经理"
            value={data.contact_position}
            onChange={(e) => update("contact_position", e.target.value)}
          />
          <datalist id="contact-positions-list">
            {CONTACT_POSITIONS.map((p, i) => (
              <option key={i} value={p.zh}>{p.en}</option>
            ))}
          </datalist>
        </Field>
        <Field label={L("contactPhone")}>
          <Input
            type="tel"
            placeholder="+86 138 0000 0000 หรือ +66 8X XXX XXXX"
            value={data.contact_phone}
            onChange={(e) => update("contact_phone", e.target.value)}
          />
        </Field>
        <Field label={L("contactEmail")} required>
          <Input
            type="email"
            placeholder="name@company.com"
            value={data.contact_email}
            onChange={(e) => update("contact_email", e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">{L("emailWarning")}</p>
        </Field>
        <Field label={L("contactWechat")}>
          <Input
            placeholder="WeChat ID เช่น zhang_wei_88"
            value={data.contact_wechat}
            onChange={(e) => update("contact_wechat", e.target.value)}
          />
        </Field>
        <Field label={L("contactWhatsapp")}>
          <Input
            type="tel"
            placeholder="+86 138 0000 0000"
            value={data.contact_whatsapp}
            onChange={(e) => update("contact_whatsapp", e.target.value)}
          />
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
          {CERTS.map((c) => {
            const active = data.certifications.includes(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleCert(c)}
                className={cn(
                  "px-4 py-2 rounded-full border text-sm font-medium transition-colors select-none",
                  active
                    ? "border-primary bg-primary/10 text-primary hover:bg-primary/15"
                    : "border-border hover:border-primary/50 hover:bg-muted"
                )}
                aria-pressed={active}
              >
                {c}
              </button>
            );
          })}
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

function Stage5({ data, update, L, lang, files, onUpload, onRemove, uploadingCat }: any) {
  const PHOTO_SLOTS = 6;
  const photoFiles: UploadedFile[] = files.filter((f: UploadedFile) => f.file_category === "factory_photo");
  const licenseFiles: UploadedFile[] = files.filter((f: UploadedFile) => f.file_category === "business_license");
  const certFiles: UploadedFile[] = files.filter((f: UploadedFile) => f.file_category === "certification");
  const videoFiles: UploadedFile[] = files.filter((f: UploadedFile) => f.file_category === "factory_video");
  const catalogFiles: UploadedFile[] = files.filter((f: UploadedFile) => f.file_category === "product_catalog");

  // bucket เป็น private — ต้องใช้ signed URL

  const toggleCatalogCat = (id: string) => {
    const arr = data.catalog_selected_categories.includes(id)
      ? data.catalog_selected_categories.filter((x: string) => x !== id)
      : [...data.catalog_selected_categories, id];
    update("catalog_selected_categories", arr);
  };

  return (
    <>
      <h2 className="text-xl font-semibold">{L("step5")}</h2>

      {/* === 1. Business License === */}
      <section className="space-y-2">
        <Label className="text-sm font-medium">{L("uploadLicense")}</Label>
        <FilePickerRow
          accept=".pdf,.jpg,.jpeg,.png"
          uploading={uploadingCat === "business_license"}
          onPick={(f) => onUpload("business_license", f)}
          L={L}
        />
        {licenseFiles.length > 0 && (
          <FileList files={licenseFiles} onRemove={onRemove} />
        )}
      </section>

      {/* === 2. Factory Photo Slots === */}
      <section className="space-y-2">
        <div className="flex items-baseline justify-between">
          <Label className="text-sm font-medium">{L("uploadFactory")}</Label>
          <span className="text-[11px] text-muted-foreground">{photoFiles.length}/{PHOTO_SLOTS}</span>
        </div>
        <p className="text-[11px] text-muted-foreground">{L("photoSlotHints")}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: PHOTO_SLOTS }).map((_, i) => {
            const f = photoFiles[i];
            const isUploading = !f && uploadingCat === "factory_photo" && i === photoFiles.length;
            if (f) {
              return (
                <div key={i} className="group relative aspect-[4/3] rounded-lg border-2 border-border bg-muted/40 overflow-hidden">
                  <SignedImage path={f.file_path} alt={f.file_name} />
                  <button
                    type="button"
                    onClick={() => onRemove(f)}
                    className="absolute top-1.5 right-1.5 bg-background/90 hover:bg-destructive hover:text-destructive-foreground rounded-full p-1 shadow"
                    aria-label="remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
                    <p className="text-[11px] text-white truncate">{L("photoSlot")} {i + 1}</p>
                  </div>
                </div>
              );
            }
            return (
              <label
                key={i}
                className={cn(
                  "aspect-[4/3] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors",
                  "border-border hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-primary",
                  isUploading && "opacity-60 pointer-events-none"
                )}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingCat === "factory_photo"}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onUpload("factory_photo", file);
                    e.target.value = "";
                  }}
                />
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    <span className="text-[11px] font-medium">{L("photoSlot")} {i + 1}</span>
                  </>
                )}
              </label>
            );
          })}
        </div>
      </section>

      {/* === 3. Factory Video — file or URL === */}
      <section className="space-y-2">
        <Label className="text-sm font-medium">{L("uploadVideo")}</Label>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 min-h-[110px]">
            {videoFiles.length > 0 ? (
              <ul className="w-full space-y-1">
                {videoFiles.map((f) => (
                  <li key={f.id} className="flex items-center justify-between text-xs bg-muted/40 px-2 py-1 rounded">
                    <span className="truncate">🎬 {f.file_name}</span>
                    <button onClick={() => onRemove(f)} className="text-muted-foreground hover:text-destructive">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <label className="flex flex-col items-center gap-2 cursor-pointer text-muted-foreground hover:text-primary">
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  className="hidden"
                  disabled={uploadingCat === "factory_video"}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onUpload("factory_video", file);
                    e.target.value = "";
                  }}
                />
                {uploadingCat === "factory_video" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                <span className="text-xs">{L("uploadHint")}</span>
              </label>
            )}
          </div>
          <div className="space-y-1.5">
            <Input
              type="url"
              placeholder="https://youtube.com/... · https://b23.tv/..."
              value={data.factory_video_url}
              onChange={(e) => update("factory_video_url", e.target.value)}
            />
            <p className="text-[11px] text-muted-foreground">{L("videoUrl")}</p>
          </div>
        </div>
      </section>

      {/* === 4. Certifications === */}
      <section className="space-y-2">
        <Label className="text-sm font-medium">{L("uploadCert")}</Label>
        <FilePickerRow
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
          uploading={uploadingCat === "certification"}
          onPick={(f) => onUpload("certification", f)}
          L={L}
        />
        {certFiles.length > 0 && <FileList files={certFiles} onRemove={onRemove} />}
      </section>

      {/* === 5. Product Catalog (with scope selector) === */}
      <section className="space-y-2">
        <Label className="text-sm font-medium">{L("uploadCatalog")}</Label>
        <RadioGroup
          value={data.catalog_scope || "all"}
          onValueChange={(v) => update("catalog_scope", v as any)}
          className="flex flex-wrap gap-3"
        >
          <label className="flex items-center gap-2 px-3 py-1.5 border rounded-md cursor-pointer text-sm">
            <RadioGroupItem value="all" /> {L("catalogScopeAll")}
          </label>
          <label className="flex items-center gap-2 px-3 py-1.5 border rounded-md cursor-pointer text-sm">
            <RadioGroupItem value="selected" /> {L("catalogScopePick")}
          </label>
        </RadioGroup>
        {data.catalog_scope === "selected" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-1">
            {PRODUCT_CATEGORIES.map((c) => {
              const checked = data.catalog_selected_categories.includes(c.id);
              return (
                <label
                  key={c.id}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs cursor-pointer",
                    checked ? "border-primary bg-primary/5 text-primary" : "border-border"
                  )}
                >
                  <Checkbox checked={checked} onCheckedChange={() => toggleCatalogCat(c.id)} />
                  <span>{(c as any)[lang]}</span>
                </label>
              );
            })}
          </div>
        )}
        <FilePickerRow
          accept=".pdf"
          multiple
          uploading={uploadingCat === "product_catalog"}
          onPick={(f) => onUpload("product_catalog", f)}
          L={L}
        />
        {catalogFiles.length > 0 && <FileList files={catalogFiles} onRemove={onRemove} />}
      </section>

      {/* === Notes & Heard-from === */}
      <Field label={L("why")}>
        <Textarea rows={3} value={data.why_partner_with_us} onChange={(e) => update("why_partner_with_us", e.target.value)} />
      </Field>
      <Field label={L("notes")}>
        <Textarea rows={2} value={data.additional_notes} onChange={(e) => update("additional_notes", e.target.value)} />
      </Field>

      <Field label={L("heardFrom")}>
        <Select
          value={data.heard_about_us_from || undefined}
          onValueChange={(v) => update("heard_about_us_from", v)}
        >
          <SelectTrigger><SelectValue placeholder={L("heardFromPick")} /></SelectTrigger>
          <SelectContent className="max-h-72">
            {HEARD_FROM_OPTIONS.map((o) => (
              <SelectItem key={o.id} value={o.id}>{(o as any)[lang]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {data.heard_about_us_from && (
          <Input
            className="mt-2"
            placeholder={L("heardFromOther")}
            value={data.heard_about_us_other}
            onChange={(e) => update("heard_about_us_other", e.target.value)}
          />
        )}
      </Field>

      <label className="flex items-start gap-2 p-3 border rounded-md cursor-pointer bg-muted/30">
        <Checkbox checked={data.agreed} onCheckedChange={(v) => update("agreed", !!v)} className="mt-0.5" />
        <span className="text-sm">{L("agreement")}</span>
      </label>
    </>
  );
}

// ── Helper sub-components for Stage5 ───────────────────────
function FilePickerRow({ accept, multiple, uploading, onPick, L }: any) {
  return (
    <label className="flex items-center justify-between border-2 border-dashed rounded-md px-3 py-2.5 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
      <span className="text-xs text-muted-foreground">{L("uploadHint")}</span>
      <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
        {uploading ? L("uploading") : "Browse"}
      </span>
      <input
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        disabled={uploading}
        onChange={(e) => {
          const fs = Array.from(e.target.files || []);
          fs.forEach((f) => onPick(f));
          e.target.value = "";
        }}
      />
    </label>
  );
}

function FileList({ files, onRemove }: { files: UploadedFile[]; onRemove: (f: UploadedFile) => void }) {
  return (
    <ul className="space-y-1">
      {files.map((f) => (
        <li key={f.id} className="flex items-center justify-between text-xs bg-muted/40 px-2 py-1.5 rounded">
          <span className="truncate">📎 {f.file_name}</span>
          <button onClick={() => onRemove(f)} className="text-muted-foreground hover:text-destructive">
            <X className="w-3 h-3" />
          </button>
        </li>
      ))}
    </ul>
  );
}

function SignedImage({ path, alt }: { path: string; alt: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    supabase.storage
      .from("partner-applications")
      .createSignedUrl(path, 3600)
      .then(({ data }) => {
        if (!cancelled && data?.signedUrl) setUrl(data.signedUrl);
      });
    return () => { cancelled = true; };
  }, [path]);
  if (!url) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return <img src={url} alt={alt} className="w-full h-full object-cover" loading="lazy" />;
}
