import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Cpu, Puzzle, Shield, Zap, Thermometer, Network, Cable, Battery, Radio, Download, ExternalLink, CheckCircle2, Layers } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import MiniNavbar from "@/components/MiniNavbar";
import FooterCompact from "@/components/FooterCompact";
import PartnerLogos from "@/components/PartnerLogos";
import B2BCTABanner from "@/components/B2BCTABanner";
import PriceDisclaimer from "@/components/PriceDisclaimer";
import AddToCartButton from "@/components/AddToCartButton";
import QuoteRequestButton from "@/components/QuoteRequestButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ProductDetailDialog from "@/components/ProductDetailDialog";

/* ───── LEGO MODE Capabilities ───── */
const legoCapabilities = [
  { icon: Cable, title: "Interfaces & Expansion", items: "RS232 / RS485 / DI / DO / USB / LAN / HDMI / VGA / TF / EDID" },
  { icon: Radio, title: "Communication & Wireless", items: "4G / 5G / CAN BUS / RFID" },
  { icon: Battery, title: "Power & Battery", items: "Wide voltage 9–36V / Redundant power / Battery module" },
  { icon: Shield, title: "System Security", items: "Watchdog timer / External pull switch" },
  { icon: Layers, title: "Integrated Functions", items: "Panel camera / RFID / Custom keys / Built-in speaker" },
  { icon: Thermometer, title: "Environmental", items: "Wide-temp design (-40°C ~ 80°C)" },
];

/* ───── Product Catalog (16 รุ่น) ───── */
type Model = {
  id: string;
  name: string;
  cpu: string;
  highlight: string;
  feature: string;
  image: string;
  datasheet: string;
  tag: "EPC" | "UPC" | "CTN";
  popular?: boolean;
};

const models: Model[] = [
  {
    id: "epc-102b",
    name: "EPC-102B",
    cpu: "12th Gen Intel® Core™",
    highlight: "Smart Fan • 4×LAN",
    feature: "เหมาะกับงาน Network Edge และ Gateway ที่ต้องการพอร์ต LAN หลายช่อง",
    image: "/upc-images/2025_12_EPC-102B.jpg",
    datasheet: "/upc-datasheets/2025_08_EPC-102B-EN-1.pdf",
    tag: "EPC",
    popular: true,
  },
  {
    id: "ctn-102c",
    name: "CTN-102C",
    cpu: "12th Gen Intel® Core™",
    highlight: "2×HDMI with EDID",
    feature: "Dual HDMI output รองรับ EDID emulation สำหรับงาน Digital Signage",
    image: "/upc-images/2025_12_EPC-102C.jpg",
    datasheet: "/upc-datasheets/2025_08_CTN-102C-EN.pdf",
    tag: "CTN",
  },
  {
    id: "epc-202b",
    name: "EPC-202B",
    cpu: "12th Gen Intel® Core™",
    highlight: "8× COM Port",
    feature: "Multi-serial port สำหรับงานควบคุมอุปกรณ์อุตสาหกรรมจำนวนมาก",
    image: "/upc-images/2025_12_WechatIMG3926.png",
    datasheet: "/upc-datasheets/2025_08_EPC-202B-EN.pdf",
    tag: "EPC",
    popular: true,
  },
  {
    id: "epc-207b",
    name: "EPC-207B",
    cpu: "Intel® Celeron® J6412",
    highlight: "DB37 Multi-Serial",
    feature: "Serial port ขยายผ่าน DB37 — ประหยัดพื้นที่ติดตั้ง",
    image: "/upc-images/2025_12_EPC-207B.jpg",
    datasheet: "/upc-datasheets/2025_08_EPC-207B-EN.pdf",
    tag: "EPC",
  },
  {
    id: "epc-309e",
    name: "EPC-309E",
    cpu: "10th Gen Intel® Core™",
    highlight: "4× Intel LAN",
    feature: "Quad Intel Ethernet สำหรับงาน Firewall / Routing / Edge Computing",
    image: "/upc-images/2025_12_EPC-309E.jpg",
    datasheet: "/upc-datasheets/2025_08_EPC-309E-EN.pdf",
    tag: "EPC",
  },
  {
    id: "epc-302b",
    name: "EPC-302B",
    cpu: "12th Gen Intel® Core™",
    highlight: "Smart Fan • 5×LAN",
    feature: "Performance สูง พร้อม 5 พอร์ต LAN สำหรับงาน Network-intensive",
    image: "/upc-images/2025_12_EPC-302B.jpg",
    datasheet: "/upc-datasheets/2025_08_UPC-302B-EN.pdf",
    tag: "EPC",
  },
  {
    id: "upc-302d",
    name: "UPC-302D",
    cpu: "12th Gen Intel® Core™",
    highlight: "9×USB • 2×LAN",
    feature: "Multi-USB สำหรับเชื่อมต่ออุปกรณ์ต่อพ่วงจำนวนมาก เช่น Scanner, Printer",
    image: "/upc-images/2025_12_UPC-302D.jpg",
    datasheet: "/upc-datasheets/2025_08_UPC-302D-EN.pdf",
    tag: "UPC",
    popular: true,
  },
  {
    id: "upc-108h",
    name: "UPC-108H",
    cpu: "7th Gen Intel® Core™",
    highlight: "Battery 4000mAh",
    feature: "มีแบตเตอรี่สำรองในตัว เหมาะกับงานที่ต้องการ UPS ฝังตัว",
    image: "/upc-images/2025_12_UPC-108H.jpg",
    datasheet: "/upc-datasheets/2025_08_UPC-108H-EN.pdf",
    tag: "UPC",
  },
  {
    id: "upc-206e",
    name: "UPC-206E",
    cpu: "Intel® Celeron® J1900",
    highlight: "CAN BUS",
    feature: "รองรับ CAN BUS สำหรับงานควบคุมยานยนต์และเครื่องจักรอุตสาหกรรม",
    image: "/upc-images/2025_12_UPC-206E.jpg",
    datasheet: "/upc-datasheets/2025_08_UPC-206E-EN.pdf",
    tag: "UPC",
  },
  {
    id: "upc-206f",
    name: "UPC-206F",
    cpu: "Intel® Celeron® J1900",
    highlight: "SIM / TF Card",
    feature: "รองรับ 4G SIM และ TF Card สำหรับงาน Mobile / Remote Site",
    image: "/upc-images/2025_12_UPC-206F.jpg",
    datasheet: "/upc-datasheets/2025_08_UPC-206F-EN.pdf",
    tag: "UPC",
  },
  {
    id: "upc-209b",
    name: "UPC-209B",
    cpu: "10th Gen Intel® Core™",
    highlight: "DI/DO • MOD BUS",
    feature: "4×Line in / 8×Line out + Modbus สำหรับ Factory Automation",
    image: "/upc-images/2025_12_UPC-209B.jpg",
    datasheet: "/upc-datasheets/2025_08_UPC-209B-EN.pdf",
    tag: "UPC",
  },
  {
    id: "upc-309c",
    name: "UPC-309C",
    cpu: "10th Gen Intel® Core™",
    highlight: "SIM / TF / 4G",
    feature: "Performance สูง พร้อม 4G สำหรับงาน Outdoor และ Telecom",
    image: "/upc-images/2025_12_UPC-309C.jpg",
    datasheet: "/upc-datasheets/2025_08_UPC-309C-EN.pdf",
    tag: "UPC",
  },
  {
    id: "upc-309r",
    name: "UPC-309R",
    cpu: "10th Gen Intel® Core™",
    highlight: "Redundant DC Power",
    feature: "ไฟเลี้ยงสำรองคู่ — เหมาะกับงาน Mission-critical ที่ห้ามดับ",
    image: "/upc-images/2025_12_UPC-309R.jpg",
    datasheet: "/upc-datasheets/2025_08_UPC-309R.pdf",
    tag: "UPC",
    popular: true,
  },
  {
    id: "upc-302f",
    name: "UPC-302F",
    cpu: "12th Gen Intel® Core™",
    highlight: "14×USB • 2×LAN",
    feature: "USB ขยายสูงสุดในซีรีส์ — สำหรับงาน Multi-device Hub",
    image: "/upc-images/2025_12_UPC-302D-1.jpg",
    datasheet: "/upc-datasheets/2025_08_UPC-302F-EN.pdf",
    tag: "UPC",
  },
  {
    id: "epc-302e",
    name: "EPC-302E",
    cpu: "12th Gen Intel® Core™",
    highlight: "5× Intel LAN",
    feature: "5 LAN ports + ประสิทธิภาพ Gen 12 สำหรับ Network Appliance",
    image: "/upc-images/2025_12_IMG_6256-1.jpg",
    datasheet: "/upc-datasheets/2025_09_EPC-302E-EN.pdf",
    tag: "EPC",
  },
  {
    id: "epc-302a",
    name: "EPC-302A",
    cpu: "12th Gen Intel® Core™",
    highlight: "GPIO 12V/24V",
    feature: "GPIO สำหรับงานควบคุม Sensor และ Actuator แบบ Embedded",
    image: "/upc-images/2025_10_IMG_7514.jpg",
    datasheet: "/upc-datasheets/2025_10_EPC-302A-EN.pdf",
    tag: "EPC",
  },
];

/* ───── Why Industrial Grade ───── */
const whyIndustrial = [
  {
    icon: Zap,
    title: "Fanless Design",
    desc: "ไม่มีพัดลมระบายความร้อน — ลดเสียงรบกวน ไม่มีชิ้นส่วนเคลื่อนไหว ลดความเสี่ยงเสียหาย",
  },
  {
    icon: Shield,
    title: "Industrial-grade Components",
    desc: "ชิ้นส่วนเกรดอุตสาหกรรม ทนอุณหภูมิสุดขั้ว สั่นสะเทือน ความชื้น และทำงาน 24/7",
  },
  {
    icon: Cpu,
    title: "CPU Compatible",
    desc: "รองรับ CPU หลากหลาย ตั้งแต่ Celeron ประหยัดพลังงาน ถึง Core i7 ประสิทธิภาพสูง",
  },
];

const trustBadges = [
  "Industrial-Grade Motherboard",
  "Factory-Direct Manufacturing",
  "0.5% Annual Failure Rate",
  "Tailored Solutions",
  "1 & 3-Year Warranties",
  "Certifications & Compliance",
];

const tagColor = (tag: Model["tag"]) => {
  switch (tag) {
    case "UPC": return "bg-primary/10 text-primary border-primary/30";
    case "EPC": return "bg-blue-500/10 text-blue-600 border-blue-500/30";
    case "CTN": return "bg-purple-500/10 text-purple-600 border-purple-500/30";
  }
};

const UPCSeries = () => {
  const [filter, setFilter] = useState<"all" | "UPC" | "EPC" | "CTN">("all");
  const [selected, setSelected] = useState<Model | null>(null);
  const filtered = filter === "all" ? models : models.filter(m => m.tag === filter);

  return (
    <>
      <SEOHead
        title="UPC Series — LEGO MODE Modular Industrial PC | 16 รุ่นพร้อมจัดส่ง"
        description="UPC / EPC / CTN Series — Fanless Industrial PC แบบ Modular LEGO MODE™ รองรับ Intel Gen 7-12, 4G/5G, CAN BUS, GPIO, Multi-LAN, Battery, Wide-temp -40~80°C"
        path="/upc-series"
        keywords="UPC Series, EPC Box PC, LEGO MODE, Fanless Industrial PC, Modular IPC, CAN BUS PC, Multi-LAN industrial computer"
      />
      <BreadcrumbJsonLd items={[
        { name: "Industrial PC", path: "/shop" },
        { name: "UPC Series", path: "/upc-series" },
      ]} />

      <MiniNavbar />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/95 via-primary to-primary/80 text-primary-foreground">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="container max-w-7xl mx-auto px-6 py-12 md:py-16 relative">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="bg-primary-foreground/15 text-primary-foreground border-primary-foreground/20 mb-3 backdrop-blur-sm">
                <Puzzle className="w-3 h-3 mr-1" /> LEGO MODE™ Modular Architecture
              </Badge>
              <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight mb-3">
                UPC Series
                <span className="block text-xl md:text-2xl font-normal text-primary-foreground/85 mt-2">
                  Fanless Industrial PC แบบ Modular ปรับแต่งได้
                </span>
              </h1>
              <p className="text-base md:text-lg text-primary-foreground/85 mb-5 leading-relaxed">
                สร้างบนแพลตฟอร์ม Industrial PC มาตรฐาน พร้อมเทคโนโลยี <strong>LEGO MODE™</strong> ที่ช่วยให้กำหนด
                Interface ได้คล่องตัว — ผ่าน <strong>i-Door</strong> และ <strong>Expansion Slot</strong> รองรับ
                CAN BUS, 5×LAN, 5G ลด Lead Time และต้นทุนการ Customize ปริมาณน้อย
              </p>
              <div className="flex flex-wrap gap-2">
                <QuoteRequestButton productName="UPC Series Industrial PC" />
                <Button asChild variant="outline" className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20">
                  <a href="#models">ดู 16 รุ่นทั้งหมด</a>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="/upc-images/2025_11_LEGO__________________.jpg"
                alt="UPC Series LEGO MODE Industrial PC"
                className="rounded-2xl shadow-2xl border border-primary-foreground/20"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-secondary/30 border-b border-border">
        <div className="container max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs md:text-sm text-muted-foreground">
            {trustBadges.map((b, i) => (
              <span key={i} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* LEGO Capabilities */}
      <section className="py-12 md:py-14">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <Badge variant="outline" className="mb-3">LEGO MODE™ Capabilities</Badge>
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">ฟังก์ชันที่ปรับแต่งได้</h2>
            <p className="text-muted-foreground">เลือก Module ที่ต้องการ ประกอบเป็นเครื่องที่ตรงกับงาน — ลดเวลา R&D และต้นทุน Customize</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {legoCapabilities.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <Card key={i} className="border-border hover:border-primary/40 hover:shadow-md transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{cap.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{cap.items}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Models Grid */}
      <section id="models" className="py-12 md:py-14 bg-secondary/20">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <Badge variant="outline" className="mb-2">Product Lineup</Badge>
              <h2 className="text-2xl md:text-3xl font-display font-bold">16 รุ่นในตระกูล UPC / EPC / CTN</h2>
              <p className="text-muted-foreground mt-1">เลือกตามฟังก์ชันหลักที่ต้องการ — Multi-LAN, COM Port, USB, GPIO, CAN BUS, Battery, Redundant Power</p>
            </div>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <TabsList>
                <TabsTrigger value="all">All ({models.length})</TabsTrigger>
                <TabsTrigger value="UPC">UPC</TabsTrigger>
                <TabsTrigger value="EPC">EPC</TabsTrigger>
                <TabsTrigger value="CTN">CTN</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((m) => (
              <Card key={m.id} className="group overflow-hidden border-border hover:border-primary/50 hover:shadow-lg transition-all flex flex-col">
                <button
                  type="button"
                  onClick={() => setSelected(m)}
                  className="relative bg-gradient-to-br from-secondary/40 to-background aspect-[4/3] flex items-center justify-center p-4 overflow-hidden text-left cursor-pointer"
                  aria-label={`ดูรายละเอียด ${m.name}`}
                >
                  <img
                    src={m.image}
                    alt={`${m.name} ${m.highlight}`}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <Badge variant="outline" className={`text-[10px] ${tagColor(m.tag)}`}>{m.tag}</Badge>
                    {m.popular && <Badge className="text-[10px] bg-primary text-primary-foreground border-0">Popular</Badge>}
                  </div>
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Badge className="text-[10px] bg-foreground text-background border-0">ดูรายละเอียด</Badge>
                  </div>
                </button>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <button type="button" onClick={() => setSelected(m)} className="text-left flex-1">
                    <h3 className="font-display font-bold text-lg text-foreground hover:text-primary transition-colors">{m.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.cpu}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      <Zap className="w-3.5 h-3.5" /> {m.highlight}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2">{m.feature}</p>
                  </button>
                  <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
                    <AddToCartButton
                      productModel={m.name}
                      productName={`${m.name} — ${m.highlight}`}
                      productDescription={`${m.cpu} • ${m.feature}`}
                      size="sm"
                      iconOnly
                      className="shrink-0"
                    />
                    <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => setSelected(m)}>
                      ดูสเปก
                    </Button>
                    <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs">
                      <a href={m.datasheet} target="_blank" rel="noreferrer" aria-label="Datasheet PDF">
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6"><PriceDisclaimer /></div>
        </div>
      </section>

      {/* Why Industrial-Grade */}
      <section className="py-12 md:py-14">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <Badge variant="outline" className="mb-3">What Makes Truly Industrial-Grade?</Badge>
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">ไม่ใช่แค่ติดป้าย "Industrial"</h2>
            <p className="text-muted-foreground">ออกแบบและทดสอบเข้มงวดให้ผ่านมาตรฐานอุตสาหกรรม พร้อมใช้งานในสภาพแวดล้อมที่โหดที่สุด</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {whyIndustrial.map((w, i) => {
              const Icon = w.icon;
              return (
                <div key={i} className="card-surface p-6 text-center hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">{w.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <PartnerLogos />

      <B2BCTABanner />

      <FooterCompact />

      <ProductDetailDialog
        open={!!selected}
        onOpenChange={(v) => !v && setSelected(null)}
        productId={selected?.id ?? null}
        productName={selected?.name}
        cpu={selected?.cpu}
        highlight={selected?.highlight}
        tag={selected?.tag}
        datasheet={selected?.datasheet}
        fallbackImage={selected?.image}
      />
    </>
  );
};

export default UPCSeries;
