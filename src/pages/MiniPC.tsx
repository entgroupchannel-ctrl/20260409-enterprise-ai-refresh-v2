import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import heroMiniPC from "@/assets/hero-minipc-desk.jpg";
import ProductJsonLd from "@/components/ProductJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { ArrowLeft, ExternalLink, Cpu, Zap, Shield, Monitor, Wifi, ThermometerSun, HardDrive, Server, ChevronRight, FileText, CircleCheck, Filter, X, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import FooterCompact from "@/components/FooterCompact";
import B2BCTABanner from "@/components/B2BCTABanner";
import PriceDisclaimer from "@/components/PriceDisclaimer";
import LineQRButton from "@/components/LineQRButton";

/* ── Category Navigation ── */
const categories = [
  { id: "entry", label: "Entry-Level", desc: "Fanless, ประหยัดไฟ" },
  { id: "high", label: "High Performance", desc: "Core i5/i7, Industrial" },
  { id: "education", label: "Education & Office", desc: "สำนักงาน, โรงเรียน" },
  { id: "nano", label: "Nano PC", desc: "ขนาดจิ๋ว" },
  { id: "firewall", label: "Firewall Appliance", desc: "Multi-LAN Router" },
  { id: "signage", label: "Digital Signage", desc: "X7 / R9 Android" },
  { id: "legacy", label: "Budget Series", desc: "K6-F13, GT/GQ" },
  { id: "pricelist", label: "Price List", desc: "ตารางราคา" },
];

/* ── Entry-Level Models ── */
const entryModels = [
  {
    id: "k6-f1",
    name: "K6-F1",
    tagline: "เงียบสนิท ประหยัดไฟ 6W Fanless",
    image: "/images/wix/0597a3_6300a3994d554da8bd26cf2a234b0e34_f091f5dc.png",
    datasheet: "/datasheets/0597a3_d277dec046804dc694ac329fa7204cc2.pdf",
    highlights: [
      "เงียบสนิท — ไม่มีพัดลม ไม่มีเสียงรบกวน",
      "ประหยัดไฟสุดๆ — กินไฟเพียง 6W ทำงาน 24/7 ได้",
      "ขนาดเล็กกะทัดรัด — ประหยัดพื้นที่สุดๆ",
      "CPU 4 แกน + Intel Graphics",
      "Network 2 ช่อง, USB 4 ช่อง, Type-C 1 ช่อง",
      "ต่อจอ VGA + HDMI, ติดตั้งยืดหยุ่น",
    ],
    specs: {
      CPU: "Intel N-Series 4 Cores",
      TDP: "6W",
      Cooling: "Fanless Passive",
      Memory: "DDR4, สูงสุด 16GB",
      Storage: "M.2 SSD",
      Network: "Dual Gigabit LAN",
      Display: "VGA + HDMI",
      "I/O": "USB 3.0 ×2, USB 2.0 ×2, Type-C ×1",
      OS: "Windows & Linux",
    },
  },
  {
    id: "k6-f17h",
    name: "K6-F17H",
    tagline: "Intel N150 4-Core, Fanless 6W, Industrial",
    image: "/images/wix/0597a3_33167f5f1c224ae4a281dc30d836d9b6_87689e10.png",
    datasheet: null,
    highlights: [
      "Intel N150 4-Core สูงสุด 3.6GHz, Cache 6MB",
      "Fanless เงียบ ประหยัดพลังงาน TDP 6W",
      "ทำงานต่อเนื่อง 24/7 ในสภาพแวดล้อมอุตสาหกรรม",
      "พอร์ตครบครัน USB 3.0, VGA, Serial, Ethernet",
      "Phoenix Connector จ่ายไฟ 9-36V",
      "ขนาดกะทัดรัด ติดตั้งง่าย",
    ],
    specs: {
      CPU: "Intel N150",
      "Clock Speed": "0.8-3.6GHz",
      "Cores/Threads": "4C / 4T",
      Cache: "6 MB",
      TDP: "6W",
      Memory: "DDR4/DDR5/LPDDR5, 2× slots, สูงสุด 16GB",
      Storage: "M.2 M KEY 2280 SATA + 2.5\" HDD expansion",
      Cooling: "Fanless",
      OS: "Windows & Linux",
    },
  },
  {
    id: "k3-f18-6006",
    name: "K3-F18-6006",
    tagline: "Core i3-6006U, 6× COM Ports, Industrial Grade",
    image: "/images/wix/0597a3_74a5ab1d3b5b4f4b93ba96a0096e16de_4f98cb32.png",
    datasheet: "/datasheets/0597a3_31fb9b826f644de3a16ad9bbb78cbf76.pdf",
    highlights: [
      "Industrial-Grade ทำงาน -20°C ถึง 50°C",
      "6 Serial Ports RS232/RS485 สำหรับเครื่องจักร",
      "Dual LAN + 8 USB Ports",
      "Dual HDMI 4K แสดงผล 2 จอพร้อมกัน",
      "ขนาด 13.4×12.7×5.4 cm น้ำหนัก 1.25kg",
      "TDP 15W, Fanless, เงียบ 100%",
    ],
    specs: {
      CPU: "Intel Core i3-6006U @ 2.00GHz",
      "Cores/Threads": "2C / 4T",
      Cache: "3MB Smart Cache",
      TDP: "15W",
      Architecture: "Skylake",
      Memory: "2×DDR4L, สูงสุด 32GB",
      Storage: "M.2 2280 SSD + SATA3.0",
      Network: "Intel i211AT + Intel i219 Dual GbE",
      Display: "Dual HDMI 4K",
      "I/O": "6×COM, 4×USB3.0, 4×USB2.0",
      OS: "Windows & Linux",
    },
  },
  {
    id: "k3-f17h",
    name: "K3-F17H",
    tagline: "Core i3-5005U, Dual GbE LAN, 4× COM, WiFi6 + 4G",
    image: "/images/wix/0597a3_fb38b6b4f7db40b2be215ba7ba711cb9_1df6c159.png",
    datasheet: "/datasheets/0597a3_60bf722fa4d245beae9a5b3047a29f34.pdf",
    highlights: [
      "Dual Gigabit LAN — หายากใน Mini PC ทั่วไป",
      "COM Ports 4 ตัว Voltage Switching",
      "Built-in Socket Pins 20+ สำหรับขยายระบบ",
      "WiFi6 + 4G Module พร้อม SIM slot",
      "เปลือกอลูมิเนียม + Passive Cooling",
      "เหมาะ Industrial Automation, Network, OEM",
    ],
    specs: {
      CPU: "Intel Core i3-5005U @ 2.0GHz",
      "Cores/Threads": "2C / 4T",
      Cache: "3 MB",
      TDP: "15W",
      Architecture: "Broadwell (5th Gen)",
      Memory: "2× DDR3L, สูงสุด 16GB",
      Storage: "M.2 SATA + 2.5\" expansion",
      Network: "Dual Gigabit LAN",
      Wireless: "WiFi6 + 4G Module (optional)",
      "I/O": "4× COM, USB 3.0, USB 2.0",
      OS: "Windows & Linux",
    },
  },
];

/* ── High Performance Models ── */
const highModels = [
  {
    id: "k8-f18-4405",
    name: "K8-F18-4405",
    tagline: "Pentium 4405U, 6× COM, Dual HDMI 4K, Fanless",
    image: "/images/wix/0597a3_20f2fab2255a443db57fe7128d67d6e2_eb4b5d97.png",
    datasheet: "/datasheets/0597a3_789e5ed0d54a486aa137e849c6fe15f0.pdf",
    highlights: [
      "Intel Pentium 4405U Skylake 2.10GHz",
      "Hyper-Threading เพิ่มประสิทธิภาพ",
      "DDR4L สูงสุด 32GB",
      "6× Serial COM, 8× USB, Dual HDMI 4K",
      "Dual Gigabit Ethernet",
      "Fanless อลูมิเนียม -20°C ถึง 50°C",
    ],
    specs: {
      CPU: "Intel Pentium 4405U @ 2.10GHz",
      "Cores/Threads": "2C / 4T (Hyper-Threading)",
      Cache: "2MB Smart Cache",
      TDP: "15W",
      Architecture: "Skylake",
      Memory: "2×DDR4L, สูงสุด 32GB",
      Storage: "M.2 2280 SSD + SATA3.0",
      Display: "Dual HDMI 4K",
      "I/O": "6×COM, 4×USB3.0, 4×USB2.0",
      OS: "Windows & Linux",
    },
  },
  {
    id: "k3-f17hi",
    name: "K3-F17HI",
    tagline: "Core i3, Dual GbE, 4× COM, WiFi6 + 4G, 20+ Pins",
    image: "/images/wix/0597a3_fb38b6b4f7db40b2be215ba7ba711cb9_1df6c159.png",
    datasheet: null,
    highlights: [
      "Dual Gigabit LAN + 4× COM Voltage Switching",
      "Built-in Socket Pins 20+ สำหรับขยายระบบ",
      "WiFi6 + 4G Module + SIM slot",
      "เปลือกอลูมิเนียม + Passive Cooling",
      "เหมาะ Industrial Automation, OEM Integration",
    ],
    specs: {
      CPU: "Intel Core i3 Series",
      Network: "Dual Gigabit LAN",
      "I/O": "4× COM, USB 3.0/2.0, Expansion Pins 20+",
      Wireless: "WiFi6 + 4G Module",
      Cooling: "Passive (Fanless)",
      OS: "Windows & Linux",
    },
  },
  {
    id: "k8-f17hi-3710",
    name: "K8-F17HI-3710",
    tagline: "Pentium 3710, Fanless 6W, -10°C~65°C",
    image: "/images/wix/0597a3_06a8fad9316b4c848ea8c185f1421ffb_44eaf262.png",
    datasheet: "/datasheets/0597a3_4dfde2ac9b0244a39be6002e88614959.pdf",
    highlights: [
      "Intel Pentium 3710, 4C/4T, TDP 6W",
      "ทำงาน -10°C ถึง 65°C",
      "Fanless Passive Cooling เงียบสนิท",
      "4× COM, Dual GbE, USB หลายพอร์ต",
      "Dual HDMI 4K Display",
      "อลูมิเนียมอัลลอย Industrial Grade",
    ],
    specs: {
      CPU: "Intel Pentium 3710 @ 1.6-2.56GHz",
      "Cores/Threads": "4C / 4T",
      Cache: "2 MB L2",
      TDP: "6W",
      Architecture: "Braswell",
      Memory: "1×SO-DIMM DDR3",
      Storage: "mSATA SSD + 2.5\" HDD expansion",
      Display: "Dual HDMI 4K",
      "I/O": "4× COM, USB 3.0/2.0",
      "Temp Range": "-10°C ~ 65°C",
      OS: "Windows 10/11 & Linux",
    },
  },
  {
    id: "k5-f17h",
    name: "K5-F17H",
    tagline: "Core i5-5300U, 2.3-2.9GHz Turbo, Dual GbE",
    image: "/images/wix/0597a3_fb38b6b4f7db40b2be215ba7ba711cb9_1df6c159.png",
    datasheet: "/datasheets/0597a3_c79cb4ba2db3485abf44477aeb2f817c.pdf",
    highlights: [
      "Core i5-5300U, 2.3-2.9GHz Turbo Boost",
      "ประสิทธิภาพสูงกว่า Mini PC ทั่วไป 30-40%",
      "Dual Gigabit LAN + Network Redundancy",
      "4× COM Voltage Switching (0/5/9/12V)",
      "WiFi6 + 4G Module + SIM Slot",
      "Passive Cooling, -10°C ~ 60°C",
    ],
    specs: {
      CPU: "Intel Core i5-5300U @ 2.3-2.9GHz",
      "Cores/Threads": "2C / 4T",
      Cache: "3 MB",
      TDP: "15W",
      Architecture: "Broadwell (5th Gen)",
      Memory: "2× DDR3L, สูงสุด 16GB",
      Storage: "M.2 SATA + 2.5\" expansion",
      Network: "Dual Gigabit LAN",
      Wireless: "WiFi6 + 4G (optional)",
      "I/O": "4× COM, USB 3.0/2.0, 20+ Expansion Pins",
      OS: "Windows & Linux",
    },
  },
  {
    id: "k7-f17h",
    name: "K7-F17H",
    tagline: "Core i7-5500U, 2.4-3.0GHz Turbo, Workstation Level",
    image: "/images/wix/0597a3_fb38b6b4f7db40b2be215ba7ba711cb9_1df6c159.png",
    datasheet: "/datasheets/0597a3_0f5e2b5c07ae4cd69726416340ec7210.pdf",
    highlights: [
      "Core i7-5500U, 2.4-3.0GHz Turbo",
      "ประสิทธิภาพระดับ Workstation ในรูปทรง Mini PC",
      "Dual Gigabit LAN, 4× COM, 20+ Expansion Pins",
      "WiFi6 + 4G Module + SIM Slot",
      "เปลือกอลูมิเนียม + Passive Cooling",
      "ทนสภาพแวดล้อม -10°C ~ 60°C",
    ],
    specs: {
      CPU: "Intel Core i7-5500U @ 2.4-3.0GHz",
      "Cores/Threads": "2C / 4T",
      TDP: "15W",
      Architecture: "Broadwell (5th Gen)",
      Memory: "2× DDR3L, สูงสุด 16GB",
      Storage: "M.2 SATA + 2.5\" expansion",
      Network: "Dual Gigabit LAN",
      "I/O": "4× COM, USB, 20+ Pins",
      OS: "Windows & Linux",
    },
  },
  {
    id: "k5-f17f",
    name: "K5-F17F",
    tagline: "Core i5-1155G7 Tiger Lake Gen11, 4C/8T, 4.5GHz",
    image: "/images/wix/0597a3_3ba05883e1c342bb99e35d0436424602_aa7730de.png",
    datasheet: "/datasheets/0597a3_6c3dc8e3c4b3416489327d62c7fd5f8d.pdf",
    badge: "Tiger Lake",
    highlights: [
      "Intel Core i5-1155G7 (11th Gen Tiger Lake)",
      "4 Cores / 8 Threads — เพิ่มจาก 2C/4T",
      "2.50-4.50GHz Turbo, 8MB Smart Cache",
      "Dual Gigabit LAN + 4× COM",
      "WiFi + 5G Module ready",
      "Industrial Grade, Passive Cooling",
    ],
    specs: {
      CPU: "Intel Core i5-1155G7",
      "Cores/Threads": "4C / 8T",
      "Clock Speed": "2.50 - 4.50GHz Turbo",
      Cache: "8MB Smart Cache",
      Architecture: "Tiger Lake (11th Gen)",
      Memory: "DDR4, สูงสุด 32GB",
      Storage: "M.2 NVMe + 2.5\" expansion",
      Network: "Dual Gigabit LAN",
      "I/O": "4× COM, USB 3.0/2.0, 20+ Pins",
      OS: "Windows & Linux",
    },
  },
  {
    id: "k7-f17f",
    name: "K7-F17F",
    tagline: "Core i7-1195G7 Flagship, 5.0GHz, 8K DisplayPort!",
    image: "/images/wix/0597a3_6ba1d01e29c34aefa206f89999813443_465ad83d.png",
    datasheet: "/datasheets/0597a3_664a2b2f1d5f46438439d522687faa2c.pdf",
    badge: "Flagship",
    highlights: [
      "Intel Core i7-1195G7 Tiger Lake Flagship",
      "2.90-5.0GHz Turbo, 12MB Smart Cache",
      "Intel Iris Xe Graphics",
      "8K DisplayPort (7680×4320@60Hz)!",
      "Triple Display — HDMI 4K + VGA + DP 8K",
      "5G Module ready + SIM Slot",
    ],
    specs: {
      CPU: "Intel Core i7-1195G7",
      "Cores/Threads": "4C / 8T",
      "Clock Speed": "2.90 - 5.0GHz Turbo",
      Cache: "12MB Smart Cache",
      Graphics: "Intel Iris Xe",
      Display: "HDMI 4K + VGA + DisplayPort 8K",
      Memory: "DDR4, สูงสุด 64GB",
      Storage: "M.2 NVMe + 2.5\" expansion",
      Network: "Dual Gigabit LAN",
      Wireless: "WiFi + 5G Module",
      OS: "Windows & Linux",
    },
  },
];

/* ── Education & Office Models ── */
const educationModels = [
  {
    id: "g5",
    name: "G5 Nano Mini PC",
    tagline: "ขนาด 6×6 ซม. น้ำหนัก 150g กินไฟ 10W",
    image: "/images/wix/0597a3_039ae2b8d04549279975647939a97044_b5d9a864.png",
    datasheet: "/datasheets/0597a3_50922cf5dd954a769a7e5d9eacce5db0.pdf",
    highlights: [
      "ขนาดเพียง 61.6×61.6×42mm น้ำหนัก 0.15kg!",
      "Intel Celeron J4125, 4 Core, 2.0-2.7GHz",
      "TDP เพียง 10W ประหยัดกว่าหลอดไฟ LED",
      "HDMI 4K Ultra HD (4096×2304@60Hz)",
      "WiFi AC7265 + Bluetooth ในตัว",
      "อลูมิเนียมอัลลอย สีแดง-ดำ สวยงาม",
    ],
    specs: {
      CPU: "Intel Celeron J4125 @ 2.0-2.7GHz",
      "Cores/Threads": "4C / 4T",
      Cache: "4 MB Smart Cache",
      TDP: "10W",
      Graphics: "Intel UHD Graphics 600",
      Display: "HDMI 4K (4096×2304@60Hz)",
      Memory: "DDR4, สูงสุด 8GB",
      Storage: "M.2 SSD",
      Wireless: "Intel AC7265 WiFi 2.4G/5G + BT",
      "I/O": "USB 3.0 ×2, Type-C ×1, TF Card, Audio",
      Dimensions: "61.6 × 61.6 × 42 mm",
      Weight: "0.15 kg",
      OS: "Windows 10/11, Linux",
    },
  },
  {
    id: "k3-c7",
    name: "K3-C7",
    tagline: "Core i3-6157U, Iris Plus 650, 4K Dual Display",
    image: "/images/wix/0597a3_e9ef885f05854a988704e1b2e8c1521b_938d404c.png",
    datasheet: "/datasheets/0597a3_860b680d7b2847ff9e7f5730e5a52751.pdf",
    highlights: [
      "Intel Core i3-6157U, Iris Plus Graphics 650",
      "กราฟิกแรงกว่าคู่แข่ง รองรับ 4K",
      "ต่อจอ 2 จอพร้อมกัน (VGA + HDMI)",
      "ขยาย WiFi หรือ 4G ได้ตามต้องการ",
      "Internal I/O Pins 15+ สำหรับ OEM",
      "เหมาะ Digital Signage, Network Gateway",
    ],
    specs: {
      CPU: "Intel Core i3-6157U @ 2.40GHz",
      "Cores/Threads": "2C / 4T (Hyper-Threading)",
      Cache: "3 MB Smart Cache",
      TDP: "28W",
      Architecture: "Skylake",
      Graphics: "Intel Iris Plus 650, 4K Ready",
      Display: "VGA (1080p) + HDMI (4K)",
      Memory: "1× DDR3L, สูงสุด 8GB",
      Storage: "M.2 SSD",
      Wireless: "WiFi + 4G (optional)",
      OS: "Windows & Linux",
    },
  },
  {
    id: "k5-n12",
    name: "K5-N12",
    tagline: "Core i5-8300H, 4C/8T, Gaming-Level Performance",
    image: "/images/wix/0597a3_9d19c68e9bce4cec92136118203f2b40_c4f8c92c.png",
    datasheet: "/datasheets/0597a3_e9f354d5f1d14052a008f339b458ad19.pdf",
    highlights: [
      "Intel Core i5-8300H, 4C/8T, สูงสุด 4.0GHz",
      "แรงเทียบเท่า Laptop Gaming ระดับกลาง",
      "DDR4 สูงสุด 64GB",
      "USB 8 พอร์ต, Dual Display 4K",
      "เปลือกโลหะแท้ 100% ระบายความร้อนมืออาชีพ",
      "ขยาย WiFi, 4G, Storage ได้ครบ",
    ],
    specs: {
      CPU: "Intel Core i5-8300H @ 2.3-4.0GHz",
      "Cores/Threads": "4C / 8T",
      Cache: "8 MB Smart Cache",
      TDP: "35-45W",
      Architecture: "Coffee Lake (8th Gen)",
      Graphics: "Intel UHD 630",
      Display: "HDMI 4K + VGA, Dual Display",
      Memory: "2× DDR4L, สูงสุด 64GB",
      Storage: "M.2 SATA SSD",
      "I/O": "USB 3.0/2.0 ×8",
      OS: "Windows & Linux",
    },
  },
  {
    id: "k7-n12",
    name: "K7-N12",
    tagline: "Core i7-8750H, 6C/12T, Workstation Class!",
    image: "/images/wix/0597a3_9d19c68e9bce4cec92136118203f2b40_c4f8c92c.png",
    datasheet: "/datasheets/0597a3_af7994bd251345b4bf89bc8864115f41.pdf",
    badge: "Most Powerful",
    highlights: [
      "Intel Core i7-8750H, 6C/12T, สูงสุด 4.1GHz",
      "แรงเทียบเท่า Laptop Gaming ระดับสูง!",
      "9MB Smart Cache, DDR4 สูงสุด 32GB",
      "USB 8 พอร์ต, HDMI 4K + VGA",
      "เปลือกโลหะแท้ 100%",
      "เหมาะ Video Editing, CAD, Server",
    ],
    specs: {
      CPU: "Intel Core i7-8750H @ 2.2-4.1GHz",
      "Cores/Threads": "6C / 12T (Hyper-Threading)",
      Cache: "9 MB Smart Cache",
      TDP: "35-45W",
      Architecture: "Coffee Lake (8th Gen)",
      Graphics: "Intel UHD 630",
      Display: "HDMI 4K (4096×2304@30Hz) + VGA (1080p)",
      Memory: "2× DDR4L, สูงสุด 32GB",
      Storage: "M.2 SATA SSD",
      "I/O": "USB 3.0/2.0 ×8",
      OS: "Windows & Linux",
    },
  },
];

/* ── Nano PC ── */
const nanoModels = [
  {
    id: "k1-f6-6400t",
    name: "K1-F6-6400T",
    tagline: "AMD A4, TDP 4.5W, ประหยัดพลังงานที่สุด!",
    image: "/images/wix/0597a3_53b1567a8a3e4825b92766a16e30a281_78a64ffd.png",
    datasheet: "/datasheets/0597a3_ad25ce5ea3f74504839c7ee7ca649943.pdf",
    highlights: [
      "AMD A4 Micro-6400T, 4 Core, TDP เพียง 4.5W!",
      "ประหยัดพลังงานที่สุดในโลก!",
      "Fanless 100% เงียบสนิท ทนทาน",
      "ขนาด 10×16 ซม. น้ำหนัก 600g",
      "เคสอลูมิเนียมแกร่ง + I/O ครบ",
      "RS232 COM port สำหรับ Industrial",
    ],
    specs: {
      CPU: "AMD A4 Micro-6400T",
      "Cores/Threads": "4C / 4T",
      TDP: "4.5W",
      Cooling: "Fanless 100%",
      Memory: "DDR3L",
      Storage: "mSATA SSD",
      Display: "Dual Display",
      "I/O": "RS232 COM, USB, HDMI, VGA",
      Dimensions: "~100 × 160 mm",
      Weight: "0.6 kg",
      OS: "Windows & Linux",
    },
  },
];

/* ── Firewall Models ── */
const firewallModels = [
  {
    id: "k8-f12",
    name: "K8-F12-N3700 (4 LAN)",
    tagline: "4× Gigabit LAN, Fanless 6W, Firewall/Router",
    image: "/images/wix/0597a3_ad7f2747d32c4f78b9f2fa33ffdc03c2_830d3a7c.png",
    datasheet: "/datasheets/0597a3_b97ed68def1a4060a1fd87cd21f45bb6.pdf",
    highlights: [
      "4 × RJ45 Gigabit LAN ports",
      "TDP เพียง 6W ประหยัดไฟสุดๆ",
      "น้ำหนักเพียง 0.6kg เบาที่สุด",
      "4K Ready + Dual Display",
      "Fanless design เงียบสนิท",
      "เหมาะ pfSense, OPNsense, Router/Firewall",
    ],
    specs: {
      CPU: "Intel Pentium N3700",
      TDP: "6W",
      Network: "4× Gigabit LAN",
      Cooling: "Fanless",
      Display: "Dual Display, 4K",
      Weight: "0.6 kg",
      OS: "Windows, Linux, pfSense, OPNsense",
    },
  },
  {
    id: "k8-f12c",
    name: "K8-F12C-N3700 (6 LAN)",
    tagline: "6× Gigabit LAN, Fanless 6W, Enterprise Router",
    image: "/images/wix/0597a3_a526198c6088458f9fcf2c7b4fb93994_ec13566c.png",
    datasheet: "/datasheets/0597a3_9fe53a205d694b24b3d9790a580ce737.pdf",
    highlights: [
      "6 × RJ45 Gigabit LAN ports",
      "TDP เพียง 6W ประหยัดไฟสุดๆ",
      "น้ำหนักเพียง 0.6kg",
      "4K Ready + Dual Display",
      "Fanless design เงียบสนิท",
      "เหมาะ Enterprise Firewall, SOHO Router",
    ],
    specs: {
      CPU: "Intel Pentium N3700",
      TDP: "6W",
      Network: "6× Gigabit LAN",
      Cooling: "Fanless",
      Display: "Dual Display, 4K",
      Weight: "0.6 kg",
      OS: "Windows, Linux, pfSense, OPNsense",
    },
  },
];

/* ── Digital Signage Models ── */
const signageModels = [
  {
    id: "r9",
    name: "R9 Digital Signage Player",
    tagline: "Android, Dual LVDS, Dual HDMI 4K, IR Remote",
    image: "/images/wix/0597a3_42d62d54f19545129af65186b0a93cba_98438629.png",
    datasheet: "/datasheets/0597a3_ff0ba2e724c44d79ae076bb9a5e71e18.pdf",
    highlights: [
      "Dual LVDS 6/8 บิต แสดงผล 2 หน้าจอ",
      "1080P output, จอ 7 นิ้วขึ้นไป",
      "Dual HDMI + 4K video playback",
      "IR Remote Control, WiFi 2.4/5GHz",
      "Bluetooth 4.1-BLE, USB 3.0",
      "Android OS พร้อมใช้งาน",
    ],
    specs: {
      SoC: "ARM-based Processor",
      Display: "Dual LVDS 6/8-bit + Dual HDMI",
      Resolution: "สูงสุด 4K",
      Wireless: "WiFi 2.4/5GHz + BT 4.1-BLE",
      "I/O": "USB 3.0, IR Receiver",
      OS: "Android 7-10",
    },
    gallery: [
      "/images/wix/0597a3_789647ea8e3e491ea997ff3a263c5da9_87364db6.png",
      "/images/wix/0597a3_1155bccf1be749bea87d526d72cfd120_b316a753.png",
      "/images/wix/0597a3_9343a5429b1848da99e6d1dc07c1d001_5039bd2a.png",
      "/images/wix/0597a3_6909454cbcfa4b26a99be861183368d2_336a21c5.png",
    ],
  },
  {
    id: "x7",
    name: "X7 Digital Signage Player",
    tagline: "RK3288 Quad-Core, Dual LVDS 2K, 4K HDMI",
    image: "/images/wix/005637_1a239b98b4f940c28220e5c71d0702ef_770202a3.png",
    datasheet: "/datasheets/0597a3_7275cc99c2504a12a02a3d098ea8ac8a.pdf",
    highlights: [
      "Rockchip RK3288 Quad-Core",
      "Dual LVDS 6/8/10-bit, หน้าจอ 7-108 นิ้ว",
      "2K resolution + eDP output",
      "4K×2K HDMI 2160P output",
      "IR Remote + Bluetooth + 4G/3G Module",
      "รองรับ Serial Port, IO Port, MIPI Camera",
    ],
    specs: {
      SoC: "Rockchip RK3288 Quad-Core",
      Display: "Dual LVDS 6/8/10-bit + HDMI + eDP",
      Resolution: "สูงสุด 4K×2K (2160P)",
      "Screen Size": "7\" - 108\"",
      Wireless: "WiFi + BT + 4G/3G (optional)",
      "I/O": "Serial Port, IO Port, USB, MIPI Camera, HDMI OUT",
      OS: "Android",
    },
  },
];

/* ── Legacy/Budget Models ── */
const legacyModels = [
  {
    id: "k6-f13a",
    name: "K6-F13A",
    tagline: "N2840 Quad Core, RAM 4GB, SSD 64GB, WiFi พร้อมใช้",
    image: "/images/wix/005637_7660fefadbf44ce595c021bbb10bc142_c72362f1.jpg",
    datasheet: "/datasheets/005637_f0d6b09fb3b748039badafd362ea6689.pdf",
    highlights: [
      "N2840 Quad Core 1.83-2.2GHz",
      "RAM 4GB + SSD 64GB (ปรับแต่งได้)",
      "Dual LAN + Dual HDMI",
      "4× USB (2×3.0 + 2×2.0)",
      "WiFi ในตัว พร้อมใช้งานทันที",
      "ขนาด 134×124×36 mm",
    ],
    specs: {
      CPU: "Intel N2840 Quad Core @ 1.83-2.2GHz",
      GPU: "Intel HD Graphics (Atom Z3700)",
      RAM: "4 GB (ปรับแต่งได้)",
      SSD: "64 GB (ปรับแต่งได้)",
      Network: "2× LAN (Intel I211-AT + RTL8111E)",
      Display: "2× HDMI",
      "I/O": "2×USB3.0, 2×USB2.0, 2×RJ45",
      Dimensions: "134 × 124 × 36 mm",
      OS: "Windows 7/8/10, Linux",
    },
  },
  {
    id: "k6-f13d",
    name: "K6-F13D",
    tagline: "N3710 Quad Core, RAM 2GB, SSD 64GB, WiFi",
    image: "/images/wix/005637_e1ed3b88204f40ffbe98269b03df27af_4fc137ab.jpg",
    datasheet: "/datasheets/3e5003_c865b0cfae29409eadb38ef072d102ae.pdf",
    highlights: [
      "N3710 Quad Core 1.6-2.5GHz",
      "RAM 2GB + SSD 64GB (ปรับแต่งได้)",
      "VGA + HDMI output",
      "USB 2.0 ×2, GbE LAN",
      "WiFi ในตัว พร้อมใช้",
      "ขนาด 134×36.5×126 mm",
    ],
    specs: {
      CPU: "Intel N3710 Quad Core @ 1.6-2.5GHz",
      GPU: "Intel HD Graphics (Atom Z3700)",
      RAM: "2 GB (ปรับแต่งได้)",
      SSD: "64 GB (ปรับแต่งได้)",
      Display: "VGA + HDMI",
      "I/O": "USB2.0 ×2, MIC, SPK",
      Network: "Gigabit LAN",
      Dimensions: "134 × 36.5 × 126 mm",
      OS: "Windows 7/8/10, Linux",
    },
  },
];

/* ── Product Card Component ── */
const ProductCard = ({ model, onQuote }: { model: any; onQuote?: (name: string) => void }) => (
  <div id={model.id} className="card-surface overflow-hidden scroll-mt-24">
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="md:w-1/3 flex items-center justify-center">
          <div className="relative bg-secondary/50 rounded-xl p-4 w-full flex items-center justify-center min-h-[200px]">
            <img src={model.image} alt={model.name} className="max-w-full max-h-[200px] object-contain" loading="lazy" />
          </div>
        </div>
        <div className="md:w-2/3">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl md:text-2xl font-display font-bold text-foreground">{model.name}</h3>
            {model.badge && (
              <Badge className="bg-primary text-primary-foreground text-xs">{model.badge}</Badge>
            )}
            >
          </div>
          <p className="text-sm text-muted-foreground mb-4">{model.tagline}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {model.highlights?.map((h: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <CircleCheck size={15} className="text-primary mt-0.5 shrink-0" />
                <span className="text-foreground/80">{h}</span>
              </div>
            ))}
            >
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="specs" className="w-full">
        <TabsList className="w-full justify-start bg-secondary/50 overflow-x-auto">
          <TabsTrigger value="specs" className="text-xs md:text-sm">►Specification</TabsTrigger>
          {model.gallery && <TabsTrigger value="gallery" className="text-xs md:text-sm">►Gallery</TabsTrigger>}
        </TabsList>
        <TabsContent value="specs">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
            {Object.entries(model.specs || {}).map(([key, val]) => (
              <div key={key} className="bg-secondary/30 rounded-lg p-3 border border-border/50">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-primary/70 mb-1">{key}</div>
                <div className="text-sm font-medium text-foreground leading-snug">{val as string}</div>
              </div>
            ))}
            >
          </div>
        </TabsContent>
        {model.gallery && (
          <TabsContent value="gallery">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {model.gallery.map((img: string, i: number) => (
                <div key={i} className="bg-secondary/30 rounded-lg overflow-hidden">
                  <img src={img} alt={`${model.name} ${i + 1}`} className="w-full h-auto object-contain" loading="lazy" />
                </div>
              ))}
              >
            </div>
          </TabsContent>
        )}
        >
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-border">
        {model.datasheet && (
          <Button variant="outline" size="sm" asChild>
            <a href={model.datasheet} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Datasheet
            </a>
          </Button>
        )}
        >
        <Button size="sm" onClick={() => onQuote?.(model.name)}>
          <FileText className="w-3.5 h-3.5 mr-1.5" /> ขอใบเสนอราคา
        </Button>
      </div>
    </div>
  </div>
);

/* ── Section Component ── */
const CategorySection = ({ id, title, subtitle, icon: Icon, models, onQuote }: {
  id: string; title: string; subtitle: string; icon: any; models: any[]; onQuote?: (name: string) => void;
}) => (
  <section id={id} className="scroll-mt-24">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
    <div className="space-y-6">
      {models.map((m) => <ProductCard key={m.id} model={m} onQuote={onQuote} />)}
      >
    </div>
  </section>
);

/* ── Main Page ── */
const MiniPC = () => {
  const [activeCategory, setActiveCategory] = useState("entry");
  const [quoteProduct, setQuoteProduct] = useState<string | null>(null);

  /* ── Price List Data & Filters ── */
  const allPriceItems = [
    { model: "K6-F1", cpu: "Intel N3160", ram: "4GB", storage: "128GB", price: "8,190", priceNum: 8190, category: "Entry-Level", cpuLevel: "Celeron/Atom" },
    { model: "K1", cpu: "AMD 6400T", ram: "4GB", storage: "128GB", price: "8,290", priceNum: 8290, category: "Entry-Level", cpuLevel: "Celeron/Atom" },
    { model: "K8-F12", cpu: "Intel N3700", ram: "4GB", storage: "128GB", price: "9,390", priceNum: 9390, category: "Nano & Firewall", cpuLevel: "Pentium" },
    { model: "G5", cpu: "Intel Celeron J4125", ram: "8GB", storage: "256GB", price: "9,690", priceNum: 9690, category: "Education & Office", cpuLevel: "Celeron/Atom" },
    { model: "K8-F17HI", cpu: "Intel Pentium 3710", ram: "4GB", storage: "128GB", price: "9,790", priceNum: 9790, category: "Entry-Level", cpuLevel: "Pentium" },
    { model: "K8-F12", cpu: "Intel N3700", ram: "4GB", storage: "128GB", price: "9,890", priceNum: 9890, category: "Nano & Firewall", cpuLevel: "Pentium" },
    { model: "F17H6C", cpu: "Intel Pentium 4405U", ram: "4GB", storage: "128GB", price: "10,390", priceNum: 10390, category: "Entry-Level", cpuLevel: "Pentium" },
    { model: "K3-C7", cpu: "Intel Core i3-6157U", ram: "4GB", storage: "128GB", price: "11,390", priceNum: 11390, category: "Education & Office", cpuLevel: "Core i3" },
    { model: "K3-F17H", cpu: "Intel i3-5005U", ram: "4GB", storage: "128GB", price: "11,990", priceNum: 11990, category: "Entry-Level", cpuLevel: "Core i3" },
    { model: "F17H6C", cpu: "Intel Core i3-6006U", ram: "4GB", storage: "128GB", price: "13,590", priceNum: 13590, category: "Entry-Level", cpuLevel: "Core i3" },
    { model: "K5-N12", cpu: "Intel Core i5-8300H", ram: "8GB DDR4", storage: "256GB", price: "15,490", priceNum: 15490, category: "Education & Office", cpuLevel: "Core i5" },
    { model: "K7-N12", cpu: "Intel Core i7-8750H", ram: "8GB DDR4", storage: "256GB", price: "16,890", priceNum: 16890, category: "Education & Office", cpuLevel: "Core i7" },
    { model: "K5-F17H", cpu: "Intel i5-5300U", ram: "4GB", storage: "128GB", price: "17,790", priceNum: 17790, category: "High Performance", cpuLevel: "Core i5" },
    { model: "K7-F17H", cpu: "Intel i7-5500U", ram: "4GB", storage: "128GB", price: "19,290", priceNum: 19290, category: "High Performance", cpuLevel: "Core i7" },
    { model: "K3-F17H", cpu: "Intel i3-1125G4", ram: "4GB", storage: "128GB", price: "19,690", priceNum: 19690, category: "High Performance", cpuLevel: "Core i3" },
    { model: "K5-F17H", cpu: "Intel i5-1155G7", ram: "4GB", storage: "128GB", price: "24,590", priceNum: 24590, category: "High Performance", cpuLevel: "Core i5" },
    { model: "K7-F17H", cpu: "Intel i7-1195G7", ram: "4GB", storage: "128GB", price: "27,290", priceNum: 27290, category: "High Performance", cpuLevel: "Core i7" },
    { model: "K6-F17H", cpu: "Intel N150 4C", ram: "4GB", storage: "128GB", price: "สอบถาม", priceNum: 0, category: "Entry-Level", cpuLevel: "Celeron/Atom" },
    { model: "K3-F18-6006", cpu: "Intel Core i3-6006U", ram: "8GB", storage: "128GB", price: "สอบถาม", priceNum: 0, category: "Entry-Level", cpuLevel: "Core i3" },
    { model: "K3-F17HI", cpu: "Intel Core i3 Series", ram: "4GB", storage: "128GB", price: "สอบถาม", priceNum: 0, category: "High Performance", cpuLevel: "Core i3" },
    { model: "K5-F17F", cpu: "Intel i5-1155G7 11th", ram: "8GB", storage: "256GB", price: "สอบถาม", priceNum: 0, category: "High Performance", cpuLevel: "Core i5" },
    { model: "K7-F17F", cpu: "Intel i7-1195G7 11th", ram: "16GB", storage: "256GB", price: "สอบถาม", priceNum: 0, category: "High Performance", cpuLevel: "Core i7" },
    { model: "K8-F18-4405", cpu: "Intel Pentium 4405U", ram: "8GB", storage: "128GB", price: "สอบถาม", priceNum: 0, category: "High Performance", cpuLevel: "Pentium" },
    { model: "K8-F12C (6LAN)", cpu: "Intel N3700", ram: "4GB", storage: "128GB", price: "สอบถาม", priceNum: 0, category: "Nano & Firewall", cpuLevel: "Pentium" },
    { model: "Windows 10 Pro OEM", cpu: "-", ram: "-", storage: "-", price: "3,950", priceNum: 3950, category: "Software", cpuLevel: "-" },
    { model: "Windows 11 Pro OEM", cpu: "-", ram: "-", storage: "-", price: "4,590", priceNum: 4590, category: "Software", cpuLevel: "-" },
  ];

  const priceCategories = ["ทั้งหมด", "Entry-Level", "High Performance", "Education & Office", "Nano & Firewall", "Software"];
  const cpuLevels = ["ทั้งหมด", "Celeron/Atom", "Pentium", "Core i3", "Core i5", "Core i7"];
  const priceRanges = [
    { label: "ทั้งหมด", min: 0, max: Infinity },
    { label: "ต่ำกว่า ฿5,000", min: 0, max: 5000 },
    { label: "฿5,000–10,000", min: 5000, max: 10000 },
    { label: "฿10,000–20,000", min: 10000, max: 20000 },
    { label: "฿20,000 ขึ้นไป", min: 20000, max: Infinity },
  ];

  const [filterCat, setFilterCat] = useState("ทั้งหมด");
  const [filterCpu, setFilterCpu] = useState("ทั้งหมด");
  const [filterPrice, setFilterPrice] = useState(0);

  const filteredPriceItems = allPriceItems.filter((item) => {
    if (filterCat !== "ทั้งหมด" && item.category !== filterCat) return false;
    if (filterCpu !== "ทั้งหมด" && item.cpuLevel !== filterCpu) return false;
    const range = priceRanges[filterPrice];
    if (item.priceNum === 0 && filterPrice !== 0) return false;
    if (item.priceNum > 0 && (item.priceNum < range.min || item.priceNum > range.max)) return false;
    return true;
  });

  const hasFilters = filterCat !== "ทั้งหมด" || filterCpu !== "ทั้งหมด" || filterPrice !== 0;
  const clearFilters = () => { setFilterCat("ทั้งหมด"); setFilterCpu("ทั้งหมด"); setFilterPrice(0); setCurrentPage(1); };

  const PAGE_SIZE = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filteredPriceItems.length / PAGE_SIZE));
  const paginatedItems = filteredPriceItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset page when filters change
  const handleFilterCat = (v: string) => { setFilterCat(v); setCurrentPage(1); };
  const handleFilterCpu = (v: string) => { setFilterCpu(v); setCurrentPage(1); };
  const handleFilterPrice = (v: number) => { setFilterPrice(v); setCurrentPage(1); };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="Mini PC Series — คอมพิวเตอร์ขนาดเล็กสมรรถนะสูง" description="Mini PC จากโรงงานผู้ผลิตโดยตรง ครอบคลุมทุกการใช้งานตั้งแต่ Entry-Level จนถึง Workstation Class ราคาเริ่มต้น 8,190 บาท" path="/mini-pc" />
      <ProductJsonLd
        collectionName="Mini PC Series"
        collectionDescription="คอมพิวเตอร์ขนาดเล็กสมรรถนะสูง จากโรงงานผู้ผลิตโดยตรง ราคาเริ่มต้น 8,190 บาท"
        collectionUrl="/mini-pc"
        products={[
          { name: "K6-F1 Mini PC", price: "4,900", category: "Mini PC" },
          { name: "K6-F17H Mini PC", price: "5,500", category: "Mini PC" },
          { name: "K3-F18-6006 Mini PC", price: "8,900", category: "Mini PC" },
          { name: "K3-F17H Mini PC", price: "8,500", category: "Mini PC" },
          { name: "K8-F18-4405 Mini PC", price: "9,500", category: "Mini PC" },
        ]}      />

      <BreadcrumbJsonLd items={[{ name: "สินค้า", path: "/products" }, { name: "Mini PC", path: "/mini-pc" }]} />
      {/* Sticky Breadcrumb */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md py-3 border-b border-border">
        <div className="container max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> หน้าหลัก
            </Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-foreground font-medium">Mini PC</span>
          </nav>
        </div>
      </div>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroMiniPC} alt="Mini PC on modern desk setup" className="w-full h-full object-cover" width={1920} height={768} />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        </div>
        <div className="relative container max-w-7xl mx-auto px-4 py-16 md:py-24">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">B2B Industrial Platform</Badge>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4 max-w-2xl">
            Mini PC <span className="text-gradient">Series</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mb-6">
            เล็กกว่า แต่ทำได้เท่า PC ตั้งโต๊ะ — วางบนโต๊ะทำงานแทน Desktop ได้ทันที ประหยัดพื้นที่ ประหยัดไฟ ราคาเริ่มต้นเพียง 8,190 บาท
          </p>
          <div className="flex flex-wrap gap-6 mb-8">
            {[
              { value: "6W", label: "กินไฟต่ำสุด" },
              { value: "24/7", label: "ทำงานต่อเนื่อง" },
              { value: "8,190.-", label: "ราคาเริ่มต้น" },
              { value: "50+", label: "รุ่นให้เลือก" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl md:text-3xl font-display font-extrabold text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
            >
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setQuoteProduct("Mini PC")}>
              <FileText className="w-3.5 h-3.5 mr-1.5" /> ขอใบเสนอราคา
            </Button>
            <Button variant="outline" onClick={() => document.getElementById("pricelist")?.scrollIntoView({ behavior: "smooth" })}>
              ดูตารางราคา
            </Button>
            <LineQRButton className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[#06C755] text-[#06C755] font-medium text-sm hover:bg-[#06C755]/10 transition-colors">
              <MessageSquare className="w-4 h-4" /> สอบถามทาง LINE
            </LineQRButton>
          </div>
        </div>
      </section>

      {/* Why ENTGROUP */}
      <div className="container max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { icon: Shield, title: "ความแกร่งที่พิสูจน์แล้ว", desc: "ออกแบบให้ใช้งานได้นาน ทนต่อสภาพแวดล้อมหนัก ไม่ต้องกังวลความร้อนหรือฝุ่น" },
            { icon: Cpu, title: "ขนาดกะทัดรัด แต่ครบครัน", desc: "ใช้พื้นที่น้อย เสียบใช้งานได้เลย รองรับสาย+อุปกรณ์ครบครัน" },
            { icon: Server, title: "ปรับแต่งได้ตามต้องการ", desc: "บริการ OEM สำหรับธุรกิจ สั่งทำพิเศษได้ ปริมาณขั้นต่ำไม่สูง" },
          ].map((f, i) => (
            <div key={i} className="card-surface p-5">
              <f.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
          >
        </div>

        {/* Category Quick Nav */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border -mx-4 px-4 py-3 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                >
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/50 text-foreground/70 border-border hover:border-primary/30"
                }`}
              >
                <div>{cat.label}</div>
                <div className="text-[10px] opacity-70">{cat.desc}</div>
              </a>
            ))}
            >
          </div>
        </div>

        {/* All Sections */}
        <div className="space-y-16">
          <CategorySection id="entry" title="Industrial Mini PC — Entry Level" subtitle="Fanless, ประหยัดไฟ, เหมาะงาน 24/7" icon={Zap} models={entryModels} onQuote={(name) => setQuoteProduct(name)} />
          <CategorySection id="high" title="Industrial Mini PC — High Performance" subtitle="Core i5/i7, Tiger Lake, Workstation Class" icon={Cpu} models={highModels} onQuote={(name) => setQuoteProduct(name)} />
          <CategorySection id="education" title="Mini PC for Education & Office" subtitle="สำนักงาน, โรงเรียน, Workstation ทดแทน" icon={Monitor} models={educationModels} onQuote={(name) => setQuoteProduct(name)} />
          <CategorySection id="nano" title="Nano PC" subtitle="ขนาดจิ๋ว ประหยัดพลังงานสูงสุด" icon={HardDrive} models={nanoModels} onQuote={(name) => setQuoteProduct(name)} />
          <CategorySection id="firewall" title="Firewall Appliance" subtitle="Multi-LAN Router, pfSense/OPNsense" icon={Shield} models={firewallModels} onQuote={(name) => setQuoteProduct(name)} />
          <CategorySection id="signage" title="Digital Signage Player" subtitle="Android-based, X7/R9 Series" icon={Monitor} models={signageModels} onQuote={(name) => setQuoteProduct(name)} />
          <CategorySection id="legacy" title="Budget Series — K6-F13" subtitle="ราคาประหยัด สำหรับงานพื้นฐาน" icon={Server} models={legacyModels} onQuote={(name) => setQuoteProduct(name)} />

          {/* Price List */}
          <section id="pricelist" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Server className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">ตารางราคาสินค้า Mini PC — Price List</h2>
                <p className="text-sm text-muted-foreground">ราคาอัปเดตล่าสุด 2025</p>
              </div>
            </div>

            {/* Smart Filter */}
            <div className="card-surface p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter size={16} className="text-primary" />
                <span className="text-sm font-bold text-foreground">ตัวกรองสินค้า</span>
                {hasFilters && (
                  <button onClick={clearFilters} className="ml-auto inline-flex items-center gap-1 text-xs text-destructive hover:underline">
                    <X size={12} /> ล้างตัวกรอง
                  </button>
                )}
                >
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {/* Category Filter */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">หมวดหมู่</label>
                  <select
                    value={filterCat}
                    onChange={(e) => handleFilterCat(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    {priceCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                    >
                  </select>
                </div>
                {/* CPU Level Filter */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">ระดับ CPU</label>
                  <select
                    value={filterCpu}
                    onChange={(e) => handleFilterCpu(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    {cpuLevels.map((c) => <option key={c} value={c}>{c}</option>)}
                    >
                  </select>
                </div>
                {/* Price Range Filter */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">ช่วงราคา</label>
                  <select
                    value={filterPrice}
                    onChange={(e) => handleFilterPrice(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    {priceRanges.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
                    >
                  </select>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                แสดง {filteredPriceItems.length} จาก {allPriceItems.length} รุ่น {totalPages > 1 && `(หน้า ${currentPage}/${totalPages})`}
                >
              </p>
            </div>

            <div className="card-surface overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5">
                      <TableHead className="font-bold text-foreground">รุ่น</TableHead>
                      <TableHead className="font-bold text-foreground">หมวด</TableHead>
                      <TableHead className="font-bold text-foreground">CPU</TableHead>
                      <TableHead className="font-bold text-foreground">RAM</TableHead>
                      <TableHead className="font-bold text-foreground">Storage</TableHead>
                      <TableHead className="font-bold text-foreground text-right">ราคา (฿)</TableHead>
                      <TableHead className="font-bold text-foreground"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          ไม่พบสินค้าที่ตรงกับตัวกรอง — ลองปรับเงื่อนไขใหม่
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedItems.map((r) => (
                        <TableRow key={r.model}>
                          <TableCell className="font-medium text-foreground">{r.model}</TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px]">{r.category}</Badge></TableCell>
                          <TableCell className="text-muted-foreground text-sm">{r.cpu}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{r.ram}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{r.storage}</TableCell>
                          <TableCell className="text-right font-semibold text-foreground">{r.price}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" className="text-xs text-primary" onClick={() => setQuoteProduct(r.model)}>
                              <FileText className="w-3 h-3 mr-1" /> ขอราคา
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    >
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 p-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="text-xs"
                  >
                    ← ก่อนหน้า
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        currentPage === page
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                      >
                      {page}
                    </button>
                  ))}
                  >
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="text-xs"
                  >
                    ถัดไป →
                  </Button>
                </div>
              )}

              <div className="p-5">
                <PriceDisclaimer />
              </div>
            </div>
          </section>
        </div>

        {/* Use Cases Banner */}
        <div className="mt-16 card-surface p-8 text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">เหมาะกับงานไหนบ้าง?</h2>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {[
              "งานโรงงาน / Industrial",
              "ระบบ POS หน้าร้าน",
              "Edge Computing",
              "pfSense Firewall",
              "Digital Signage",
              "สำนักงาน / Education",
              "IoT Gateway",
              "Kiosk / Self-Service",
              "Video Editing / CAD",
            ].map((u) => (
              <span key={u} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">{u}</span>
            ))}
            >
          </div>
          <Button onClick={() => setQuoteProduct("Mini PC")}>
            <FileText className="w-3.5 h-3.5 mr-1.5" /> ปรึกษาผู้เชี่ยวชาญ — ขอใบเสนอราคา
          </Button>
        </div>
      </div>
      <B2BCTABanner variant="compact" />
      <FooterCompact />
    </div>
  );
};


export default MiniPC;
