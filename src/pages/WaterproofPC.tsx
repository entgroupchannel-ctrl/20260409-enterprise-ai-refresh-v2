import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import ProductJsonLd from "@/components/ProductJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Droplets, Shield, ThermometerSun, Cpu, Monitor, FileText, ShieldCheck, Waves, SprayCanIcon, Fan, Cog } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import QuoteRequestButton from "@/components/QuoteRequestButton";
import CartBadge from "@/components/CartBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FooterCompact from "@/components/FooterCompact";
import MiniNavbar from "@/components/MiniNavbar";

const models = [
  {
    id: "wp-10",
    name: "Water Proof — 10 inch",
    model: "UTC-S1061G (KLD-1061D)",
    image: "/images/wix/0597a3_af7e5b509d7746fc92da5800de490b80_767004bb.png",
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_21f4cb97b2764af98b370fcc99f58592.pdf",
    specs: {
      "Screen Size": "10 inch LED",
      "Protection": "IP67 & IP69K",
      "Touch": "Capacitive Touch",
      "Material": "Industrial Grade",
      "Design": "Fanless",
      "OS": "Windows / Linux",
    },
  },
  {
    id: "wp-15",
    name: "Water Proof — 15 inch",
    model: "Touch Panel PC",
    image: "/images/wix/0597a3_bc6d3986e2d142f693bc7447618a1d3e_400ae4d0.png",
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_844456de2ee747ed9114dee707ae3788.pdf",
    specs: {
      "Screen Size": "15 inch LED",
      "Resolution": "1920(H) × 1080(V) Full HD",
      "Touch": "10-point Capacitive Touch Screen",
      "CPU": "Intel Core i5-6200U",
      "RAM / Storage": "8GB DDR4 + 128GB SSD",
      "OS": "Windows 11",
      "Material": "Stainless Steel SUS304",
      "Protection": "IP67",
      "Design": "Fanless",
    },
  },
  {
    id: "wp-15-6",
    name: "Water Proof — 15.6 inch",
    model: "UTC-W1592G (KLD-1592GA)",
    image: "/images/wix/0597a3_c0a00a648d2143068e676c50a6d077df_23a50b3c.jpg",
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_1459a6f9ce304306b4b973312f920066.pdf",
    specs: {
      "Screen Size": "15.6 inch LED",
      "Protection": "IP67 & IP69K",
      "Touch": "Capacitive Touch",
      "Material": "Industrial Grade",
      "Design": "Fanless",
      "OS": "Windows / Linux",
    },
  },
  {
    id: "wp-17",
    name: "Water Proof — 17 inch",
    model: "Stainless Steel Touch Panel PC",
    badge: "Best Seller",
    image: "/images/wix/0597a3_89215803eae94d8b8dfbd8bb1cb629b1_cb11085d.png",
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_52b921b945d54d72a95465a7309152bc.pdf",
    specs: {
      "Screen Size": "17 inch LED",
      "Resolution": "1920(H) × 1080(V) Full HD",
      "Touch": "10-point Capacitive Touch Screen",
      "CPU": "Intel Core i5-6200U",
      "RAM / Storage": "8GB DDR4 + 128GB SSD",
      "OS": "Windows 11",
      "Material": "Stainless Steel SUS304",
      "Protection": "IP67",
      "Design": "Fanless",
    },
  },
  {
    id: "wp-21",
    name: "Water Proof — 21.5 inch (KLD)",
    model: "UTC-W2192G (KLD-2192GA)",
    image: "/images/wix/0597a3_265560fdc2694b42bfee0a5cfa89658f_bc699fcb.png",
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_8f9c5bb648384ba5b471eb4d369fa7b8.pdf",
    specs: {
      "Screen Size": "21.5 inch LED",
      "Protection": "IP67 & IP69K",
      "Touch": "Capacitive Touch",
      "Material": "Industrial Grade",
      "Design": "Fanless",
      "OS": "Windows / Linux",
    },
  },
  {
    id: "wp-21-ctn",
    name: "Water Proof — 21.5 inch (CTN)",
    model: "CTN-W21X2B",
    image: "/images/wix/0597a3_85962bd2b6c34f2eb110cfa091cb4ef4_601eb5cc.png",
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_5aaca9bb9d554fdda93138cabb9582aa.pdf",
    specs: {
      "Screen Size": "21.5 inch LED",
      "Protection": "IP67 & IP69K",
      "Touch": "Capacitive Touch",
      "Material": "Industrial Grade",
      "Design": "Fanless",
      "OS": "Windows / Linux",
    },
  },
];

const features = [
  {
    icon: Droplets,
    title: "IP67 / IP69K Protection",
    desc: "กันน้ำ กันฝุ่นสมบูรณ์ จุ่มน้ำลึก 1 เมตร นาน 30 นาที ทนแรงดันน้ำ IP69K",
  },
  {
    icon: Shield,
    title: "Stainless Steel SUS304",
    desc: "วัสดุสแตนเลสเกรดอาหาร ทนทานสูง เหมาะอุตสาหกรรมอาหาร ยา เนื้อสัตว์",
  },
  {
    icon: ThermometerSun,
    title: "Fanless Design",
    desc: "ไร้พัดลม ลดจุดเสี่ยงความเสียหาย ไม่สะสมฝุ่น บำรุงรักษาต่ำ",
  },
  {
    icon: Cpu,
    title: "Industrial-Grade Components",
    desc: "ชิ้นส่วนระดับอุตสาหกรรม ทนทานต่อการทำงานหนักต่อเนื่อง 24/7",
  },
  {
    icon: Monitor,
    title: "Capacitive Touch Screen",
    desc: "หน้าจอสัมผัส 10 จุด ใช้งานด้วยถุงมือได้ แม้มือเปียก",
  },
];

const gallery = [
  "/images/wix/0597a3_4c1c8d61641743aabf446588dba6bb76_bb972213.png",
  "/images/wix/0597a3_349f3590742946d59757e82db9058351_729a230a.png",
  "/images/wix/0597a3_2572d551426a494fb15f36a62888af4f_200c32e7.png",
  "/images/wix/0597a3_8a82f1f1b9834e13adfcb0d5b60392f6_84bb86ef.png",
  "/images/wix/0597a3_395098f7c1a249cdbe9eacd4db009eb5_0df4ec1e.png",
  "/images/wix/0597a3_0e8e591a5b0b47348effb95ee8e90cba_bd779c5b.png",
  "/images/wix/0597a3_09cd9c375cb741aa96abd2e2a32eded7_885d9020.png",
];

const useCases = [
  "อุตสาหกรรมอาหารและเครื่องดื่ม",
  "โรงงานแปรรูปเนื้อสัตว์",
  "อุตสาหกรรมยาและเวชภัณฑ์",
  "ห้องปลอดเชื้อ / Clean Room",
  "โรงงานเคมีภัณฑ์",
  "พื้นที่เปียกชื้น / ล้างน้ำได้",
];

const WaterproofPC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="Waterproof Panel PC — IP67 IP69K กันน้ำ" description="Waterproof Panel PC มาตรฐาน IP67 IP69K กันน้ำ กันฝุ่น Stainless Steel SUS316 สำหรับอุตสาหกรรมอาหาร ยา และห้องคลีนรูม" path="/waterproof-pc" />
      <ProductJsonLd
        collectionName="Waterproof Panel PC IP67 IP69K"

        collectionDescription="Waterproof Panel PC มาตรฐาน IP67 IP69K กันน้ำ กันฝุ่น Stainless Steel สำหรับอุตสาหกรรมอาหารและยา"

        collectionUrl="/waterproof-pc"

        products={models.map(m => ({ name: m.name, image: m.image, description: `${m.model} Waterproof Panel PC`, category: "Waterproof Panel PC" }))}
      />

      <BreadcrumbJsonLd items={[{ name: "สินค้า", path: "/products" }, { name: "Waterproof PC", path: "/waterproof-pc" }]} />
      <MiniNavbar />
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        <div className="container max-w-7xl mx-auto px-4 py-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 py-6">
            <div className="md:w-1/2">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">IP67 & IP69K Certified</Badge>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
                Waterproof <span className="text-gradient">Panel PC</span>
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-6">
                คอมพิวเตอร์อุตสาหกรรมกันน้ำ กันฝุ่น IP67/IP69K สแตนเลส SUS304 เกรดอาหาร ออกแบบไร้พัดลม เหมาะสำหรับอุตสาหกรรมอาหาร เครื่องดื่ม ยา และพื้นที่ที่ต้องล้างทำความสะอาดได้
              </p>
              <div className="flex gap-3">
                <QuoteRequestButton productModel="Waterproof PC IP69K" productName="Waterproof PC IP69K" />
                <Button variant="outline" asChild>
                  <a href="https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_9c183e569b0c43bd9fe64184fff90503.pdf" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1.5" /> Product Overview
                  </a>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="/images/wix/0597a3_af08675d14124a59a86c4be31805907a_2f9d6714.png"
                alt="Waterproof Panel PC Banner"
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-10 space-y-16">
        {/* Features */}
        <section>
          <h2 className="text-2xl font-display font-bold text-foreground mb-6 text-center">
            ทำไมต้อง <span className="text-gradient">Waterproof Panel PC</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {features.map((f, i) => (
              <div key={i} className="card-surface p-5 text-center">
                <f.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* IP67 Explanation */}
        <section className="card-surface p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <img
                src="/images/wix/0597a3_0ad34056abce4284bb55ec5a2fb4ea1b_f03de733.png"
                alt="IP67 Protection"
                className="w-full h-auto rounded-lg"
                loading="lazy"
               decoding="async"/>
            </div>
            <div className="md:w-1/2 flex flex-col justify-center">
              <h3 className="text-xl font-display font-bold text-foreground mb-3">ระดับการป้องกัน IP67 & IP69K</h3>
              <ul className="space-y-4 text-sm">
                {[
                  { icon: ShieldCheck, text: "ปิดผนึกป้องกันฝุ่นอย่างสมบูรณ์ 100%" },
                  { icon: Waves, text: "ทนต่อการแช่น้ำลึก 1 เมตร นาน 30 นาที (IP67)" },
                  { icon: SprayCanIcon, text: "ทนแรงดันน้ำสูง สเปรย์ล้างทำความสะอาดได้ (IP69K)" },
                  { icon: Fan, text: "ไร้พัดลม ลดจุดเสี่ยงความเสียหาย ไม่สะสมฝุ่น" },
                  { icon: Cog, text: "ส่วนประกอบระดับอุตสาหกรรม ทนทานต่อสภาพแวดล้อมที่รุนแรง" },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground leading-relaxed pt-1">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">เหมาะสำหรับอุตสาหกรรม</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {useCases.map((u) => (
              <span key={u} className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">{u}</span>
            ))}
          </div>
        </section>

        {/* Product Lineup */}
        <section>
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">
            รุ่นสินค้า <span className="text-gradient">Waterproof Panel PC</span>
          </h2>

          {/* Quick Nav */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {models.map((m) => (
              <a
                key={m.id}
                href={`#${m.id}`}
                className="shrink-0 px-3 py-2 rounded-lg text-xs font-medium bg-secondary/50 text-foreground/70 border border-border hover:border-primary/30 transition-all"
              >
                {m.name}
              </a>
            ))}
          </div>

          <div className="space-y-6">
            {models.map((m) => (
              <div key={m.id} id={m.id} className="card-surface overflow-hidden scroll-mt-24">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="md:w-1/3 flex items-center justify-center">
                      <div className="relative bg-secondary/50 rounded-xl p-4 w-full flex items-center justify-center min-h-[200px]">
                        <img src={m.image} alt={m.name} className="max-w-full max-h-[220px] object-contain" loading="lazy"  decoding="async"/>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl md:text-2xl font-display font-bold text-foreground">{m.name}</h3>
                        {m.badge && <Badge className="bg-primary text-primary-foreground text-xs">{m.badge}</Badge>}

                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{m.model}</p>

                      <Tabs defaultValue="specs" className="w-full">
                        <TabsList className="w-full justify-start bg-secondary/50">
                          <TabsTrigger value="specs" className="text-xs md:text-sm">►Specification</TabsTrigger>
                        </TabsList>
                        <TabsContent value="specs">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                            {Object.entries(m.specs).map(([key, val]) => (
                              <div key={key} className="bg-secondary/30 rounded-lg p-3 border border-border/50">
                                <div className="text-[11px] font-semibold uppercase tracking-wider text-primary/70 mb-1">{key}</div>
                                <div className="text-sm font-medium text-foreground leading-snug">{val}</div>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                    <Button variant="outline" size="sm" asChild>
                      <a href={m.datasheet} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Datasheet
                      </a>
                    </Button>
                    <QuoteRequestButton productModel="Waterproof PC IP69K" productName="Waterproof PC IP69K" size="sm" />
                    <AddToCartButton productModel={m.model} productName={m.name} productDescription={`${m.model} — ${Object.values(m.specs).slice(0, 3).join(", ")}`} size="sm" variant="outline" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section>
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">
            ภาพผลิตภัณฑ์ <span className="text-gradient">Gallery</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {gallery.map((img, i) => (
              <div key={i} className="card-surface overflow-hidden">
                <img src={img} alt={`Waterproof PC ${i + 1}`} className="w-full h-auto object-contain" loading="lazy"  decoding="async"/>
              </div>
            ))}
          </div>
        </section>

        {/* Application Images */}
        <section className="card-surface overflow-hidden">
          <img
            src="/images/wix/0597a3_ffe271d4f86b4f699e9760cb18da5733_29923812.png"
            alt="Waterproof PC Applications"
            className="w-full h-auto"
            loading="lazy"
           decoding="async"/>
        </section>

        {/* CTA */}
        <div className="card-surface p-8 text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-3">สนใจ Waterproof Panel PC?</h2>
          <p className="text-muted-foreground mb-6">ปรึกษาผู้เชี่ยวชาญเพื่อเลือกรุ่นที่เหมาะกับอุตสาหกรรมของคุณ</p>
          <QuoteRequestButton productModel="Waterproof PC IP69K" productName="Waterproof PC IP69K" size="lg" />
        </div>
      </div>
      <FooterCompact />
    </div>
  );
};


export default WaterproofPC;

