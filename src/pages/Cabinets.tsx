import SEOHead from "@/components/SEOHead";
import ProductJsonLd from "@/components/ProductJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Shield, Zap, Lock, Droplets, Download,
  ExternalLink, Factory, Wrench, FileText, ChevronRight,
  Ruler, Send, Loader2, Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import FooterCompact from "@/components/FooterCompact";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import bannerCabinets from "@/assets/banner-cabinets.jpg";
import cabinetGallery4 from "@/assets/cabinet-gallery-4.jpg";
import cabinetGallery5 from "@/assets/cabinet-gallery-5.jpg";
import cabinetGallery6 from "@/assets/cabinet-gallery-6.jpg";

/* ═══════ Product Data ═══════ */
const cabinetModels = [
  {
    id: "ppc-cb-gk1501",
    name: "PPC-CB-GK1501",
    panelModel: "GK1501",
    material: "เหล็ก & สแตนเลสสตีล",
    protection: "IP65",
    lock: "กุญแจแบบเด้ง หรือ แบบเขาควาย",
    installation: "วางกับพื้น หรือ แขวนกับผนัง",
    cabinetSize: "140 × 550 × 500 mm",
    panelSize: "60 × 359 × 283 mm",
    image: "/images/wix/005637_0947f6ab0a65440c80e8b512a6e5b7bc_26aa12e4.png",
    datasheetPanel: "/datasheets/005637_c1e39dcdf20d4023bcaa04dbf2d33300.pdf",
    datasheetCabinet: "/datasheets/005637_bc78861bac1743da9dfd0dfa3c1496d6.pdf",
  },
  {
    id: "ppc-cb-itpca500",
    name: "PPC-CB-ITPCA500",
    panelModel: "ITPC-A500",
    material: "สแตนเลสสตีล & เหล็ก",
    protection: "IP65",
    lock: "กุญแจแบบเด้ง หรือ แบบเขาควาย",
    installation: "วางกับพื้น หรือ แขวนกับผนัง",
    cabinetSize: "120 × 500 × 500 mm",
    panelSize: "60 × 366 × 290 mm",
    image: "/images/wix/005637_2c4bd9b386094f52b29f7216de542dd6_88a265f2.png",
    datasheetPanel: "/datasheets/005637_1622ff542d1244c68d5207e036d69f48.pdf",
    datasheetCabinet: "/datasheets/005637_34865607b1c447fe85523e820aec8226.pdf",
  },
  {
    id: "ppc-cb-gk1506",
    name: "PPC-CB-GK1506",
    panelModel: "GK1506",
    material: "สแตนเลสสตีล & เหล็ก",
    protection: "IP65",
    lock: "กุญแจแบบเด้ง หรือ แบบเขาควาย",
    installation: "วางกับพื้น หรือ แขวนกับผนัง",
    cabinetSize: "120 × 550 × 500 mm",
    panelSize: "60 × 391 × 276 mm",
    image: "/images/wix/005637_b92a7431672b4b75acc16888898c7e98_3a142ad3.png",
    datasheetPanel: "/datasheets/005637_c159f1de71084932ad2ff90de91b7e29.pdf",
    datasheetCabinet: "/datasheets/005637_831aabe88e18477bb082a402bf5c175d.pdf",
  },
];

const advantages = [
  { icon: Shield, title: "SECURE", desc: "Double Lock / ล็อกสองชั้น กุญแจแบบกดเด้งหรือเขาควาย ป้องกันการเข้าถึงโดยไม่ได้รับอนุญาต" },
  { icon: Zap, title: "STABILITY", desc: "ผลิตด้วยแผ่นเหล็กขาวหรือสแตนเลสสตีล ทนทานต่อสภาพแวดล้อม ระบายความร้อนได้ดี" },
  { icon: Lock, title: "RELIABILITY", desc: "ผ่านการทดสอบภาคสนาม ออกแบบให้เข้ากับตัวเครื่อง มีเพลทยึดอุปกรณ์ 1-2 ชั้น" },
];

const installationTypes = [
  { label: "Indoor", desc: "ติดตั้งภายในอาคาร โรงงาน สำนักงาน", icon: Factory },
  { label: "Outdoor", desc: "ติดตั้งภายนอกอาคาร กันฝุ่น กันน้ำ", icon: Droplets },
  { label: "Floor Standing", desc: "วางตั้งกับพื้น เคลื่อนย้ายสะดวก", icon: Wrench },
  { label: "Wall Mounting", desc: "แขวนติดผนัง ประหยัดพื้นที่", icon: Wrench },
];

const galleryImages = [
  "/images/wix/005637_32016e0d75a34007b8955509d9cb5b59_dbe59e0e.jpg",
  "/images/wix/005637_34cd1b29091c44eca78ef0700748e875_3fe7d1e1.jpg",
  "/images/wix/005637_905985eb99544b148865284b561dba6b_6b746627.jpg",
  cabinetGallery4,
  cabinetGallery5,
  cabinetGallery6,
];

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

const materialOptions = ["เหล็กขาว", "สแตนเลสสตีล (SUS304)", "สแตนเลสสตีล (SUS316)", "อื่นๆ"];
const installOptions = ["วางกับพื้น (Floor Standing)", "แขวนกับผนัง (Wall Mounting)", "ทั้งสองแบบ"];
const lockOptions = ["กุญแจแบบเด้ง", "กุญแจแบบเขาควาย", "ล็อกอิเล็กทรอนิกส์", "อื่นๆ"];

/* ═══════ Component ═══════ */
const Cabinets = () => {
  const [quoteProduct, setQuoteProduct] = useState<string | null>(null);
  const [customOpen, setCustomOpen] = useState(false);  const { toast } = useToast();
  const [customLoading, setCustomLoading] = useState(false);
  const [customSubmitted, setCustomSubmitted] = useState(false);
  const [customForm, setCustomForm] = useState({
    name: "", email: "", phone: "", company: "",
    panelModel: "", cabinetWidth: "", cabinetHeight: "", cabinetDepth: "",
    material: "", installation: "", lock: "", protection: "IP65",
    plateCount: "1", details: "",
  });

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setCustomForm({ ...customForm, [e.target.name]: e.target.value });
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomLoading(true);
    try {
      const details = [
        `[Custom Cabinet]`,
        `Panel Model: ${customForm.panelModel}`,
        `ขนาดตู้: ${customForm.cabinetWidth}×${customForm.cabinetHeight}×${customForm.cabinetDepth} mm`,
        `วัสดุ: ${customForm.material}`,
        `การติดตั้ง: ${customForm.installation}`,
        `กุญแจ: ${customForm.lock}`,
        `ระดับป้องกัน: ${customForm.protection}`,
        `เพลทยึด: ${customForm.plateCount} ชั้น`,
        customForm.details ? `หมายเหตุ: ${customForm.details}` : "",
      ].filter(Boolean).join("\n");

      const { error } = await (supabase.from as any)("quote_requests").insert({
        user_id: null,
        name: customForm.name,
        email: customForm.email || "",
        phone: customForm.phone || null,
        company: customForm.company || null,
        products: [{ category: "Custom Cabinet", model: customForm.panelModel, qty: 1 }],
        details,
      });
      if (error) throw error;
      setCustomSubmitted(true);
      toast({ title: "ส่งคำขอเรียบร้อย!", description: "ทีมจะติดต่อกลับเพื่อเสนอราคาตู้ Custom" });
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    } finally {
      setCustomLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="ตู้ Rack & Cabinet อุตสาหกรรม" description="ตู้ Rack, ตู้ Cabinet อุตสาหกรรม สั่งผลิตขนาดพิเศษ วัสดุ Steel/SUS304/SUS316 มาตรฐาน IP65 พร้อมบริการออกแบบและติดตั้ง" path="/cabinets" />
      <ProductJsonLd
        collectionName="ตู้ Rack & Cabinet อุตสาหกรรม"

        collectionDescription="ตู้ Rack, ตู้ Cabinet อุตสาหกรรม สั่งผลิตขนาดพิเศษ วัสดุ Steel/SUS304/SUS316 มาตรฐาน IP65"

        collectionUrl="/cabinets"

        products={[{ name: "Custom Industrial Cabinet", category: "ตู้ Rack & Cabinet" }]}      />

      <BreadcrumbJsonLd items={[{ name: "สินค้า", path: "/products" }, { name: "ตู้ Rack & Cabinet", path: "/cabinets" }]} />
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img src={bannerCabinets} alt="ตู้พาเนลพีซีเกรดอุตสาหกรรม" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container max-w-6xl mx-auto px-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-3">
              <ArrowLeft className="w-4 h-4" /> กลับหน้าหลัก
            </Link>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-1">Panel PC — Cabinet</h1>
            <p className="text-sm md:text-base text-white/80">ตู้พาเนลพีซีเกรดอุตสาหกรรม สั่งผลิตตามขนาดที่ต้องการ</p>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-10 space-y-16">
        {/* Intro */}
        <section className="text-center max-w-3xl mx-auto">
          <p className="text-muted-foreground leading-relaxed">
            ตู้หน้าจอสัมผัสของเราได้รับการออกแบบและผลิตโดยผู้เชี่ยวชาญ สามารถกำหนดขนาดตู้ได้เหมาะสมกับตัวเครื่อง
            เพื่อตอบสนองความต้องการเฉพาะของงาน ในขณะที่ยังคงรักษารากฐานที่มั่นคงของตัวเครื่องที่ผ่านการทดสอบภาคสนาม
          </p>
        </section>

        {/* Advantages */}
        <section>
          <h2 className="text-xl md:text-2xl font-display font-bold text-foreground text-center mb-8">
            ทำไมต้องเลือก Panel PC Cabinet ของเรา
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {advantages.map((adv) => (
              <div key={adv.title} className="card-surface p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <adv.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{adv.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{adv.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Features Strip */}
        <section className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6">
          <h3 className="text-sm font-bold text-foreground mb-4">ข้อดีของการใช้ Panel PC — Cabinet</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              "รองรับการติดตั้งภายในและภายนอกอาคาร",
              "กันฝุ่น / กันน้ำ / ปลอดภัย ติดตั้งง่าย",
              "ผลิตด้วยแผ่นเหล็กขาว หรือ สแตนเลสสตีล",
              "ขอบตู้ยกป้องกันน้ำเข้า",
              "ด้านในมีเพลทยึดอุปกรณ์ 1 หรือ 2 ชั้น",
              "Double Lock / ล็อกสองชั้น",
            ].map((feat) => (
              <div key={feat} className="flex items-start gap-2">
                <ChevronRight size={14} className="text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{feat}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Product Models */}
        <section>
          <h2 className="text-xl md:text-2xl font-display font-bold text-foreground text-center mb-8">
            รุ่นตู้ Panel PC Cabinet
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cabinetModels.map((model) => (
              <div key={model.id} className="card-surface overflow-hidden group hover:border-primary/30 transition-all">
                <div className="relative bg-secondary/30 p-6 flex items-center justify-center h-56">
                  <img
                    src={model.image}
                    alt={model.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-foreground">{model.name}</h3>
                    <Badge variant="secondary" className="text-xs">{model.protection}</Badge>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <p><span className="font-medium text-foreground">วัสดุ:</span> {model.material}</p>
                    <p><span className="font-medium text-foreground">ติดตั้ง:</span> {model.installation}</p>
                    <p><span className="font-medium text-foreground">กุญแจ:</span> {model.lock}</p>
                    <p><span className="font-medium text-foreground">ขนาดตู้:</span> {model.cabinetSize}</p>
                    <p><span className="font-medium text-foreground">ขนาดเครื่อง:</span> {model.panelSize}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <a href={model.datasheetPanel} target="_blank" rel="noopener noreferrer">
                        <Download className="w-3.5 h-3.5 mr-1" /> Panel
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <a href={model.datasheetCabinet} target="_blank" rel="noopener noreferrer">
                        <Download className="w-3.5 h-3.5 mr-1" /> Cabinet
                      </a>
                    </Button>
                  </div>
                  <Button size="sm" className="w-full" onClick={() => setQuoteProduct(model.name)}>
                    <FileText className="w-3.5 h-3.5 mr-1.5" /> ขอใบเสนอราคา
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Installation Types */}
        <section>
          <h2 className="text-xl md:text-2xl font-display font-bold text-foreground text-center mb-8">
            รูปแบบการติดตั้ง
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {installationTypes.map((type) => (
              <div key={type.label} className="card-surface p-5 text-center">
                <type.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-bold text-foreground text-sm mb-1">{type.label}</h4>
                <p className="text-xs text-muted-foreground">{type.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section>
          <h2 className="text-xl md:text-2xl font-display font-bold text-foreground text-center mb-2">
            ผลงานตู้ต่างๆ ที่เราจัดจำหน่าย
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-8">
            สามารถติดตั้งได้หลากหลายสถานที่ตามเหมาะสมของงาน
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((img, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-secondary/30 border border-border">
                <img src={img} alt={`ตัวอย่างผลงาน ${i + 1}`} className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Button variant="outline" asChild>
              <a href="/datasheets/005637_3905ac03579a48dab93f975d41e62d3e.pdf" target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-2" /> ดาวน์โหลด Datasheet รวม
              </a>
            </Button>
          </div>
        </section>

        {/* Custom Cabinet Section */}
        <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5 p-8 md:p-10">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Settings className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-3">
              สั่งผลิตตู้ Custom Cabinet
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ต้องการตู้ขนาดพิเศษ? เราสามารถออกแบบและผลิตตู้ Panel PC ตามความต้องการเฉพาะของคุณ
              ไม่ว่าจะเป็นขนาด วัสดุ ระดับการป้องกัน หรือระบบล็อก
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Ruler, title: "กำหนดขนาดได้", desc: "ระบุขนาดตู้ที่ต้องการให้เหมาะกับตัวเครื่องและพื้นที่ติดตั้ง" },
              { icon: Shield, title: "เลือกวัสดุ & ระดับป้องกัน", desc: "เหล็กขาว, SUS304, SUS316 พร้อมระดับ IP ตามต้องการ" },
              { icon: Wrench, title: "ปรับแต่งรายละเอียด", desc: "เพลทยึดอุปกรณ์, ระบบล็อก, ช่องเดินสาย ตามสเปกงาน" },
            ].map((item) => (
              <div key={item.title} className="card-surface p-5 text-center">
                <item.icon className="w-7 h-7 text-primary mx-auto mb-3" />
                <h4 className="font-bold text-foreground text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button size="lg" onClick={() => { setCustomOpen(true); setCustomSubmitted(false); }}>

              <Settings className="w-4 h-4 mr-2" /> ขอใบเสนอราคา Custom Cabinet
            </Button>
          </div>
        </section>

        {/* CTA */}
        <div className="card-surface p-8 text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-3">สนใจตู้ Panel PC Cabinet?</h2>
          <p className="text-muted-foreground mb-6">ปรึกษาผู้เชี่ยวชาญเพื่อเลือกขนาดและรุ่นที่เหมาะกับงานของคุณ</p>
          <Button size="lg" onClick={() => setQuoteProduct("Panel PC Cabinet")}>
            <FileText className="w-4 h-4 mr-2" /> ขอใบเสนอราคา
          </Button>
        </div>
      </div>

      {/* Custom Cabinet Dialog */}
      <Dialog open={customOpen} onOpenChange={(o) => { if (!o) { setCustomOpen(false); setTimeout(() => setCustomSubmitted(false), 300); } }}>

        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings size={20} className="text-primary" /> สั่งผลิตตู้ Custom Cabinet
            </DialogTitle>
            <DialogDescription>กรอกสเปกที่ต้องการ เราจะจัดทำใบเสนอราคาให้ภายใน 24 ชม.</DialogDescription>
          </DialogHeader>

          {customSubmitted ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <FileText size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">ส่งคำขอเรียบร้อย!</h3>
              <p className="text-sm text-muted-foreground mb-4">ทีมจะติดต่อกลับเพื่อเสนอราคาตู้ Custom ภายใน 24 ชม.</p>
              <button onClick={() => setCustomOpen(false)} className="text-sm text-primary hover:underline">ปิด</button>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-foreground">ข้อมูลติดต่อ</h4>
                <div className="grid grid-cols-2 gap-3">
                  <input name="name" placeholder="ชื่อ-นามสกุล *" required value={customForm.name} onChange={handleCustomChange} className={inputClass} />
                  <input name="email" type="email" placeholder="อีเมล *" required value={customForm.email || user?.email || ""} onChange={handleCustomChange} className={inputClass} />
                  <input name="phone" placeholder="เบอร์โทร" value={customForm.phone} onChange={handleCustomChange} className={inputClass} />
                  <input name="company" placeholder="บริษัท" value={customForm.company} onChange={handleCustomChange} className={inputClass} />
                </div>
              </div>

              {/* Cabinet Specs */}
              <div className="space-y-3 pt-2 border-t border-border">
                <h4 className="text-sm font-bold text-foreground">สเปกตู้ที่ต้องการ</h4>
                <input name="panelModel" placeholder="รุ่น Panel PC ที่ใช้ (เช่น GK1501)" value={customForm.panelModel} onChange={handleCustomChange} className={inputClass} />
                
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">ขนาดตู้ (mm)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input name="cabinetWidth" placeholder="กว้าง (W)" value={customForm.cabinetWidth} onChange={handleCustomChange} className={inputClass} />
                    <input name="cabinetHeight" placeholder="สูง (H)" value={customForm.cabinetHeight} onChange={handleCustomChange} className={inputClass} />
                    <input name="cabinetDepth" placeholder="ลึก (D)" value={customForm.cabinetDepth} onChange={handleCustomChange} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">วัสดุ</label>
                    <select name="material" value={customForm.material} onChange={handleCustomChange} className={inputClass}>

                      <option value="">เลือกวัสดุ</option>
                      {materialOptions.map((m) => <option key={m} value={m}>{m}</option>)}

                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">รูปแบบติดตั้ง</label>
                    <select name="installation" value={customForm.installation} onChange={handleCustomChange} className={inputClass}>

                      <option value="">เลือกรูปแบบ</option>
                      {installOptions.map((o) => <option key={o} value={o}>{o}</option>)}

                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">กุญแจ / ล็อก</label>
                    <select name="lock" value={customForm.lock} onChange={handleCustomChange} className={inputClass}>

                      <option value="">เลือกประเภทกุญแจ</option>
                      {lockOptions.map((l) => <option key={l} value={l}>{l}</option>)}

                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">ระดับป้องกัน</label>
                    <select name="protection" value={customForm.protection} onChange={handleCustomChange} className={inputClass}>

                      <option value="IP54">IP54</option>
                      <option value="IP65">IP65</option>
                      <option value="IP66">IP66</option>
                      <option value="IP67">IP67</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">เพลทยึดอุปกรณ์</label>
                  <select name="plateCount" value={customForm.plateCount} onChange={handleCustomChange} className={inputClass}>

                    <option value="1">1 ชั้น</option>
                    <option value="2">2 ชั้น</option>
                    <option value="3">3 ชั้น</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">รายละเอียดเพิ่มเติม</label>
                <textarea name="details" rows={3} placeholder="เช่น ต้องการช่องเดินสายเพิ่ม, สีพิเศษ, โลโก้บริษัท ฯลฯ" value={customForm.details} onChange={handleCustomChange} className={inputClass} />
              </div>

              <Button type="submit" className="w-full" disabled={customLoading}>

                {customLoading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Send size={16} className="mr-2" />}

                ส่งคำขอ Custom Cabinet
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <FooterCompact />
    </div>
  );
};

export default Cabinets;

