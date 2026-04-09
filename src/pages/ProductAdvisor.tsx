import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Cpu, Monitor, Shield, Tablet, Wifi, Server, Factory, Droplets,
  ArrowRight, ArrowLeft, RotateCcw, CheckCircle2, Sparkles,
  Thermometer, HardDrive, Tv, Box, Zap, ChevronRight,
  Building2, Truck, Stethoscope, ShoppingCart, GraduationCap,
  Wrench, DollarSign, Layers, ExternalLink, Crosshair
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import FooterCompact from "@/components/FooterCompact";

/* ═══════ Product Database ═══════ */
interface Product {
  name: string;
  series: string;
  href: string;
  category: string;
  tags: string[];
  priceRange: "budget" | "mid" | "high" | "premium";
  environment: string[];
  useCases: string[];
  features: string[];
  description: string;
  highlight: string;
}

const products: Product[] = [
  {
    name: "GT1000 / GT1200",
    series: "GT Series",
    href: "/gt-series",
    category: "mini-pc",
    tags: ["fanless", "compact", "entry"],
    priceRange: "budget",
    environment: ["office", "retail", "light-industrial"],
    useCases: ["pos", "signage", "kiosk", "thin-client", "general"],
    features: ["fanless", "compact", "low-power"],
    description: "Mini PC Fanless ระดับเริ่มต้น เหมาะกับงาน POS, Digital Signage",
    highlight: "ราคาประหยัด เริ่มต้นง่าย",
  },
  {
    name: "GT2000 / GT3000",
    series: "GT Series",
    href: "/gt-series",
    category: "mini-pc",
    tags: ["fanless", "mid-range", "versatile"],
    priceRange: "mid",
    environment: ["office", "retail", "factory", "light-industrial"],
    useCases: ["pos", "signage", "automation", "edge-computing", "general"],
    features: ["fanless", "expandable", "multi-display"],
    description: "Mini PC Fanless กลางสาย มี COM Port / GPIO สำหรับงานอุตสาหกรรมเบา",
    highlight: "คุ้มค่า สมดุลทุกด้าน",
  },
  {
    name: "GT4000 / GT4500 / GT5000",
    series: "GT Series",
    href: "/gt-series",
    category: "mini-pc",
    tags: ["fanless", "high-performance", "industrial"],
    priceRange: "high",
    environment: ["factory", "warehouse", "outdoor-shelter"],
    useCases: ["automation", "machine-vision", "edge-computing", "scada"],
    features: ["fanless", "wide-temp", "expandable", "multi-lan", "gpio"],
    description: "Mini PC Fanless ระดับสูง รองรับงาน Factory Automation, Machine Vision",
    highlight: "สเปกแรง ทนทาน งานหนักได้",
  },
  {
    name: "GT6000 / GT7000 / GT8000 / GT9000",
    series: "GT Series",
    href: "/gt-series",
    category: "mini-pc",
    tags: ["fanless", "premium", "rugged", "edge-ai"],
    priceRange: "premium",
    environment: ["factory", "outdoor", "harsh", "marine"],
    useCases: ["edge-ai", "machine-vision", "deep-learning", "scada", "automation"],
    features: ["fanless", "wide-temp", "multi-lan", "pcie", "gpu-support", "gpio"],
    description: "Mini PC Fanless ระดับพรีเมียม GPU/PCIe สำหรับ Edge AI, Deep Learning",
    highlight: "ขุมพลัง AI ในกล่องเล็ก",
  },
  {
    name: "GB Series",
    series: "GB Series",
    href: "/gb-series",
    category: "mini-pc",
    tags: ["ultra-compact", "fanless", "din-rail"],
    priceRange: "mid",
    environment: ["factory", "cabinet", "light-industrial"],
    useCases: ["gateway", "iot", "data-collection", "protocol-conversion"],
    features: ["fanless", "din-rail", "compact", "low-power"],
    description: "Ultra-Compact Fanless PC ติดตั้งง่ายบน DIN Rail สำหรับงาน IoT Gateway",
    highlight: "เล็กจิ๋ว ติด DIN Rail ได้",
  },
  {
    name: "iBox Series",
    series: "iBox Series",
    href: "/ibox-series",
    category: "mini-pc",
    tags: ["fanless", "embedded", "versatile"],
    priceRange: "mid",
    environment: ["office", "factory", "retail"],
    useCases: ["embedded", "signage", "automation", "general"],
    features: ["fanless", "compact", "expandable"],
    description: "Embedded Box PC สำหรับงาน Embedded System ทั่วไป",
    highlight: "ยืดหยุ่น ปรับแต่งได้",
  },
  {
    name: "EPC Box Series",
    series: "EPC Box Series",
    href: "/epc-box-series",
    category: "mini-pc",
    tags: ["fanless", "edge", "ai"],
    priceRange: "high",
    environment: ["factory", "outdoor-shelter", "harsh"],
    useCases: ["edge-ai", "machine-vision", "automation"],
    features: ["fanless", "wide-temp", "gpu-support", "expandable"],
    description: "Edge PC แบบ Box รองรับ GPU Card สำหรับ Edge AI",
    highlight: "Box PC พร้อม GPU",
  },
  {
    name: "EPC Series",
    series: "EPC Series",
    href: "/epc-series",
    category: "panel-pc",
    tags: ["panel-pc", "rugged", "ip65", "industrial"],
    priceRange: "high",
    environment: ["factory", "outdoor", "harsh", "food-processing"],
    useCases: ["hmi", "automation", "scada", "machine-control"],
    features: ["touchscreen", "ip65", "wide-temp", "fanless"],
    description: "Panel PC เกรดอุตสาหกรรม IP65 สำหรับสายการผลิต",
    highlight: "Panel PC สุดแกร่ง IP65",
  },
  {
    name: "GK Series",
    series: "GK Series",
    href: "/gk-series",
    category: "panel-pc",
    tags: ["panel-pc", "all-in-one", "touch"],
    priceRange: "mid",
    environment: ["office", "retail", "factory", "light-industrial"],
    useCases: ["pos", "kiosk", "hmi", "signage"],
    features: ["touchscreen", "all-in-one", "fanless"],
    description: "All-in-One Panel PC จอสัมผัส เหมาะกับ POS, Kiosk, HMI",
    highlight: "All-in-One จอสัมผัส",
  },
  {
    name: "Panel PC GTG/GTY",
    series: "Panel PC GTG",
    href: "/panel-pc-gtg",
    category: "panel-pc",
    tags: ["panel-pc", "modular", "industrial"],
    priceRange: "high",
    environment: ["factory", "warehouse", "light-industrial"],
    useCases: ["hmi", "automation", "scada", "machine-control"],
    features: ["touchscreen", "modular", "multi-size", "fanless"],
    description: "Panel PC อุตสาหกรรม แยกชุด PC กับจอ เลือกขนาดได้",
    highlight: "Modular เลือกจอ+PC ได้",
  },
  {
    name: "UTC Series",
    series: "UTC Series",
    href: "/utc-series",
    category: "panel-pc",
    tags: ["panel-pc", "ultra-thin", "commercial"],
    priceRange: "mid",
    environment: ["office", "retail", "healthcare"],
    useCases: ["pos", "kiosk", "reception", "info-display"],
    features: ["touchscreen", "ultra-thin", "fanless", "poe"],
    description: "Ultra-Thin Panel PC สวยงาม เหมาะกับงาน Front-desk, Retail",
    highlight: "บางเฉียบ สวยทันสมัย",
  },
  {
    name: "Waterproof PC IP69K",
    series: "Waterproof PC",
    href: "/waterproof-pc",
    category: "panel-pc",
    tags: ["waterproof", "ip69k", "stainless", "food-grade"],
    priceRange: "premium",
    environment: ["food-processing", "cleanroom", "outdoor", "marine", "harsh"],
    useCases: ["food-processing", "pharmaceutical", "cleanroom", "washdown"],
    features: ["ip69k", "stainless-steel", "touchscreen", "fanless", "wide-temp"],
    description: "PC กันน้ำ IP69K สแตนเลส สำหรับอุตสาหกรรมอาหาร ห้องคลีนรูม",
    highlight: "กันน้ำ IP69K สแตนเลส",
  },
  {
    name: "Rugged Tablet",
    series: "Rugged Tablet",
    href: "/rugged-tablet",
    category: "rugged",
    tags: ["tablet", "rugged", "mobile", "mil-std"],
    priceRange: "high",
    environment: ["outdoor", "harsh", "factory", "field"],
    useCases: ["field-service", "logistics", "military", "inspection", "survey"],
    features: ["mil-std", "ip67", "sunlight-readable", "gps", "4g-5g", "barcode"],
    description: "แท็บเล็ตเกรดทหาร MIL-STD กันน้ำกันกระแทก",
    highlight: "ทหารใช้ได้ พกพาง่าย",
  },
  {
    name: "Smart Display & Kiosk",
    series: "Smart Display",
    href: "/smart-display",
    category: "display",
    tags: ["kiosk", "signage", "commercial-display"],
    priceRange: "mid",
    environment: ["retail", "office", "public-space"],
    useCases: ["signage", "kiosk", "wayfinding", "queue", "info-display"],
    features: ["touchscreen", "large-screen", "android", "cms"],
    description: "จอ Digital Signage, Kiosk ตั้งพื้น, Wayfinding",
    highlight: "จอ Kiosk ครบโซลูชัน",
  },
  {
    name: "Mini PC Firewall",
    series: "Mini PC Firewall",
    href: "/minipc-firewall",
    category: "network",
    tags: ["firewall", "router", "pfsense", "opnsense"],
    priceRange: "mid",
    environment: ["office", "datacenter", "smb"],
    useCases: ["firewall", "vpn", "router", "network-security"],
    features: ["multi-lan", "aes-ni", "fanless", "low-power"],
    description: "Mini PC สำหรับทำ Firewall/Router ด้วย pfSense, OPNsense",
    highlight: "Firewall สำเร็จรูป",
  },
  {
    name: "Volktek Network",
    series: "Volktek",
    href: "/volktek",
    category: "network",
    tags: ["switch", "network", "industrial-switch", "poe"],
    priceRange: "mid",
    environment: ["factory", "office", "outdoor"],
    useCases: ["network-infra", "ip-camera", "industrial-network"],
    features: ["managed-switch", "poe", "industrial-grade", "fiber"],
    description: "สวิตช์เครือข่ายอุตสาหกรรม Managed/Unmanaged, PoE",
    highlight: "สวิตช์เกรดอุตสาหกรรม",
  },
  {
    name: "vCloudPoint",
    series: "vCloudPoint",
    href: "/vcloudpoint",
    category: "thin-client",
    tags: ["zero-client", "vdi", "multi-user"],
    priceRange: "budget",
    environment: ["office", "school", "library", "call-center"],
    useCases: ["thin-client", "shared-pc", "classroom", "call-center"],
    features: ["zero-client", "multi-user", "low-cost", "energy-saving"],
    description: "Zero Client แชร์ PC 1 เครื่อง ใช้ได้หลายจอ ประหยัดงบ",
    highlight: "1 PC ใช้ได้ 30+ คน",
  },
  {
    name: "ตู้ Panel PC สำเร็จรูป",
    series: "Cabinets",
    href: "/cabinets",
    category: "cabinet",
    tags: ["cabinet", "enclosure", "turnkey"],
    priceRange: "high",
    environment: ["factory", "warehouse"],
    useCases: ["automation", "scada", "machine-control"],
    features: ["turnkey", "pre-assembled", "industrial-grade"],
    description: "ตู้ Panel PC สำเร็จรูป พร้อมติดตั้ง ครบจบในตู้เดียว",
    highlight: "Turnkey พร้อมใช้งาน",
  },
];

/* ═══════ Wizard Steps ═══════ */
interface StepOption {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface WizardStep {
  id: string;
  title: string;
  subtitle: string;
  options: StepOption[];
  multiple?: boolean;
}

const steps: WizardStep[] = [
  {
    id: "usage",
    title: "ใช้งานในลักษณะไหน?",
    subtitle: "เลือกประเภทการใช้งานหลักของคุณ",
    options: [
      { id: "automation", label: "โรงงาน / ระบบอัตโนมัติ", icon: Factory, description: "PLC, SCADA, HMI, Machine Vision" },
      { id: "pos-retail", label: "ค้าปลีก / POS / Kiosk", icon: ShoppingCart, description: "ร้านค้า, ห้าง, ซุปเปอร์มาร์เก็ต" },
      { id: "signage", label: "Digital Signage / Display", icon: Tv, description: "จอโฆษณา, ป้ายข้อมูล, Wayfinding" },
      { id: "field-mobile", label: "ภาคสนาม / เคลื่อนที่", icon: Truck, description: "สำรวจ, ขนส่ง, ภาคสนาม" },
      { id: "office-edu", label: "สำนักงาน / การศึกษา", icon: GraduationCap, description: "งานทั่วไป, Thin Client, ห้องเรียน" },
      { id: "network", label: "ระบบเครือข่าย / Firewall", icon: Wifi, description: "Firewall, Router, Network Switch" },
      { id: "edge-ai", label: "Edge AI / Deep Learning", icon: Sparkles, description: "AI Inference, Machine Learning, GPU Computing" },
      { id: "food-clean", label: "อาหาร / ห้องคลีนรูม", icon: Droplets, description: "ล้างน้ำได้, สแตนเลส, IP69K" },
    ],
  },
  {
    id: "environment",
    title: "สภาพแวดล้อมการใช้งาน?",
    subtitle: "เลือกสภาพที่เครื่องจะต้องทำงาน",
    options: [
      { id: "office", label: "ห้องแอร์ / สำนักงาน", icon: Building2, description: "อุณหภูมิปกติ สะอาด" },
      { id: "factory", label: "โรงงาน / สายการผลิต", icon: Factory, description: "ฝุ่น สั่นสะเทือน ร้อน" },
      { id: "outdoor", label: "กลางแจ้ง / ภาคสนาม", icon: Thermometer, description: "แดด ฝน ฝุ่น" },
      { id: "harsh", label: "สภาพรุนแรง / ทหาร", icon: Shield, description: "MIL-STD, กระแทก, สั่นสะเทือนหนัก" },
      { id: "food-processing", label: "อุตสาหกรรมอาหาร", icon: Droplets, description: "ล้างน้ำ IP69K, สแตนเลส" },
      { id: "cleanroom", label: "ห้องคลีนรูม / ยา", icon: Stethoscope, description: "ปลอดฝุ่น ปลอดเชื้อ" },
    ],
  },
  {
    id: "form-factor",
    title: "รูปแบบที่ต้องการ?",
    subtitle: "เลือกรูปร่างของอุปกรณ์",
    options: [
      { id: "box-pc", label: "Box PC (กล่อง)", icon: Box, description: "ติดตั้งยืดหยุ่น VESA, DIN Rail" },
      { id: "panel-pc", label: "Panel PC (จอสัมผัส)", icon: Monitor, description: "จอสัมผัสในตัว All-in-One" },
      { id: "tablet", label: "Tablet (พกพา)", icon: Tablet, description: "พกพาไปภาคสนาม" },
      { id: "kiosk", label: "Kiosk / จอตั้งพื้น", icon: Tv, description: "ตั้งพื้นหรือแขวนผนัง" },
      { id: "network-appliance", label: "Network Appliance", icon: Server, description: "Firewall, Router, Switch" },
      { id: "any", label: "ยังไม่แน่ใจ", icon: Layers, description: "ให้ระบบแนะนำ" },
    ],
  },
  {
    id: "budget",
    title: "งบประมาณโดยประมาณ?",
    subtitle: "ช่วยให้เราแนะนำรุ่นที่เหมาะสมกับงบ",
    options: [
      { id: "budget", label: "ประหยัด", icon: DollarSign, description: "เน้นคุ้มค่า ฟังก์ชันพื้นฐาน" },
      { id: "mid", label: "ปานกลาง", icon: DollarSign, description: "สมดุลราคา-สเปก" },
      { id: "high", label: "สูง", icon: DollarSign, description: "เน้นประสิทธิภาพ ทนทาน" },
      { id: "premium", label: "ไม่จำกัด / เกรดพรีเมียม", icon: Sparkles, description: "ดีที่สุด เต็มสเปก" },
    ],
  },
  {
    id: "features",
    title: "ฟีเจอร์ที่ต้องการ?",
    subtitle: "เลือกได้มากกว่า 1 ข้อ",
    multiple: true,
    options: [
      { id: "fanless", label: "Fanless (ไม่มีพัดลม)", icon: Zap, description: "เงียบ ไร้ฝุ่นเข้า" },
      { id: "touchscreen", label: "จอสัมผัส", icon: Monitor, description: "Touch Panel ในตัว" },
      { id: "wide-temp", label: "ทนอุณหภูมิสูง", icon: Thermometer, description: "-20°C ถึง 60°C" },
      { id: "ip65-plus", label: "กันน้ำกันฝุ่น", icon: Droplets, description: "IP65 / IP67 / IP69K" },
      { id: "gpu-support", label: "รองรับ GPU / AI", icon: Sparkles, description: "PCIe GPU Card" },
      { id: "multi-lan", label: "หลายพอร์ต LAN", icon: Wifi, description: "2-6 LAN Ports" },
      { id: "gpio-com", label: "GPIO / COM Port", icon: Wrench, description: "เชื่อมต่ออุปกรณ์เฉพาะทาง" },
      { id: "mobile-ready", label: "4G/5G / GPS", icon: Tablet, description: "ใช้งานเคลื่อนที่" },
    ],
  },
];

/* ═══════ Scoring Engine ═══════ */
function scoreProducts(answers: Record<string, string[]>): (Product & { score: number; reasons: string[] })[] {
  return products
    .map((p) => {
      let score = 0;
      const reasons: string[] = [];

      // Usage matching
      const usage = answers.usage || [];
      const usageMap: Record<string, string[]> = {
        "automation": ["automation", "scada", "machine-control", "hmi", "machine-vision"],
        "pos-retail": ["pos", "kiosk", "thin-client"],
        "signage": ["signage", "info-display", "wayfinding"],
        "field-mobile": ["field-service", "logistics", "military", "inspection", "survey"],
        "office-edu": ["general", "thin-client", "shared-pc", "classroom"],
        "network": ["firewall", "vpn", "router", "network-security", "network-infra"],
        "edge-ai": ["edge-ai", "deep-learning", "machine-vision", "edge-computing"],
        "food-clean": ["food-processing", "pharmaceutical", "cleanroom", "washdown"],
      };
      for (const u of usage) {
        const mapped = usageMap[u] || [];
        const matches = mapped.filter((m) => p.useCases.includes(m));
        if (matches.length > 0) {
          score += matches.length * 15;
          reasons.push(`ตรงกับการใช้งาน: ${p.useCases.filter(uc => mapped.includes(uc)).slice(0, 2).join(", ")}`);
        }
      }

      // Environment matching
      const env = answers.environment || [];
      for (const e of env) {
        if (p.environment.includes(e)) {
          score += 12;
          reasons.push(`รองรับสภาพแวดล้อม: ${e}`);
        }
      }

      // Form factor matching
      const form = answers["form-factor"] || [];
      const formMap: Record<string, string[]> = {
        "box-pc": ["mini-pc"],
        "panel-pc": ["panel-pc"],
        "tablet": ["rugged"],
        "kiosk": ["display"],
        "network-appliance": ["network"],
        "any": ["mini-pc", "panel-pc", "rugged", "display", "network", "thin-client", "cabinet"],
      };
      for (const f of form) {
        if ((formMap[f] || []).includes(p.category)) {
          score += 20;
          reasons.push(`รูปแบบตรงกัน: ${p.category}`);
        }
      }

      // Budget matching
      const budget = answers.budget || [];
      if (budget.length > 0) {
        const budgetOrder = ["budget", "mid", "high", "premium"];
        const userBudgetIdx = budgetOrder.indexOf(budget[0]);
        const productBudgetIdx = budgetOrder.indexOf(p.priceRange);
        if (userBudgetIdx >= 0 && productBudgetIdx >= 0) {
          const diff = Math.abs(userBudgetIdx - productBudgetIdx);
          if (diff === 0) { score += 15; reasons.push("งบประมาณพอดี"); }
          else if (diff === 1) { score += 8; }
          else if (userBudgetIdx === 3) { score += 10; } // premium = ไม่จำกัด
        }
      }

      // Feature matching
      const feats = answers.features || [];
      const featMap: Record<string, string[]> = {
        "fanless": ["fanless"],
        "touchscreen": ["touchscreen"],
        "wide-temp": ["wide-temp"],
        "ip65-plus": ["ip65", "ip67", "ip69k"],
        "gpu-support": ["gpu-support", "pcie"],
        "multi-lan": ["multi-lan"],
        "gpio-com": ["gpio"],
        "mobile-ready": ["4g-5g", "gps"],
      };
      for (const f of feats) {
        const mapped = featMap[f] || [];
        if (mapped.some((m) => p.features.includes(m))) {
          score += 10;
          reasons.push(`มีฟีเจอร์: ${f}`);
        }
      }

      // De-duplicate reasons
      const uniqueReasons = [...new Set(reasons)].slice(0, 3);

      return { ...p, score, reasons: uniqueReasons };
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score);
}

/* ═══════ Components ═══════ */
const ProgressBar = ({ current, total }: { current: number; total: number }) => (
  <div className="w-full max-w-md mx-auto mb-8">
    <div className="flex justify-between text-xs text-muted-foreground mb-2">
      <span>ขั้นตอนที่ {current + 1} / {total}</span>
      <span>{Math.round(((current + 1) / total) * 100)}%</span>
    </div>
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
        style={{ width: `${((current + 1) / total) * 100}%` }}
      />
    </div>
  </div>
);

const OptionCard = ({
  option,
  selected,
  onClick,
}: {
  option: StepOption;
  selected: boolean;
  onClick: () => void;
}) => {
  const Icon = option.icon;
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all duration-200 text-center
        ${selected
          ? "border-primary bg-primary/10 shadow-lg shadow-primary/10 scale-[1.02]"
          : "border-border hover:border-primary/40 hover:bg-accent/50"
        }`}
    >
      {selected && (
        <div className="absolute top-2 right-2">
          <CheckCircle2 size={18} className="text-primary" />
        </div>
      )}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
        ${selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"}`}>
        <Icon size={22} />
      </div>
      <h3 className="font-semibold text-sm text-foreground">{option.label}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{option.description}</p>
    </button>
  );
};

const ResultCard = ({
  product,
  rank,
}: {
  product: Product & { score: number; reasons: string[] };
  rank: number;
}) => {
  const priceLabels: Record<string, string> = {
    budget: "ประหยัด",
    mid: "ปานกลาง",
    high: "สูง",
    premium: "พรีเมียม",
  };
  
  return (
    <div className={`relative rounded-xl border p-5 transition-all hover:shadow-lg
      ${rank === 1 ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/30"}`}>
      {rank <= 3 && (
        <div className={`absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-bold
          ${rank === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          {rank === 1 ? "แนะนำอันดับ 1" : `#${rank}`}
        </div>
      )}
      <div className="mt-2">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="font-bold text-lg text-foreground">{product.name}</h3>
            <p className="text-xs text-muted-foreground">{product.series}</p>
          </div>
          <Badge variant="secondary" className="shrink-0 text-xs">{priceLabels[product.priceRange]}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
        
        {/* Match score bar */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-foreground">ความเหมาะสม</span>
            <span className="text-xs font-bold text-primary">{Math.min(product.score, 100)}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${Math.min(product.score, 100)}%` }} />
          </div>
        </div>

        {/* Reasons */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.reasons.map((r, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent text-accent-foreground text-[10px]">
              <CheckCircle2 size={10} /> {r}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <Link
            to={product.href}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            ดูรายละเอียด <ChevronRight size={14} />
          </Link>
          <Link
            to="/quote"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/10 transition-colors"
          >
            ขอใบเสนอราคา
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ═══════ Main Page ═══════ */
const ProductAdvisor = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [showResults, setShowResults] = useState(false);

  const step = steps[currentStep];

  const toggleAnswer = (stepId: string, optionId: string, multiple: boolean) => {
    setAnswers((prev) => {
      const current = prev[stepId] || [];
      if (multiple) {
        return { ...prev, [stepId]: current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId] };
      }
      return { ...prev, [stepId]: [optionId] };
    });
  };

  const canProceed = (answers[step?.id] || []).length > 0;

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setShowResults(true);
    }
  };

  const goBack = () => {
    if (showResults) {
      setShowResults(false);
    } else if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
  };

  const results = useMemo(() => scoreProducts(answers), [answers]);

  return (
    <>
      <Helmet>
        <title>ตัวช่วยเลือกสินค้า | ENT Group — Smart Product Advisor</title>
        <meta name="description" content="ระบบ AI ช่วยเลือกสินค้า Industrial PC, Panel PC, Rugged Tablet ที่เหมาะกับการใช้งานและงบประมาณของคุณ" />
      </Helmet>

      <main className="min-h-screen bg-background flex flex-col">
        {/* Back button */}
        <div className="px-4 pt-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> กลับหน้าแรก
          </Link>
        </div>

        {/* Hero */}
        <section className="relative py-12 md:py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
          <div className="container max-w-4xl mx-auto text-center relative z-10">
            <Badge variant="secondary" className="mb-4 gap-1.5 block w-fit mx-auto">
              <Sparkles size={12} /> Smart Product Advisor
            </Badge>
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
              ค้นหา<span className="text-gradient"> สินค้าที่ใช่ </span>ให้คุณ
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              ตอบคำถามง่ายๆ 5 ข้อ แล้วระบบจะแนะนำสินค้าที่เหมาะสมที่สุดกับงานและงบประมาณของคุณ
            </p>
          </div>
        </section>

        {/* Wizard / Results */}
        <section className="pb-20 px-4">
          <div className="container max-w-4xl mx-auto">
            {!showResults ? (
              <>
                <ProgressBar current={currentStep} total={steps.length} />

                {/* Step Content */}
                <div className="text-center mb-8">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">{step.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {step.subtitle}
                    {step.multiple && <span className="ml-1 text-primary font-medium">(เลือกได้หลายข้อ)</span>}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
                  {step.options.map((opt) => (
                    <OptionCard
                      key={opt.id}
                      option={opt}
                      selected={(answers[step.id] || []).includes(opt.id)}
                      onClick={() => toggleAnswer(step.id, opt.id, !!step.multiple)}
                    />
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between max-w-md mx-auto">
                  <Button variant="ghost" onClick={goBack} disabled={currentStep === 0} className="gap-1.5">
                    <ArrowLeft size={16} /> ย้อนกลับ
                  </Button>
                  <Button onClick={goNext} disabled={!canProceed} className="gap-1.5">
                    {currentStep === steps.length - 1 ? "ดูผลลัพธ์" : "ถัดไป"} <ArrowRight size={16} />
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Results */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    <Crosshair className="inline w-5 h-5 mr-1 text-primary" /> สินค้าที่เหมาะกับคุณ
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    พบ {results.length} รุ่นที่ตรงกับความต้องการ เรียงตามความเหมาะสม
                  </p>
                </div>

                {/* NVIDIA Jetson Banner for Edge AI */}
                {(answers.usage || []).includes("edge-ai") && (
                  <div className="mb-8 rounded-xl border-2 border-green-500/30 bg-gradient-to-r from-green-500/10 via-green-500/5 to-transparent p-5 md:p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
                        <Sparkles className="w-6 h-6 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground text-base mb-1">
                          <Zap className="inline w-4 h-4 mr-1" /> สนใจ Edge AI / Deep Learning?
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          นอกจากสินค้าด้านล่างแล้ว เรายังมี <strong className="text-foreground">NVIDIA Jetson Platform</strong> — 
                          GPU Edge Computing สำหรับงาน AI Inference, Computer Vision, Robotics และ Deep Learning 
                          ที่เว็บไซต์เฉพาะทางของเราอีกด้วย
                        </p>
                        <a
                          href="https://nvidia-jetson.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
                        >
                          ดู NVIDIA Jetson ทั้งหมด <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {results.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 mb-8">
                    {results.slice(0, 6).map((product, i) => (
                      <ResultCard key={product.name} product={product} rank={i + 1} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">ไม่พบสินค้าที่ตรงกับเงื่อนไขทั้งหมด</p>
                    <Button onClick={reset} variant="outline" className="gap-1.5">
                      <RotateCcw size={14} /> ลองใหม่อีกครั้ง
                    </Button>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Button variant="ghost" onClick={goBack} className="gap-1.5">
                    <ArrowLeft size={16} /> แก้ไขคำตอบ
                  </Button>
                  <Button variant="outline" onClick={reset} className="gap-1.5">
                    <RotateCcw size={14} /> เริ่มใหม่
                  </Button>
                  <Link to="/contact">
                    <Button className="gap-1.5">
                      ปรึกษาผู้เชี่ยวชาญ <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <FooterCompact />
    </>
  );
};

export default ProductAdvisor;
