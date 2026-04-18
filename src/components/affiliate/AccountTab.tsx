import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Wallet, Building2, Receipt, Upload, FileCheck2, AlertTriangle, Search } from "lucide-react";

interface Affiliate {
  id: string;
  user_id?: string;
  full_name: string;
  email: string;
  phone: string | null;
  account_holder_type: "individual" | "corporate";
  bank_name: string | null;
  bank_account_name: string | null;
  bank_account_number: string | null;
  promptpay_id: string | null;
  tax_id: string | null;
  national_id: string | null;
  id_card_url: string | null;
  id_card_uploaded_at: string | null;
  total_commission_earned: number;
  total_commission_paid: number;
}

interface Payout {
  id: string;
  payout_number: string;
  amount: number;
  status: string;
  period_start: string;
  period_end: string;
  paid_at: string | null;
  payment_method: string;
  payment_reference: string | null;
  created_at: string;
}

const STATUS_COLOR: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  approved: "outline",
  paid: "default",
  cancelled: "destructive",
};

const TH_BANKS = [
  "ธนาคารกสิกรไทย (KBANK)",
  "ธนาคารไทยพาณิชย์ (SCB)",
  "ธนาคารกรุงเทพ (BBL)",
  "ธนาคารกรุงไทย (KTB)",
  "ธนาคารกรุงศรีอยุธยา (BAY)",
  "ธนาคารทหารไทยธนชาต (TTB)",
  "ธนาคารออมสิน (GSB)",
  "ธนาคารยูโอบี (UOB)",
  "ธนาคารซีไอเอ็มบี ไทย (CIMB)",
  "ธนาคารแลนด์ แอนด์ เฮ้าส์ (LH Bank)",
  "ธนาคารทิสโก้ (TISCO)",
  "ธนาคารเกียรตินาคินภัทร (KKP)",
  "ธนาคารไอซีบีซี (ICBC)",
  "ธนาคารอาคารสงเคราะห์ (GHB)",
  "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (BAAC)",
  "ธนาคารอิสลามแห่งประเทศไทย (IBANK)",
];

const normalizeName = (s: string | null | undefined) =>
  (s ?? "").toLowerCase().replace(/\s+/g, " ").trim();

export default function AccountTab({ affiliateId }: { affiliateId: string }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [aff, setAff] = useState<Affiliate | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [bankFilter, setBankFilter] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [affRes, payRes] = await Promise.all([
        (supabase.from as any)("affiliates")
          .select("id, user_id, full_name, email, phone, account_holder_type, bank_name, bank_account_name, bank_account_number, promptpay_id, tax_id, national_id, id_card_url, id_card_uploaded_at, total_commission_earned, total_commission_paid")
          .eq("id", affiliateId)
          .maybeSingle(),
        (supabase.from as any)("affiliate_payouts")
          .select("id, payout_number, amount, status, period_start, period_end, paid_at, payment_method, payment_reference, created_at")
          .eq("affiliate_id", affiliateId)
          .order("created_at", { ascending: false })
          .limit(50),
      ]);
      if (affRes.data) setAff(affRes.data);
      setPayouts(payRes.data || []);
      setLoading(false);
    })();
  }, [affiliateId]);

  const filteredBanks = useMemo(
    () => TH_BANKS.filter(b => b.toLowerCase().includes(bankFilter.toLowerCase())),
    [bankFilter]
  );

  const update = (field: keyof Affiliate, value: any) => {
    if (!aff) return;
    setAff({ ...aff, [field]: value });
  };

  const nameMismatch =
    aff?.account_holder_type === "individual" &&
    aff.bank_account_name &&
    aff.full_name &&
    normalizeName(aff.full_name) !== normalizeName(aff.bank_account_name);

  const isDigits13 = (v?: string | null) => !!v && /^[0-9]{13}$/.test(v);

  const save = async () => {
    if (!aff) return;
    if (aff.tax_id && !isDigits13(aff.tax_id)) {
      toast({ title: "เลขผู้เสียภาษีต้อง 13 หลัก", variant: "destructive" });
      return;
    }
    if (aff.account_holder_type === "individual" && aff.national_id && !isDigits13(aff.national_id)) {
      toast({ title: "เลขบัตรประชาชนต้อง 13 หลัก", variant: "destructive" });
      return;
    }
    if (nameMismatch) {
      toast({ title: "ชื่อบัญชีไม่ตรงกับชื่อในบัตรประชาชน", description: "กรุณาตรวจสอบให้ตรงกัน", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await (supabase.from as any)("affiliates").update({
      full_name: aff.full_name,
      phone: aff.phone,
      account_holder_type: aff.account_holder_type,
      bank_name: aff.bank_name,
      bank_account_name: aff.bank_account_name,
      bank_account_number: aff.bank_account_number,
      promptpay_id: aff.promptpay_id,
      tax_id: aff.tax_id || null,
      national_id: aff.account_holder_type === "individual" ? (aff.national_id || null) : null,
    }).eq("id", aff.id);
    setSaving(false);
    if (error) {
      toast({ title: "บันทึกไม่สำเร็จ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "บันทึกข้อมูลแล้ว" });
    }
  };

  const handleIdCardUpload = async (file: File) => {
    if (!aff) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/id-card-${Date.now()}.${ext}`;
    const up = await supabase.storage.from("affiliate-kyc").upload(path, file, { upsert: true });
    if (up.error) {
      toast({ title: "อัปโหลดไม่สำเร็จ", description: up.error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const now = new Date().toISOString();
    const { error } = await (supabase.from as any)("affiliates")
      .update({ id_card_url: path, id_card_uploaded_at: now })
      .eq("id", aff.id);
    setUploading(false);
    if (error) {
      toast({ title: "บันทึกไฟล์ไม่สำเร็จ", description: error.message, variant: "destructive" });
    } else {
      setAff({ ...aff, id_card_url: path, id_card_uploaded_at: now });
      toast({ title: "อัปโหลดบัตรประชาชนเรียบร้อย" });
    }
  };

  const viewIdCard = async () => {
    if (!aff?.id_card_url) return;
    const { data } = await supabase.storage.from("affiliate-kyc").createSignedUrl(aff.id_card_url, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  if (loading || !aff) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  const earned = Number(aff.total_commission_earned) || 0;
  const paid = Number(aff.total_commission_paid) || 0;
  const pending = Math.max(earned - paid, 0);
  const isIndividual = aff.account_holder_type === "individual";

  return (
    <div className="space-y-6">
      {/* Earnings summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> รายได้สะสม</div>
          <p className="text-xl font-bold mt-1">฿{earned.toLocaleString("th-TH")}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-xs text-muted-foreground">จ่ายแล้ว</div>
          <p className="text-xl font-bold mt-1 text-green-600">฿{paid.toLocaleString("th-TH")}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-xs text-muted-foreground">รอจ่าย</div>
          <p className="text-xl font-bold mt-1 text-amber-600">฿{pending.toLocaleString("th-TH")}</p>
        </CardContent></Card>
      </div>

      {/* Account type + identity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" /> ประเภทบัญชี & ตัวตน
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">ประเภทบัญชี</Label>
              <Select value={aff.account_holder_type} onValueChange={v => update("account_holder_type", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">บุคคลธรรมดา</SelectItem>
                  <SelectItem value="corporate">นิติบุคคล</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">ชื่อ-นามสกุล / ชื่อบริษัท</Label>
              <Input value={aff.full_name} onChange={e => update("full_name", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">อีเมล</Label>
              <Input value={aff.email} disabled className="mt-1 bg-muted" />
            </div>
            <div>
              <Label className="text-xs">เบอร์โทร</Label>
              <Input value={aff.phone || ""} onChange={e => update("phone", e.target.value)} className="mt-1" />
            </div>
            {isIndividual ? (
              <div className="sm:col-span-2">
                <Label className="text-xs">เลขบัตรประชาชน (13 หลัก)</Label>
                <Input
                  value={aff.national_id || ""}
                  onChange={e => update("national_id", e.target.value.replace(/\D/g, "").slice(0, 13))}
                  className="mt-1 font-mono"
                  placeholder="1234567890123"
                  inputMode="numeric"
                  maxLength={13}
                />
              </div>
            ) : (
              <div className="sm:col-span-2">
                <Label className="text-xs">เลขประจำตัวผู้เสียภาษี (13 หลัก)</Label>
                <Input
                  value={aff.tax_id || ""}
                  onChange={e => update("tax_id", e.target.value.replace(/\D/g, "").slice(0, 13))}
                  className="mt-1 font-mono"
                  placeholder="0105500000000"
                  inputMode="numeric"
                  maxLength={13}
                />
              </div>
            )}
          </div>

          {isIndividual && (
            <div className="rounded-lg border bg-muted/40 p-3 space-y-2">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FileCheck2 className="w-4 h-4 text-primary" />
                  สำเนาบัตรประชาชน (สำหรับยืนยันตัวตนการรับเงิน)
                </div>
                <div className="flex items-center gap-2">
                  {aff.id_card_url && (
                    <Button size="sm" variant="outline" onClick={viewIdCard}>ดูไฟล์</Button>
                  )}
                  <label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={e => e.target.files?.[0] && handleIdCardUpload(e.target.files[0])}
                    />
                    <Button size="sm" variant="default" disabled={uploading} asChild>
                      <span className="cursor-pointer gap-1.5 inline-flex items-center">
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {aff.id_card_url ? "เปลี่ยนไฟล์" : "อัปโหลด"}
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
              {aff.id_card_uploaded_at && (
                <p className="text-xs text-muted-foreground">
                  อัปโหลดเมื่อ {new Date(aff.id_card_uploaded_at).toLocaleString("th-TH")}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                * ชื่อบนบัตรประชาชนต้องตรงกับชื่อบัญชีธนาคารที่ใช้รับเงิน
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bank */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" /> ข้อมูลรับเงิน
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">PromptPay (เบอร์โทร / เลขบัตรประชาชน)</Label>
            <Input value={aff.promptpay_id || ""} onChange={e => update("promptpay_id", e.target.value)} className="mt-1" placeholder="0812345678" />
          </div>
          <Separator />
          <p className="text-xs text-muted-foreground">หรือโอนผ่านบัญชีธนาคาร</p>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">ธนาคาร</Label>
              <Select value={aff.bank_name || ""} onValueChange={v => update("bank_name", v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="เลือกธนาคาร" /></SelectTrigger>
                <SelectContent>
                  <div className="p-2 sticky top-0 bg-popover z-10 border-b">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="ค้นหาธนาคาร…"
                        value={bankFilter}
                        onChange={e => setBankFilter(e.target.value)}
                        className="h-8 pl-7 text-sm"
                        onKeyDown={e => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  {filteredBanks.length === 0 ? (
                    <div className="p-3 text-xs text-muted-foreground">ไม่พบธนาคาร</div>
                  ) : filteredBanks.map(b => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">ชื่อบัญชี {isIndividual && <span className="text-amber-600">(ต้องตรงกับบัตรประชาชน)</span>}</Label>
              <Input value={aff.bank_account_name || ""} onChange={e => update("bank_account_name", e.target.value)} className="mt-1" />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs">เลขที่บัญชี</Label>
              <Input
                value={aff.bank_account_number || ""}
                onChange={e => update("bank_account_number", e.target.value.replace(/[^\d-]/g, ""))}
                className="mt-1 font-mono"
                placeholder="123-4-56789-0"
              />
            </div>
          </div>

          {nameMismatch && (
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription className="text-xs">
                ชื่อบัญชีธนาคารไม่ตรงกับชื่อในบัตรประชาชน — กรุณาแก้ไขให้ตรงกันก่อนบันทึก
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={save} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            บันทึกข้อมูล
          </Button>
        </CardContent>
      </Card>

      {/* Payout history */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" /> ประวัติการจ่ายค่าคอมมิชชัน ({payouts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payouts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">ยังไม่มีรายการจ่ายเงิน</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="py-2 pr-3">เลขที่</th>
                    <th className="py-2 pr-3">รอบ</th>
                    <th className="py-2 pr-3">วิธีจ่าย</th>
                    <th className="py-2 pr-3">สถานะ</th>
                    <th className="py-2 pr-3">วันที่จ่าย</th>
                    <th className="py-2 pr-3 text-right">จำนวนเงิน</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map(p => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-2 pr-3 font-mono text-xs">{p.payout_number}</td>
                      <td className="py-2 pr-3 text-xs whitespace-nowrap">
                        {new Date(p.period_start).toLocaleDateString("th-TH")} – {new Date(p.period_end).toLocaleDateString("th-TH")}
                      </td>
                      <td className="py-2 pr-3 text-xs">{p.payment_method}</td>
                      <td className="py-2 pr-3">
                        <Badge variant={STATUS_COLOR[p.status] || "outline"} className="text-xs">{p.status}</Badge>
                      </td>
                      <td className="py-2 pr-3 text-xs whitespace-nowrap">
                        {p.paid_at ? new Date(p.paid_at).toLocaleDateString("th-TH") : "—"}
                      </td>
                      <td className="py-2 pr-3 text-right font-medium">฿{Number(p.amount).toLocaleString("th-TH")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
