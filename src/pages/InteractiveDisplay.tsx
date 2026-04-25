import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Monitor, Hand, ShieldCheck, Zap, Sun, Maximize2,
  Building2, GraduationCap, Factory, Sparkles, Phone, MessageCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/SEOHead";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import MiniNavbar from "@/components/MiniNavbar";
import FooterCompact from "@/components/FooterCompact";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import QuoteRequestButton from "@/components/QuoteRequestButton";
import AddToCartButton from "@/components/AddToCartButton";
import { LineQRDialog } from "@/components/LineQRDialog";
import heroImg from "@/assets/interactive-display-hero.jpg";

type Product = {
  id: string;
  sku: string | null;
  model: string;
  name: string;
  description: string | null;
  slug: string;
  form_factor: string | null;
  image_url: string | null;
  tags: string[] | null;
};

const SIZE_FILTERS = [
  { label: "ทั้งหมด", value: "all" },
  { label: '32"', value: "32" },
  { label: '43"', value: "43" },
  { label: '55"', value: "55" },
  { label: '65"', value: "65" },
];

const FEATURES = [
  { icon: Hand, title: "10-Point Multi-Touch", desc: "IR Touch รุ่น 7 ตอบสนอง <5ms รองรับการเขียน-วาด-สัมผัสพร้อมกัน 10 จุด" },
  { icon: ShieldCheck, title: "IP65 Vandal-Proof", desc: "กระจกนิรภัย 4mm ทนการกระแทก กันน้ำ-ฝุ่นระดับอุตสาหกรรม" },
  { icon: Sun, title: "Sunlight-Readable", desc: "Anti-glare ความสว่างสูง มองเห็นชัดแม้ในพื้นที่แสงจ้า" },
  { icon: Zap, title: "Plug-and-Play", desc: "เสียบใช้งานได้ทันที พร้อม Auto Power Management ประหยัดพลังงาน" },
  { icon: Maximize2, title: "Wall / Floor / Embedded", desc: "ติดตั้งได้หลายรูปแบบ — ผนัง, ขาตั้งพื้น, ฝังในเฟอร์นิเจอร์" },
  { icon: Sparkles, title: "30,000-hr Lifespan", desc: "หน้าจอ LCD เกรดอุตสาหกรรม อายุการใช้งานยาวนานกว่า 3 ปี 24/7" },
];

const USE_CASES = [
  {
    icon: Building2,
    title: "Retail / POS / Self-Order",
    desc: "ร้านค้า ร้านอาหาร โชว์รูม — สั่งอาหารด้วยตัวเอง, จัดการคิว, นำทางลูกค้า, แสดงโปรโมชัน",
    bullets: ["Self-order Kiosk", "Queue Management", "Wayfinding", "Digital Catalog"],
  },
  {
    icon: GraduationCap,
    title: "Meeting Room / Education",
    desc: "ห้องประชุม ห้องเรียน Active Learning — ใช้แทนกระดาน, นำเสนอ, จัดประชุมไฮบริด",
    bullets: ["Interactive Whiteboard", "Video Conference", "Active Classroom", "War Room"],
  },
  {
    icon: Factory,
    title: "Industrial / Factory HMI",
    desc: "หน้าจอควบคุมเครื่องจักร, MES Dashboard, Andon Board, Control Room",
    bullets: ["MES / SCADA HMI", "Andon Display", "Production KPI", "Quality Control"],
  },
];

export default function InteractiveDisplay() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState<string>("all");
  const [lineOpen, setLineOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, sku, model, name, description, slug, form_factor, image_url, tags")
        .eq("category", "Interactive Touch Display")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (!mounted) return;
      if (!error && data) setProducts(data as Product[]);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = size === "all"
    ? products
    : products.filter(p => p.tags?.some(t => t === `${size}-inch`));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title='Interactive Touch Display 32"–65" | จอทัชสกรีนอุตสาหกรรม | ENT Group'
        description='จอทัชสกรีนอุตสาหกรรมขนาด 32"-65" สำหรับห้องประชุม, Retail, Education, Factory HMI — IR Touch 10 จุด, IP65, Anti-glare, รับประกัน On-site 24 เดือน'
        path="/interactive-display"
      />
      <BreadcrumbJsonLd items={[
        { name: "หน้าแรก", path: "/" },
        { name: "Interactive Touch Display", path: "/interactive-display" },
      ]} />

      <MiniNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImg}
            alt="Interactive Touch Display in modern conference room"
            className="h-full w-full object-cover opacity-25"
            width={1600}
            height={900}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        </div>
        <div className="container max-w-7xl mx-auto px-6 py-16 md:py-24">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> กลับหน้าหลัก
          </Link>
          <Badge variant="secondary" className="mb-4">B2B • Enterprise Grade</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl">
            Interactive Touch Display
            <span className="block text-primary mt-2 text-3xl md:text-5xl">
              จอทัชสกรีน 32" – 65" สำหรับงานอุตสาหกรรม
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            จอสัมผัส IR Touch 10 จุด ระดับอุตสาหกรรม ตอบสนอง &lt;5ms — สำหรับห้องประชุม, ร้านค้า,
            ห้องเรียน, โรงงาน และจุดบริการลูกค้า รับประกัน On-site 24 เดือน
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <a href="#products">ดูสินค้าทั้งหมด</a>
            </Button>
            <Button size="lg" variant="outline" onClick={() => setLineOpen(true)}>
              <MessageCircle className="mr-2 h-4 w-4" /> ปรึกษาผู้เชี่ยวชาญ
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">ทำไมต้องเลือก Interactive Touch Display</h2>
          <p className="text-muted-foreground mt-3">มาตรฐานอุตสาหกรรม ทนทาน พร้อมใช้งานต่อเนื่อง 24/7</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <Card key={f.title} className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section className="border-y border-border bg-muted/30">
        <div className="container max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">ใช้งานได้หลากหลาย</h2>
            <p className="text-muted-foreground mt-3">3 กลุ่มเป้าหมายหลักที่ลูกค้าเลือกใช้งาน</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {USE_CASES.map((u) => (
              <Card key={u.title} className="bg-background">
                <CardContent className="p-6">
                  <div className="rounded-lg bg-primary/10 p-3 w-fit mb-4">
                    <u.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{u.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{u.desc}</p>
                  <ul className="space-y-1.5">
                    {u.bullets.map(b => (
                      <li key={b} className="text-sm flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="container max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">เลือกขนาดที่เหมาะกับงานคุณ</h2>
            <p className="text-muted-foreground mt-2">มี 4 ขนาด: 32", 43", 55", 65"</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {SIZE_FILTERS.map(f => (
              <Button
                key={f.value}
                size="sm"
                variant={size === f.value ? "default" : "outline"}
                onClick={() => setSize(f.value)}
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">กำลังโหลดสินค้า...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">ไม่พบสินค้าในขนาดนี้</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((p) => {
              // Override links for series pages with multiple OS variants
              const is32 = p.tags?.includes("32-inch") || p.slug === "interactive-display-hd32";
              const is43 = p.tags?.includes("43-inch") || p.slug === "interactive-display-hr43" || p.slug === "interactive-display-hd43";
              // Map specific 43" SKUs to dedicated HR43/HD43 detail
              const model43 = p.slug === "interactive-display-hr43" ? "hr43" : "hd43";
              const detailHref = is43
                ? `/products/displays-43?model=${model43}`
                : is32
                ? "/products/displays-32?model=hd32"
                : `/products/${p.slug}`;
              return (
              <Card key={p.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <Link to={detailHref} className="block">
                  <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-[#0078D4] via-[#1a4a8a] to-[#3DDC84]">
                    {/* Windows mesh */}
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.35) 0%, transparent 45%), radial-gradient(circle at 80% 70%, rgba(61,220,132,0.45) 0%, transparent 50%)",
                      }}
                    />
                    {/* Subtle grid */}
                    <div
                      className="absolute inset-0 opacity-[0.12]"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                      }}
                    />
                    {/* OS chips */}
                    <div className="absolute top-3 right-3 flex gap-1.5 z-10">
                      <span className="px-2 py-0.5 rounded-full bg-white/95 text-[10px] font-bold text-[#0078D4] shadow-sm">Windows</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#3DDC84] text-[10px] font-bold text-[#0a3d1f] shadow-sm">Android</span>
                    </div>
                    {/* Monitor silhouette */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Monitor className="h-24 w-24 text-white/85 drop-shadow-lg group-hover:scale-110 transition-transform duration-300" strokeWidth={1.25} />
                    </div>
                    <Badge className="absolute top-3 left-3 z-10" variant="secondary">{p.model}</Badge>
                  </div>
                </Link>
                <CardContent className="p-5">
                <Link to={detailHref} className="block group/title">
                    <h3 className="font-semibold text-base mb-1 line-clamp-2 min-h-[3rem] group-hover/title:text-primary transition-colors">
                      {p.name.replace("Interactive Touch Display ", "")}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground mb-3">{p.form_factor}</p>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 min-h-[3.75rem]">
                    {p.description}
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button asChild size="sm" variant="secondary" className="w-full">
                      <Link to={detailHref}>ดูรายละเอียด</Link>
                    </Button>
                    <QuoteRequestButton
                      productModel={p.model}
                      productName={p.name}
                      size="sm"
                      className="w-full"
                    />
                    <AddToCartButton
                      productModel={p.model}
                      productName={p.name}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="container max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">ต้องการคำแนะนำเฉพาะโครงการ?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            ทีมวิศวกรของเราพร้อมช่วยออกแบบ-สำรวจหน้างาน-เลือกขนาด-รูปแบบติดตั้ง
            พร้อมเสนอราคาแบบ Bulk สำหรับโครงการมากกว่า 5 จุด
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/quote-request">
                <Phone className="mr-2 h-4 w-4" /> ขอใบเสนอราคา
              </Link>
            </Button>
            <Button size="lg" variant="outline" onClick={() => setLineOpen(true)}>
              <MessageCircle className="mr-2 h-4 w-4" /> แชท LINE @entgroup
            </Button>
          </div>
        </div>
      </section>

      <FooterCompact />
      <LineQRDialog open={lineOpen} onClose={() => setLineOpen(false)} />
    </div>
  );
}
