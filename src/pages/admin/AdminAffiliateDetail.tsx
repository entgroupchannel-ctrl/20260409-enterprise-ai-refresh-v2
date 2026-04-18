import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  Award,
  Building2,
  CheckCircle2,
  ExternalLink,
  Linkedin,
  Loader2,
  Mail,
  Pause,
  Phone,
  Play,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/layouts/AdminLayout";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format } from "date-fns";

interface Affiliate {
  id: string;
  user_id: string;
  affiliate_code: string;
  full_name: string;
  email: string;
  phone: string | null;
  linkedin_url: string;
  current_company: string | null;
  current_position: string | null;
  years_experience: number | null;
  professional_bio: string | null;
  expertise_areas: string[];
  tier: string;
  status: string;
  rejection_reason: string | null;
  approved_at: string | null;
  approved_by: string | null;
  total_clicks: number;
  total_leads: number;
  total_qualified_leads: number;
  total_closed_sales: number;
  total_revenue_generated: number;
  total_commission_earned: number;
  total_commission_paid: number;
  created_at: string;
}

interface Application {
  id: string;
  customer_network_description: string | null;
  expected_monthly_leads: number | null;
  promotion_channels: string[];
  competitive_affiliations: string[];
  why_affiliate: string | null;
  reviewer_notes: string | null;
  reviewed_at: string | null;
}

interface ClickRow {
  id: string;
  created_at: string;
  landing_path: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  converted_to_lead: boolean;
}

interface LeadRow {
  id: string;
  created_at: string;
  source_type: string;
  source_id: string | null;
  status: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_company: string | null;
  deal_value: number | null;
  notes: string | null;
  rejected_reason: string | null;
}

const TIERS = ["bronze", "silver", "gold", "platinum"];

export default function AdminAffiliateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [aff, setAff] = useState<Affiliate | null>(null);
  const [app, setApp] = useState<Application | null>(null);
  const [clicks, setClicks] = useState<ClickRow[]>([]);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [tier, setTier] = useState("bronze");
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [leadActionId, setLeadActionId] = useState<string | null>(null);

  useEffect(() => {
    if (id) load();
  }, [id]);

  const load = async () => {
    setLoading(true);
    const [{ data: a }, { data: ap }, { data: cl }, { data: ld }] = await Promise.all([
      supabase.from("affiliates").select("*").eq("id", id!).maybeSingle(),
      supabase.from("affiliate_applications").select("*").eq("affiliate_id", id!).maybeSingle(),
      (supabase.from as any)("affiliate_clicks")
        .select("id, created_at, landing_path, referrer, utm_source, utm_campaign, converted_to_lead")
        .eq("affiliate_id", id!)
        .order("created_at", { ascending: false })
        .limit(30),
      (supabase.from as any)("affiliate_leads")
        .select("id, created_at, source_type, source_id, status, customer_name, customer_email, customer_company, deal_value, notes, rejected_reason")
        .eq("affiliate_id", id!)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);
    if (a) {
      setAff(a as Affiliate);
      setTier(a.tier);
    }
    if (ap) {
      setApp(ap as Application);
      setReviewerNotes(ap.reviewer_notes || "");
    }
    setClicks((cl || []) as ClickRow[]);
    setLeads((ld || []) as LeadRow[]);
    setLoading(false);
  };

  const updateLeadStatus = async (
    leadId: string,
    newStatus: "qualified" | "converted" | "rejected",
    extra: { deal_value?: number; rejected_reason?: string } = {},
  ) => {
    if (!user) return;
    setLeadActionId(leadId);
    try {
      const updates: any = { status: newStatus };
      if (newStatus === "qualified") {
        updates.qualified_at = new Date().toISOString();
        updates.qualified_by = user.id;
      }
      if (newStatus === "converted") {
        updates.converted_at = new Date().toISOString();
        if (extra.deal_value != null) updates.deal_value = extra.deal_value;
      }
      if (newStatus === "rejected" && extra.rejected_reason) {
        updates.rejected_reason = extra.rejected_reason;
      }
      const { error } = await (supabase.from as any)("affiliate_leads")
        .update(updates)
        .eq("id", leadId);
      if (error) throw error;
      toast.success(`อัปเดต Lead เป็น "${newStatus}"`);
      await load();
    } catch (e: any) {
      toast.error(e.message || "เกิดข้อผิดพลาด");
    } finally {
      setLeadActionId(null);
    }
  };

  const updateStatus = async (newStatus: string, extra: Partial<Affiliate> = {}) => {
    if (!aff || !user) return;
    setSaving(true);
    try {
      const updates: any = {
        status: newStatus,
        tier,
        ...extra,
      };
      if (newStatus === "approved") {
        updates.approved_at = new Date().toISOString();
        updates.approved_by = user.id;
        updates.rejection_reason = null;
      }
      const { error: e1 } = await supabase.from("affiliates").update(updates).eq("id", aff.id);
      if (e1) throw e1;

      if (app) {
        const { error: e2 } = await supabase
          .from("affiliate_applications")
          .update({
            reviewer_notes: reviewerNotes,
            reviewed_at: new Date().toISOString(),
            reviewed_by: user.id,
          })
          .eq("id", app.id);
        if (e2) throw e2;
      }
      toast.success(`อัปเดตสถานะเป็น "${newStatus}" แล้ว`);
      await load();
      setRejectOpen(false);
    } catch (e: any) {
      toast.error(e.message || "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const approve = () => updateStatus("approved");
  const reject = () => {
    if (!rejectReason.trim()) {
      toast.error("กรุณาระบุเหตุผล");
      return;
    }
    updateStatus("rejected", { rejection_reason: rejectReason });
  };
  const suspend = () => updateStatus("suspended");
  const reactivate = () => updateStatus("approved");

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      </AdminLayout>
    );
  }

  if (!aff) {
    return (
      <AdminLayout>
        <div className="py-20 text-center">
          <p className="text-muted-foreground mb-4">ไม่พบ Affiliate นี้</p>
          <Button asChild variant="outline">
            <Link to="/admin/affiliates">กลับไปรายการ</Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>{aff.full_name} | Affiliates</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/affiliates")}>
            <ArrowLeft size={14} /> กลับ
          </Button>
          <Badge
            variant="secondary"
            className={
              aff.status === "approved"
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                : aff.status === "rejected"
                  ? "bg-destructive/15 text-destructive"
                  : aff.status === "suspended"
                    ? "bg-muted text-muted-foreground"
                    : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
            }
          >
            {aff.status}
          </Badge>
        </div>

        {/* Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{aff.full_name}</h1>
                <p className="text-sm text-primary font-mono">@{aff.affiliate_code}</p>
                <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm">
                  <Info icon={Mail} label="Email" value={aff.email} />
                  <Info icon={Phone} label="Phone" value={aff.phone || "—"} />
                  <Info
                    icon={Linkedin}
                    label="LinkedIn"
                    value={
                      <a
                        href={aff.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        เปิดดูโปรไฟล์ <ExternalLink size={12} />
                      </a>
                    }
                  />
                  <Info
                    icon={Building2}
                    label="Company / Position"
                    value={`${aff.current_company || "—"} / ${aff.current_position || "—"}`}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Clicks" value={aff.total_clicks} />
          <StatCard label="Qualified Leads" value={`${aff.total_qualified_leads}/${aff.total_leads}`} />
          <StatCard label="Closed Sales" value={aff.total_closed_sales} />
          <StatCard
            label="Revenue Generated"
            value={`฿${Number(aff.total_revenue_generated).toLocaleString("th-TH")}`}
          />
        </div>

        {/* Application details */}
        {app && (
          <Card>
            <CardContent className="pt-6 space-y-5">
              <h2 className="font-semibold text-lg">ข้อมูลใบสมัคร</h2>

              <Section label="แนะนำตัว / ประสบการณ์">
                <p className="text-sm whitespace-pre-wrap">{aff.professional_bio || "—"}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  ประสบการณ์: {aff.years_experience} ปี
                </p>
              </Section>

              <Section label="ความเชี่ยวชาญ">
                <div className="flex flex-wrap gap-1.5">
                  {aff.expertise_areas.map((e) => (
                    <Badge key={e} variant="outline" className="text-xs">
                      {e}
                    </Badge>
                  ))}
                </div>
              </Section>

              <Section label="เครือข่ายลูกค้า">
                <p className="text-sm whitespace-pre-wrap">{app.customer_network_description || "—"}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  คาดการณ์: {app.expected_monthly_leads} leads/เดือน
                </p>
              </Section>

              <Section label="ช่องทางโปรโมต">
                <div className="flex flex-wrap gap-1.5">
                  {app.promotion_channels.map((c) => (
                    <Badge key={c} variant="secondary" className="text-xs">
                      {c}
                    </Badge>
                  ))}
                </div>
              </Section>

              {app.competitive_affiliations.length > 0 && (
                <Section label="พันธมิตรกับแบรนด์อื่น">
                  <div className="flex flex-wrap gap-1.5">
                    {app.competitive_affiliations.map((c) => (
                      <Badge key={c} variant="outline" className="text-xs">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </Section>
              )}

              <Section label="ทำไมอยากเป็น Affiliate">
                <p className="text-sm whitespace-pre-wrap">{app.why_affiliate || "—"}</p>
              </Section>
            </CardContent>
          </Card>
        )}

        {/* Reviewer panel */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="font-semibold text-lg">การพิจารณา</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm mb-1.5 block">Tier</Label>
                <Select value={tier} onValueChange={setTier} disabled={saving}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIERS.map((t) => (
                      <SelectItem key={t} value={t}>
                        <span className="capitalize flex items-center gap-2">
                          <Award size={14} /> {t}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col justify-end">
                <Label className="text-xs text-muted-foreground">
                  สมัครเมื่อ: {format(new Date(aff.created_at), "d MMM yyyy HH:mm")}
                </Label>
                {aff.approved_at && (
                  <Label className="text-xs text-muted-foreground">
                    อนุมัติเมื่อ: {format(new Date(aff.approved_at), "d MMM yyyy HH:mm")}
                  </Label>
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm mb-1.5 block">Reviewer Notes (ภายใน)</Label>
              <Textarea
                rows={3}
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                placeholder="บันทึกการพิจารณาภายในทีม..."
              />
            </div>

            {aff.rejection_reason && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-xs font-semibold text-destructive mb-1">เหตุผลการปฏิเสธ</p>
                <p className="text-sm">{aff.rejection_reason}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              {aff.status === "pending" && (
                <>
                  <Button onClick={approve} disabled={saving}>
                    {saving ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                    อนุมัติ
                  </Button>
                  <Button variant="destructive" onClick={() => setRejectOpen(true)} disabled={saving}>
                    <XCircle size={14} /> ปฏิเสธ
                  </Button>
                </>
              )}
              {aff.status === "approved" && (
                <>
                  <Button onClick={() => updateStatus("approved")} disabled={saving}>
                    <TrendingUp size={14} /> อัปเดต Tier / Notes
                  </Button>
                  <Button variant="outline" onClick={suspend} disabled={saving}>
                    <Pause size={14} /> ระงับการใช้งาน
                  </Button>
                </>
              )}
              {aff.status === "suspended" && (
                <Button onClick={reactivate} disabled={saving}>
                  <Play size={14} /> เปิดใช้งานอีกครั้ง
                </Button>
              )}
              {aff.status === "rejected" && (
                <Button onClick={approve} disabled={saving} variant="outline">
                  <CheckCircle2 size={14} /> อนุมัติย้อนหลัง
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reject dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ปฏิเสธใบสมัคร</DialogTitle>
            <DialogDescription>
              ระบุเหตุผลที่จะส่งให้ผู้สมัครทราบ
            </DialogDescription>
          </DialogHeader>
          <Textarea
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="เช่น โปรไฟล์ยังไม่เพียงพอ / เครือข่ายไม่ตรงกับกลุ่มลูกค้าเป้าหมาย..."
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)} disabled={saving}>
              ยกเลิก
            </Button>
            <Button variant="destructive" onClick={reject} disabled={saving}>
              {saving && <Loader2 className="animate-spin" size={14} />}
              ยืนยันปฏิเสธ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

const Info = ({ icon: Icon, label, value }: { icon: any; label: string; value: any }) => (
  <div className="flex items-start gap-2">
    <Icon size={14} className="text-muted-foreground mt-0.5 shrink-0" />
    <div className="min-w-0">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium text-sm break-all">{value}</div>
    </div>
  </div>
);

const StatCard = ({ label, value }: { label: string; value: any }) => (
  <Card>
    <CardContent className="pt-5">
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="text-xl font-bold mt-1">{value}</div>
    </CardContent>
  </Card>
);

const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
      {label}
    </p>
    {children}
  </div>
);
