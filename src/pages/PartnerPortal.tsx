/**
 * Partner Portal — landing page for partner applicants.
 * Shows status of their submitted application(s).
 * Requires login. Matches applications by user_id OR contact_email.
 */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, FileText, Loader2, Mail, XCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/contexts/I18nContext";
import LangToggle from "@/components/LangToggle";
import { format } from "date-fns";

interface AppRow {
  id: string;
  application_number: string | null;
  company_name_en: string | null;
  company_name_local: string | null;
  status: string;
  current_stage: number;
  submitted_at: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  contact_email: string | null;
  created_at: string;
}

const STATUS_META: Record<string, { th: string; en: string; zh: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: any }> = {
  draft:        { th: "ร่าง",        en: "Draft",        zh: "草稿",     variant: "outline",      icon: FileText },
  submitted:    { th: "รอตรวจสอบ",   en: "Under review", zh: "审核中",   variant: "secondary",    icon: Clock },
  under_review: { th: "กำลังตรวจสอบ", en: "Reviewing",    zh: "审核中",   variant: "secondary",    icon: Clock },
  approved:     { th: "อนุมัติแล้ว",  en: "Approved",     zh: "已批准",   variant: "default",      icon: CheckCircle2 },
  rejected:     { th: "ไม่อนุมัติ",   en: "Rejected",     zh: "未通过",   variant: "destructive",  icon: XCircle },
};

export default function PartnerPortal() {
  const { user, loading: authLoading } = useAuth();
  const { lang } = useI18n();
  const navigate = useNavigate();
  const [apps, setApps] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);

  const t = (th: string, en: string, zh: string) => (lang === "zh" ? zh : lang === "en" ? en : th);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent("/partner/portal")}`);
      return;
    }
    (async () => {
      setLoading(true);
      const email = user.email ?? "";
      // Match by user_id OR contact_email (since old applications may not have user_id)
      const { data, error } = await supabase
        .from("partner_applications")
        .select("id, application_number, company_name_en, company_name_local, status, current_stage, submitted_at, reviewed_at, rejection_reason, contact_email, created_at")
        .or(`user_id.eq.${user.id},contact_email.eq.${email}`)
        .order("created_at", { ascending: false });
      if (!error && data) setApps(data as AppRow[]);
      setLoading(false);
    })();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const submitted = apps.filter((a) => a.status !== "draft");
  const drafts = apps.filter((a) => a.status === "draft");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Helmet>
        <title>{t("Partner Portal", "Partner Portal", "合作伙伴门户")} — ENT Group</title>
        <meta name="description" content="ENT Group Partner Portal — manage your partnership application and access partner resources." />
      </Helmet>

      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-bold text-lg text-primary">ENT Group</Link>
          <div className="flex items-center gap-2">
            <LangToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link to="/partner"><ArrowLeft className="w-4 h-4 mr-1" />{t("กลับ", "Back", "返回")}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Welcome */}
        <section className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            {t(`ยินดีต้อนรับ${user?.email ? `, ${user.email}` : ""}`, `Welcome${user?.email ? `, ${user.email}` : ""}`, `欢迎${user?.email ? `, ${user.email}` : ""}`)}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "ติดตามสถานะใบสมัครและเข้าถึงข้อมูลพันธมิตรได้ที่นี่",
              "Track your application status and access partner resources here.",
              "在此查看申请状态并访问合作伙伴资源。"
            )}
          </p>
        </section>

        {/* Submitted applications */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{t("ใบสมัครของคุณ", "Your Applications", "您的申请")}</h2>
            <Button size="sm" variant="outline" asChild>
              <Link to="/partner/apply"><Plus className="w-4 h-4 mr-1" />{t("สมัครใหม่", "New Application", "新申请")}</Link>
            </Button>
          </div>

          {submitted.length === 0 && drafts.length === 0 && (
            <Card>
              <CardContent className="p-10 text-center space-y-4">
                <Mail className="w-12 h-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">
                  {t("ยังไม่มีใบสมัคร เริ่มสมัครได้เลย", "No applications yet. Start your application now.", "尚无申请。立即开始申请。")}
                </p>
                <Button asChild>
                  <Link to="/partner/apply">{t("เริ่มสมัคร", "Start Application", "开始申请")}<ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {submitted.map((app) => {
              const meta = STATUS_META[app.status] ?? STATUS_META.submitted;
              const Icon = meta.icon;
              return (
                <Card key={app.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <Badge variant={meta.variant} className="gap-1">
                            <Icon className="w-3 h-3" />
                            {t(meta.th, meta.en, meta.zh)}
                          </Badge>
                          {app.application_number && (
                            <span className="text-xs font-mono text-muted-foreground">{app.application_number}</span>
                          )}
                        </div>
                        <h3 className="font-semibold truncate">
                          {app.company_name_en || app.company_name_local || t("ไม่ระบุชื่อบริษัท", "Unnamed company", "未命名公司")}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t("ส่งเมื่อ", "Submitted", "提交于")}:{" "}
                          {app.submitted_at ? format(new Date(app.submitted_at), "yyyy-MM-dd HH:mm") : "—"}
                        </p>
                        {app.status === "rejected" && app.rejection_reason && (
                          <p className="text-sm text-destructive mt-2 p-2 bg-destructive/10 rounded">
                            {app.rejection_reason}
                          </p>
                        )}
                        {app.status === "approved" && (
                          <p className="text-sm text-primary mt-2">
                            🎉 {t("ขอแสดงความยินดี! ทีมงานจะติดต่อกลับเร็วๆ นี้", "Congratulations! Our team will reach out shortly.", "恭喜!我们的团队将很快与您联系。")}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {drafts.map((app) => (
              <Card key={app.id} className="border-dashed">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <Badge variant="outline" className="gap-1 mb-2">
                        <FileText className="w-3 h-3" />{t("ร่าง", "Draft", "草稿")}
                      </Badge>
                      <h3 className="font-semibold">
                        {app.company_name_en || app.company_name_local || t("ใบสมัครยังไม่เสร็จ", "Incomplete application", "未完成的申请")}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("ขั้นตอน", "Stage", "阶段")} {app.current_stage}/5
                      </p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/partner/apply">{t("ทำต่อ", "Continue", "继续")}<ArrowRight className="w-4 h-4 ml-1" /></Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* What's next */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">{t("ขั้นตอนถัดไป", "What's next", "接下来的步骤")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>1. {t("ทีมพันธมิตรของเราจะตรวจสอบใบสมัครภายใน 3-5 วันทำการ", "Our partner team reviews your application within 3-5 business days.", "我们的合作伙伴团队将在 3-5 个工作日内审核您的申请。")}</p>
            <p>2. {t("หากต้องการข้อมูลเพิ่มเติม เราจะติดต่อทางอีเมล", "If we need more info, we'll reach you by email.", "如需更多信息,我们将通过电子邮件与您联系。")}</p>
            <p>3. {t("เมื่ออนุมัติแล้ว คุณจะได้รับสิทธิ์เข้าถึงทรัพยากรพันธมิตร", "Once approved, you'll get access to partner resources.", "批准后,您将获得合作伙伴资源的访问权限。")}</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
