import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Wallet, Building2, Receipt } from "lucide-react";

interface Affiliate {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  bank_name: string | null;
  bank_account_name: string | null;
  bank_account_number: string | null;
  promptpay_id: string | null;
  tax_id: string | null;
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

export default function AccountTab({ affiliateId }: { affiliateId: string }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aff, setAff] = useState<Affiliate | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [affRes, payRes] = await Promise.all([
        (supabase.from as any)("affiliates")
          .select("id, full_name, email, phone, bank_name, bank_account_name, bank_account_number, promptpay_id, tax_id, total_commission_earned, total_commission_paid")
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

  const update = (field: keyof Affiliate, value: string) => {
    if (!aff) return;
    setAff({ ...aff, [field]: value });
  };

  const save = async () => {
    if (!aff) return;
    setSaving(true);
    const { error } = await (supabase.from as any)("affiliates").update({
      full_name: aff.full_name,
      phone: aff.phone,
      bank_name: aff.bank_name,
      bank_account_name: aff.bank_account_name,
      bank_account_number: aff.bank_account_number,
      promptpay_id: aff.promptpay_id,
      tax_id: aff.tax_id,
    }).eq("id", aff.id);
    setSaving(false);
    if (error) {
      toast({ title: "บันทึกไม่สำเร็จ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "บันทึกข้อมูลแล้ว" });
    }
  };

  if (loading || !aff) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  const earned = Number(aff.total_commission_earned) || 0;
  const paid = Number(aff.total_commission_paid) || 0;
  const pending = Math.max(earned - paid, 0);

  return (
    <div className="space-y-6">
      {/* Earnings summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> รายได้สะสม</div>
            <p className="text-xl font-bold mt-1">฿{earned.toLocaleString("th-TH")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">จ่ายแล้ว</div>
            <p className="text-xl font-bold mt-1 text-green-600">฿{paid.toLocaleString("th-TH")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">รอจ่าย</div>
            <p className="text-xl font-bold mt-1 text-amber-600">฿{pending.toLocaleString("th-TH")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" /> ข้อมูลส่วนตัว
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">ชื่อ-นามสกุล</Label>
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
            <div>
              <Label className="text-xs">เลขประจำตัวผู้เสียภาษี (สำหรับใบหัก ณ ที่จ่าย)</Label>
              <Input value={aff.tax_id || ""} onChange={e => update("tax_id", e.target.value)} className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" /> ข้อมูลรับเงิน
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">PromptPay ID (เบอร์โทร / เลขบัตรประชาชน)</Label>
            <Input value={aff.promptpay_id || ""} onChange={e => update("promptpay_id", e.target.value)} className="mt-1" placeholder="0812345678" />
          </div>
          <Separator />
          <p className="text-xs text-muted-foreground">หรือโอนผ่านบัญชีธนาคาร</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">ธนาคาร</Label>
              <Input value={aff.bank_name || ""} onChange={e => update("bank_name", e.target.value)} className="mt-1" placeholder="กสิกรไทย" />
            </div>
            <div>
              <Label className="text-xs">ชื่อบัญชี</Label>
              <Input value={aff.bank_account_name || ""} onChange={e => update("bank_account_name", e.target.value)} className="mt-1" />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs">เลขที่บัญชี</Label>
              <Input value={aff.bank_account_number || ""} onChange={e => update("bank_account_number", e.target.value)} className="mt-1" />
            </div>
          </div>
          <Button onClick={save} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            บันทึกข้อมูล
          </Button>
        </CardContent>
      </Card>

      {/* Payout history */}
      <Card>
        <CardHeader>
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
