import { useState, useEffect } from "react";
import { Wrench, Clock, CheckCircle, Truck, RotateCcw, Loader2, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface DemoRequest {
  id: string;
  name: string;
  organization: string | null;
  product_model: string | null;
  status: string;
  created_at: string;
  notes: string | null;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  new: { label: "รอพิจารณา", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: Clock },
  approved: { label: "อนุมัติ", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle },
  shipping: { label: "กำลังจัดส่ง", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Truck },
  returned: { label: "คืนเครื่องแล้ว", color: "bg-muted text-muted-foreground border-border", icon: RotateCcw },
  rejected: { label: "ไม่อนุมัติ", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: Package },
};

const MyDemos = () => {
  const { user } = useAuth();
  const [demos, setDemos] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await (supabase.from as any)("demo_requests")
          .select("*")
          .eq("email", user.email)
          .order("created_at", { ascending: false });
        if (data) setDemos(data);
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
        <Wrench size={20} className="text-primary" /> คำขอทดลองใช้งาน
      </h2>

      <div className="card-surface rounded-xl p-5">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={20} className="animate-spin text-muted-foreground" />
          </div>
        ) : demos.length === 0 ? (
          <div className="text-center py-12">
            <Wrench size={32} className="mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">ยังไม่มีคำขอทดลองใช้งาน</p>
            <p className="text-xs text-muted-foreground/60 mt-1">คุณสามารถขอทดลองใช้ได้จากหน้าสินค้าแต่ละรุ่น</p>
          </div>
        ) : (
          <div className="space-y-3">
            {demos.map((demo) => {
              const status = statusConfig[demo.status] || statusConfig.new;
              const StatusIcon = status.icon;
              return (
                <div key={demo.id} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-secondary/20 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Wrench size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-foreground">
                        {demo.product_model || "ขอทดลองใช้งาน"}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${status.color}`}>
                        <StatusIcon size={10} /> {status.label}
                      </span>
                    </div>
                    {demo.organization && (
                      <p className="text-[11px] text-muted-foreground">{demo.organization}</p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1">{formatDate(demo.created_at)}</p>
                    {demo.notes && (
                      <p className="text-[11px] text-primary mt-1">หมายเหตุ: {demo.notes}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDemos;
