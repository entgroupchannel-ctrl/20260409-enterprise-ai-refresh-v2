import { useState, useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import ProductJsonLd from "@/components/ProductJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Cpu, Thermometer, Wind, Shield, Zap, Server, Layers, Settings, Box, Maximize, ChevronDown, Monitor, HardDrive, Wifi, Power, PlugZap, Expand, Filter, SlidersHorizontal, DollarSign, BarChart3, Play, Headphones, Volume2, Pause } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/logo-entgroup.avif";
import FooterCompact from "@/components/FooterCompact";
import PriceDisclaimer from "@/components/PriceDisclaimer";
import { LineQRDialog } from "@/components/LineQRDialog";

const features = [
  { icon: Wind, title: "Fanless Design", desc: "เงียบสนิท ไม่มีชิ้นส่วนเคลื่อนไหว อายุการใช้งานยาวนาน" },
  { icon: Layers, title: "LEGO Mode Design", desc: "ระบบโมดูลาร์ ปรับแต่งและขยายระบบได้ตามใจ ไม่ต้องเปลี่ยนเครื่องใหม่" },
  { icon: Shield, title: "Industrial-Grade จริง", desc: "ออกแบบ ทดสอบ และรับรองมาตรฐานสำหรับโรงงานจริง" },
  { icon: Thermometer, title: "ทำงาน 24/7", desc: "ทนทุกสภาพแวดล้อม ฝุ่น ความร้อน การสั่นสะเทือน MTBF 60,000 ชั่วโมง" },
];

const certifications = [
  { icon: Settings, text: "วิศวกรรมเฉพาะทาง: ออกแบบเพื่อสภาพแวดล้อมโรงงานโดยตรง", color: "text-emerald-500" },
  { icon: Shield, text: "ทดสอบเข้มงวด: ผ่านการทดสอบในสภาวะจริงหลากหลายรูปแบบ", color: "text-sky-500" },
  { icon: Zap, text: "รับรองมาตรฐาน: ได้รับการรับรองสำหรับการทำงานที่เชื่อถือได้", color: "text-amber-500" },
  { icon: Server, text: "พิสูจน์ในสนาม: ใช้งานจริงในโรงงานทั่วโลก", color: "text-purple-500" },
];

// Shared spec table structure
const sharedSpecs = {
  cpu: [
    "Intel® Celeron® Processor J1900 2.0~2.42GHz",
    "Intel® Celeron® Processor J6412 2.0~2.6GHz",
    "Intel® Core™ 10th i3-10110U 2.1~4.1GHz",
    "Intel® Core™ 10th i5-10210U 1.6~4.2GHz",
    "Intel® Core™ 10th i7-10710U 1.1~4.7GHz",
    "Intel® Core™ 12th i3-1215U 1.2~4.4GHz",
    "Intel® Core™ 12th i5-1235U 1.3~4.4GHz",
    "Intel® Core™ 12th i5-1240P 1.7~4.4GHz",
    "Intel® Core™ 12th i7-1255U 1.7~4.7GHz",
  ],
  memory: "4~8GB DDR3L / 4~32GB DDR4 / 4~32GB DDR5",
  storage: "1 × mSATA SSD",
  cooling: "Fan-less",
  os: "Windows 10/11 / Linux Ubuntu",
  display: "1×HDMI + 1×VGA Dual Display",
  audio: "1×Audio",
  expansion: "1×Mini PCIe Socket",
  ethernet: "2×10M/100M/1000M Intel I210 LAN",
  wireless: "4G Full Network Compatibility (Optional)",
  wifi: "Wi-Fi / Bluetooth",
  power: "1×3-pin Pluggable Terminal Block for 12V DC, 9-36V optional",
  booting: "AT / ATX",
};

// Product selection data for each series
const productSelection10XA = [
  { no: 1, model: "EPC-106A", partNo: "C10.01.01.001", cpu: "Intel® Celeron® J1900", memory: "4GB", storage: "mSATA SSD 128GB" },
  { no: 2, model: "EPC-107A", partNo: "C10.01.05.001", cpu: "Intel® Celeron® J6412", memory: "8GB", storage: "mSATA SSD 256GB" },
  { no: 3, model: "EPC-109A", partNo: "C10.01.03.001", cpu: "Intel® Core™ i3-10110U", memory: "8GB", storage: "mSATA SSD 256GB" },
  { no: 4, model: "EPC-109A", partNo: "C10.01.03.002", cpu: "Intel® Core™ i5-10210U", memory: "8GB", storage: "mSATA SSD 256GB" },
  { no: 5, model: "EPC-109A", partNo: "C10.01.03.003", cpu: "Intel® Core™ i7-10710U", memory: "8GB", storage: "mSATA SSD 256GB" },
  { no: 6, model: "EPC-102A", partNo: "C10.01.04.001", cpu: "Intel® Core™ i3-1215U", memory: "8GB", storage: "mSATA SSD 256GB" },
  { no: 7, model: "EPC-102A", partNo: "C10.01.04.002", cpu: "Intel® Core™ i5-1235U", memory: "8GB", storage: "mSATA SSD 256GB" },
  { no: 8, model: "EPC-102A", partNo: "C10.01.04.003", cpu: "Intel® Core™ i5-1240P", memory: "8GB", storage: "mSATA SSD 256GB" },
  { no: 9, model: "EPC-102A", partNo: "C10.01.04.004", cpu: "Intel® Core™ i7-1255U", memory: "8GB", storage: "mSATA SSD 256GB" },
];

const productSelection20XA = [
  { no: 1, model: "EPC-206A", partNo: "C10.02.01.001", cpu: "Intel® Celeron® J1900", memory: "4GB", storage: "mSATA SSD 128GB" },
  { no: 2, model: "EPC-207A", partNo: "C10.02.05.001", cpu: "Intel® Celeron® J6412", memory: "8GB", storage: "mSATA SSD 256GB" },
  { no: 3, model: "EPC-209A", partNo: "C10.02.03.001", cpu: "Intel® Core™ i3-10110U", memory: "8GB", storage: "mSATA SSD 256GB" },
  { no: 4, model: "EPC-209A", partNo: "C10.02.03.002", cpu: "Intel® Core™ i5-10210U", memory: "8GB", storage: "mSATA SSD 256GB" },
  { no: 5, model: "EPC-209A", partNo: "C10.02.03.003", cpu: "Intel® Core™ i7-10710U", memory: "8GB", storage: "mSATA SSD 256GB" },
  { no: 6, model: "EPC-202A", partNo: "C10.02.04.001", cpu: "Intel® Core™ i3-1215U", memory: "8GB", storage: "mSATA SSD 256GB" },
  { no: 7, model: "EPC-202A", partNo: "C10.02.04.002", cpu: "Intel® Core™ i5-1235U", memory: "8GB", storage: "mSATA SSD 256GB" },
  { no: 8, model: "EPC-202A", partNo: "C10.02.04.003", cpu: "Intel® Core™ i5-1240P", memory: "8GB", storage: "mSATA SSD 256GB" },
  { no: 9, model: "EPC-202A", partNo: "C10.02.04.004", cpu: "Intel® Core™ i7-1255U", memory: "8GB", storage: "mSATA SSD 256GB" },
];

const productSelection30XA = [
  { no: 1, model: "EPC-306A", partNo: "C10.03.01.001", cpu: "Intel® Celeron® J1900", memory: "4GB", storage: "mSATA SSD 128GB" },
  { no: 2, model: "EPC-307A", partNo: "C10.03.04.001", cpu: "Intel® Celeron® J6412", memory: "8GB", storage: "mSATA SSD 256GB" },
  { no: 3, model: "EPC-309A", partNo: "C10.03.03.001", cpu: "Intel® Core™ i3-10110U", memory: "8GB", storage: "mSATA SSD 256GB" },
  { no: 4, model: "EPC-309A", partNo: "C10.03.03.002", cpu: "Intel® Core™ i5-10210U", memory: "8GB", storage: "mSATA SSD 256GB" },
  { no: 5, model: "EPC-309A", partNo: "C10.03.03.003", cpu: "Intel® Core™ i7-10710U", memory: "8GB", storage: "mSATA SSD 256GB" },
  { no: 6, model: "EPC-302A", partNo: "C10.03.04.001", cpu: "Intel® Core™ i3-1215U", memory: "8GB", storage: "mSATA SSD 256GB" },
  { no: 7, model: "EPC-302A", partNo: "C10.03.04.002", cpu: "Intel® Core™ i5-1235U", memory: "8GB", storage: "mSATA SSD 256GB" },
  { no: 8, model: "EPC-302A", partNo: "C10.03.04.003", cpu: "Intel® Core™ i5-1240P", memory: "8GB", storage: "mSATA SSD 256GB" },
  { no: 9, model: "EPC-302A", partNo: "C10.03.04.004", cpu: "Intel® Core™ i7-1255U", memory: "8GB", storage: "mSATA SSD 256GB" },
];

interface SeriesData {
  id: string;
  name: string;
  tagline: string;
  taglineEn: string;
  desc: string;
  image: string;
  datasheetUrl: string;
  comPorts: string;
  usbPorts: { usb2: string; usb3: string };
  dimensions?: string;
  highlight: string;
  badge?: boolean;
  gallery?: string[];
  features: { title: string; titleEn: string; points: string[] }[];
  productSelection: typeof productSelection10XA;
  applications: string[];
}

const epcSeries: SeriesData[] = [
  {
    id: "10xa",
    name: "EPC-10XA Series",
    tagline: "Compact & Affordable",
    taglineEn: "Entry-Level Industrial PC",
    desc: "คอมพิวเตอร์อุตสาหกรรมระดับเริ่มต้นที่ไม่ธรรมดา เงียบจริง ทนจริง ด้วยเทคโนโลยี Fanless — ยืดหยุ่นสุดขีดด้วยระบบ LEGO MODE โครงสร้างอลูมิเนียม 200mm แกร่งกว่าที่คิด",
    image: "/images/wix/0597a3_e66a5a6616b64254a920d2c6f05b93f8_48ed79f4.png",
    datasheetUrl: "/datasheets/0597a3_7c5d5ac786764ef2b4fd3910060c41b6.pdf",
    comPorts: "2×RS232 + 1×RS485 DB9",
    usbPorts: { usb2: "5×USB2.0 / 2×USB2.0", usb3: "1×USB3.0 / 4×USB3.0" },
    dimensions: "200mm compact",
    highlight: "เริ่มต้น",
    gallery: [
      "/images/wix/0597a3_4681e86fee384a13953cfc1477fe4eeb_5458d060.png",
      "/images/wix/0597a3_7043dbbbf77841f599d56ca8bd1c8eeb_bcb7f419.png",
      "/images/wix/0597a3_a33086dc821449789942597ff318195f_62e6f2fd.png",
    ],
    features: [
      {
        title: "Fanless ออกแบบแบบไร้พัดลม",
        titleEn: "Silent & Reliable",
        points: ["เงียบสนิท ไม่มีชิ้นส่วนเคลื่อนไหวที่จะเสียหาย", "อายุการใช้งานที่ยาวนานกว่าเดิม"],
      },
      {
        title: "ยืดหยุ่นสุดขีดด้วย LEGO MODE",
        titleEn: "Modular Flexibility",
        points: ["ปรับแต่งและขยายระบบได้ตามใจ", "ไม่ต้องเปลี่ยนเครื่องใหม่ทั้งหมด"],
      },
      {
        title: "พลังประมวลผลที่เลือกได้",
        titleEn: "Scalable Performance",
        points: ["Celeron J1900/J6412 ประหยัดไฟ", "Intel Core 10th/12th Gen สมรรถนะสูง"],
      },
      {
        title: "โครงสร้างอลูมิเนียม 200mm",
        titleEn: "Robust Chassis",
        points: ["แข็งแกร่งทนทานสภาพแวดล้อมอุตสาหกรรมหนัก", "มีระดับป้องกันสูง"],
      },
    ],
    productSelection: productSelection10XA,
    applications: ["ระบบควบคุมอัตโนมัติ (Automation Control)", "การประมวลผลริมขอบ (Edge Computing)", "งานที่ต้องการความน่าเชื่อถือสูง"],
  },
  {
    id: "20xa",
    name: "EPC-20XA Series",
    tagline: "Enhanced Expansion",
    taglineEn: "Enhanced Expansion Design",
    desc: "ความสูงเพิ่มจาก 47mm เป็น 79mm (+68% พื้นที่) พื้นที่ภายในมากขึ้นรองรับการขยายและระบายความร้อนดีขึ้น เหมาะกับ CPU ประสิทธิภาพสูง ทำงาน 24/7 ในโรงงานได้มั่นใจ",
    image: "/images/wix/0597a3_373c66cd76674aafb9d631325e3e3a26_258223ef.png",
    datasheetUrl: "/datasheets/0597a3_88901736999d4c28bf68d683143988c3.pdf",
    comPorts: "2×RS232 + 1×RS485 DB9",
    usbPorts: { usb2: "5×USB2.0 / 2×USB2.0", usb3: "1×USB3.0 / 4×USB3.0" },
    dimensions: "79mm height (+68%)",
    highlight: "ขยายได้",
    features: [
      {
        title: "Enhanced Expansion Design",
        titleEn: "การขยายตัวที่ดีขึ้น",
        points: ["ความสูงเพิ่มขึ้น: จาก 47mm เป็น 79mm (+68% พื้นที่)", "พื้นที่ภายในมากขึ้น: รองรับการขยายและระบายความร้อนดีขึ้น", "เหมาะสำหรับอุปกรณ์เสริมและโมดูลเพิ่มเติม"],
      },
      {
        title: "Superior Thermal Management",
        titleEn: "การระบายความร้อนที่เหนือกว่า",
        points: ["Cooling Space เพิ่มขึ้น: รองรับ CPU ประสิทธิภาพสูง", "Stable Operation: ทำงานต่อเนื่องในสภาพแวดล้อมหนัก", "High-Performance Ready: เหมาะกับ Core i5/i7 รุ่นใหม่"],
      },
      {
        title: "Professional Grade Applications",
        titleEn: "ระดับมืออาชีพ",
        points: ["Complex Industrial Control: ระบบควบคุมที่ซับซ้อน", "Multi-Device Connectivity: เชื่อมต่ออุปกรณ์หลายตัวพร้อมกัน", "Extended Operating Hours: ทำงาน 24/7 ได้มั่นใจ"],
      },
    ],
    productSelection: productSelection20XA,
    applications: ["Complex Industrial Control", "Multi-Device Connectivity", "24/7 Heavy-Duty Operation"],
  },
  {
    id: "30xa",
    name: "EPC-30XA Series",
    tagline: "Wider Form Factor",
    taglineEn: "Wider Form Factor Design",
    desc: "กว้าง 337mm (+47% จาก EPC-20XA) ความสูงเพียง 47.5mm (บางกว่า EPC-20XA) — ครีบระบายความร้อนขนาดใหญ่พิเศษ เหมาะกับ Rack Mount และ Panel Mount",
    image: "/images/wix/0597a3_66f688e771804493b4e10e4daf7dd19a_e2ade35a.png",
    datasheetUrl: "/datasheets/0597a3_95fc75ebfd0641c6be57dc1491e93f43.pdf",
    comPorts: "4×RS232 + 2×RS485 DB9",
    usbPorts: { usb2: "5×USB2.0 / 2×USB2.0", usb3: "1×USB3.0 / 4×USB3.0" },
    dimensions: "337mm wide, Low Profile 47.5mm",
    highlight: "Rack Mount",
    gallery: [
      "/images/wix/0597a3_58406a7c4f4f4150ae07b2d6376366b0_04bc328f.png",
      "/images/wix/0597a3_0367da74dfe34d24971aeda0f990b9a2_cf347c22.png",
      "/images/wix/0597a3_722adc2902d94e0aa1c6d285e63a01b5_3456525d.png",
    ],
    features: [
      {
        title: "Wider Form Factor Design",
        titleEn: "รูปทรงกว้างเพื่อประสิทธิภาพ",
        points: ["ความกว้าง: 337mm (+47% จาก EPC-20XA)", "Low Profile: ความสูงเพียง 47.5mm", "พื้นที่ระบายความร้อนเพิ่มขึ้นอย่างมีนัยสำคัญ"],
      },
      {
        title: "Superior Thermal Performance",
        titleEn: "การระบายความร้อนเหนือชั้น",
        points: ["Larger Heat Dissipation Surface", "Extended Cooling Fins ขนาดใหญ่พิเศษ", "รองรับ Core i5/i7 12th Gen ได้เต็มประสิทธิภาพ"],
      },
      {
        title: "Professional Installation Flexibility",
        titleEn: "ความยืดหยุ่นในการติดตั้ง",
        points: ["Rack Mount Friendly", "Panel Mount Options: cutout 327×100mm", "Industrial Cabinet Integration"],
      },
      {
        title: "Enhanced Stability",
        titleEn: "ความเสถียรที่เหนือกว่า",
        points: ["Better Weight Distribution", "Reduced Vibration Impact", "MTBF 60,000 ชั่วโมง"],
      },
    ],
    productSelection: productSelection30XA,
    applications: ["Rack Mount Systems", "Panel Mount Installations", "Industrial Cabinet Integration"],
  },
  {
    id: "40xa",
    name: "EPC-40XA Series",
    tagline: "Flagship Model",
    taglineEn: "รุ่นเรือธงของซีรีส์",
    desc: "Maximum Form Factor: 337×160×79.5mm (ใหญ่ที่สุดในซีรีส์) รวมจุดเด่นของ EPC-20XA (สูง) + EPC-30XA (กว้าง) — พื้นผิวระบายความร้อน +168% จาก EPC-10XA พร้อมสำหรับงานวิกฤต",
    image: "/images/wix/0597a3_97f200930e3047dc887b96a9e8c48203_bc6a9156.png",
    datasheetUrl: "/datasheets/0597a3_d306bb34abe6432eba8b356ecbe755e1.pdf",
    comPorts: "4×RS232 + 2×RS485 DB9",
    usbPorts: { usb2: "5×USB2.0 / 2×USB2.0", usb3: "1×USB3.0 / 4×USB3.0" },
    dimensions: "337×160×79.5mm Flagship",
    highlight: "Flagship",
    badge: true,
    features: [
      {
        title: "Flagship Model",
        titleEn: "รุ่นเรือธงของซีรีส์",
        points: ["Maximum Form Factor: 337×160×79.5mm", "Best of Both Worlds: EPC-20XA (สูง) + EPC-30XA (กว้าง)", "Ultimate Performance Platform"],
      },
      {
        title: "Maximum Thermal Excellence",
        titleEn: "ระบายความร้อนสูงสุด",
        points: ["Largest Heat Dissipation Area (+168% จาก EPC-10XA)", "Optimized Thermal Channels", "Extreme Performance Ready"],
      },
      {
        title: "Ultimate Expansion & Stability",
        titleEn: "ขยายและเสถียรสูงสุด",
        points: ["Maximum Internal Space สำหรับโมดูลเสริม", "Enhanced Mechanical Robustness", "Superior Vibration Resistance"],
      },
      {
        title: "Mission-Critical Ready",
        titleEn: "พร้อมสำหรับงานวิกฤต",
        points: ["24/7 Heavy-Duty Operation ทำงานหนักต่อเนื่อง", "Extreme Environment Capable", "Maximum Reliability: MTBF 60,000 ชั่วโมง"],
      },
    ],
    productSelection: [], // Same as 30XA models with 4xx naming
    applications: ["24/7 Heavy-Duty Operation", "Mission-Critical Systems", "Extreme Environment"],
  },
];

const priceList = [
  { no: 1, model: "EPC-106A / EPC-206A", spec: "J1900/4G RAM/128G SSD/12V DC", price: "14,990" },
  { no: 2, model: "EPC-107A / EPC-207A", spec: "J6412/4G RAM/128G SSD/12V DC", price: "13,990" },
  { no: 3, model: "EPC-109A / EPC-209A", spec: "i3-10110U/4G RAM/128G SSD/12V DC", price: "30,990" },
  { no: 4, model: "EPC-109A / EPC-209A", spec: "i5-10210U/4G RAM/128G SSD/12V DC", price: "36,990" },
  { no: 5, model: "EPC-109A / EPC-209A", spec: "i7-10510U/4G RAM/128G SSD/12V DC", price: "39,990" },
  { no: 6, model: "EPC-102A / EPC-202A", spec: "i3-1215U/4G RAM/128G SSD/12V DC", price: "30,990" },
  { no: 7, model: "EPC-102A / EPC-202A", spec: "i5-1235U/4G RAM/128G SSD/12V DC", price: "35,990" },
  { no: 8, model: "EPC-102A / EPC-202A", spec: "i7-1250U/4G RAM/128G SSD/12V DC", price: "39,990" },
];

const windowsOptions = [
  { no: 1, product: "Windows 10 Pro OEM", price: "฿3,950" },
  { no: 2, product: "Windows 11 Pro OEM", price: "฿4,590" },
  { no: 3, product: "Windows 10 IOT", price: "฿3,950" },
  { no: 4, product: "Windows 11 IOT", price: "฿4,590" },
  { no: 5, product: "Upgrade จาก Wifi ABGN/AC > Wifi6", price: "Call" },
  { no: 6, product: "4G Sim Card", price: "Call" },
  { no: 7, product: "5G Sim Card", price: "Call" },
  { no: 8, product: "ซื้อประกันเพิ่ม ปีที่ 2", price: "15%" },
  { no: 9, product: "ซื้อประกันเพิ่ม ปีที่ 3", price: "20%" },
];

// Spec Table Component
const SpecTable = ({ series }: { series: SeriesData }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <tbody className="divide-y divide-border">
        <tr className="hover:bg-muted/30 transition-colors">
          <td className="px-4 py-3 font-semibold text-foreground w-40 align-top bg-muted/20">CPU</td>
          <td className="px-4 py-3 text-muted-foreground">
            <div className="space-y-1">
              {sharedSpecs.cpu.map((c, i) => (
                <div key={i} className="text-sm">{c}</div>
              ))}
            </div>
          </td>
        </tr>
        <tr className="hover:bg-muted/30 transition-colors">
          <td className="px-4 py-3 font-semibold text-foreground bg-muted/20">Memory</td>
          <td className="px-4 py-3 text-muted-foreground">{sharedSpecs.memory}</td>
        </tr>
        <tr className="hover:bg-muted/30 transition-colors">
          <td className="px-4 py-3 font-semibold text-foreground bg-muted/20">Storage</td>
          <td className="px-4 py-3 text-muted-foreground">{sharedSpecs.storage}</td>
        </tr>
        <tr className="hover:bg-muted/30 transition-colors">
          <td className="px-4 py-3 font-semibold text-foreground bg-muted/20">Cooling</td>
          <td className="px-4 py-3 text-muted-foreground">{sharedSpecs.cooling}</td>
        </tr>
        <tr className="hover:bg-muted/30 transition-colors">
          <td className="px-4 py-3 font-semibold text-foreground bg-muted/20">OS</td>
          <td className="px-4 py-3 text-muted-foreground">{sharedSpecs.os}</td>
        </tr>
        <tr className="hover:bg-muted/30 transition-colors">
          <td className="px-4 py-3 font-semibold text-foreground bg-muted/20" rowSpan={2}>I/O Ports</td>
          <td className="px-4 py-3 text-muted-foreground">
            <span className="font-medium text-foreground">USB2.0:</span> {series.usbPorts.usb2}
          </td>
        </tr>
        <tr className="hover:bg-muted/30 transition-colors">
          <td className="px-4 py-3 text-muted-foreground">
            <span className="font-medium text-foreground">USB3.0:</span> {series.usbPorts.usb3}
          </td>
        </tr>
        <tr className="hover:bg-muted/30 transition-colors">
          <td className="px-4 py-3 font-semibold text-foreground bg-muted/20">COM</td>
          <td className="px-4 py-3 text-muted-foreground">{series.comPorts}</td>
        </tr>
        <tr className="hover:bg-muted/30 transition-colors">
          <td className="px-4 py-3 font-semibold text-foreground bg-muted/20">Display</td>
          <td className="px-4 py-3 text-muted-foreground">{sharedSpecs.display}</td>
        </tr>
        <tr className="hover:bg-muted/30 transition-colors">
          <td className="px-4 py-3 font-semibold text-foreground bg-muted/20">Audio</td>
          <td className="px-4 py-3 text-muted-foreground">{sharedSpecs.audio}</td>
        </tr>
        <tr className="hover:bg-muted/30 transition-colors">
          <td className="px-4 py-3 font-semibold text-foreground bg-muted/20">Expansion</td>
          <td className="px-4 py-3 text-muted-foreground">{sharedSpecs.expansion}</td>
        </tr>
        <tr className="hover:bg-muted/30 transition-colors">
          <td className="px-4 py-3 font-semibold text-foreground bg-muted/20">Ethernet</td>
          <td className="px-4 py-3 text-muted-foreground">{sharedSpecs.ethernet}</td>
        </tr>
        <tr className="hover:bg-muted/30 transition-colors">
          <td className="px-4 py-3 font-semibold text-foreground bg-muted/20">Wireless</td>
          <td className="px-4 py-3 text-muted-foreground">
            <div>{sharedSpecs.wireless}</div>
            <div>{sharedSpecs.wifi}</div>
          </td>
        </tr>
        <tr className="hover:bg-muted/30 transition-colors">
          <td className="px-4 py-3 font-semibold text-foreground bg-muted/20">Power Supply</td>
          <td className="px-4 py-3 text-muted-foreground">{sharedSpecs.power}</td>
        </tr>
        <tr className="hover:bg-muted/30 transition-colors">
          <td className="px-4 py-3 font-semibold text-foreground bg-muted/20">Booting</td>
          <td className="px-4 py-3 text-muted-foreground">{sharedSpecs.booting}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

// Product Selection Table Component
const ProductSelectionTable = ({ products }: { products: typeof productSelection10XA }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-primary/10 border-b border-border">
          <th className="text-left px-4 py-3 font-semibold text-foreground">Model</th>
          <th className="text-left px-4 py-3 font-semibold text-foreground">CPU</th>
          <th className="text-left px-4 py-3 font-semibold text-foreground">Memory</th>
          <th className="text-left px-4 py-3 font-semibold text-foreground">Storage</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {products.map((p) => (
          <tr key={`${p.model}-${p.partNo}`} className="hover:bg-muted/30 transition-colors">
            <td className="px-4 py-3 font-medium text-primary">{p.model}</td>
            <td className="px-4 py-3 text-foreground">{p.cpu}</td>
            <td className="px-4 py-3 text-muted-foreground">{p.memory}</td>
            <td className="px-4 py-3 text-muted-foreground">{p.storage}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Series Section Component with Tabs
const SeriesSection = ({ series, index }: { series: SeriesData; index: number }) => {
  const isReversed = index % 2 === 1;
  const allImages = [series.image, ...(series.gallery || [])];
  const [activeImg, setActiveImg] = useState(0);

  // Auto-slide every 4s
  useEffect(() => {
    if (allImages.length <= 1) return;
    const timer = setInterval(() => setActiveImg((prev) => (prev + 1) % allImages.length), 4000);
    return () => clearInterval(timer);
  }, [allImages.length]);

  return (
    <div className="card-surface overflow-hidden" id={series.id}>
      {/* Header with image and features */}
      <div className={`grid lg:grid-cols-5 gap-0`}>
        {/* Image side - 2 cols */}
        <div className={`lg:col-span-2 relative bg-secondary/30 p-8 flex flex-col items-center justify-center ${isReversed ? "lg:order-2" : ""}`}>
          {series.badge ? (
            <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {series.highlight}
            </span>
          ) : (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border border-border">
              {series.highlight}
            </span>
          )}
            item={{ id: series.id, name: series.name, category: "EPC Box Series", image: series.image, href: "/epc-box-series", specs: series.tagline }}
            className="absolute top-4 right-4 z-10"
          />
          <img
            src={allImages[activeImg]}
            alt={series.name}
            className="max-h-[220px] object-contain mb-4 transition-opacity duration-500"
            loading="lazy"
          />
          {allImages.length > 1 && (
            <div className="flex gap-2 mt-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 object-contain rounded-lg p-1 border-2 transition-all cursor-pointer ${
                    i === activeImg ? "border-primary bg-primary/10" : "border-transparent bg-background/50 hover:border-primary/40"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" loading="lazy" />
                </button>
              ))}
            </div>
          )}
          <a
            href={series.datasheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Datasheet <ExternalLink size={14} />
          </a>
        </div>

        {/* Content side - 3 cols */}
        <div className={`lg:col-span-3 p-8 lg:p-10 ${isReversed ? "lg:order-1" : ""}`}>
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">{series.tagline}</p>
          <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">{series.name}</h3>
          <p className="text-sm text-muted-foreground italic mb-4">{series.taglineEn}</p>
          <p className="text-muted-foreground mb-6 leading-relaxed">{series.desc}</p>

          {/* Feature cards */}
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            {series.features.map((f, i) => (
              <div key={i} className="rounded-lg border border-border p-4 hover:border-primary/30 transition-colors bg-background/50">
                <h4 className="text-sm font-bold text-foreground mb-1">{f.title}</h4>
                <p className="text-xs text-primary mb-2">{f.titleEn}</p>
                <ul className="space-y-1">
                  {f.points.map((p, j) => (
                    <li key={j} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <Zap size={10} className="text-primary mt-0.5 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Applications */}
          <div className="flex flex-wrap gap-2">
            {series.applications.map((app, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {app}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Spec & Video — 2 Column Layout */}
      <div className="border-t border-border">
        <div className="grid lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* Left: Specification */}
          <div>
            <div className="px-6 py-3 bg-primary/10 border-b border-border">
              <span className="text-sm font-bold text-foreground flex items-center gap-1"><SlidersHorizontal size={14} className="text-primary" /> Specification</span>
            </div>
            <SpecTable series={series} />
          </div>

          {/* Right: Product Selection + Video */}
          <div className="flex flex-col">
            {series.productSelection.length > 0 && (
              <div>
                <div className="px-6 py-3 bg-muted/30 border-b border-border">
                  <span className="text-sm font-bold text-foreground flex items-center gap-1"><Box size={14} className="text-primary" /> Product Selection</span>
                </div>
                <ProductSelectionTable products={series.productSelection} />
              </div>
            )}
            <div className="mt-auto">
              <div className="px-6 py-3 bg-muted/20 border-y border-border">
                <span className="text-sm font-bold text-foreground flex items-center gap-1"><Play size={14} className="text-primary" /> Video</span>
              </div>
              <div className="p-4">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.youtube.com/embed/n_AVEOTjeAA"
                    title={`EPC Box ${series.name} Video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── EPC Comparison System ─── */
const epcCompData = {
  models: ["EPC-10XA", "EPC-20XA", "EPC-30XA", "EPC-40XA"] as const,
  specs: {
    "ขนาดตัวเครื่อง": ["200×160×47mm", "200×160×79mm", "337×160×47.5mm", "337×160×79.5mm"],
    "Form Factor": ["Compact", "Enhanced Height", "Wide Low-Profile", "Maximum"],
    "Cooling": ["Fanless", "Fanless", "Fanless", "Fanless"],
    "CPU รองรับ": ["Celeron ~ Core i7 12th", "Celeron ~ Core i7 12th", "Celeron ~ Core i7 12th", "Celeron ~ Core i7 12th"],
    "RAM": ["4~32GB DDR3L/DDR4/DDR5", "4~32GB DDR3L/DDR4/DDR5", "4~32GB DDR3L/DDR4/DDR5", "4~32GB DDR3L/DDR4/DDR5"],
    "Storage": ["1× mSATA SSD", "1× mSATA SSD", "1× mSATA SSD", "1× mSATA SSD"],
    "COM Port": ["2×RS232 + 1×RS485", "2×RS232 + 1×RS485", "4×RS232 + 2×RS485", "4×RS232 + 2×RS485"],
    "USB": ["5×USB2.0 + 1×USB3.0", "5×USB2.0 + 1×USB3.0", "5×USB2.0 + 1×USB3.0", "5×USB2.0 + 1×USB3.0"],
    "LAN": ["2× GbE Intel I210", "2× GbE Intel I210", "2× GbE Intel I210", "2× GbE Intel I210"],
    "Display Out": ["HDMI + VGA Dual", "HDMI + VGA Dual", "HDMI + VGA Dual", "HDMI + VGA Dual"],
    "Expansion": ["1× Mini PCIe", "1× Mini PCIe", "1× Mini PCIe", "1× Mini PCIe"],
    "WiFi/BT": ["Optional", "Optional", "Optional", "Optional"],
    "4G/5G": ["Optional", "Optional", "Optional", "Optional"],
    "Power": ["DC 12V (9-36V opt)", "DC 12V (9-36V opt)", "DC 12V (9-36V opt)", "DC 12V (9-36V opt)"],
    "Boot Mode": ["AT / ATX", "AT / ATX", "AT / ATX", "AT / ATX"],
    "OS": ["Win 10/11, Linux", "Win 10/11, Linux", "Win 10/11, Linux", "Win 10/11, Linux"],
    "MTBF": ["60,000 ชม.", "60,000 ชม.", "60,000 ชม.", "60,000 ชม."],
  } as Record<string, string[]>,
  prices: {
    "ราคาเริ่มต้น (Celeron)": ["฿13,990", "฿13,990", "สอบถาม", "สอบถาม"],
    "ราคา i3 Gen10": ["฿30,990", "฿30,990", "สอบถาม", "สอบถาม"],
    "ราคา i5 Gen10": ["฿36,990", "฿36,990", "สอบถาม", "สอบถาม"],
    "ราคา i7 Gen10": ["฿39,990", "฿39,990", "สอบถาม", "สอบถาม"],
    "ราคา i3 Gen12": ["฿30,990", "฿30,990", "สอบถาม", "สอบถาม"],
    "ราคา i5 Gen12": ["฿35,990", "฿35,990", "สอบถาม", "สอบถาม"],
    "ราคา i7 Gen12": ["฿39,990", "฿39,990", "สอบถาม", "สอบถาม"],
    "Windows 10 Pro OEM": ["฿3,950", "฿3,950", "฿3,950", "฿3,950"],
    "Windows 11 Pro OEM": ["฿4,590", "฿4,590", "฿4,590", "฿4,590"],
  } as Record<string, string[]>,
  value: {
    "พื้นที่ระบายความร้อน": ["★★★☆☆", "★★★★☆", "★★★★☆", "★★★★★"],
    "ความกะทัดรัด": ["★★★★★", "★★★★☆", "★★★☆☆", "★★★☆☆"],
    "ขยายได้ (Expansion)": ["★★★☆☆", "★★★★☆", "★★★★☆", "★★★★★"],
    "Rack Mount": ["★★☆☆☆", "★★☆☆☆", "★★★★★", "★★★★★"],
    "COM Port จำนวนมาก": ["★★★☆☆", "★★★☆☆", "★★★★★", "★★★★★"],
    "ทนทาน / Vibration": ["★★★★☆", "★★★★☆", "★★★★★", "★★★★★"],
    "คุ้มค่ารวม": ["★★★★★", "★★★★☆", "★★★★☆", "★★★★★"],
    "เหมาะกับ": ["งานทั่วไป / Edge / POS", "24/7 Heavy / CPU แรง", "Rack Mount / Panel Mount", "Mission-Critical / Flagship"],
  } as Record<string, string[]>,
};

const epcFilterOpts = {
  formFactor: ["ทุกรุ่น", "Compact", "Enhanced", "Wide", "Flagship"],
  budget: ["ทุกงบ", "ต่ำกว่า 20,000", "20,000 - 35,000", "มากกว่า 35,000"],
};

const EPCComparisonSystem = ({ onQuote }: { onQuote: (name: string) => void }) => {
  const [viewMode, setViewMode] = useState<"specs" | "price" | "value">("specs");
  const [formFilter, setFormFilter] = useState("ทุกรุ่น");
  const [budgetFilter, setBudgetFilter] = useState("ทุกงบ");

  const formMap: Record<string, number[]> = {
    "ทุกรุ่น": [0, 1, 2, 3], "Compact": [0], "Enhanced": [1], "Wide": [2], "Flagship": [3],
  };
  const budgetMap: Record<string, number[]> = {
    "ทุกงบ": [0, 1, 2, 3], "ต่ำกว่า 20,000": [0, 1], "20,000 - 35,000": [0, 1, 2, 3], "มากกว่า 35,000": [0, 1, 2, 3],
  };

  const visibleIndices = formMap[formFilter].filter(i => budgetMap[budgetFilter].includes(i));
  const data = viewMode === "specs" ? epcCompData.specs : viewMode === "price" ? epcCompData.prices : epcCompData.value;

  const viewTabs = [
    { key: "specs" as const, label: "สเปก", icon: SlidersHorizontal },
    { key: "price" as const, label: "ราคา", icon: DollarSign },
    { key: "value" as const, label: "ความคุ้มค่า", icon: BarChart3 },
  ];

  const tierColors = ["text-emerald-500", "text-sky-500", "text-amber-500", "text-purple-500"];
  const tierLabels = ["Compact", "Enhanced", "Wide", "Flagship"];

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="card-surface p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">กรองสินค้า</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Form Factor</label>
            <div className="flex flex-wrap gap-1.5">
              {epcFilterOpts.formFactor.map(opt => (
                <button key={opt} onClick={() => setFormFilter(opt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${formFilter === opt ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">งบประมาณ</label>
            <div className="flex flex-wrap gap-1.5">
              {epcFilterOpts.budget.map(opt => (
                <button key={opt} onClick={() => setBudgetFilter(opt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${budgetFilter === opt ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex items-center justify-center gap-2">
        {viewTabs.map(tab => (
          <button key={tab.key} onClick={() => setViewMode(tab.key)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${viewMode === tab.key ? "bg-primary text-primary-foreground border-primary shadow-lg" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}>
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Comparison Table */}
      {visibleIndices.length === 0 ? (
        <div className="card-surface p-8 text-center">
          <p className="text-muted-foreground">ไม่พบสินค้าที่ตรงกับตัวกรอง — ลองเปลี่ยนเงื่อนไข</p>
        </div>
      ) : (
        <div className="card-surface overflow-hidden overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid border-b border-border" style={{ gridTemplateColumns: `180px repeat(${visibleIndices.length}, 1fr)` }}>
              <div className="px-4 py-4 bg-primary/10 flex items-center">
                <span className="text-sm font-bold text-foreground">
                  {viewMode === "specs" ? <><SlidersHorizontal size={14} className="inline mr-1" /> สเปก</> : viewMode === "price" ? <><DollarSign size={14} className="inline mr-1" /> ราคา</> : <><BarChart3 size={14} className="inline mr-1" /> ความคุ้มค่า</>}
                </span>
              </div>
              {visibleIndices.map(i => (
                <div key={i} className="px-3 py-4 bg-primary/5 text-center border-l border-border">
                  <p className={`text-lg font-black ${tierColors[i]}`}>{epcCompData.models[i]}</p>
                  <p className="text-[10px] text-muted-foreground">{tierLabels[i]}</p>
                </div>
              ))}
            </div>

            <div className="divide-y divide-border">
              {Object.entries(data).map(([label, values], rowIdx) => (
                <div key={label} className={`grid items-center ${rowIdx % 2 === 0 ? "bg-muted/10" : ""}`}
                  style={{ gridTemplateColumns: `180px repeat(${visibleIndices.length}, 1fr)` }}>
                  <div className="px-4 py-3 text-sm font-medium text-foreground">{label}</div>
                  {visibleIndices.map(i => (
                    <div key={i} className="px-3 py-3 text-center text-sm text-muted-foreground border-l border-border">
                      {values[i].startsWith("★") ? (
                        <span className="text-amber-500 font-bold tracking-wider">{values[i]}</span>
                      ) : values[i] === "—" ? (
                        <span className="text-muted-foreground/40">—</span>
                      ) : (
                        values[i]
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="grid border-t border-border bg-muted/20"
              style={{ gridTemplateColumns: `180px repeat(${visibleIndices.length}, 1fr)` }}>
              <div className="px-4 py-4 text-sm font-medium text-foreground flex items-center">ขอใบเสนอราคา</div>
              {visibleIndices.map(i => (
                <div key={i} className="px-3 py-4 text-center border-l border-border">
                  <button onClick={() => onQuote(String(epcCompData.models[i]))}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors">
                    ขอราคา
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Decision Helper */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: "10xa", Icon: Box, title: "พื้นที่จำกัด / งานทั่วไป", desc: "Compact 200mm เล็กที่สุด เบาที่สุด เหมาะกับ Edge Computing, POS", color: "border-emerald-500/30 bg-emerald-500/5" },
          { id: "20xa", Icon: Zap, title: "ต้องการ CPU แรง 24/7", desc: "สูงขึ้น 79mm ระบายความร้อนดีขึ้น 68% สำหรับงานหนักต่อเนื่อง", color: "border-sky-500/30 bg-sky-500/5" },
          { id: "30xa", Icon: Server, title: "Rack Mount / Panel Mount", desc: "กว้าง 337mm Low Profile เหมาะติดตู้ Rack หรือ Panel", color: "border-amber-500/30 bg-amber-500/5" },
          { id: "40xa", Icon: Shield, title: "Mission-Critical Flagship", desc: "ใหญ่ที่สุด ทนที่สุด ระบายความร้อน +168% งานวิกฤตต้องเครื่องนี้", color: "border-purple-500/30 bg-purple-500/5" },
        ].map(item => (
          <button key={item.id} onClick={() => {
            const el = document.getElementById(item.id);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }} className={`p-5 rounded-xl border ${item.color} text-left hover:scale-[1.02] transition-transform`}>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2"><item.Icon size={22} className="text-primary" /></div>
            <p className="font-bold text-foreground text-sm mb-1">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
            <p className="text-xs font-bold text-primary mt-2">→ ดู {item.id.toUpperCase()}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

const EPCBoxSeries = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState("");
  const [showLineQR, setShowLineQR] = useState(false);
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="EPC Box Series — Fanless Modular Industrial PC" description="EPC Box Series คอมพิวเตอร์อุตสาหกรรม Fanless แบบ Modular LEGO MODE รองรับ Intel N100 ถึง Core i7 สำหรับโรงงานและ IoT" path="/epc-box-series" />
      <ProductJsonLd
        collectionName="EPC Box Series Fanless Modular Industrial PC"
        collectionDescription="EPC Box Series คอมพิวเตอร์อุตสาหกรรม Fanless แบบ Modular สำหรับโรงงานและ IoT"
        collectionUrl="/epc-box-series"
        products={priceList.map(m => ({ name: m.model, price: m.price, description: m.spec, category: "Fanless Modular Industrial PC" }))}      />

      <BreadcrumbJsonLd items={[{ name: "สินค้า", path: "/products" }, { name: "EPC Box Series", path: "/epc-box-series" }]} />
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="ENT GROUP" className="h-8 w-auto" />
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-semibold text-foreground">EPC Box Series</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/" className="hidden md:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={16} /> กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="relative container max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">
                CESIPC Partner
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black mb-6 tracking-tight">
                EPC Box <span className="text-gradient">Series</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                โซลูชั่น Industrial Box PC ระดับโลก สำหรับอุตสาหกรรมไทย
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                คอมพิวเตอร์อุตสาหกรรมระบบ LEGO MODE ที่ใช้เทคโนโลยี Intel Core
                พร้อมการออกแบบแบบไร้พัดลมและโครงสร้างอลูมิเนียมที่แข็งแกร่ง
                เหมาะสำหรับงานอุตสาหกรรมหนักและระบบอัตโนมัติ
              </p>
              <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                ในยุคที่ Industry 4.0 กำลังเปลี่ยนโฉมหน้าการผลิต
                การเลือกคอมพิวเตอร์อุตสาหกรรมที่เหมาะสมจึงเป็นกุญแจสำคัญของความสำเร็จ
                — Box PC จึงกลายเป็นตัวเลือกอันดับหนึ่งของโรงงานชั้นนำทั่วโลก
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/datasheets/0597a3_9dad5caa6c4d4410a723cab33c3177bf.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                >
                  CESIPC E-Catalog <ExternalLink size={16} />
                </a>
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-muted transition-colors"
                >
                  ดูราคาสินค้า
                </a>
                <a
                  href="#10xa"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-muted transition-colors"
                >
                  ดูสินค้าทั้งหมด <ChevronDown size={16} />
                </a>
              </div>
            </div>
            <div className="card-surface p-6 flex items-center justify-center">
              <img
                src="/images/wix/0597a3_390ed059c959423d9c40be95b414b68f_fc93c220.png"
                alt="EPC Box Series"
                className="max-w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="py-8 border-y border-border">
        <div className="container max-w-7xl mx-auto px-6">
          <img
            src="/images/wix/0597a3_7c3f2bd701f340ee993f725c168c1bec_e05257e7.png"
            alt="Trusted by global industries"
            className="w-full max-w-3xl mx-auto h-auto opacity-70"
            loading="lazy"
          />
          <p className="text-center text-sm text-muted-foreground mt-4">
            สินค้าของเราได้รับการยอมรับและติดตั้งใช้งานกับอุตสาหกรรมระดับโลก
          </p>
        </div>
      </section>

      {/* Key Features */}
      <section className="section-padding">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">คุณสมบัติและประโยชน์เด่น</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              เทคโนโลยีชั้นนำ<span className="text-gradient">สำหรับอุตสาหกรรม</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card-surface p-6 hover:border-primary/30 transition-all hover:-translate-y-1">
                <f.icon className="text-primary mb-4" size={32} />
                <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Compare System */}
      <section className="section-padding bg-muted/30" id="comparison">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">Quick Compare</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold">เปรียบเทียบ<span className="text-gradient">ซีรีส์ทั้งหมด</span></h2>
            <p className="text-muted-foreground mt-3">เลือกมุมมอง สเปก / ราคา / ความคุ้มค่า พร้อมระบบกรอง</p>
          </div>
          <EPCComparisonSystem onQuote={(name) => { setQuoteProduct(name); setQuoteOpen(true); }} />
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              อะไรทำให้เป็น <span className="text-gradient">Industrial-Grade จริงๆ?</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              CESIPC Industrial Box PC ไม่ได้แค่ติดป้าย "มาตรฐานอุตสาหกรรม" แต่ถูกออกแบบและผลิตให้ตอบสนองความต้องการที่เข้มงวดของสภาพแวดล้อมโรงงานจริง
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {certifications.map((c, i) => (
              <div key={i} className="card-surface p-5 flex items-start gap-4 hover:border-primary/30 transition-colors">
                <div className={`shrink-0 w-11 h-11 rounded-xl bg-background flex items-center justify-center border border-border ${c.color}`}>
                  <c.icon size={22} />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pt-1">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Nav */}
      <section className="py-6 border-b border-border sticky top-[65px] z-40 bg-background/90 backdrop-blur-lg">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-sm text-muted-foreground shrink-0 mr-2">Quick Nav:</span>
            {epcSeries.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium border border-border hover:border-primary/50 hover:bg-primary/5 text-foreground transition-all"
              >
                {s.name.replace(" Series", "")}
              </a>
            ))}
            <a
              href="#pricing"
              className="shrink-0 px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              ราคา
            </a>
          </div>
        </div>
      </section>

      {/* All Series with Tabs */}
      <section className="section-padding" id="models">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">Product Lineup</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold">
              ซีรีส์<span className="text-gradient">ทั้งหมด</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              เลือกขนาดที่เหมาะกับพื้นที่และความต้องการ — ตั้งแต่ Compact จนถึง Flagship พร้อม Specification, Product Selection และ Video ครบถ้วน
            </p>
          </div>

          <div className="space-y-10">
            {epcSeries.map((series, idx) => (
              <SeriesSection key={series.id} series={series} index={idx} />
            ))}
          </div>
        </div>
      </section>


      {/* Price List */}
      <section className="section-padding" id="pricing">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">Price List</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              ราคา<span className="text-gradient">สินค้า</span>
            </h2>
          </div>

          {/* Main price table */}
          <div className="card-surface overflow-hidden mb-8">
            <div className="px-6 py-4 bg-primary/10 border-b border-border">
              <h3 className="font-bold text-foreground">EPC Box Series — ราคาเริ่มต้น</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="text-left px-6 py-3 font-semibold text-foreground w-12">No.</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Model</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Specification</th>
                    <th className="text-right px-6 py-3 font-semibold text-foreground">ราคา (฿)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {priceList.map((item) => (
                    <tr key={`${item.model}-${item.no}`} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-3 text-muted-foreground">{item.no}</td>
                      <td className="px-6 py-3 font-medium text-foreground">{item.model}</td>
                      <td className="px-6 py-3 text-muted-foreground">{item.spec}</td>
                      <td className="px-6 py-3 text-right font-bold text-primary text-lg">{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Windows / Options table */}
          <div className="card-surface overflow-hidden">
            <div className="px-6 py-4 bg-muted/30 border-b border-border">
              <h3 className="font-bold text-foreground">Windows License / Options</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/20 border-b border-border">
                    <th className="text-left px-6 py-3 font-semibold text-foreground w-12">No.</th>
                    <th className="text-left px-6 py-3 font-semibold text-foreground">Product</th>
                    <th className="text-right px-6 py-3 font-semibold text-foreground">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {windowsOptions.map((opt) => (
                    <tr key={opt.no} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-3 text-muted-foreground">{opt.no}</td>
                      <td className="px-6 py-3 text-foreground">{opt.product}</td>
                      <td className="px-6 py-3 text-right font-semibold text-primary">{opt.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <PriceDisclaimer />
        </div>
      </section>

      {/* YouTube & Podcast Section */}
      <section className="section-padding" id="media">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">Video & Podcast</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              วิดีโอและ<span className="text-gradient">พอดแคสต์</span> EPC Box Series
            </h2>
            <p className="text-muted-foreground mt-3">เรียนรู้เพิ่มเติมเกี่ยวกับ EPC Box PC ผ่านวิดีโอและเสียงบรรยาย</p>
          </div>

          {/* Main Video */}
          <div className="mb-8">
            <div className="card-surface overflow-hidden">
              <div className="px-6 py-3 bg-primary/10 border-b border-border flex items-center gap-2">
                <Play size={16} className="text-primary" />
                <span className="font-bold text-foreground text-sm">วิดีโอแนะนำหลัก — EPC Box Series Overview</span>
              </div>
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/n_AVEOTjeAA"
                  title="EPC Box Series Overview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Additional Videos Grid */}
          <div className="mb-12">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Play size={18} className="text-primary" /> วิดีโอเพิ่มเติม
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: "mtamL6vkDv8", title: "EPC Box Series — คุณสมบัติเด่น" },
                { id: "bQdfhE03b78", title: "EPC Box Series — การติดตั้งและใช้งาน" },
                { id: "mKcqTs1tloA", title: "EPC Box Series — LEGO Mode Design" },
                { id: "dWf112ejtEY", title: "EPC Box Series — Fanless Technology" },
                { id: "JrTOOQGR1d0", title: "EPC Box Series — Industrial Applications" },
              ].map((video) => (
                <div key={video.id} className="card-surface overflow-hidden group hover:border-primary/30 transition-colors">
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-foreground">{video.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Podcast Section */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Headphones size={18} className="text-primary" /> Podcast — ฟังบรรยายสรุป EPC Box Series
            </h3>
            <p className="text-sm text-muted-foreground mb-6">ฟังข้อมูลสรุปสั้นๆ เกี่ยวกับ EPC Box Series เหมาะสำหรับฟังระหว่างเดินทาง</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { file: "/podcasts/epc-podcast-1.wav", title: "EPC Box Series Overview", desc: "ภาพรวมซีรีส์ EPC Box ทั้งหมด — จุดเด่น ความแตกต่าง" },
                { file: "/podcasts/epc-podcast-2.wav", title: "Fanless & LEGO Mode", desc: "เทคโนโลยี Fanless และระบบ LEGO Mode ยืดหยุ่น" },
                { file: "/podcasts/epc-podcast-3.wav", title: "เลือกรุ่นให้ตรงงาน", desc: "แนวทางเลือก EPC-10XA ถึง 40XA ตามลักษณะงาน" },
                { file: "/podcasts/epc-podcast-4.wav", title: "CPU & Performance", desc: "เปรียบเทียบ CPU ตั้งแต่ Celeron ถึง Core i7 Gen12" },
                { file: "/podcasts/epc-podcast-5.wav", title: "Use Cases จริง", desc: "ตัวอย่างการใช้งาน EPC Box ในโรงงานและอุตสาหกรรม" },
              ].map((podcast, i) => (
                <div key={i} className="card-surface p-5 hover:border-primary/30 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Volume2 size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{podcast.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{podcast.desc}</p>
                    </div>
                  </div>
                  <audio controls className="w-full h-10" preload="none">
                    <source src={podcast.file} type="audio/wav" />
                    เบราว์เซอร์ของคุณไม่รองรับการเล่นเสียง
                  </audio>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-muted/30">
        <div className="container max-w-3xl mx-auto text-center">
          <Settings className="mx-auto mb-4 text-primary" size={40} />
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            สนใจ EPC Box Series?<span className="text-gradient"> ปรึกษาเรา</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            ให้ทีมผู้เชี่ยวชาญช่วยเลือกรุ่นและ Configuration ที่เหมาะกับงานของคุณ
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => setQuoteOpen(true)} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors">
              ขอใบเสนอราคา
            </button>
            <button
              onClick={() => setShowLineQR(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[hsl(142,70%,45%)] text-white font-bold text-lg hover:opacity-90 transition-opacity"
            >
              LINE @entgroup
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-foreground font-bold text-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft size={18} /> กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </section>
      <FooterCompact />
      <LineQRDialog open={showLineQR} onClose={() => setShowLineQR(false)} />
    </div>
  );
};

export default EPCBoxSeries;
