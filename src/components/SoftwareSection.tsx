import { ExternalLink, Code2, Rocket, Shield, Cpu, Palette, BarChart3 } from "lucide-react";
import LineQRButton from "@/components/LineQRButton";
import softwareFastImg from "@/assets/software-fast.jpg";
import softwareSecureImg from "@/assets/software-secure.jpg";
import softwareDesignImg from "@/assets/software-design.jpg";
import softwareAnalyticsImg from "@/assets/software-analytics.jpg";

const softwareExamples = [
  { label: "HRM", href: "https://entgroup-job.lovable.app/" },
  { label: "ERP", href: "https://entronics-flow.lovable.app/" },
  { label: "CRM", href: "https://ent-crm.lovable.app/" },
  { label: "Webapp", href: "https://www.entgroup.biz/" },
  { label: "Travel & Mobile App", href: "https://www.thailandgo.co/" },
  { label: "Workflow", href: "https://www.vichakarn.co/" },
  { label: "Online Shopping", href: "https://ent-shopper-industrial.lovable.app/" },
  { label: "Social Media", href: "https://thonburi.lovable.app/" },
  { label: "POS", href: "https://ent-posmate.lovable.app/" },
  { label: "ร้านอาหาร", href: "https://phimm.lovable.app/" },
];

const highlights = [
  { icon: Rocket, label: "พัฒนาเร็ว", desc: "เห็นผลภายใน 2 สัปดาห์", img: softwareFastImg },
  { icon: Shield, label: "ปลอดภัย", desc: "ระบบ Cloud ระดับสากล", img: softwareSecureImg },
  { icon: Palette, label: "ออกแบบสวย", desc: "UX/UI มืออาชีพ", img: softwareDesignImg },
  { icon: BarChart3, label: "วัดผลได้", desc: "Dashboard & Analytics", img: softwareAnalyticsImg },
];

const SoftwareSection = () => {
  return (
    <section className="section-padding relative isolate overflow-hidden" id="services">
      {/* Background decoration — z-0 so they stay behind all content */}
      >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/4" />

      <div className="container max-w-7xl mx-auto relative">
        {/* Header */}
        >
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
            <Code2 size={16} />
            <span>บริการใหม่ 2026</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 leading-tight">
            เป็นเจ้าของ{" "}
            >
            <span className="text-gradient">ซอฟต์แวร์</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            พัฒนาซอฟต์แวร์ตามความต้องการของธุรกิจคุณ ด้วยทีมงานมืออาชีพ
          </p>
        </div>

        {/* Highlight stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {highlights.map((h, i) => (
            <div
              key={h.label}
              className="group card-surface overflow-hidden hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 100}ms` }}
              >
              <div className="h-28 overflow-hidden">
                <img
                  src={h.img}
                  alt={h.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width={640}
                  height={512}
                  >
                />
              </div>
              <div className="p-4 text-center">
                <div className="w-9 h-9 mx-auto mb-2 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <h.icon size={18} className="text-primary" />
                </div>
                <p className="text-sm font-bold text-foreground">{h.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{h.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main content: image + examples */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Image */}
          >
          <div className="order-2 lg:order-1">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative card-surface p-2 overflow-hidden">
                <img
                  src="/images/wix/0597a3_9e1fa56a9a7c40f9813a78e9e8b4edce_18a08837.jpg"
                  alt="ทีมพัฒนาซอฟต์แวร์"
                  className="w-full rounded-lg transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                  width={600}
                  height={450}
                  >
                />
                {/* Floating badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-md rounded-xl p-3 border border-border/50">
                  <div className="flex items-center gap-2">
                    <Cpu size={16} className="text-primary" />
                    <span className="text-xs font-semibold text-foreground">Hardware + Software Integration</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">ออกแบบซอฟต์แวร์ให้ทำงานร่วมกับ Mini PC ได้อย่างสมบูรณ์แบบ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="order-1 lg:order-2">
            <h3 className="text-xl font-bold text-foreground mb-4">ตัวอย่างผลงาน</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {softwareExamples.map((ex, i) => (
                <a
                  key={ex.label}
                  href={ex.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border border-border hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:-translate-y-0.5 transition-all duration-200"
                  style={{ animationDelay: `${i * 50}ms` }}
                  >
                  {ex.label} <ExternalLink size={10} />
                </a>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
                <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25">
                  <Rocket size={16} className="group-hover:animate-[bounce_0.6s_ease-in-out]" />
                  สอบถามบริการซอฟต์แวร์
                </button>
<LineQRButton
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-surface-hover hover:border-primary/30 transition-all duration-200"
                >
                >
                เพิ่มเพื่อนขอรายละเอียด
              </LineQRButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SoftwareSection;
