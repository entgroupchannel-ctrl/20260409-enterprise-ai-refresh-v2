import SEOHead from "@/components/SEOHead";
import ProductJsonLd from "@/components/ProductJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Cpu, Monitor, Shield, Zap, Server, Layers, Settings, Maximize, Wifi, ChevronDown, Smartphone, Factory, BarChart3, Gauge, Headphones, Play, Star, Quote, Filter, CheckCircle2, DollarSign, SlidersHorizontal, FileText } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/logo-entgroup.avif";
import FooterCompact from "@/components/FooterCompact";
import { LineQRDialog } from "@/components/LineQRDialog";
import PriceDisclaimer from "@/components/PriceDisclaimer";
import ProductGallery from "@/components/ProductGallery";
import gk1506img1 from "@/assets/gk-series/gk1506-1.jpg";
import gk1506img2 from "@/assets/gk-series/gk1506-2.jpg";
import gk1506img3 from "@/assets/gk-series/gk1506-3.jpg";
import gk1506img4 from "@/assets/gk-series/gk1506-4.jpg";
import gk1506img5 from "@/assets/gk-series/gk1506-5.jpg";
import gk1506img6 from "@/assets/gk-series/gk1506-6.jpg";
import gk1506banner from "@/assets/gk-series/gk1506-banner.jpg";
import gk1501front from "@/assets/gk-series/gk1501-front.png";
import gk1501back from "@/assets/gk-series/gk1501-back.jpg";
import gk1501io1 from "@/assets/gk-series/gk1501-io1.jpg";
import gk1501io2 from "@/assets/gk-series/gk1501-io2.jpg";
import gk2101front from "@/assets/gk-series/gk2101-front.png";
import gk2101angle from "@/assets/gk-series/gk2101-angle.jpg";
import gk2101back from "@/assets/gk-series/gk2101-back.jpg";
import gk2101io from "@/assets/gk-series/gk2101-io.jpg";
import gkHeroBanner from "@/assets/gk-series/gk-hero-banner.jpg";

/* ─── Concept: "One Body, Multiple Brains" ─── */
const concepts = [
  {
    icon: Layers,
    title: "One Body, Multiple Brains",
    titleEn: "คอนเซ็ปต์หลัก: ดีไซน์เดียว เลือก 'สมอง' ได้หลายแบบ",
    desc: "บอดี้ภายนอกทนทานมาตรฐานอุตสาหกรรม แต่เลือกสีพียูให้ตรงใจได้หลากหลายที่สุด",
  },
  {
    icon: Monitor,
    title: "เลือกรุ่นที่ใช่ ตอบโจทย์ทุกหน้างาน",
    titleEn: "Choose the right model for every application",
    desc: "ตั้งแต่ 10.4\" คอมแพกต์ ไปจนถึง 21\" Full HD — เลือกขนาดตามการใช้งาน",
  },
  {
    icon: Shield,
    title: "ทนทานทุกการใช้งาน",
    titleEn: "Industrial durability IP65",
    desc: "วัสดุอลูมิเนียม มาตรฐาน IP65 ทนฝุ่น น้ำ กรุรักษ์สูง",
  },
  {
    icon: Gauge,
    title: "เลือกขุมพลังให้ตรงกับซอฟต์แวร์",
    titleEn: "X86 (Windows/Linux) & ARM (Android/Linux)",
    desc: "Intel Core i3/i5/i7, AMD A6, ARM RK3399/RK3288 — เลือกตามงบและการใช้งาน",
  },
];

/* ─── GK Models ─── */
interface GKModel {
  id: string;
  name: string;
  screenSize: string;
  resolution: string;
  tagline: string;
  desc: string;
  image: string;
  bannerImage?: string;
  datasheetUrls: { label: string; url: string }[];
  highlights: string[];
  cpuOptions: string[];
  platform: string;
  specs: { label: string; value: string }[];
  priceTable: { cpu: string; configs: { ram: string; ssd: string; price: string }[] }[];
  applications: string[];
  youtubeId?: string;
  gallery?: string[];
}

const gkModels: GKModel[] = [
  {
    id: "gk1004",
    name: "GK1004",
    screenSize: "10.4\"",
    resolution: "1024×768",
    tagline: "Compact & Versatile",
    desc: "คอมพิวเตอร์แผงควบคุมสมรรถนะสูง มาตรฐาน IP65 หน้าจอสัมผัส 10 นิ้ว เลือกได้ทั้ง Windows/Linux (Intel/AMD) และ Android (ARM) — เล็กที่สุด แต่ฟีเจอร์ครบที่สุด",
    image: "/images/wix/005637_63354c2396e945468024a1170057f661_d39cca82.png",
    bannerImage: "/images/wix/005637_e086c00fa8d945c4abf7defd3a9d838d_8948d37f.jpg",
    datasheetUrls: [
      { label: "GK1004 Core i3/i5/i7", url: "/datasheets/0597a3_494ff783ace94e86b75a19186e846b4c.pdf" },
      { label: "GK1004 AMD A6", url: "/datasheets/0597a3_6f2939c704d64ad9815751e73437e63d.pdf" },
      { label: "GK1004 A10-X7 (RK3288)", url: "/datasheets/0597a3_8862e83a07ef4fd588e0a969382a2037.pdf" },
      { label: "GK1004 A10-X9 (RK3399)", url: "/datasheets/0597a3_f13b4842a3454efea01f796ecb37781d.pdf" },
    ],
    highlights: [
      "หน้าจอสัมผัส 10.4\" มาตรฐาน IP65 ทนฝุ่น น้ำ 10 จุดสัมผัส",
      "รองรับไฟฟ้าแรงดันกว้าง 12-64V ใช้กับระบบไฟโรงงานทุกประเภท",
      "พอร์ตครบ: COM (RS232/RS485), LAN, USB, VGA, HDMI",
      "รองรับ 4G LTE + mini PCIe/M.2 expansion",
      "ติดตั้งได้หลากหลาย: VESA / ขาตั้ง / ฝังติดผนัง",
    ],
    youtubeId: "v33ZXk1KZLA",
    cpuOptions: ["Intel Core i3/i5/i7", "AMD A6-6500T", "ARM RK3288 (Android)", "ARM RK3399 (Android)"],
    platform: "Windows / Linux / Android",
    specs: [
      { label: "Display", value: "10.4\" Capacitive Touch, 1024×768, 10 Points" },
      { label: "CPU (Windows)", value: "Intel Core i3-5005U / i5-5300U / i7-5500U" },
      { label: "CPU (AMD)", value: "AMD A6 Micro-6500T" },
      { label: "CPU (Android)", value: "RK3288 / RK3399" },
      { label: "RAM", value: "DDR3 2GB/4GB/8GB (DDR3L 4GB for RK3399)" },
      { label: "Storage", value: "SSD 16GB~512GB / EMMC 16~128GB" },
      { label: "I/O", value: "1~2×RS232/RS485, 2~6×USB, 2×RJ45, VGA+HDMI" },
      { label: "Protection", value: "IP65 Front Panel" },
      { label: "Dimension", value: "283×225.2×56 mm" },
      { label: "Power", value: "AC100-240V / DC12V 5A / DC 12-64V" },
      { label: "Certification", value: "CE, FCC, ROHS, ISO" },
      { label: "Mounting", value: "Wall Mount / Embedded / VESA / Vertical Stand" },
    ],
    priceTable: [
      {
        cpu: "i3-5005U (2LAN 6USB HDMI VGA 2RS232)",
        configs: [
          { ram: "4GB", ssd: "128GB", price: "25,990" },
          { ram: "4GB", ssd: "256GB", price: "26,990" },
          { ram: "8GB", ssd: "128GB", price: "26,990" },
          { ram: "8GB", ssd: "256GB", price: "27,990" },
        ],
      },
      {
        cpu: "i5-5300 (2LAN 6USB HDMI VGA 2RS232)",
        configs: [
          { ram: "4GB", ssd: "128GB", price: "26,990" },
          { ram: "4GB", ssd: "256GB", price: "27,990" },
          { ram: "8GB", ssd: "128GB", price: "27,990" },
          { ram: "8GB", ssd: "256GB", price: "29,900" },
        ],
      },
      {
        cpu: "i7-5500 (2LAN 6USB HDMI VGA 2RS232)",
        configs: [
          { ram: "4GB", ssd: "128GB", price: "29,900" },
          { ram: "4GB", ssd: "256GB", price: "30,990" },
          { ram: "8GB", ssd: "128GB", price: "30,990" },
          { ram: "8GB", ssd: "256GB", price: "31,990" },
        ],
      },
      {
        cpu: "i5-1155G7 (2LAN 4USB HDMI DP VGA 2RS232, 3 Displays)",
        configs: [
          { ram: "4GB", ssd: "128GB", price: "34,990" },
          { ram: "4GB", ssd: "256GB+Wifi", price: "35,990" },
          { ram: "8GB", ssd: "128GB+Wifi", price: "35,990" },
          { ram: "8GB", ssd: "256GB+Wifi", price: "36,990" },
          { ram: "8GB", ssd: "512GB+Wifi", price: "37,990" },
          { ram: "16GB", ssd: "512GB+Wifi", price: "38,990" },
        ],
      },
    ],
    applications: ["Industrial Automation", "PLC / SCADA", "Production Line", "Security & Surveillance", "Kiosk / Queuing", "Digital Signage"],
  },
  {
    id: "gk1501",
    name: "GK1501",
    screenSize: "15\"",
    resolution: "1024×768",
    tagline: "Standard Size",
    desc: "Panel PC อุตสาหกรรม 15 นิ้ว จอสัมผัส Capacitive 10 จุด โครงสร้าง IP65 กันฝุ่นกันน้ำ รองรับ CPU ตั้งแต่ Core i5 ถึง i7 หลาย Generation — เหมาะกับงาน HMI, SCADA และ Factory Automation",
    image: gk1501front,
    datasheetUrls: [
      { label: "GK1501 Core i5 Datasheet (PDF)", url: "/datasheets/GK1501_i5.pdf" },
      { label: "GK1501 Core i7 Gen3 Datasheet (PDF)", url: "/datasheets/GK1501_i7_Gen3.pdf" },
      { label: "GK1501 Core i7 Gen6 Datasheet (PDF)", url: "/datasheets/GK1501_i7_Gen6.pdf" },
    ],
    highlights: [
      "หน้าจอ 15\" Capacitive Touch 10 จุด (1024×768)",
      "IP65 กันฝุ่น กันน้ำ ระดับอุตสาหกรรม",
      "รองรับ CPU Core i5 Gen3 / i7 Gen3 / i7 Gen6",
      "RAM DDR3 2GB/4GB/8GB, SSD สูงสุด 512GB",
      "2× LAN, 6× USB, 2× RS232, HDMI + VGA",
      "ติดตั้งได้หลายแบบ: Wall Mount / Embedded / VESA",
      "อุณหภูมิใช้งาน -10°C ถึง 60°C",
      "รองรับ Windows / Linux",
    ],
    cpuOptions: ["Intel Core i5 (Gen3)", "Intel Core i7 (Gen3)", "Intel Core i7 (Gen6)"],
    platform: "Windows 10/11 / Linux",
    specs: [
      { label: "Display", value: "15\" TFT-LCD, 1024×768, Anti-Glare" },
      { label: "Touch", value: "Capacitive 10-Point, Response <10ms" },
      { label: "Brightness", value: "250-400 nits" },
      { label: "CPU (Gen3)", value: "Intel Core i5-3337U / i7-3537U" },
      { label: "CPU (Gen6)", value: "Intel Core i7-6500U" },
      { label: "RAM", value: "DDR3 2GB/4GB/8GB (1-2 Slots)" },
      { label: "Storage", value: "SSD 16GB/32GB/64GB/128GB/256GB/512GB" },
      { label: "Ethernet", value: "2× RJ45 Gigabit LAN" },
      { label: "USB", value: "6× USB2.0/USB3.0" },
      { label: "Serial Port", value: "2× RS232" },
      { label: "Video Output", value: "1× VGA + 1× HDMI" },
      { label: "Audio", value: "1× Audio IN/OUT" },
      { label: "Expansion", value: "mini PCIe — WiFi, Bluetooth, 3G/4G LTE" },
      { label: "Protection", value: "IP65 Front Panel" },
      { label: "Dimension", value: "385×305×55 mm" },
      { label: "Weight", value: "4.5 kg" },
      { label: "Power Input", value: "AC 100-240V 50-60Hz / DC 12V" },
      { label: "Temperature", value: "Operating: -10~60°C / Storage: -20~75°C" },
      { label: "Humidity", value: "0%~95% (Non-condensing)" },
      { label: "Certification", value: "CE, FCC, ROHS" },
      { label: "Mounting", value: "Wall Mount / Embedded / VESA 100×100" },
      { label: "OS", value: "Windows 10/11, Linux" },
    ],
    priceTable: [
      {
        cpu: "i5 Gen3 (2LAN 6USB HDMI VGA 2RS232)",
        configs: [
          { ram: "4GB", ssd: "128GB", price: "28,990" },
          { ram: "4GB", ssd: "256GB", price: "29,990" },
          { ram: "8GB", ssd: "128GB", price: "29,990" },
          { ram: "8GB", ssd: "256GB", price: "30,990" },
        ],
      },
      {
        cpu: "i7 Gen3 (2LAN 6USB HDMI VGA 2RS232)",
        configs: [
          { ram: "4GB", ssd: "128GB", price: "30,990" },
          { ram: "4GB", ssd: "256GB", price: "31,990" },
          { ram: "8GB", ssd: "128GB", price: "31,990" },
          { ram: "8GB", ssd: "256GB", price: "32,990" },
        ],
      },
      {
        cpu: "i7 Gen6 (2LAN 6USB HDMI VGA 2RS232)",
        configs: [
          { ram: "4GB", ssd: "128GB", price: "32,990" },
          { ram: "4GB", ssd: "256GB", price: "33,990" },
          { ram: "8GB", ssd: "128GB", price: "33,990" },
          { ram: "8GB", ssd: "256GB", price: "34,990" },
        ],
      },
    ],
    applications: ["HMI Control", "Factory Automation", "Warehouse Management", "SCADA", "POS & Queuing", "Digital Signage"],
    gallery: [
      gk1501front,
      gk1501back,
      gk1501io1,
      gk1501io2,
    ],
  },
  {
    id: "gk1506",
    name: "GK1506 (A15)",
    screenSize: "15.6\"",
    resolution: "1920×1080 Full HD",
    tagline: "Full HD — Best Seller!",
    desc: "Panel PC อุตสาหกรรม 15.6 นิ้ว Full HD จอสัมผัส 10 จุด โครงสร้าง IP65 ทั้งด้านหน้าและด้านหลัง ทนฝุ่น ทนน้ำ รองรับ CPU ตั้งแต่ Pentium ถึง Core i7 — เลือกสเปกให้ตรงกับงบประมาณและการใช้งาน",
    image: gk1506img1,
    bannerImage: gk1506banner,
    datasheetUrls: [
      { label: "A15 Datasheet (PDF)", url: "https://www.sharevdi.com/upload/portal/20250704/202507042002221664.pdf" },
      { label: "GK1506 Datasheet", url: "/datasheets/0597a3_d2a55f290be74f049d8099a7666f5153.pdf" },
    ],
    highlights: [
      "หน้าจอ Full HD 15.6\" (1920×1080) Capacitive Touch 10 จุด",
      "IP65 ทั้งด้านหน้าและด้านหลัง — กันฝุ่น กันน้ำระดับอุตสาหกรรม",
      "รองรับไฟฟ้าแรงดันกว้าง 12-64V + AC 100-240V",
      "พอร์ต COM (RS232/RS485) สูงสุด 4 พอร์ต, USB สูงสุด 6 พอร์ต",
      "รองรับ 4G LTE Module, mini PCIe/M.2 expansion",
      "ติดตั้งได้ 4 แบบ: VESA / ขาตั้ง / ฝังผนัง / Wall Mount",
      "อุณหภูมิใช้งาน -10°C ถึง 60°C ทนสภาพแวดล้อมรุนแรง",
      "ความสว่างสูงสุด 1,000 nits ใช้กลางแจ้งได้",
    ],
    cpuOptions: ["Intel Pentium A1020", "Intel Core i3-5005U", "Intel Core i5-5300U", "Intel Core i7-5500U"],
    platform: "Windows 10/11 / Windows IoT / Linux",
    specs: [
      { label: "Display", value: "15.6\" Full HD 1920×1080, TFT-LCD, Anti-Glare" },
      { label: "Touch", value: "Capacitive 10-Point, Response <10ms, Accuracy 2-2.5mm" },
      { label: "Brightness", value: "250-1,000 nits (ปรับได้)" },
      { label: "Contrast", value: "1000:1, 16.7M สี, Full Viewing Angle" },
      { label: "CPU (Pentium)", value: "Intel Pentium A1020" },
      { label: "CPU (Core)", value: "Intel Core i3-5005U / i5-5300U / i7-5500U" },
      { label: "RAM", value: "DDR3 4GB/8GB (1-2 Slots)" },
      { label: "Storage", value: "SSD 64GB/128GB/256GB/512GB" },
      { label: "Ethernet", value: "2× RJ45 Gigabit LAN (Upgradable)" },
      { label: "USB", value: "6× USB2.0/USB3.0 (Upgradable)" },
      { label: "Serial Port", value: "2-4× RS232/RS485 (Upgradable)" },
      { label: "Video Output", value: "1× VGA + 1× HDMI" },
      { label: "Audio", value: "1× Audio IN/OUT" },
      { label: "Expansion", value: "mini PCIe/M.2 — WiFi, Bluetooth, 4G/5G LTE" },
      { label: "Extendable", value: "RS485, Phoenix terminal (9-36V), GPIO" },
      { label: "Protection", value: "IP65 Full Panel (Front + Back)" },
      { label: "Dimension", value: "391×276×51 mm" },
      { label: "Weight", value: "4.2 kg" },
      { label: "Power Input", value: "AC 100-240V 50-60Hz / DC 12V 5A" },
      { label: "Wide Voltage", value: "DC 9-36V (Phoenix connector)" },
      { label: "Temperature", value: "Operating: -10~60°C / Storage: -20~75°C" },
      { label: "Humidity", value: "0%~95% (Non-condensing)" },
      { label: "Certification", value: "CE, FCC, ROHS, ISO" },
      { label: "Mounting", value: "Wall Mount / Embedded / VESA / Vertical Stand" },
      { label: "OS", value: "Windows 10/11, Windows IoT, Linux (Custom image supported)" },
      { label: "Color", value: "Gray" },
    ],
    priceTable: [
      {
        cpu: "i3-5005U (2LAN 6USB HDMI VGA 2RS232)",
        configs: [
          { ram: "4GB", ssd: "128GB", price: "31,990" },
          { ram: "4GB", ssd: "256GB", price: "32,990" },
          { ram: "8GB", ssd: "128GB", price: "32,990" },
          { ram: "8GB", ssd: "256GB", price: "33,990" },
        ],
      },
      {
        cpu: "i5-5300 (2LAN 6USB HDMI VGA 2RS232)",
        configs: [
          { ram: "4GB", ssd: "128GB", price: "32,990" },
          { ram: "4GB", ssd: "256GB", price: "33,990" },
          { ram: "8GB", ssd: "128GB", price: "33,990" },
          { ram: "8GB", ssd: "256GB", price: "34,990" },
        ],
      },
      {
        cpu: "i7-5500 (2LAN 6USB HDMI VGA 2RS232)",
        configs: [
          { ram: "4GB", ssd: "128GB", price: "34,990" },
          { ram: "4GB", ssd: "256GB", price: "35,990" },
        ],
      },
    ],
    applications: ["HMI Dashboard", "Quality Control", "Factory Monitoring", "Self-Service Terminal", "Kiosk & POS", "Digital Signage"],
    gallery: [
      gk1506img1,
      gk1506img2,
      gk1506img3,
      gk1506img4,
      gk1506img5,
      gk1506img6,
    ],
  },
  {
    id: "gk1901",
    name: "GK1901",
    screenSize: "19\"",
    resolution: "1280×1024",
    tagline: "Large Display",
    desc: "Panel PC อุตสาหกรรม 19 นิ้ว จอสัมผัส Capacitive 10 จุด IP65 กันฝุ่นกันน้ำ พื้นที่แสดงผลกว้าง รองรับ CPU Core i5 Gen4/Gen8 และ Core i7 Gen3/Gen6 — เหมาะกับ Control Room, SCADA และ Production Monitoring",
    image: "/images/wix/3e5003_90384e2e610a43438fe307816e83b2d2_513fd415.jpg",
    datasheetUrls: [
      { label: "GK1901 Core i5 Gen4 (PDF)", url: "/datasheets/GK1901_i5_Gen4.pdf" },
      { label: "GK1901 Core i5 Gen8 (PDF)", url: "/datasheets/GK1901_i5_Gen8.pdf" },
      { label: "GK1901 Core i7 Gen3 (PDF)", url: "/datasheets/GK1901_i7_Gen3.pdf" },
      { label: "GK1901 Core i7 Gen6 (PDF)", url: "/datasheets/GK1901_i7_Gen6.pdf" },
    ],
    highlights: [
      "หน้าจอ 19\" Capacitive Touch 10 จุด (1280×1024)",
      "IP65 กันฝุ่น กันน้ำ ระดับอุตสาหกรรม",
      "รองรับ CPU Core i5 Gen4/Gen8 และ Core i7 Gen3/Gen6",
      "RAM DDR3/DDR4, SSD สูงสุด 512GB",
      "2× LAN, USB, RS232/RS485, HDMI + VGA",
      "ติดตั้งได้หลายแบบ: Wall Mount / Embedded / VESA / Stand",
      "อุณหภูมิใช้งาน -10°C ถึง 60°C",
      "ใช้งานได้หลากหลาย ตั้งแต่ Office ไปจนถึงโปรแกรมออกแบบ",
    ],
    cpuOptions: ["Intel Core i5 (Gen4)", "Intel Core i5 (Gen8)", "Intel Core i7 (Gen3)", "Intel Core i7 (Gen6)"],
    platform: "Windows 10/11 / Linux",
    specs: [
      { label: "Display", value: "19\" TFT-LCD, 1280×1024, Anti-Glare" },
      { label: "Touch", value: "Capacitive 10-Point, Response <10ms" },
      { label: "Brightness", value: "250-400 nits" },
      { label: "CPU (Gen4)", value: "Intel Core i5-4200U" },
      { label: "CPU (Gen8)", value: "Intel Core i5-8250U" },
      { label: "CPU (Gen3)", value: "Intel Core i7-3537U" },
      { label: "CPU (Gen6)", value: "Intel Core i7-6500U" },
      { label: "RAM", value: "DDR3/DDR4 4GB/8GB (1-2 Slots)" },
      { label: "Storage", value: "SSD 64GB/128GB/256GB/512GB" },
      { label: "Ethernet", value: "2× RJ45 Gigabit LAN" },
      { label: "USB", value: "4-6× USB2.0/USB3.0" },
      { label: "Serial Port", value: "2× RS232/RS485" },
      { label: "Video Output", value: "1× VGA + 1× HDMI" },
      { label: "Audio", value: "1× Audio IN/OUT" },
      { label: "Expansion", value: "mini PCIe — WiFi, Bluetooth, 3G/4G LTE" },
      { label: "Protection", value: "IP65 Front Panel" },
      { label: "Dimension", value: "445×360×60 mm" },
      { label: "Weight", value: "5.5 kg" },
      { label: "Power Input", value: "AC 100-240V 50-60Hz / DC 12V" },
      { label: "Temperature", value: "Operating: -10~60°C / Storage: -20~75°C" },
      { label: "Humidity", value: "0%~95% (Non-condensing)" },
      { label: "Certification", value: "CE, FCC, ROHS" },
      { label: "Mounting", value: "Wall Mount / Embedded / VESA 100×100 / Stand" },
      { label: "OS", value: "Windows 10/11, Linux" },
    ],
    priceTable: [
      {
        cpu: "i5 Gen4 (2LAN USB HDMI VGA RS232)",
        configs: [
          { ram: "4GB", ssd: "128GB", price: "29,990" },
          { ram: "4GB", ssd: "256GB", price: "30,990" },
          { ram: "8GB", ssd: "128GB", price: "30,990" },
          { ram: "8GB", ssd: "256GB", price: "31,990" },
        ],
      },
      {
        cpu: "i5 Gen8 (2LAN USB HDMI VGA RS232)",
        configs: [
          { ram: "4GB", ssd: "128GB", price: "32,990" },
          { ram: "4GB", ssd: "256GB", price: "33,990" },
          { ram: "8GB", ssd: "128GB", price: "33,990" },
          { ram: "8GB", ssd: "256GB", price: "34,990" },
        ],
      },
      {
        cpu: "i7 Gen3 (2LAN USB HDMI VGA RS232)",
        configs: [
          { ram: "4GB", ssd: "128GB", price: "31,990" },
          { ram: "4GB", ssd: "256GB", price: "32,990" },
          { ram: "8GB", ssd: "128GB", price: "32,990" },
          { ram: "8GB", ssd: "256GB", price: "33,990" },
        ],
      },
      {
        cpu: "i7 Gen6 (2LAN USB HDMI VGA RS232)",
        configs: [
          { ram: "4GB", ssd: "128GB", price: "33,990" },
          { ram: "4GB", ssd: "256GB", price: "34,990" },
          { ram: "8GB", ssd: "128GB", price: "34,990" },
          { ram: "8GB", ssd: "256GB", price: "35,990" },
        ],
      },
    ],
    applications: ["Control Room", "SCADA Display", "Production Monitoring", "Factory Dashboard", "Digital Signage", "HMI"],
  },
  {
    id: "gk2101",
    name: "GK2101",
    screenSize: "21\"",
    resolution: "1920×1080 Full HD",
    tagline: "Flagship — จอใหญ่ Full HD",
    desc: "Panel PC อุตสาหกรรม 21 นิ้ว Full HD จอสัมผัส Capacitive 10 จุด IP65 กันฝุ่นกันน้ำ โครงสร้างอะลูมิเนียมอัลลอยด์+เหล็กกล้า รองรับ 24/7 ทนอุณหภูมิ -10°C ถึง 60°C — เหมาะกับ Control Room, Dashboard และระบบอัตโนมัติ",
    image: gk2101front,
    datasheetUrls: [
      { label: "GK2101 Core i5 Gen4 (PDF)", url: "/datasheets/GK2101_i5_Gen4.pdf" },
      { label: "GK2101 Core i5 Gen6 (PDF)", url: "/datasheets/GK2101_i5_Gen6.pdf" },
      { label: "GK2101 Core i5 Gen7 (PDF)", url: "/datasheets/GK2101_i5_Gen7.pdf" },
      { label: "GK2101 Core i7 Gen3 (PDF)", url: "/datasheets/GK2101_i7_Gen3.pdf" },
      { label: "GK2101 Core i7 Gen6 (PDF)", url: "/datasheets/GK2101_i7_Gen6.pdf" },
    ],
    highlights: [
      "หน้าจอ Full HD 21.5\" (1920×1080) Capacitive Touch 10 จุด IP65",
      "รองรับ 24/7 ต่อเนื่อง 365 วัน",
      "ทนอุณหภูมิ -10°C ถึง 60°C",
      "โครงสร้างอะลูมิเนียมอัลลอยด์ + เหล็กกล้า น้ำหนัก 9-10 kg",
      "รองรับ CPU Core i5 Gen4/5/6/7 และ Core i7 Gen3/6",
      "รองรับแหล่งจ่ายไฟ 12-64V กว้างขวาง",
      "HDMI, USB, COM, LAN ครบครัน พร้อม 4G LTE Module",
      "ติดตั้ง VESA / Stand / Embedded / Wall Mount",
    ],
    cpuOptions: ["Intel Core i5 (Gen4)", "Intel Core i5 (Gen5)", "Intel Core i5 (Gen6)", "Intel Core i5 (Gen7)", "Intel Core i7 (Gen3)", "Intel Core i7 (Gen6)"],
    platform: "Windows 10/11 / Linux",
    specs: [
      { label: "Display", value: "21.5\" Full HD 1920×1080, TFT-LCD, Anti-Glare" },
      { label: "Touch", value: "Capacitive 10-Point, IP65" },
      { label: "Brightness", value: "250-400 nits" },
      { label: "CPU (i5 Gen4)", value: "Intel Core i5-4200U" },
      { label: "CPU (i5 Gen5)", value: "Intel Core i5-5200U" },
      { label: "CPU (i5 Gen6)", value: "Intel Core i5-6200U" },
      { label: "CPU (i5 Gen7)", value: "Intel Core i5-7200U" },
      { label: "CPU (i7 Gen3)", value: "Intel Core i7-3537U" },
      { label: "CPU (i7 Gen6)", value: "Intel Core i7-6500U" },
      { label: "RAM", value: "DDR3/DDR4 4GB/8GB/16GB" },
      { label: "Storage", value: "SSD 128GB/256GB/512GB" },
      { label: "Ethernet", value: "1-2× RJ45 Gigabit LAN + WiFi" },
      { label: "USB", value: "USB2.0/USB3.0 (Upgradable)" },
      { label: "Serial Port", value: "COM 1/2 (RS232/RS485)" },
      { label: "Video Output", value: "HDMI" },
      { label: "Expansion", value: "mini PCIe/M.2 — WiFi, Bluetooth, 4G/5G LTE" },
      { label: "Protection", value: "IP65 Dustproof & Waterproof" },
      { label: "Dimension", value: "554×355×150 mm, Screen 537×305 mm" },
      { label: "Weight", value: "9-10 kg" },
      { label: "Power Input", value: "DC 12-64V Wide Voltage" },
      { label: "Temperature", value: "Operating: -10~60°C / Storage: -20~75°C" },
      { label: "Humidity", value: "0%~95% (Non-condensing)" },
      { label: "Certification", value: "CE, FCC, ROHS" },
      { label: "Mounting", value: "VESA / Stand / Embedded / Wall Mount" },
      { label: "OS", value: "Windows 10/11, Linux" },
    ],
    priceTable: [
      {
        cpu: "i5 Gen4 (LAN USB HDMI COM)",
        configs: [
          { ram: "4GB", ssd: "128GB", price: "30,990" },
          { ram: "4GB", ssd: "256GB", price: "31,990" },
          { ram: "8GB", ssd: "128GB", price: "31,990" },
          { ram: "8GB", ssd: "256GB", price: "32,990" },
        ],
      },
      {
        cpu: "i5 Gen5 (LAN USB HDMI COM)",
        configs: [
          { ram: "4GB", ssd: "128GB", price: "31,990" },
          { ram: "4GB", ssd: "256GB", price: "32,990" },
          { ram: "8GB", ssd: "128GB", price: "32,990" },
          { ram: "8GB", ssd: "256GB", price: "33,990" },
        ],
      },
      {
        cpu: "i5 Gen6 (LAN USB HDMI COM)",
        configs: [
          { ram: "4GB", ssd: "128GB", price: "32,990" },
          { ram: "4GB", ssd: "256GB", price: "33,990" },
          { ram: "8GB", ssd: "128GB", price: "33,990" },
          { ram: "8GB", ssd: "256GB", price: "34,990" },
        ],
      },
      {
        cpu: "i5 Gen7 (LAN USB HDMI COM)",
        configs: [
          { ram: "4GB", ssd: "128GB", price: "33,990" },
          { ram: "4GB", ssd: "256GB", price: "34,990" },
          { ram: "8GB", ssd: "128GB", price: "34,990" },
          { ram: "8GB", ssd: "256GB", price: "35,990" },
        ],
      },
      {
        cpu: "i7 Gen3 (LAN USB HDMI COM)",
        configs: [
          { ram: "4GB", ssd: "128GB", price: "32,990" },
          { ram: "4GB", ssd: "256GB", price: "33,990" },
          { ram: "8GB", ssd: "128GB", price: "33,990" },
          { ram: "8GB", ssd: "256GB", price: "34,990" },
        ],
      },
      {
        cpu: "i7 Gen6 (LAN USB HDMI COM)",
        configs: [
          { ram: "4GB", ssd: "128GB", price: "34,990" },
          { ram: "4GB", ssd: "256GB", price: "35,990" },
          { ram: "8GB", ssd: "128GB", price: "35,990" },
          { ram: "8GB", ssd: "256GB", price: "36,990" },
        ],
      },
    ],
    applications: ["Real-time Dashboard", "ระบบอัตโนมัติและควบคุม", "Control Room", "วิเคราะห์ข้อมูลขั้นสูง", "Digital Signage", "SCADA"],
    gallery: [
      gk2101front,
      gk2101angle,
      gk2101back,
      gk2101io,
    ],
  },
];

/* ─── Paginated Price Table ─── */
const PaginatedPriceTable = ({ rows, perPage, totalPages }: {
  rows: { cpu: string; ram: string; ssd: string; price: string; isFirst: boolean; rowSpan: number }[];
  perPage: number;
  totalPages: number;
}) => {
  const [page, setPage] = useState(1);
  const pageRows = rows.slice((page - 1) * perPage, page * perPage);

  // Recalculate rowSpan for paginated view
  const renderRows: typeof rows = [];
  let lastCpu = "";
  pageRows.forEach((r) => {
    if (r.cpu !== lastCpu) {
      const sameCpuCount = pageRows.filter(pr => pr.cpu === r.cpu).length;
      renderRows.push({ ...r, isFirst: true, rowSpan: sameCpuCount });
      lastCpu = r.cpu;
    } else {
      renderRows.push({ ...r, isFirst: false });
    }
  });

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary/10 border-b border-border">
              <th className="text-left px-4 py-3 font-semibold text-foreground">CPU</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">RAM</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">SSD</th>
              <th className="text-right px-4 py-3 font-semibold text-foreground">ราคา (฿)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {renderRows.map((r, i) => (
              <tr key={i} className="hover:bg-muted/30 transition-colors">
                {r.isFirst && (
                  <td className="px-4 py-3 font-medium text-foreground align-top" rowSpan={r.rowSpan}>

                    {r.cpu}
                  </td>
                )}
                <td className="px-4 py-3 text-muted-foreground">{r.ram}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.ssd}</td>
                <td className="px-4 py-3 text-right font-bold text-primary text-lg">{r.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground">
            หน้า {page}/{totalPages} ({rows.length} รายการ)
          </p>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-7 w-7 rounded text-xs font-medium transition-colors ${
                  p === page ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-muted"
                }`}
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Model Card Component ─── */
const ModelSection = ({ model, index, onQuote }: { model: GKModel; index: number; onQuote: (name: string) => void }) => {
  const isReversed = index % 2 === 1;

  return (
    <div className="card-surface overflow-hidden" id={model.id}>

      {/* Header area */}
      <div className="grid lg:grid-cols-5 gap-0">
        {/* Image side */}
        <div className={`lg:col-span-2 relative bg-secondary/30 p-8 flex flex-col items-center justify-center ${isReversed ? "lg:order-2" : ""}`}>

          <div className="absolute top-4 left-4 flex items-center gap-2">
      
            <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {model.screenSize}
            </span>
            {model.resolution.includes("Full HD") && (
              <span className="px-2 py-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                Full HD
              </span>
            )}
          </div
            item={{
              id: model.id,
              name: model.name,
              category: "GK Series — Panel PC",
              image: model.image,
              href: `/gk-series#${model.id}`,
              specs: `${model.screenSize} ${model.resolution} ${model.platform}`,
            }}
            className="absolute top-4 right-4"
          />
          {model.gallery && model.gallery.length > 0 ? (
            <ProductGallery images={model.gallery} alt={model.name} />
          ) : (
            <img
              src={model.image}
              alt={model.name}
              className="max-h-[240px] object-contain mb-4"
              loading="lazy"
            />
          )}
          {model.datasheetUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {model.datasheetUrls.map((ds, i) => (
                <a
                  key={i}
                  href={ds.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                  {ds.label} <ExternalLink size={10} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Content side */}
        <div className={`lg:col-span-3 p-8 lg:p-10 ${isReversed ? "lg:order-1" : ""}`}>

          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">{model.tagline}</p>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-1">{model.name}</h3>
          <p className="text-sm text-muted-foreground mb-1">{model.screenSize} • {model.resolution} • {model.platform}</p>
          <p className="text-muted-foreground mb-4 leading-relaxed">{model.desc}</p>
          <button
            onClick={() => onQuote(model.name)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors mb-6"
            <ExternalLink size={14} /> ขอใบเสนอราคา {model.name}

          </button>

          {/* Highlights */}
          <ul className="space-y-2 mb-6">
            {model.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Zap size={12} className="text-primary mt-1 shrink-0" />
                {h}
              </li>
            ))}
          </ul>

          {/* CPU Options */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-foreground mb-2">ตัวเลือก CPU:</p>
            <div className="flex flex-wrap gap-2">
              {model.cpuOptions.map((cpu, i) => (
                <span key={i} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {cpu}
                </span>
              ))}
            </div>
          </div>

          {/* Applications */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">เหมาะสำหรับ:</p>
            <div className="flex flex-wrap gap-2">
              {model.applications.map((app, i) => (
                <span key={i} className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground">
                  {app}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-border">
        <Tabs defaultValue="spec" className="w-full">
          <TabsList className="w-full justify-start rounded-none h-auto border-b border-border bg-muted/30 p-0 overflow-x-auto">
            <TabsTrigger
              value="spec"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 text-sm font-semibold shrink-0"
              ►Specification
            </TabsTrigger>
            {model.priceTable.length > 0 && (
              <TabsTrigger
                value="price"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 text-sm font-semibold shrink-0"
                ►ราคา
              </TabsTrigger>
            )}
            {model.youtubeId && (
              <TabsTrigger
                value="video"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 text-sm font-semibold shrink-0"
                ►Video
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="spec" className="mt-0 p-0">
            {(() => {
              const SPEC_PER_PAGE = 10;
              const totalSpecPages = Math.ceil(model.specs.length / SPEC_PER_PAGE);
              if (totalSpecPages <= 1) {
                return (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-border">
                        {model.specs.map((s, i) => (
                          <tr key={i} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 font-semibold text-foreground w-36 bg-muted/20 align-top">{s.label}</td>
                            <td className="px-4 py-3 text-muted-foreground whitespace-pre-line">{s.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
              // Multi-column layout for specs > 10
              const col1 = model.specs.slice(0, SPEC_PER_PAGE);
              const col2 = model.specs.slice(SPEC_PER_PAGE);
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-px bg-border">
                  <div className="bg-card overflow-x-auto">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-border">
                        {col1.map((s, i) => (
                          <tr key={i} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-2.5 font-semibold text-foreground w-32 bg-muted/20 align-top text-xs">{s.label}</td>
                            <td className="px-4 py-2.5 text-muted-foreground text-xs whitespace-pre-line">{s.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-card overflow-x-auto">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-border">
                        {col2.map((s, i) => (
                          <tr key={i} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-2.5 font-semibold text-foreground w-32 bg-muted/20 align-top text-xs">{s.label}</td>
                            <td className="px-4 py-2.5 text-muted-foreground text-xs whitespace-pre-line">{s.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
          </TabsContent>

          {model.priceTable.length > 0 && (
            <TabsContent value="price" className="mt-0 p-0">
              {(() => {
                const PRICE_PER_PAGE = 10;
                const allRows = model.priceTable.flatMap((group) =>
                  group.configs.map((c, ci) => ({ ...c, cpu: group.cpu, isFirst: ci === 0, rowSpan: group.configs.length }))
                );
                const totalPricePages = Math.ceil(allRows.length / PRICE_PER_PAGE);
                return (
                  <PaginatedPriceTable rows={allRows} perPage={PRICE_PER_PAGE} totalPages={totalPricePages} />
                );
              })()}
              <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20">
                <PriceDisclaimer />
                <button
                  onClick={() => onQuote(model.name)}
                  className="shrink-0 ml-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                  <ExternalLink size={14} /> ขอใบเสนอราคา
                </button>
              </div>
            </TabsContent>
          )}

          {model.youtubeId && (
            <TabsContent value="video" className="mt-0 p-6">
              <div className="aspect-video max-w-2xl mx-auto rounded-xl overflow-hidden border border-border">
                <iframe
                  src={`https://www.youtube.com/embed/${model.youtubeId}`}
                  title={`${model.name} Video`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

/* ─── Advanced Comparison System ─── */
const comparisonData = {
  models: ["GK1004", "GK1501", "GK1506", "GK1901", "GK2101"] as const,
  specs: {
    "ขนาดจอ": ["10.4\"", "15\"", "15.6\"", "19\"", "21.5\""],
    "ความละเอียด": ["1024×768", "1024×768", "1920×1080 FHD", "1280×1024", "1920×1080 FHD"],
    "Touch": ["10-Point", "10-Point", "10-Point", "10-Point", "10-Point"],
    "มาตรฐาน IP": ["IP65 Front", "IP65 Front", "IP65 Full", "IP65 Front", "IP65"],
    "CPU (Intel)": ["i3/i5/i7 Gen5", "i5/i7 Gen3/Gen6", "i3/i5/i7 Gen5", "i5 Gen4/8, i7 Gen3/6", "i5 Gen4-7, i7 Gen3/6"],
    "CPU (ARM)": ["RK3288 / RK3399", "—", "—", "—", "—"],
    "OS": ["Win/Linux/Android", "Win/Linux", "Win/Linux/IoT", "Win/Linux", "Win/Linux"],
    "RAM สูงสุด": ["8GB DDR3", "8GB DDR3", "8GB DDR3", "8GB DDR3/DDR4", "16GB DDR3/DDR4"],
    "SSD สูงสุด": ["512GB", "512GB", "512GB", "512GB", "512GB"],
    "LAN": ["2× GbE", "2× GbE", "2× GbE", "2× GbE", "1-2× GbE"],
    "USB": ["2-6 พอร์ต", "6 พอร์ต", "6 พอร์ต", "4-6 พอร์ต", "USB2.0/3.0"],
    "COM Port": ["1-2× RS232/485", "2× RS232", "2-4× RS232/485", "2× RS232/485", "1-2× COM"],
    "Video Out": ["VGA + HDMI", "VGA + HDMI", "VGA + HDMI", "VGA + HDMI", "HDMI"],
    "ความสว่าง": ["250-400 nits", "250-400 nits", "250-1,000 nits", "250-400 nits", "250-400 nits"],
    "อุณหภูมิ": ["-10~60°C", "-10~60°C", "-10~60°C", "-10~60°C", "-10~60°C"],
    "ขนาดตัวเครื่อง": ["283×225×56 mm", "385×305×55 mm", "391×276×51 mm", "445×360×60 mm", "554×355×150 mm"],
    "น้ำหนัก": ["~3 kg", "4.5 kg", "4.2 kg", "5.5 kg", "9-10 kg"],
    "Wide Voltage": ["12-64V", "DC 12V", "9-36V Phoenix", "DC 12V", "12-64V"],
    "Expansion": ["mini PCIe/M.2", "mini PCIe", "mini PCIe/M.2", "mini PCIe", "mini PCIe/M.2"],
  } as Record<string, string[]>,
  prices: {
    "ราคาเริ่มต้น": ["฿25,990", "฿28,990", "฿31,990", "฿29,990", "฿30,990"],
    "ราคาสูงสุด": ["฿38,990", "฿34,990", "฿35,990", "฿35,990", "฿36,990"],
    "CPU เริ่มต้น": ["i3-5005U", "i5 Gen3", "i3-5005U", "i5 Gen4", "i5 Gen4"],
    "CPU สูงสุด": ["i5-1155G7 Gen11", "i7 Gen6", "i7-5500U", "i7 Gen6", "i7 Gen6"],
    "Config เริ่มต้น": ["4GB/128GB", "4GB/128GB", "4GB/128GB", "4GB/128GB", "4GB/128GB"],
    "Config สูงสุด": ["16GB/512GB+WiFi", "8GB/256GB", "4GB/256GB", "8GB/256GB", "8GB/256GB"],
  } as Record<string, string[]>,
  value: {
    "ราคา/นิ้ว": ["฿2,499", "฿1,933", "฿2,051", "฿1,578", "฿1,442"],
    "ความยืดหยุ่น CPU": ["★★★★★", "★★★☆☆", "★★★★☆", "★★★★☆", "★★★★★"],
    "ความยืดหยุ่น OS": ["★★★★★", "★★★☆☆", "★★★★☆", "★★★☆☆", "★★★☆☆"],
    "ความทนทาน": ["★★★★☆", "★★★★☆", "★★★★★", "★★★★☆", "★★★★★"],
    "พอร์ตครบถ้วน": ["★★★★★", "★★★★☆", "★★★★★", "★★★★☆", "★★★★☆"],
    "คุ้มค่ารวม": ["★★★★★", "★★★★☆", "★★★★★", "★★★★☆", "★★★★★"],
    "เหมาะกับ": ["Compact / Kiosk / POS", "HMI / Factory", "Best Seller ทุกงาน", "Control Room / SCADA", "Dashboard / Flagship"],
  } as Record<string, string[]>,
};

const filterOptions = {
  screenSize: ["ทุกขนาด", "10\"", "15\"", "15.6\"", "19\"", "21\""],
  cpu: ["ทุก CPU", "Intel i3", "Intel i5", "Intel i7", "ARM Android"],
  budget: ["ทุกงบ", "ต่ำกว่า 30,000", "30,000 - 35,000", "มากกว่า 35,000"],
};

const ComparisonSystem = ({ onQuote }: { onQuote: (name: string) => void }) => {
  const [viewMode, setViewMode] = useState<"specs" | "price" | "value">("specs");
  const [screenFilter, setScreenFilter] = useState("ทุกขนาด");
  const [cpuFilter, setCpuFilter] = useState("ทุก CPU");
  const [budgetFilter, setBudgetFilter] = useState("ทุกงบ");

  const screenMap: Record<string, number[]> = {
    "ทุกขนาด": [0, 1, 2, 3, 4],
    "10\"": [0], "15\"": [1], "15.6\"": [2], "19\"": [3], "21\"": [4],
  };
  const cpuMap: Record<string, number[]> = {
    "ทุก CPU": [0, 1, 2, 3, 4],
    "Intel i3": [0, 2],
    "Intel i5": [0, 1, 2, 3, 4],
    "Intel i7": [0, 1, 2, 3, 4],
    "ARM Android": [0],
  };
  const budgetMap: Record<string, number[]> = {
    "ทุกงบ": [0, 1, 2, 3, 4],
    "ต่ำกว่า 30,000": [0, 1, 3],
    "30,000 - 35,000": [0, 1, 2, 3, 4],
    "มากกว่า 35,000": [0, 2, 3, 4],
  };

  const visibleIndices = screenMap[screenFilter]
    .filter(i => cpuMap[cpuFilter].includes(i))
    .filter(i => budgetMap[budgetFilter].includes(i));

  const data = viewMode === "specs" ? comparisonData.specs : viewMode === "price" ? comparisonData.prices : comparisonData.value;

  const viewTabs = [
    { key: "specs" as const, label: "สเปก", icon: SlidersHorizontal },
    { key: "price" as const, label: "ราคา", icon: DollarSign },
    { key: "value" as const, label: "ความคุ้มค่า", icon: BarChart3 },
  ];

  const tierColors = ["text-emerald-500", "text-sky-500", "text-primary", "text-amber-500", "text-purple-500"];
  const tierLabels = ["Compact", "Standard", "Best Seller", "Large", "Flagship"];

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="card-surface p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">กรองสินค้า</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">ขนาดจอ</label>
            <div className="flex flex-wrap gap-1.5">
              {filterOptions.screenSize.map(opt => (
                <button key={opt} onClick={() => setScreenFilter(opt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${screenFilter === opt ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>

                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">CPU</label>
            <div className="flex flex-wrap gap-1.5">
              {filterOptions.cpu.map(opt => (
                <button key={opt} onClick={() => setCpuFilter(opt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${cpuFilter === opt ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>

                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">งบประมาณ</label>
            <div className="flex flex-wrap gap-1.5">
              {filterOptions.budget.map(opt => (
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
        <div className="card-surface overflow-hidden">
          {/* Model Header */}
          <div className="grid border-b border-border" style={{ gridTemplateColumns: `180px repeat(${visibleIndices.length}, 1fr)` }}>

            <div className="px-4 py-4 bg-primary/10 flex items-center">
              <span className="text-sm font-bold text-foreground">
                {viewMode === "specs" ? <><FileText size={14} className="inline mr-1" /> สเปก</> : viewMode === "price" ? <><DollarSign size={14} className="inline mr-1" /> ราคา</> : <><BarChart3 size={14} className="inline mr-1" /> ความคุ้มค่า</>}>

              </span>
            </div>
            {visibleIndices.map(i => (
              <div key={i} className="px-3 py-4 bg-primary/5 text-center border-l border-border">
                <p className={`text-lg font-black ${tierColors[i]}`}>{comparisonData.models[i]}</p>
                <p className="text-[10px] text-muted-foreground">{tierLabels[i]}</p>
                <p className="text-xs text-muted-foreground mt-0.5">({comparisonData.specs["ขนาดจอ"][i]})</p>
              </div>
            ))}
          </div>

          {/* Data Rows */}
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

          {/* Quote Buttons Row */}
          <div className="grid border-t border-border bg-muted/20"
            style={{ gridTemplateColumns: `180px repeat(${visibleIndices.length}, 1fr)` }}>

            <div className="px-4 py-4 text-sm font-medium text-foreground flex items-center">ขอใบเสนอราคา</div>
            {visibleIndices.map(i => (
              <div key={i} className="px-3 py-4 text-center border-l border-border">
                <button onClick={() => onQuote(comparisonData.models[i])}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors">
                  ขอราคา {comparisonData.models[i]}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Decision Helper */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { model: "GK1004", Icon: Smartphone, title: "ต้องการเครื่องขนาดกะทัดรัด", desc: "เหมาะกับ POS, Kiosk, ตู้จำหน่ายสินค้า, เครื่องขนาดเล็ก", color: "border-emerald-500/30 bg-emerald-500/5" },
          { model: "GK1506", Icon: Star, title: "Best Seller ครบทุกงาน", desc: "Full HD 15.6\" IP65 ทั้งตัว ราคาคุ้มค่า ใช้ได้ทุกอุตสาหกรรม", color: "border-primary/30 bg-primary/5" },
          { model: "GK2101", Icon: Monitor, title: "ต้องการจอใหญ่ Flagship", desc: "21\" Full HD สำหรับ Control Room, Dashboard, งานวิเคราะห์ข้อมูล", color: "border-purple-500/30 bg-purple-500/5" },
        ].map(item => (
          <button key={item.model} onClick={() => {
            const el = document.getElementById(gkModels.find(m => m.name === item.model)?.id || "");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }} className={`p-5 rounded-xl border ${item.color} text-left hover:scale-[1.02] transition-transform`}

            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2"><item.Icon size={22} className="text-primary" /></div>
            <p className="font-bold text-foreground text-sm mb-1">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
            <p className="text-xs font-bold text-primary mt-2">→ ดู {item.model}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
/* ─── Page ─── */
const GKSeries = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState("");
  const [showLineQR, setShowLineQR] = useState(false);
  const [activeVideoTab, setActiveVideoTab] = useState("ทั้งหมด");
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="GK Series — Industrial Panel PC จอสัมผัสอุตสาหกรรม" description="GK Series Panel PC อุตสาหกรรม จอสัมผัส 10.4-21 นิ้ว เลือก CPU ได้ตามใจ ทนร้อน ทนฝุ่น สำหรับโรงงาน POS และงานควบคุม" path="/gk-series" />
      <ProductJsonLd
        collectionName="GK Series Industrial Panel PC"
        collectionDescription="Panel PC อุตสาหกรรม จอสัมผัส 10.4-21 นิ้ว IP65 เลือก CPU ได้ สำหรับโรงงาน POS และงานควบคุม"
        collectionUrl="/gk-series"
        products={gkModels.map(m => ({ name: m.name, price: m.priceTable?.[0]?.configs?.[0]?.price, image: m.image, description: `${m.screenSize} ${m.tagline}`, category: "Industrial Panel PC" }))}
      />
      <BreadcrumbJsonLd items={[{ name: "สินค้า", path: "/products" }, { name: "GK Series", path: "/gk-series" }]} />
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="ENT GROUP" className="h-8 w-auto" />
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-semibold text-foreground">GK Series</span>
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
      <section className="relative overflow-hidden min-h-[500px] md:min-h-[600px]">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={gkHeroBanner}
            alt="GK Series Panel PC in harsh industrial environment"
            className="w-full h-full object-cover"
            width={1920}
            height={800}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative container max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 backdrop-blur-sm text-primary text-xs font-bold tracking-widest uppercase mb-6 border border-primary/20">
              Industrial Panel PC
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 tracking-tight text-foreground">
              คอมพิวเตอร์อุตสาหกรรม<br />
              ที่เลือก <span className="text-gradient">'สมอง'</span> ได้ตามใจคุณ
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
              Panel PC อุตสาหกรรม GK Series โดดเด่นด้านความยืดหยุ่นสูงที่สุด — สามารถเลือกขนาดหน้าจอและ CPU/OS ที่แตกต่างกันได้ในบอดี้ที่ทนทานเหมือนกัน ตั้งแต่ 10.4" ถึง 21" Full HD
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              {[
                { value: "IP65", label: "กันฝุ่น กันน้ำ" },
                { value: "24/7", label: "ทำงานต่อเนื่อง" },
                { value: "-10~60°C", label: "ทนอุณหภูมิสุดขีด" },
                { value: "10.4\"–21\"", label: "เลือกขนาดได้" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-black text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/datasheets/0597a3_b7e91a40254040a3b28e20e2641312cd.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                Product Overview <ExternalLink size={16} />
              </a>
              <a
                href="#comparison"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-background/60 backdrop-blur-sm border border-border text-foreground font-semibold hover:bg-muted transition-colors">
                เปรียบเทียบรุ่น
              </a>
              <a
                href="#gk1004"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-background/60 backdrop-blur-sm border border-border text-foreground font-semibold hover:bg-muted transition-colors"
                ดูสินค้าทั้งหมด <ChevronDown size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Concept Cards */}
      <section className="section-padding">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">Why GK Series?</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              เลือก<span className="text-gradient">ได้ตามใจคุณ</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {concepts.map((c) => (
              <div key={c.title} className="card-surface p-6 hover:border-primary/30 transition-all hover:-translate-y-1">
                <c.icon className="text-primary mb-4" size={32} />
                <h3 className="font-bold text-foreground mb-1 text-sm">{c.title}</h3>
                <p className="text-xs text-primary mb-2">{c.titleEn}</p>
                <p className="text-sm text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Overview */}
      <section className="section-padding bg-muted/30" id="comparison">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">Quick Compare</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              เปรียบเทียบ<span className="text-gradient">รุ่นยอดนิยม</span>
            </h2>
            <p className="text-muted-foreground mt-3">เลือกมุมมอง สเปก / ราคา / ความคุ้มค่า พร้อมระบบกรองสินค้า</p>
          </div>
          <ComparisonSystem onQuote={(name) => { setQuoteProduct(name); setQuoteOpen(true); }} />
        </div>
      </section>

      {/* Quick Nav */}
      <section className="py-6 border-b border-border sticky top-[65px] z-40 bg-background/90 backdrop-blur-lg">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-sm text-muted-foreground shrink-0 mr-2">รุ่น:</span>
            {gkModels.map((m) => (
              <a
                key={m.id}
                href={`#${m.id}`}
                className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium border border-border hover:border-primary/50 hover:bg-primary/5 text-foreground transition-all"
                {m.name} <span className="text-muted-foreground text-xs">({m.screenSize})</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* All Models */}
      <section className="section-padding" id="models">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">Product Lineup</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold">
              สินค้า<span className="text-gradient">ทั้งหมด</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              เลือกขนาดหน้าจอที่ตอบโจทย์ — พร้อม Specification, ราคา และ Video ครบถ้วน
            </p>
          </div>

          <div className="space-y-10">
            {gkModels.map((model, idx) => (
              <ModelSection key={model.id} model={model} index={idx} onQuote={(name) => { setQuoteProduct(name); setQuoteOpen(true); }} />
            ))}
          </div>
        </div>
      </section>

      {/* Real-world photos */}
      <section className="section-padding bg-muted/30">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold">
              GK Series <span className="text-gradient">ใช้งานจริง</span>
            </h2>
            <p className="text-muted-foreground mt-2">ภาพถ่ายจากไซต์งานจริง เพื่อความมั่นใจในคุณภาพ</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "/images/wix/0597a3_7de2c07f966b4371b16dde472b035298_ddc8290f.jpg",
              "/images/wix/0597a3_0660fba37ffe49a2a004047745c69797_97306e95.jpg",
              "/images/wix/0597a3_9b8e671a00504f9784c84c5aa6a03134_03ed6c18.jpg",
              "/images/wix/0597a3_61a977e88e8d4c12ad37c88712ee9cef_e8cf6990.jpg",
              "/images/wix/0597a3_0774793f619b458d87404f6058b4d179_977903bf.jpg",
              "/images/wix/0597a3_3ad6e6ac09f04cc08bb72b10ef484871_e0d0ed03.jpg",
              "/images/wix/0597a3_1e39ed0fe74245629b16b5e5ea5d0a6c_573b67b0.jpg",
              "/images/wix/0597a3_27159c0c9ec54624b72408d7a94b8065_faf2eb07.jpg",
            ].map((img, i) => (
              <img key={i} src={img} alt="GK Series installation" className="w-full aspect-square object-cover rounded-xl" loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Section — Tabbed by model */}
      {(() => {
        const videoTabs: Record<string, { id: string; title: string }[]> = {
          "ทั้งหมด": [
            { id: "v33ZXk1KZLA", title: "GK1004 Introduction" },
            { id: "cUqG6xWQegE", title: "GK1004 How to Choose" },
            { id: "jWM0vEKoAAE", title: "GK1004 รายละเอียดเพิ่มเติม" },
            { id: "xXaUYlbVy5o", title: "GK1004 การใช้งาน" },
            { id: "_UqXHR6iCMA", title: "GK1501 Introduction" },
            { id: "JVnNQcTupgE", title: "GK1501 รีวิวเพิ่มเติม" },
            { id: "O5fd-_ZfWR0", title: "GK1506 Introduction" },
            { id: "szVVTv5tmJs", title: "GK1506 รีวิวเพิ่มเติม" },
            { id: "ZZlkdSgJAzs", title: "GK1506 สาธิตการใช้งาน" },
            { id: "PeOizgJEVBc", title: "GK1506 เปรียบเทียบสเปก" },
            { id: "wNUZ1WS9Uuw", title: "GK1901 Introduction" },
            { id: "rdHodN5fcDA", title: "GK2101 Introduction" },
            { id: "JMLZ82OKHl0", title: "GK2101 รีวิว" },
            { id: "V4IdJcKvh0g", title: "GK2101 สาธิตการใช้งาน" },
            { id: "_CZTxWtK3rw", title: "รีวิว Industrial Panel PC - GK Series" },
            { id: "POvzJ1FWtTU", title: "Panel PC - GK2101" },
          ],
          "GK1004": [
            { id: "v33ZXk1KZLA", title: "Introduction" },
            { id: "cUqG6xWQegE", title: "How to Choose" },
            { id: "jWM0vEKoAAE", title: "รายละเอียดเพิ่มเติม" },
            { id: "xXaUYlbVy5o", title: "การใช้งาน" },
          ],
          "GK1501": [
            { id: "_UqXHR6iCMA", title: "Introduction" },
            { id: "JVnNQcTupgE", title: "รีวิวเพิ่มเติม" },
          ],
          "GK1506": [
            { id: "O5fd-_ZfWR0", title: "Introduction" },
            { id: "szVVTv5tmJs", title: "รีวิวเพิ่มเติม" },
            { id: "ZZlkdSgJAzs", title: "สาธิตการใช้งาน" },
            { id: "PeOizgJEVBc", title: "เปรียบเทียบสเปก" },
          ],
          "GK1901": [
            { id: "wNUZ1WS9Uuw", title: "Introduction" },
          ],
          "GK2101": [
            { id: "rdHodN5fcDA", title: "Introduction" },
            { id: "JMLZ82OKHl0", title: "รีวิว" },
            { id: "V4IdJcKvh0g", title: "สาธิตการใช้งาน" },
            { id: "POvzJ1FWtTU", title: "Panel PC - GK2101" },
          ],
          "GK Series": [
            { id: "_CZTxWtK3rw", title: "รีวิว Industrial Panel PC - GK Series" },
            { id: "v33ZXk1KZLA", title: "GK1004 Introduction" },
            { id: "_UqXHR6iCMA", title: "GK1501 Introduction" },
            { id: "O5fd-_ZfWR0", title: "GK1506 Introduction" },
            { id: "wNUZ1WS9Uuw", title: "GK1901 Introduction" },
            { id: "rdHodN5fcDA", title: "GK2101 Introduction" },
            { id: "POvzJ1FWtTU", title: "Panel PC - GK2101" },
          ],
        };
        const tabKeys = Object.keys(videoTabs);
        const currentVideos = videoTabs[activeVideoTab] || videoTabs["ทั้งหมด"];

        return (
          <section className="section-padding">
            <div className="container max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-display font-bold">
                  วิดีโอ<span className="text-gradient">แนะนำ</span>
                </h2>
              </div>
              {/* Tabs */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {tabKeys.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveVideoTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                      activeVideoTab === tab
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                    {tab}
                  </button>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {currentVideos.map((v) => (
                  <div key={v.id} className="card-surface overflow-hidden">
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${v.id}`}
                        title={v.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <p className="font-semibold text-foreground text-sm">{v.title}</p>
                      <ShareButtons url={`https://youtu.be/${v.id}`} title={v.title} compact />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Podcast Section */}
      <section className="section-padding bg-muted/30">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold">
              <Headphones className="inline-block mr-2 text-primary" size={28} />
              Podcast<span className="text-gradient"> GK Series</span>
            </h2>
            <p className="text-muted-foreground mt-2">ฟังข้อมูลสินค้าแบบสบายๆ — เปิดฟังระหว่างทำงานได้เลย</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "GK1004 Intro", desc: "แนะนำ GK1004 Panel PC สเปก ฟีเจอร์ และจุดเด่น", src: "/audio/GK1004_Podcast1.wav" },
              { title: "GK1004 How to Choose", desc: "วิธีเลือกรุ่น CPU ที่เหมาะกับงานของคุณ", src: "/audio/GK1004_Podcast2.wav" },
              { title: "GK1506 Intro", desc: "แนะนำ GK1506 Panel PC 15.6\" Full HD จุดเด่นและสเปก", src: "/audio/GK1506_Podcast1.wav" },
              { title: "GK1506 Sale Scenario", desc: "สถานการณ์การขายและการเลือกรุ่น GK1506", src: "/audio/GK1506_Podcast2.wav" },
            ].map((pod, i) => (
              <div key={i} className="card-surface p-5 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Play size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{pod.title}</p>
                    <p className="text-xs text-muted-foreground">{pod.desc}</p>
                  </div>
                </div>
                <audio controls className="w-full h-10" preload="metadata">
                  <source src={pod.src} type="audio/wav" />
                </audio>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3G/4G SIM Feature */}
      <section className="section-padding bg-muted/30">
        <div className="container max-w-5xl mx-auto">
          <div className="card-surface p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Wifi className="text-primary mb-4" size={40} />
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                  ใช้อินเทอร์เน็ต<span className="text-gradient"> ไม่ต้องง้อ WiFi</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  GK Series มีช่องเสียบ SIM สามารถใช้ 3G/4G LTE ได้เลย — เชื่อมต่อได้ทุกที่ ไม่ต้องตามหา WiFi สะดวกสำหรับไซต์งานที่ไม่มีเครือข่ายอินเทอร์เน็ตสาย
                </p>
              </div>
              <div className="flex justify-center">
                <img
                  src="/images/wix/005637_9307d91084e2433eb766e611c65c7518_d90cd4b5.jpg"
                  alt="GK Series SIM slot"
                  className="rounded-xl max-w-full"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="section-padding">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">Customer Reviews</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              ลูกค้าพูดถึง<span className="text-gradient"> GK Series</span>
            </h2>
            <p className="text-muted-foreground mt-3">เสียงจากผู้ใช้งานจริงในภาคอุตสาหกรรม</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                stars: 5,
                text: "ใช้ GK2101 ติดตั้งบนไลน์ผลิตชิ้นส่วนยานยนต์มากว่า 2 ปี ฝุ่นเหล็ก น้ำมันกระเด็นตลอด แต่เครื่องไม่เคยมีปัญหา จอสัมผัสยังคงตอบสนองดีแม้ใส่ถุงมือ ประทับใจมาก",
                role: "ผู้จัดการฝ่ายผลิต",
                industry: "โรงงานชิ้นส่วนยานยนต์",
              },
              {
                stars: 5,
                text: "เปลี่ยนจากคอมตั้งโต๊ะทั่วไปมาใช้ GK1004 สำหรับระบบ POS ร้านอาหาร ทนน้ำ ทนความชื้นในครัว ใช้มา 1 ปีครึ่งไม่เคยค้างหรือต้อง Restart เลย คุ้มค่ากว่าที่คิด",
                role: "เจ้าของกิจการ",
                industry: "ธุรกิจร้านอาหาร",
              },
              {
                stars: 5,
                text: "ทีม IT ของเราชอบที่เลือก CPU ได้ตามงาน ไลน์ไหนงานเบาก็ใช้ i3 งานหนักก็อัพเป็น i7 ใส่บอดี้เดียวกัน ลดเวลาเทรนช่างได้เยอะ อะไหล่ก็ใช้ร่วมกันได้",
                role: "IT Manager",
                industry: "โรงงานอิเล็กทรอนิกส์",
              },
              {
                stars: 4,
                text: "ติดตั้ง GK1506 เป็นจอ Dashboard แสดงผล KPI แบบ Real-time ในห้อง Control Room ภาพชัด Full HD อ่านตัวเลขได้สบาย เปิด 24 ชม. ไม่มีพัดลมเสียงเงียบมาก",
                role: "วิศวกรระบบ",
                industry: "โรงไฟฟ้า",
              },
              {
                stars: 5,
                text: "ใช้ GK1004 Android สำหรับ Kiosk ลงทะเบียนผู้เยี่ยมชม บู๊ตเร็ว แอปเสถียร จอทัชลื่นไหล ลดคนดูแลจาก 3 คนเหลือ 1 คน ROI คืนทุนใน 4 เดือน เตรียมสั่งเพิ่มอีก 10 ตัว",
                role: "ผู้จัดการอาคาร",
                industry: "อาคารสำนักงาน",
              },
            ].map((review, i) => (
              <div key={i} className="card-surface p-6 relative group hover:border-primary/30 transition-colors">
                <Quote className="absolute top-4 right-4 text-primary/10 group-hover:text-primary/20 transition-colors" size={40} />
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }, (_, s) => (
                    <Star
                      key={s}
                      size={16}
                      className={s < review.stars ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}
                    />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-4">"{review.text}"</p>
                <div className="border-t border-border pt-3">
                  <p className="text-sm font-semibold text-foreground">{review.role}</p>
                  <p className="text-xs text-muted-foreground">{review.industry}</p>
                </div>
              </div>
            ))}
          </div>

          {/* PDPA Disclaimer */}
          <div className="mt-8 p-5 rounded-xl border border-primary/20 bg-primary/5 text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground"><FileText size={14} className="inline mr-1" /> หมายเหตุ:</span> ด้วยข้อบังคับตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) เราไม่สามารถเปิดเผยชื่อ-นามสกุล หรือข้อมูลที่ระบุตัวตนของลูกค้าได้
              คำชมเหล่านี้เป็น <span className="font-semibold text-foreground">คำรีวิวจริง</span> ที่ได้รับจากลูกค้าผู้ใช้งานจริง ผ่านการทำงานหนักและบริการอย่างจริงใจของทีมเรา
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container max-w-3xl mx-auto text-center">
          <Settings className="mx-auto mb-4 text-primary" size={40} />
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            สนใจ GK Series?<span className="text-gradient"> ปรึกษาเรา</span>
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
              LINE @entgroup
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-foreground font-bold text-lg hover:bg-muted transition-colors"
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

export default GKSeries;
