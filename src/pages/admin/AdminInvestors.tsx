import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Loader2, Mail, Phone, Building2, Plus, Link as LinkIcon, Copy, Check,
  Eye, Ban, RotateCcw, ChevronLeft, ShieldCheck, Calendar, Users, Send, CalendarPlus,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface Inquiry {
  id: string;
  full_name: string;
  email: string;
  company: string | null;
  position: string | null;
  phone: string | null;
  investor_type: string | null;
  budget_range: string | null;
  timeline: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

interface Token {
  id: string;
  token: string;
  recipient_name: string;
  recipient_email: string;
  recipient_company: string | null;
  notes: string | null;
  is_active: boolean;
  expires_at: string | null;
  max_views: number | null;
  view_count: number;
  last_viewed_at: string | null;
  revoked_at: string | null;
  created_at: string;
  inquiry_id: string | null;
}

interface BriefView {
  id: string;
  token: string;
  user_agent: string | null;
  referrer: string | null;
  viewed_at: string;
}

const investorTypeLabel: Record<string, string> = {
  institutional: "Institutional",
  ultra_hnw: "UHNW",
  hnw: "HNW",
  invited: "Invited",
  not_qualified: "Not Qualified",
};

const AdminInvestors = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [views, setViews] = useState<BriefView[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Create-token dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [linkedInquiryId, setLinkedInquiryId] = useState<string | null>(null);
  const [newToken, setNewToken] = useState({
    recipient_name: "",
    recipient_email: "",
    recipient_company: "",
    notes: "",
    expires_in_days: "30",
    max_views: "",
  });
  const [creating, setCreating] = useState(false);

  const reload = async () => {
    setLoading(true);
    const [inqRes, tokRes, vRes] = await Promise.all([
      supabase.from("investor_inquiries").select("*").order("created_at", { ascending: false }),
      supabase.from("investor_access_tokens").select("*").order("created_at", { ascending: false }),
      supabase.from("investor_brief_views").select("*").order("viewed_at", { ascending: false }).limit(200),
    ]);
    if (inqRes.data) setInquiries(inqRes.data as any);
    if (tokRes.data) setTokens(tokRes.data as any);
    if (vRes.data) setViews(vRes.data as any);
    setLoading(false);
  };

  useEffect(() => { reload(); }, []);

  const briefUrl = (token: string) => `${window.location.origin}/investors/brief/${token}`;

  const copyLink = async (id: string, token: string) => {
    await navigator.clipboard.writeText(briefUrl(token));
    setCopiedId(id);
    toast({ title: "คัดลอกลิงก์แล้ว" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openCreateDialog = (inq?: Inquiry) => {
    if (inq) {
      setLinkedInquiryId(inq.id);
      setNewToken({
        recipient_name: inq.full_name,
        recipient_email: inq.email,
        recipient_company: inq.company || "",
        notes: "",
        expires_in_days: "30",
        max_views: "",
      });
    } else {
      setLinkedInquiryId(null);
      setNewToken({ recipient_name: "", recipient_email: "", recipient_company: "", notes: "", expires_in_days: "30", max_views: "" });
    }
    setOpenDialog(true);
  };

  const sendBriefEmail = async (t: { token: string; recipient_name: string; recipient_email: string; expires_at: string | null }) => {
    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "investor-vision-link",
          recipientEmail: t.recipient_email,
          idempotencyKey: `investor-vision-${t.token}-${Date.now()}`,
          templateData: {
            recipient_name: t.recipient_name,
            brief_url: briefUrl(t.token),
            expires_at: t.expires_at,
          },
        },
      });
      return true;
    } catch (err: any) {
      toast({ title: "ส่งอีเมลไม่สำเร็จ", description: err?.message ?? "เกิดข้อผิดพลาด", variant: "destructive" });
      return false;
    }
  };

  const createToken = async () => {
    if (!newToken.recipient_name.trim() || !newToken.recipient_email.trim()) {
      toast({ title: "กรุณากรอกชื่อและอีเมล", variant: "destructive" });
      return;
    }
    setCreating(true);
    const days = parseInt(newToken.expires_in_days) || 0;
    const expires_at = days > 0 ? new Date(Date.now() + days * 86400_000).toISOString() : null;
    const max_views = newToken.max_views ? parseInt(newToken.max_views) : null;

    const { data, error } = await supabase.from("investor_access_tokens").insert({
      recipient_name: newToken.recipient_name.trim(),
      recipient_email: newToken.recipient_email.trim(),
      recipient_company: newToken.recipient_company.trim() || null,
      notes: newToken.notes.trim() || null,
      inquiry_id: linkedInquiryId,
      expires_at,
      max_views,
    } as any).select().single();
    setCreating(false);

    if (error) {
      toast({ title: "สร้างลิงก์ไม่สำเร็จ", description: error.message, variant: "destructive" });
      return;
    }
    setOpenDialog(false);
    if (linkedInquiryId) {
      await supabase.from("investor_inquiries").update({ status: "link_sent" } as any).eq("id", linkedInquiryId);
    }

    const created = data as any;
    const sent = await sendBriefEmail({
      token: created.token,
      recipient_name: created.recipient_name,
      recipient_email: created.recipient_email,
      expires_at: created.expires_at,
    });
    await navigator.clipboard.writeText(briefUrl(created.token));
    toast({
      title: sent ? "สร้างลิงก์ + ส่งอีเมลแล้ว ✓" : "สร้างลิงก์สำเร็จ",
      description: sent ? "คัดลอกลิงก์ให้แล้ว และส่งอีเมลไปยังผู้รับเรียบร้อย" : "คัดลอกลิงก์ให้แล้ว (อีเมลส่งไม่สำเร็จ)",
    });
    reload();
  };

  const toggleRevoke = async (t: Token) => {
    const revoking = !t.revoked_at;
    const update: any = revoking
      ? { is_active: false, revoked_at: new Date().toISOString() }
      : { is_active: true, revoked_at: null };
    const { error } = await supabase.from("investor_access_tokens").update(update).eq("id", t.id);
    if (error) {
      toast({ title: "อัพเดตไม่สำเร็จ", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: revoking ? "ยกเลิกลิงก์แล้ว" : "เปิดใช้งานลิงก์อีกครั้ง" });
    reload();
  };

  const resendEmail = async (t: Token) => {
    const ok = await sendBriefEmail(t);
    if (ok) toast({ title: "ส่งอีเมลซ้ำแล้ว ✓", description: `ส่งไปยัง ${t.recipient_email}` });
  };

  const extendExpiry = async (t: Token, days: number) => {
    const base = t.expires_at ? new Date(t.expires_at).getTime() : Date.now();
    const newExpiry = new Date(Math.max(base, Date.now()) + days * 86400_000).toISOString();
    const { error } = await supabase
      .from("investor_access_tokens")
      .update({ expires_at: newExpiry } as any)
      .eq("id", t.id);
    if (error) {
      toast({ title: "ขยายอายุไม่สำเร็จ", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `ขยายอายุ +${days} วันแล้ว ✓` });
    reload();
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardHeader><CardTitle>ไม่มีสิทธิ์เข้าถึง</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">หน้านี้สงวนสำหรับผู้ดูแลระบบเท่านั้น</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background admin-content-area">
      <Helmet><title>Investor Relations | Admin</title></Helmet>
      <div className="container max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link to="/admin/dashboard" className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1 mb-2">
              <ChevronLeft size={14} /> Dashboard
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="text-primary" size={24} />
              Investor Relations
            </h1>
            <p className="text-sm text-muted-foreground mt-1">จัดการคำขอจากนักลงทุน + ลิงก์เข้าถึงเอกสารลับ</p>
          </div>
          <Button onClick={() => openCreateDialog()}>
            <Plus size={16} className="mr-1" /> สร้างลิงก์ Brief
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard icon={Users} label="คำขอทั้งหมด" value={inquiries.length} />
          <StatCard icon={LinkIcon} label="ลิงก์ที่ใช้งาน" value={tokens.filter(t => t.is_active && !t.revoked_at).length} />
          <StatCard icon={Eye} label="เปิดดูทั้งหมด" value={tokens.reduce((s, t) => s + t.view_count, 0)} />
          <StatCard icon={Calendar} label="คำขอใหม่ (รอตอบ)" value={inquiries.filter(i => i.status === "new").length} />
        </div>

        <Tabs defaultValue="inquiries">
          <TabsList>
            <TabsTrigger value="inquiries">คำขอ ({inquiries.length})</TabsTrigger>
            <TabsTrigger value="tokens">ลิงก์เอกสาร ({tokens.length})</TabsTrigger>
            <TabsTrigger value="views">ประวัติเปิดดู ({views.length})</TabsTrigger>
          </TabsList>

          {/* INQUIRIES */}
          <TabsContent value="inquiries" className="mt-4">
            {loading ? (
              <div className="text-center py-12"><Loader2 className="animate-spin mx-auto" /></div>
            ) : inquiries.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-12">ยังไม่มีคำขอ</p>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <Card key={inq.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1 min-w-[280px]">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{inq.full_name}</h3>
                            {inq.investor_type && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                                {investorTypeLabel[inq.investor_type] || inq.investor_type}
                              </span>
                            )}
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              {inq.status}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-0.5">
                            {inq.company && <div className="flex items-center gap-1.5"><Building2 size={12} /> {inq.company} {inq.position && `· ${inq.position}`}</div>}
                            <div className="flex items-center gap-1.5"><Mail size={12} /> {inq.email}</div>
                            {inq.phone && <div className="flex items-center gap-1.5"><Phone size={12} /> {inq.phone}</div>}
                            {inq.timeline && <div>Timeline: {inq.timeline}</div>}
                            <div className="text-[10px] mt-1">{new Date(inq.created_at).toLocaleString("th-TH")}</div>
                          </div>
                          {inq.message && (
                            <p className="text-xs mt-2 p-2 bg-muted rounded">{inq.message}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <Button size="sm" onClick={() => openCreateDialog(inq)}>
                            <LinkIcon size={14} className="mr-1" /> สร้างลิงก์ Brief
                          </Button>
                          <a
                            href={`mailto:${inq.email}?subject=ENT Group Investor Relations`}
                            className="text-xs text-primary hover:underline text-center"
                          >
                            ส่งอีเมล
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* TOKENS */}
          <TabsContent value="tokens" className="mt-4">
            {tokens.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-12">ยังไม่มีลิงก์</p>
            ) : (
              <div className="space-y-3">
                {tokens.map((t) => {
                  const revoked = !!t.revoked_at;
                  const expired = t.expires_at && new Date(t.expires_at) < new Date();
                  return (
                    <Card key={t.id} className={revoked ? "opacity-60" : ""}>
                      <CardContent className="p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex-1 min-w-[280px]">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{t.recipient_name}</h3>
                              {revoked && <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/15 text-destructive">REVOKED</span>}
                              {expired && !revoked && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700">EXPIRED</span>}
                              {!revoked && !expired && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700">ACTIVE</span>}
                            </div>
                            <div className="text-xs text-muted-foreground space-y-0.5">
                              <div>{t.recipient_email}{t.recipient_company && ` · ${t.recipient_company}`}</div>
                              <div className="flex items-center gap-3 flex-wrap">
                                <span>เปิดแล้ว: <strong>{t.view_count}{t.max_views ? `/${t.max_views}` : ""}</strong> ครั้ง</span>
                                {t.last_viewed_at && <span>ล่าสุด: {new Date(t.last_viewed_at).toLocaleString("th-TH")}</span>}
                                {t.expires_at && <span>หมดอายุ: {new Date(t.expires_at).toLocaleDateString("th-TH")}</span>}
                              </div>
                              {t.notes && <div className="italic">หมายเหตุ: {t.notes}</div>}
                              <code className="block bg-muted text-[10px] p-1.5 rounded mt-1 break-all">{briefUrl(t.token)}</code>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 shrink-0 min-w-[160px]">
                            <Button size="sm" variant="outline" onClick={() => copyLink(t.id, t.token)}>
                              {copiedId === t.id ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                              คัดลอกลิงก์
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => resendEmail(t)} disabled={revoked}>
                              <Send size={14} className="mr-1" /> ส่งอีเมลซ้ำ
                            </Button>
                            <div className="grid grid-cols-2 gap-1">
                              <Button size="sm" variant="outline" className="text-[10px] h-7" onClick={() => extendExpiry(t, 30)} disabled={revoked}>
                                <CalendarPlus size={12} className="mr-0.5" /> +30วัน
                              </Button>
                              <Button size="sm" variant="outline" className="text-[10px] h-7" onClick={() => extendExpiry(t, 90)} disabled={revoked}>
                                <CalendarPlus size={12} className="mr-0.5" /> +90วัน
                              </Button>
                            </div>
                            <Button size="sm" variant={revoked ? "default" : "destructive"} onClick={() => toggleRevoke(t)}>
                              {revoked ? <><RotateCcw size={14} className="mr-1" /> เปิดใช้งาน</> : <><Ban size={14} className="mr-1" /> ยกเลิก</>}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* VIEWS */}
          <TabsContent value="views" className="mt-4">
            {views.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-12">ยังไม่มีการเปิดดู</p>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <table className="w-full text-xs">
                    <thead className="bg-muted">
                      <tr className="text-left">
                        <th className="p-3">เวลา</th>
                        <th className="p-3">Token</th>
                        <th className="p-3">User Agent</th>
                        <th className="p-3">Referrer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {views.map((v) => (
                        <tr key={v.id} className="border-t">
                          <td className="p-3">{new Date(v.viewed_at).toLocaleString("th-TH")}</td>
                          <td className="p-3 font-mono">{v.token.slice(0, 12)}...</td>
                          <td className="p-3 max-w-[300px] truncate">{v.user_agent}</td>
                          <td className="p-3 max-w-[200px] truncate">{v.referrer || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* CREATE TOKEN DIALOG */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>สร้างลิงก์เข้าถึงเอกสารลับ</DialogTitle>
            <DialogDescription>ระบบจะคัดลอกลิงก์ให้อัตโนมัติเมื่อสร้างเสร็จ</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">ชื่อผู้รับ *</Label>
              <Input value={newToken.recipient_name} onChange={(e) => setNewToken({ ...newToken, recipient_name: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">อีเมล *</Label>
              <Input type="email" value={newToken.recipient_email} onChange={(e) => setNewToken({ ...newToken, recipient_email: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">บริษัท / Family Office</Label>
              <Input value={newToken.recipient_company} onChange={(e) => setNewToken({ ...newToken, recipient_company: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">หมดอายุภายใน (วัน)</Label>
                <Select value={newToken.expires_in_days} onValueChange={(v) => setNewToken({ ...newToken, expires_in_days: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 วัน</SelectItem>
                    <SelectItem value="14">14 วัน</SelectItem>
                    <SelectItem value="30">30 วัน</SelectItem>
                    <SelectItem value="60">60 วัน</SelectItem>
                    <SelectItem value="90">90 วัน</SelectItem>
                    <SelectItem value="0">ไม่หมดอายุ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">เปิดได้สูงสุด (ครั้ง)</Label>
                <Input type="number" min={1} placeholder="ไม่จำกัด" value={newToken.max_views} onChange={(e) => setNewToken({ ...newToken, max_views: e.target.value })} />
              </div>
            </div>
            <div>
              <Label className="text-xs">หมายเหตุภายใน</Label>
              <Textarea rows={2} value={newToken.notes} onChange={(e) => setNewToken({ ...newToken, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>ยกเลิก</Button>
            <Button onClick={createToken} disabled={creating}>
              {creating && <Loader2 className="animate-spin mr-1" size={14} />} สร้างลิงก์
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: number }) => (
  <Card>
    <CardContent className="p-4">
      <Icon size={16} className="text-primary mb-2" />
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </CardContent>
  </Card>
);

export default AdminInvestors;
