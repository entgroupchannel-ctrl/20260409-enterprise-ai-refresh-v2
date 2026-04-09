import { Link } from "react-router-dom";
import { Rocket, ArrowRight, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlatformInviteBannerProps {
  variant?: "full" | "compact";
}

const PlatformInviteBanner = ({ variant = "full" }: PlatformInviteBannerProps) => {
  if (variant === "compact") {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
          <Rocket size={16} className="text-primary" />
          6 ขั้นตอนง่ายๆ จากเลือกสินค้าถึงรับของ
        </p>
        <p className="text-xs text-muted-foreground mb-3">
          ระบบออกแบบมาเพื่อลูกค้าองค์กร ลดขั้นตอนยุ่งยาก ทีมขายคอยช่วยเหลือทุกขั้นตอน
        </p>
        <div className="flex items-center gap-3">
          <Link to="/member-register">
            <Button size="sm" className="gap-1.5 text-xs">
              <UserPlus size={14} /> สมัครสมาชิกฟรี
            </Button>
          </Link>
          <Link to="/platform" className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
            ดูขั้นตอนการใช้งาน <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 md:py-16 px-4 bg-gradient-to-br from-[hsl(220,25%,10%)] via-[hsl(220,20%,14%)] to-[hsl(168,35%,12%)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(168_80%_38%/0.08),transparent_60%)]" />
      <div className="relative container max-w-4xl mx-auto text-center">
        <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center mx-auto mb-5">
          <Rocket size={24} className="text-primary" />
        </div>
        <h2 className="text-xl font-display font-bold text-white mb-3 md:text-3xl">
          แพลตฟอร์มจัดซื้ออุตสาหกรรม<br className="hidden md:block" />แบบครบวงจร
        </h2>
        <p className="text-sm text-white/55 max-w-2xl mx-auto mb-7 leading-relaxed">
          ตั้งแต่ค้นหาสินค้า เปรียบเทียบสเปก สร้างใบเสนอราคา ติดตามสถานะ จนถึงรับสินค้า
          — ทุกขั้นตอนอยู่บนระบบเดียว มีทีมขายคอยช่วยเหลือตลอดเส้นทาง
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/member-register">
            <Button size="lg" className="gap-2 font-bold">
              <UserPlus size={18} /> สมัครสมาชิกฟรี
            </Button>
          </Link>
          <Link to="/platform">
            <Button variant="outline" size="lg" className="gap-2 font-semibold border-white/30 text-white bg-white/5 hover:bg-white/15">
              ดูขั้นตอนการใช้งาน <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PlatformInviteBanner;
