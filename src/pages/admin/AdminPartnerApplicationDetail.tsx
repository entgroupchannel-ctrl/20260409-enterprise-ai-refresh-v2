/**
 * Admin — Partner Application Detail
 * Full review view with: applicant data, files, scoring, decision actions, review log.
 */
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Building2, Globe, Mail, Phone, MapPin, FileText, CheckCircle2, XCircle, PauseCircle, Loader2, Star, Download, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface AppDetail { [k: string]: any }
interface FileRow { id: string; file_category: string; file_name: string; file_path: string; file_size: number | null; created_at: string; }
interface ReviewRow { id: string; decision: string; comment: string | null; score: number | null; reviewer_name: string | null; created_at: string; }

const statusColor: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  submitted: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  reviewing: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  rejected: "bg-destructive/15 text-destructive",
  on_hold: "bg-purple-500/15 text-purple-700 dark:text-purple-300",
};

export default function AdminPartnerApplicationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [app, setApp] = useState<AppDetail | null>(null);
  const [files, setFiles] = useState<FileRow[]>([]);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Review form
  const [decision, setDecision] = useState<string>("comment");
  const [score, setScore] = useState<string>("");
  const [comment, setComment] = useState("");
  const [internalOnly, setInternalOnly] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Status form
  const [newStatus, setNewStatus] = useState<string>("");
  const [rejectionReason, setRejectionReason] = useState("");

  const reload = async () => {
    if (!id) return;
    setLoading(true);
    const [{ data: a }, { data: f }, { data: r }] = await Promise.all([
      supabase.from("partner_applications").select("*").eq("id", id).maybeSingle(),
      supabase.from("partner_application_files").select("*").eq("application_id", id).order("created_at"),
      supabase.from("partner_application_reviews").select("*").eq("application_id", id).order("created_at", { ascending: false }),
    ]);
    setApp(a);
    setFiles((f ?? []) as FileRow[]);
    setReviews((r ?? []) as ReviewRow[]);
    setNewStatus(a?.status ?? "");
    setLoading(false);
  };

  useEffect(() => { reload(); /* eslint-disable-next-line */ }, [id]);

  const downloadFile = async (path: string, name: string) => {
    const { data, error } = await supabase.storage.from("partner-applications").createSignedUrl(path, 60);
    if (error || !data) { toast({ title: "ดาวน์โหลดล้มเหลว", description: error?.message, variant: "destructive" }); return; }
    const a = document.createElement("a"); a.href = data.signedUrl; a.download = name; a.target = "_blank"; a.click();
  };

  const submitReview = async () => {
    if (!id || !user) return;
    if (!comment.trim() && decision === "comment") { toast({ title: "กรุณาใส่ความคิดเห็น", variant: "destructive" }); return; }
    setSubmitting(true);
    const { error } = await supabase.from("partner_application_reviews").insert({
      application_id: id,
      reviewer_id: user.id,
      reviewer_name: user.email ?? null,
      decision,
      comment: comment.trim() || null,
      score: score ? Number(score) : null,
      internal_only: internalOnly,
    });
    if (error) {
      toast({ title: "บันทึกไม่สำเร็จ", description: error.message, variant: "destructive" });
    } else {
      // If the reviewer attached a manual score, update the application as well
      if (score) {
        await supabase.from("partner_applications").update({ manual_score: Number(score) }).eq("id", id);
      }
      toast({ title: "บันทึกความคิดเห็นแล้ว" });
      setComment(""); setScore("");
      reload();
    }
    setSubmitting(false);
  };

  const updateStatus = async () => {
    if (!id || !newStatus || newStatus === app?.status) return;
    setSubmitting(true);
    const patch: any = {
      status: newStatus,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user?.id,
      review_decision: newStatus,
    };
    if (newStatus === "rejected") {
      patch.rejection_reason = rejectionReason || null;
    }
    const { error } = await supabase.from("partner_applications").update(patch).eq("id", id);
    if (error) {
      toast({ title: "อัพเดทสถานะไม่สำเร็จ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "อัพเดทสถานะเรียบร้อย", description: `สถานะใหม่: ${newStatus}` });
      reload();
    }
    setSubmitting(false);
  };

  if (loading) return <div className="p-12 text-center"><Loader2 className="w-6 h-6 animate-spin inline" /></div>;
  if (!app) return (
    <div className="container mx-auto p-6">
      <p className="text-muted-foreground">ไม่พบใบสมัครนี้</p>
      <Button asChild variant="outline" className="mt-4"><Link to="/admin/partners"><ArrowLeft className="w-4 h-4 mr-2" />กลับ</Link></Button>
    </div>
  );

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-0.5">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm">{children || <span className="text-muted-foreground">—</span>}</div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <Helmet><title>{app.application_number ?? "Partner Application"} | Admin</title></Helmet>

      <Button asChild variant="ghost" size="sm"><Link to="/admin/partners"><ArrowLeft className="w-4 h-4 mr-2" />รายการทั้งหมด</Link></Button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{app.company_name_en || app.company_name_local || "—"}</h1>
            <Badge variant="outline" className={statusColor[app.status] ?? ""}>{app.status}</Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {app.application_number ?? "ยังไม่ส่ง"} · stage {app.current_stage}/5 · ส่งเมื่อ {app.submitted_at ? new Date(app.submitted_at).toLocaleString("th-TH") : "—"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {app.auto_score != null && (
            <div className="text-center px-4 py-2 border rounded-lg">
              <div className="text-xs text-muted-foreground">Auto Score</div>
              <div className="text-2xl font-bold flex items-center gap-1"><Star className="w-4 h-4 fill-amber-500 text-amber-500" />{app.auto_score}</div>
            </div>
          )}
          {app.manual_score != null && (
            <div className="text-center px-4 py-2 border rounded-lg bg-amber-500/5">
              <div className="text-xs text-muted-foreground">Manual Score</div>
              <div className="text-2xl font-bold flex items-center gap-1"><Star className="w-4 h-4 fill-amber-500 text-amber-500" />{app.manual_score}</div>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT — App data */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Building2 className="w-4 h-4" />ข้อมูลบริษัท</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <Field label="ชื่อ (EN)">{app.company_name_en}</Field>
              <Field label="ชื่อ (Local)">{app.company_name_local}</Field>
              <Field label="Business License">{app.business_license_no}</Field>
              <Field label="Legal Representative">{app.legal_representative}</Field>
              <Field label="Registered Capital (CNY)">{app.registered_capital_cny ? Number(app.registered_capital_cny).toLocaleString() : null}</Field>
              <Field label="Established">{app.established_year}</Field>
              <Field label="ประเทศ / เมือง"><span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{[app.country, app.province, app.city].filter(Boolean).join(", ")}</span></Field>
              <Field label="Website">{app.website && <a href={app.website} target="_blank" rel="noreferrer" className="text-primary inline-flex items-center gap-1"><Globe className="w-3 h-3" />{app.website}</a>}</Field>
              <Field label="ที่อยู่">{app.company_address}</Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">ผู้ติดต่อ</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <Field label="ชื่อ">{app.contact_name}</Field>
              <Field label="ตำแหน่ง">{app.contact_position}</Field>
              <Field label="Email"><span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" />{app.contact_email}</span></Field>
              <Field label="โทรศัพท์"><span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />{app.contact_phone}</span></Field>
              <Field label="WeChat">{app.contact_wechat}</Field>
              <Field label="WhatsApp">{app.contact_whatsapp}</Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">สินค้าและกำลังการผลิต</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <Field label="หมวดหมู่"><div className="flex flex-wrap gap-1">{(app.product_categories ?? []).map((c: string) => <Badge key={c} variant="secondary">{c}</Badge>)}</div></Field>
              <Field label="OEM / ODM">{[app.oem_capable && "OEM", app.odm_capable && "ODM"].filter(Boolean).join(" + ") || "—"}</Field>
              <Field label="Monthly Capacity">{app.monthly_capacity}</Field>
              <Field label="Factory size (sqm)">{app.factory_size_sqm}</Field>
              <Field label="Staff (รวม)">{app.staff_count}</Field>
              <Field label="QA / R&D Staff">{[app.qa_staff_count && `QA ${app.qa_staff_count}`, app.rd_staff_count && `R&D ${app.rd_staff_count}`].filter(Boolean).join(" · ")}</Field>
              <div className="sm:col-span-2"><Field label="สินค้าหลัก">{app.main_products}</Field></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Capability & ประสบการณ์</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <Field label="Certifications"><div className="flex flex-wrap gap-1">{(app.certifications ?? []).map((c: string) => <Badge key={c} variant="outline">{c}</Badge>)}</div></Field>
              <Field label="Annual Export Value (USD)">{app.annual_export_value_usd ? Number(app.annual_export_value_usd).toLocaleString() : null}</Field>
              <Field label="Export Countries">{(app.export_countries ?? []).join?.(", ") || app.export_countries}</Field>
              <Field label="Thailand Experience">{app.has_thailand_experience ? `ใช่ — ${app.thailand_experience_detail ?? ""}` : "ไม่"}</Field>
              <div className="sm:col-span-2"><Field label="Major Clients">{app.major_clients}</Field></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">เงื่อนไขการเป็น Partner</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <Field label="Exclusivity">{app.exclusivity_preference}</Field>
              <Field label="MOQ">{app.min_order_quantity}</Field>
              <Field label="Payment Terms">{app.payment_terms_preference}</Field>
              <Field label="Sample Policy">{app.sample_policy}</Field>
              <Field label="Warranty">{app.warranty_terms}</Field>
              <Field label="Partnership Type">{(app.expected_partnership_type ?? []).join?.(", ")}</Field>
              <div className="sm:col-span-2"><Field label="ทำไมถึงเลือก ENT?">{app.why_partner_with_us}</Field></div>
              <div className="sm:col-span-2"><Field label="หมายเหตุเพิ่มเติม">{app.additional_notes}</Field></div>
              <Field label="ทราบข่าวจาก">{app.heard_about_us_from}</Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="w-4 h-4" />ไฟล์แนบ ({files.length})</CardTitle></CardHeader>
            <CardContent>
              {files.length === 0 ? <p className="text-sm text-muted-foreground">ยังไม่มีไฟล์แนบ</p> : (
                <ul className="divide-y">
                  {files.map((f) => (
                    <li key={f.id} className="py-2 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{f.file_name}</div>
                        <div className="text-xs text-muted-foreground">{f.file_category} · {f.file_size ? `${Math.round(f.file_size / 1024)} KB` : ""}</div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => downloadFile(f.file_path, f.file_name)}><Download className="w-3 h-3 mr-1" />ดาวน์โหลด</Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT — Review actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">เปลี่ยนสถานะ</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="submitted">submitted (ส่งใหม่)</SelectItem>
                  <SelectItem value="reviewing">reviewing (กำลังพิจารณา)</SelectItem>
                  <SelectItem value="on_hold">on_hold (พักไว้)</SelectItem>
                  <SelectItem value="approved">approved (อนุมัติ)</SelectItem>
                  <SelectItem value="rejected">rejected (ปฏิเสธ)</SelectItem>
                </SelectContent>
              </Select>
              {newStatus === "rejected" && (
                <Textarea placeholder="เหตุผลในการปฏิเสธ" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={3} />
              )}
              <div className="flex gap-2">
                <Button className="flex-1" onClick={updateStatus} disabled={submitting || newStatus === app.status}>
                  {newStatus === "approved" ? <><CheckCircle2 className="w-4 h-4 mr-2" />อนุมัติ</> :
                   newStatus === "rejected" ? <><XCircle className="w-4 h-4 mr-2" />ปฏิเสธ</> :
                   newStatus === "on_hold" ? <><PauseCircle className="w-4 h-4 mr-2" />พักไว้</> :
                   "บันทึกสถานะ"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><MessageSquare className="w-4 h-4" />บันทึกการรีวิว</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">ประเภท</Label>
                  <Select value={decision} onValueChange={setDecision}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comment">ความคิดเห็น</SelectItem>
                      <SelectItem value="approve">เห็นชอบ</SelectItem>
                      <SelectItem value="hold">ขอข้อมูลเพิ่ม</SelectItem>
                      <SelectItem value="reject">ไม่เห็นชอบ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">คะแนน (0-100)</Label>
                  <Input type="number" min={0} max={100} value={score} onChange={(e) => setScore(e.target.value)} placeholder="เลือกได้" />
                </div>
              </div>
              <Textarea placeholder="ความคิดเห็น / เหตุผล..." value={comment} onChange={(e) => setComment(e.target.value)} rows={4} />
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input type="checkbox" checked={internalOnly} onChange={(e) => setInternalOnly(e.target.checked)} />
                Internal only (ไม่แสดงให้ผู้สมัคร)
              </label>
              <Button className="w-full" onClick={submitReview} disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}บันทึกการรีวิว
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Activity Timeline</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {reviews.length === 0 ? <p className="text-sm text-muted-foreground">ยังไม่มีการรีวิว</p> : reviews.map((r) => (
                <div key={r.id} className="border-l-2 border-muted pl-3 pb-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="text-xs">{r.decision}</Badge>
                    {r.score != null && <span className="font-semibold">{r.score} คะแนน</span>}
                    <span className="text-muted-foreground ml-auto">{new Date(r.created_at).toLocaleString("th-TH")}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{r.reviewer_name ?? "—"}</div>
                  {r.comment && <p className="text-sm mt-1 whitespace-pre-wrap">{r.comment}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
