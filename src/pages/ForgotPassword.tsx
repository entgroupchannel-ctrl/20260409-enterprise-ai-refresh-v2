import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, Send } from "lucide-react";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({ title: "ส่งอีเมลไม่สำเร็จ", description: error.message, variant: "destructive" });
      } else {
        setSent(true);
      }
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err?.message || "ไม่สามารถส่งอีเมลได้", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <Send size={28} className="text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">ตรวจสอบอีเมลของคุณ</h1>
          <p className="text-sm text-muted-foreground mb-6">
            เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปยัง <strong className="text-foreground">{email}</strong> แล้ว กรุณาตรวจสอบกล่องจดหมายของคุณ
          </p>
          <Link to="/admin-login" className="text-sm text-primary hover:underline font-medium">
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground mb-1">ลืมรหัสผ่าน</h1>
          <p className="text-sm text-muted-foreground">กรอกอีเมลเพื่อรับลิงก์ตั้งรหัสผ่านใหม่</p>
        </div>

        <div className="card-surface rounded-2xl p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="อีเมลที่ใช้สมัครสมาชิก"
                required
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send size={14} /> {loading ? "กำลังส่ง..." : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          <Link to="/admin-login" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
            <ArrowLeft size={12} /> กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
