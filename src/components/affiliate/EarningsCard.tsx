import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Wallet, MousePointerClick, ShieldCheck, ShieldAlert, Loader2, Send } from "lucide-react";

interface Earnings {
  total_clicks: number;
  billable_clicks: number;
  rejected_clicks: number;
  clicks_30d: number;
  billable_30d: number;
  pending_earnings: number;
  paid_earnings: number;
  lifetime_earnings: number;
  click_rate: number;
  min_payout: number;
  can_request_payout: boolean;
}

export default function EarningsCard() {
  const { toast } = useToast();
  const [data, setData] = useState<Earnings | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  const load = async () => {
    try {
      const { data: rows, error } = await (supabase.rpc as any)("affiliate_my_earnings");
      if (error) throw error;
      if (rows && rows.length > 0) setData(rows[0]);
    } catch (err: any) {
      toast({ title: "โหลดข้อมูลรายได้ไม่สำเร็จ", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const requestPayout = async () => {
    setRequesting(true);
    try {
      const { error } = await (supabase.rpc as any)("affiliate_request_payout");
      if (error) throw error;
      toast({ title: "ส่งคำขอเบิกเรียบร้อย", description: "แอดมินจะตรวจสอบและโอนเงินภายใน 7 วันทำการ" });
      await load();
    } catch (err: any) {
      const msg = err.message?.includes("below_min_payout")
        ? `ยอดสะสมยังไม่ถึงขั้นต่ำ ฿${data?.min_payout?.toLocaleString("th-TH")}`
        : err.message;
      toast({ title: "ขอเบิกไม่สำเร็จ", description: msg, variant: "destructive" });
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <Card><CardContent className="p-6 flex items-center justify-center h-32">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </CardContent></Card>
    );
  }
  if (!data) return null;

  const progress = Math.min(100, (data.pending_earnings / data.min_payout) * 100);
  const acceptRate = data.total_clicks > 0
    ? Math.round((data.billable_clicks / data.total_clicks) * 100)
    : 0;

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Wallet className="w-4 h-4 text-primary" /> รายได้จากคลิก (รอเบิก)
            </div>
            <p className="text-3xl font-bold text-primary">
              ฿{data.pending_earnings.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              อัตรา ฿{data.click_rate.toFixed(2)} / คลิกที่ผ่านการตรวจสอบ
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={!data.can_request_payout || requesting} className="gap-2">
                {requesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                ขอเบิกเงิน
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>ยืนยันการขอเบิกเงิน</AlertDialogTitle>
                <AlertDialogDescription>
                  ยอดรอเบิก <strong className="text-primary">฿{data.pending_earnings.toLocaleString("th-TH", { minimumFractionDigits: 2 })}</strong> จะถูกส่งให้แอดมินตรวจสอบ
                  และโอนเข้าบัญชีที่ลงทะเบียนไว้ภายใน 7 วันทำการ
                  <br /><br />
                  กรุณาตรวจสอบข้อมูลบัญชีในแท็บ "บัญชี" ให้ถูกต้องก่อนกดยืนยัน
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                <AlertDialogAction onClick={requestPayout}>ยืนยันขอเบิก</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {!data.can_request_payout && (
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">ความคืบหน้าสู่การเบิกขั้นต่ำ</span>
              <span className="font-medium">฿{data.pending_earnings.toFixed(2)} / ฿{data.min_payout.toLocaleString("th-TH")}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t">
          <Stat icon={MousePointerClick} label="คลิกทั้งหมด" value={data.total_clicks.toLocaleString("th-TH")} />
          <Stat icon={ShieldCheck} label="นับเงินได้" value={data.billable_clicks.toLocaleString("th-TH")} sub={`${acceptRate}% ผ่าน`} positive />
          <Stat icon={ShieldAlert} label="ไม่ผ่าน" value={data.rejected_clicks.toLocaleString("th-TH")} sub="bot/ซ้ำ/self" muted />
          <Stat icon={Wallet} label="รับแล้วทั้งหมด" value={`฿${data.paid_earnings.toLocaleString("th-TH")}`} />
        </div>

        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer hover:text-foreground">เงื่อนไขการนับคลิกที่จ่ายเงิน</summary>
          <ul className="mt-2 space-y-1 pl-4 list-disc">
            <li>ผู้เข้าชมแต่ละคน (visitor) นับได้ <strong>1 ครั้งต่อ 30 วัน</strong> ต่อรหัสของคุณ</li>
            <li>ไม่นับคลิกจาก bot, crawler, link preview ของแอปแชท</li>
            <li>ไม่นับคลิกที่ตัวคุณเองคลิกลิงก์ของตัวเอง (ตรวจจาก visitor + บัญชี login)</li>
            <li>ไม่นับคลิกที่ referrer มาจากเว็บไซต์ entgroup.co.th เอง</li>
            <li>เบิกขั้นต่ำ ฿{data.min_payout.toLocaleString("th-TH")} — แอดมินตรวจและโอนภายใน 7 วันทำการ</li>
          </ul>
        </details>
      </CardContent>
    </Card>
  );
}

function Stat({ icon: Icon, label, value, sub, positive, muted }: {
  icon: any; label: string; value: string; sub?: string; positive?: boolean; muted?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5">
        <Icon className={`w-3.5 h-3.5 ${positive ? "text-green-600" : muted ? "text-muted-foreground" : ""}`} />
        {label}
      </div>
      <p className="font-semibold">{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}
