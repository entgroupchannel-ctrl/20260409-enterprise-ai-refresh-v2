import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Building2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface B2BCTABannerProps {
  variant?: "full" | "compact";
}

const B2BCTABanner = ({ variant = "full" }: B2BCTABannerProps) => {
  const items = [
    {
      icon: BookOpen,
      title: "กรณีศึกษา",
      desc: "ดูตัวอย่างจริงจากลูกค้าที่ใช้งานสินค้าของเรา",
      href: "/case-studies",
      color: "text-blue-500",
    },
    {
      icon: Building2,
      title: "ราคาองค์กร",
      desc: "สั่งซื้อจำนวนมาก รับส่วนลดพิเศษ",
      href: "/corporate-pricing",
      color: "text-emerald-500",
    },
    {
      icon: FileText,
      title: "บทความเทคนิค",
      desc: "เคล็ดลับเลือกสินค้าจากทีมวิศวกร",
      href: "/blog",
      color: "text-amber-500",
    },
  ];

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap gap-2 justify-center py-4">
        {items.map((item) => (
          <Link key={item.href} to={item.href}>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
              {item.title}
            >
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <section className="bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-sm font-semibold text-muted-foreground mb-5 uppercase tracking-wider">
          สำหรับลูกค้าองค์กร & โครงการ
        </p>
        <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="group flex items-start gap-3 p-4 rounded-xl bg-card border border-border/60 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className={`p-2 rounded-lg bg-background ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                >
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors mt-1 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default B2BCTABanner;
