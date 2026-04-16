import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import ProductJsonLd from "@/components/ProductJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Monitor, Cpu, Shield, Puzzle, Droplets, ThermometerSun, Download, ChevronLeft, ChevronRight, FileText, Play, Headphones, Youtube, Star, Zap, Clock, Volume2, Thermometer, Wrench, Sun } from "lucide-react";
import B2BCTABanner from "@/components/B2BCTABanner";
import { Checkbox } from "@/components/ui/checkbox";
import AddToCartButton from "@/components/AddToCartButton";
import CartBadge from "@/components/CartBadge";
import badgeMotherboard from "@/assets/epc-badge-motherboard.png";
import badgeFactory from "@/assets/epc-badge-factory.png";
import badgeReliability from "@/assets/epc-badge-reliability.png";
import badgeCustomize from "@/assets/epc-badge-customize.png";
import badgeWarranty from "@/assets/epc-badge-warranty.png";
import badgeCertification from "@/assets/epc-badge-certification.png";
import { Badge } from "@/components/ui/badge";
import epcLegoBanner from "@/assets/epc-lego-banner.png";
import epcHeroFactory from "@/assets/epc-hero-factory.jpg";
import epcHeroPanelPC from "@/assets/epc-hero-panel-pc.jpg";
import epcUsecaseFactory from "@/assets/epc-usecase-factory.jpg";
import epcUsecaseColdStorage from "@/assets/epc-usecase-coldstorage.jpg";
import epcUsecaseConstruction from "@/assets/epc-usecase-construction.jpg";
import epcUsecaseFood from "@/assets/epc-usecase-food.jpg";
import epcUsecaseAutomotive from "@/assets/epc-usecase-automotive.jpg";
import epcUsecaseWarehouse from "@/assets/epc-usecase-warehouse.jpg";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FooterCompact from "@/components/FooterCompact";
import PriceDisclaimer from "@/components/PriceDisclaimer";
import EPCSeriesCompare from "@/components/EPCSeriesCompare";

/* ───── Product Data ───── */

const squareModels = [
  {
    id: "epc-s10",
    name: "EPC-S10X2A",
    size: '10"',
    ratio: "4:3",
    image: "/images/wix/0597a3_8989217128734f62bd47299daa9ad880_6f9ecf34.png",
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_ad14d113fe1e48bdb0fb90684f6a347e.pdf",
    com: "2×RS232 + 1×RS485 DB9",
  },
  {
    id: "epc-s12",
    name: "EPC-S12X2A",
    size: '12"',
    ratio: "4:3",
    image: "/images/wix/0597a3_8d0b05f5ca794468b05502a273c955f3_d6be5c17.png",
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_5bed0468c86a4b44867336905051e6fb.pdf",
    com: "2×RS232 + 1×RS485 DB9",
  },
  {
    id: "epc-s15",
    name: "EPC-S15X2A",
    size: '15"',
    ratio: "4:3",
    image: "/images/wix/0597a3_1044f895f5d842f7a7c68fcc6caf36c9_5dffe446.png",
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_7c51ca4ca1d4424f976232df9557f7e4.pdf",
    com: "4×RS232 + 2×RS485 DB9",
  },
  {
    id: "epc-s19",
    name: "EPC-S19X2A",
    size: '19"',
    ratio: "4:3",
    image: "/images/wix/0597a3_74801b56e37c4badb8f6ab099f0b5651_ee87eb35.png",
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_8425d3dbc3034586ac78ec28d4b12811.pdf",
    com: "4×RS232 + 2×RS485 DB9",
  },
];

const wideModels = [
  {
    id: "epc-w13",
    name: "EPC-W13X2A",
    size: '13.3"',
    ratio: "16:9",
    image: "/images/wix/0597a3_a24a2701c3274227be9a623a39fcad77_c5875973.png",
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_a40c0b0f82054de78ad202b3a6bce9c1.pdf",
    com: "2×RS232 + 1×RS485 DB9",
  },
  {
    id: "epc-w15",
    name: "EPC-W15X2A",
    size: '15.6"',
    ratio: "16:9",
    image: "/images/wix/0597a3_f72a672e77bc413a90eaa099e8bcfe0e_679aa82e.png",
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_b6d3208d5bfb494bb029a23ff133f57e.pdf",
    com: "2×RS232 + 1×RS485 DB9",
  },
  {
    id: "epc-w18",
    name: "EPC-W18X2A",
    size: '18.5"',
    ratio: "16:9",
    image: "/images/wix/0597a3_1afba5b0dac84a259a2dd29c1fda6909_57745515.png",
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_7018ff96f96e4a97bbd0ecdce6e4805f.pdf",
    com: "4×RS232 + 2×RS485 DB9",
  },
  {
    id: "epc-w21",
    name: "EPC-W21X2A",
    size: '21.5"',
    ratio: "16:9",
    image: "/images/wix/0597a3_cfe6c90e6ba44ef3ba3a0aa5a698f32d_2b0c00e1.png",
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_bc28e143cffa491a9a38bcf5098a87d8.pdf",
    com: "4×RS232 + 2×RS485 DB9",
  },
  {
    id: "epc-w24",
    name: "EPC-W24X2A",
    size: '23.6"',
    ratio: "16:9",
    image: "/images/wix/0597a3_67653d20f0ad4119b45a29a2927e5a2f_ada6fffb.png",
    datasheet: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_899307542dca4df6b763b3a52e2af574.pdf",
    com: "4×RS232 + 2×RS485 DB9",
  },
];

const productSelectionTable = [
  { no: 1, model: "EPC-S1062A", partNumber: "C11.01.01.001", cpu: "Intel® Celeron® J1900" },
  { no: 2, model: "EPC-S1072A", partNumber: "C11.01.05.001", cpu: "Intel® Celeron® J6412" },
  { no: 3, model: "EPC-S1092A", partNumber: "C11.01.03.001", cpu: "Intel® Core™ i3-10110U" },
  { no: 4, model: "EPC-S1092A", partNumber: "C11.01.03.002", cpu: "Intel® Core™ i5-10210U" },
  { no: 5, model: "EPC-S1092A", partNumber: "C11.01.03.003", cpu: "Intel® Core™ i7-10710U" },
  { no: 6, model: "EPC-S1022A", partNumber: "C11.01.04.001", cpu: "Intel® Core™ i3-1215U" },
  { no: 7, model: "EPC-S1022A", partNumber: "C11.01.04.002", cpu: "Intel® Core™ i5-1235U" },
  { no: 8, model: "EPC-S1022A", partNumber: "C11.01.04.003", cpu: "Intel® Core™ i5-1240P" },
  { no: 9, model: "EPC-S1022A", partNumber: "C11.01.04.004", cpu: "Intel® Core™ i7-1255U" },
];

const features = [
  {
    icon: Monitor,
    title: "หน้าจอสัมผัสหลากหลายขนาด",
    desc: "ขนาด 8-24 นิ้ว ทั้ง 4:3 และ 16:9 เทคโนโลยี Resistive และ Capacitive ใส่ถุงมือได้ ทนฝุ่นและน้ำ",
  },
  {
    icon: Cpu,
    title: "ประสิทธิภาพระดับพรีเมียม",
    desc: "Intel® Celeron ถึง Core i7 Gen 12 รองรับ RAM สูงสุด 64GB สำหรับ ERP, MES, SCADA",
  },
  {
    icon: Puzzle,
    title: "ออกแบบแบบ LEGO — ต่อเชื่อมง่าย",
    desc: "COM, USB, LAN, VGA, HDMI ครบ ขยายระบบได้เหมือน LEGO เปลี่ยนชิ้นส่วนง่าย ไม่ต้องเปลี่ยนทั้งเครื่อง",
  },
  {
    icon: Shield,
    title: "การติดตั้งที่ยืดหยุ่น",
    desc: "Panel Mount ฝังในตู้ควบคุม VESA Stand วางบนโต๊ะหรือแขวนผนัง เหมาะทุกพื้นที่",
  },
  {
    icon: Droplets,
    title: "มาตรฐานป้องกัน IP65",
    desc: "ป้องกันฝุ่น เศษโลหะ สายน้ำแรงดันสูง และสารทำความสะอาด สำหรับสภาพแวดล้อมที่เข้มงวด",
  },
  {
    icon: ThermometerSun,
    title: "ชิ้นส่วนอุตสาหกรรมแท้",
    desc: "ทนอุณหภูมิสุดขั้ว การสั่นสะเทือน ความชื้นสูง ทำงานต่อเนื่อง 24/7 อัตราขัดข้อง 0.5% ต่อปี",
  },
];

const sharedSpecs = {
  memory: "4~8GB DDR3L / 4~32GB DDR4 / 4~32GB DDR5",
  storage: "mSATA SSD",
  cooling: "Fan-less",
  os: "Windows 10/11 / Linux Ubuntu",
  usb2: "5×USB2.0 / 2×USB2.0",
  usb3: "1×USB3.0 / 4×USB3.0",
  display: "1×HDMI + 1×VGA Dual Display",
  audio: "1×Audio",
  expansion: "1×Mini PCIe Socket",
  ethernet: "2×10M/100M/1000M Intel I210 LAN",
  cpuOptions: [
    "Intel® Celeron® J1900 2.0~2.42GHz",
    "Intel® Celeron® J6412 2.0~2.6GHz",
    "Intel® Core™ i3-10110U 2.1~4.1GHz",
    "Intel® Core™ i5-10210U 1.6~4.2GHz",
    "Intel® Core™ i7-10710U 1.1~4.7GHz",
    "Intel® Core™ i3-1215U 1.2~4.4GHz",
    "Intel® Core™ i5-1235U 1.3~4.4GHz",
    "Intel® Core™ i5-1240P 1.7~4.4GHz",
    "Intel® Core™ i7-1255U 1.7~4.7GHz",
  ],
};

const priceListSquare = [
  // 10 Inch
  { size: '10"', res: "1024×768", cpu: "J1900", model: "EPC-S1062A", config: "J1900 / 4G RAM / 128G SSD / 12V", price: "฿27,990" },
  { size: '10"', res: "1024×768", cpu: "J6412", model: "EPC-S1072A", config: "J6412 / 4G RAM / 128G SSD / 12V", price: "฿27,990" },
  { size: '10"', res: "1024×768", cpu: "i3-10110U", model: "EPC-S1092A", config: "i3-10110U / 4G RAM / 128G SSD / 12V", price: "฿31,990" },
  { size: '10"', res: "1024×768", cpu: "i5-10210U", model: "EPC-S1092A", config: "i5-10210U / 4G RAM / 128G SSD / 12V", price: "฿34,990" },
  { size: '10"', res: "1024×768", cpu: "i3-1215U", model: "EPC-S1022A", config: "i3-1215U / 4G RAM / 128G SSD / 12V", price: "฿31,990" },
  { size: '10"', res: "1024×768", cpu: "i5-1235U", model: "EPC-S1022A", config: "i5-1235U / 4G RAM / 128G SSD / 12V", price: "฿33,990" },
  // 12 Inch
  { size: '12"', res: "1024×768", cpu: "J1900", model: "EPC-S1262A", config: "J1900 / 4G RAM / 128G SSD / 12V", price: "฿27,990" },
  { size: '12"', res: "1024×768", cpu: "J6412", model: "EPC-S1272A", config: "J6412 / 4G RAM / 128G SSD / 12V", price: "฿27,990" },
  { size: '12"', res: "1024×768", cpu: "i3-10110U", model: "EPC-S1292A", config: "i3-10110U / 4G RAM / 128G SSD / 12V", price: "฿32,990" },
  { size: '12"', res: "1024×768", cpu: "i5-10210U", model: "EPC-S1292A", config: "i5-10210U / 4G RAM / 128G SSD / 12V", price: "฿34,990" },
  { size: '12"', res: "1024×768", cpu: "i7-10510U", model: "EPC-S1292A", config: "i7-10510U / 4G RAM / 128G SSD / 12V", price: "฿36,990" },
  { size: '12"', res: "1024×768", cpu: "i3-1215U", model: "EPC-S1222A", config: "i3-1215U / 4G RAM / 128G SSD / 12V", price: "฿32,990" },
  { size: '12"', res: "1024×768", cpu: "i5-1235U", model: "EPC-S1222A", config: "i5-1235U / 4G RAM / 128G SSD / 12V", price: "฿33,990" },
  { size: '12"', res: "1024×768", cpu: "i7-1250U", model: "EPC-S1222A", config: "i7-1250U / 4G RAM / 128G SSD / 12V", price: "฿36,990" },
  // 15 Inch
  { size: '15"', res: "1024×768", cpu: "J1900", model: "EPC-S1562A", config: "J1900 / 4G RAM / 128G SSD / 12V", price: "฿27,990" },
  { size: '15"', res: "1024×768", cpu: "J6412", model: "EPC-S1572A", config: "J6412 / 4G RAM / 128G SSD / 12V", price: "฿27,990" },
  { size: '15"', res: "1024×768", cpu: "i3-10110U", model: "EPC-S1592A", config: "i3-10110U / 4G RAM / 128G SSD / 12V", price: "฿32,990" },
  { size: '15"', res: "1024×768", cpu: "i5-10210U", model: "EPC-S1592A", config: "i5-10210U / 4G RAM / 128G SSD / 12V", price: "฿35,990" },
  { size: '15"', res: "1024×768", cpu: "i7-10510U", model: "EPC-S1592A", config: "i7-10510U / 4G RAM / 128G SSD / 12V", price: "฿36,990" },
  { size: '15"', res: "1024×768", cpu: "i3-1215U", model: "EPC-S1522A", config: "i3-1215U / 4G RAM / 128G SSD / 12V", price: "฿32,990" },
  { size: '15"', res: "1024×768", cpu: "i5-1235U", model: "EPC-S1522A", config: "i5-1235U / 4G RAM / 128G SSD / 12V", price: "฿34,990" },
  { size: '15"', res: "1024×768", cpu: "i7-1250U", model: "EPC-S1522A", config: "i7-1250U / 4G RAM / 128G SSD / 12V", price: "฿36,990" },
  // 17 Inch
  { size: '17"', res: "1280×1024", cpu: "J1900", model: "EPC-S1762A", config: "J1900 / 4G RAM / 128G SSD / 12V", price: "฿29,990" },
  { size: '17"', res: "1280×1024", cpu: "J6412", model: "EPC-S1772A", config: "J6412 / 4G RAM / 128G SSD / 12V", price: "฿29,990" },
  { size: '17"', res: "1280×1024", cpu: "i3-10110U", model: "EPC-S1792A", config: "i3-10110U / 4G RAM / 128G SSD / 12V", price: "฿33,990" },
  { size: '17"', res: "1280×1024", cpu: "i5-10210U", model: "EPC-S1792A", config: "i5-10210U / 4G RAM / 128G SSD / 12V", price: "฿36,990" },
  { size: '17"', res: "1280×1024", cpu: "i7-10510U", model: "EPC-S1792A", config: "i7-10510U / 4G RAM / 128G SSD / 12V", price: "฿37,990" },
  { size: '17"', res: "1280×1024", cpu: "i3-1215U", model: "EPC-S1722A", config: "i3-1215U / 4G RAM / 128G SSD / 12V", price: "฿33,990" },
  { size: '17"', res: "1280×1024", cpu: "i5-1235U", model: "EPC-S1722A", config: "i5-1235U / 4G RAM / 128G SSD / 12V", price: "฿36,990" },
  { size: '17"', res: "1280×1024", cpu: "i7-1250U", model: "EPC-S1722A", config: "i7-1250U / 4G RAM / 128G SSD / 12V", price: "฿37,990" },
];

const priceListWide = [
  // 12.5 Inch
  { size: '12.5"', res: "1920×1080", cpu: "J1900", model: "EPC-W1262A", config: "J1900 / 4G RAM / 128G SSD / 12V", price: "฿28,990" },
  { size: '12.5"', res: "1920×1080", cpu: "J6412", model: "EPC-W1272A", config: "J6412 / 4G RAM / 128G SSD / 12V", price: "฿28,990" },
  { size: '12.5"', res: "1920×1080", cpu: "i3-10110U", model: "EPC-W1292A", config: "i3-10110U / 4G RAM / 128G SSD / 12V", price: "฿33,990" },
  { size: '12.5"', res: "1920×1080", cpu: "i5-10210U", model: "EPC-W1292A", config: "i5-10210U / 4G RAM / 128G SSD / 12V", price: "฿36,990" },
  { size: '12.5"', res: "1920×1080", cpu: "i7-10510U", model: "EPC-W1292A", config: "i7-10510U / 4G RAM / 128G SSD / 12V", price: "฿37,990" },
  { size: '12.5"', res: "1920×1080", cpu: "i3-1215U", model: "EPC-W1222A", config: "i3-1215U / 4G RAM / 128G SSD / 12V", price: "฿33,990" },
  { size: '12.5"', res: "1920×1080", cpu: "i5-1235U", model: "EPC-W1222A", config: "i5-1235U / 4G RAM / 128G SSD / 12V", price: "฿36,990" },
  { size: '12.5"', res: "1920×1080", cpu: "i7-1250U", model: "EPC-W1222A", config: "i7-1250U / 4G RAM / 128G SSD / 12V", price: "฿37,990" },
  // 13.3 Inch
  { size: '13.3"', res: "1920×1080", cpu: "J1900", model: "EPC-W1362A", config: "J1900 / 4G RAM / 128G SSD / 12V", price: "฿29,990" },
  { size: '13.3"', res: "1920×1080", cpu: "J6412", model: "EPC-W1372A", config: "J6412 / 4G RAM / 128G SSD / 12V", price: "฿29,990" },
  { size: '13.3"', res: "1920×1080", cpu: "i3-10110U", model: "EPC-W1392A", config: "i3-10110U / 4G RAM / 128G SSD / 12V", price: "฿33,990" },
  { size: '13.3"', res: "1920×1080", cpu: "i5-10210U", model: "EPC-W1392A", config: "i5-10210U / 4G RAM / 128G SSD / 12V", price: "฿36,990" },
  { size: '13.3"', res: "1920×1080", cpu: "i7-10510U", model: "EPC-W1392A", config: "i7-10510U / 4G RAM / 128G SSD / 12V", price: "฿38,990" },
  { size: '13.3"', res: "1920×1080", cpu: "i3-1215U", model: "EPC-W1322A", config: "i3-1215U / 4G RAM / 128G SSD / 12V", price: "฿33,990" },
  { size: '13.3"', res: "1920×1080", cpu: "i5-1235U", model: "EPC-W1322A", config: "i5-1235U / 4G RAM / 128G SSD / 12V", price: "฿36,990" },
  { size: '13.3"', res: "1920×1080", cpu: "i7-1250U", model: "EPC-W1322A", config: "i7-1250U / 4G RAM / 128G SSD / 12V", price: "฿38,990" },
  // 15.6 Inch
  { size: '15.6"', res: "1920×1080", cpu: "J1900", model: "EPC-W1562A", config: "J1900 / 4G RAM / 128G SSD / 12V", price: "฿29,990" },
  { size: '15.6"', res: "1920×1080", cpu: "i7-10510U", model: "EPC-W1592A", config: "i7-10510U / 4G RAM / 128G SSD / 12V", price: "฿37,990" },
  { size: '15.6"', res: "1920×1080", cpu: "i3-1215U", model: "EPC-W1522A", config: "i3-1215U / 4G RAM / 128G SSD / 12V", price: "฿32,990" },
  { size: '15.6"', res: "1920×1080", cpu: "i5-1235U", model: "EPC-W1522A", config: "i5-1235U / 4G RAM / 128G SSD / 12V", price: "฿37,990" },
  { size: '15.6"', res: "1920×1080", cpu: "i7-1250U", model: "EPC-W1522A", config: "i7-1250U / 4G RAM / 128G SSD / 12V", price: "฿37,990" },
  // 18.5 Inch
  { size: '18.5"', res: "1920×1080", cpu: "J1900", model: "EPC-W1862A", config: "J1900 / 4G RAM / 128G SSD / 12V", price: "฿32,990" },
  { size: '18.5"', res: "1920×1080", cpu: "J6412", model: "EPC-W1872A", config: "J6412 / 4G RAM / 128G SSD / 12V", price: "฿32,990" },
  { size: '18.5"', res: "1920×1080", cpu: "i3-10110U", model: "EPC-W1892A", config: "i3-10110U / 4G RAM / 128G SSD / 12V", price: "฿34,990" },
];

const optionsList = [
  { no: 1, product: "Windows 10 Pro OEM", price: "฿3,950" },
  { no: 2, product: "Windows 11 Pro OEM", price: "฿4,590" },
  { no: 3, product: "Windows 10 IOT", price: "฿3,950" },
  { no: 4, product: "Windows 11 IOT", price: "฿4,590" },
  { no: 5, product: "Upgrade Wifi ABGN/AC → Wifi6", price: "Call" },
  { no: 6, product: "4G Sim Card", price: "Call" },
  { no: 7, product: "5G Sim Card", price: "Call" },
  { no: 8, product: "ซื้อประกันเพิ่ม ปีที่ 2", price: "15%" },
  { no: 9, product: "ซื้อประกันเพิ่ม ปีที่ 3", price: "20%" },
];

const categories = [
  { id: "overview", label: "Overview" },
  { id: "comparison", label: "Quick Compare" },
  { id: "features", label: "Features" },
  { id: "square", label: "Square Display" },
  { id: "wide", label: "Wide Display" },
  { id: "specs", label: "Specifications" },
  { id: "pricelist", label: "Price List" },
  { id: "downloads", label: "Downloads" },
];

/* ───── Spec Table Component ───── */
const SpecTable = ({ model }: { model: typeof squareModels[0] }) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead colSpan={2} className="text-center bg-primary/10 text-primary font-bold text-base">
            {model.name} Industrial Panel PC — {model.size} ({model.ratio})
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow><TableCell className="font-medium w-1/3">CPU</TableCell><TableCell className="text-xs leading-relaxed">{sharedSpecs.cpuOptions.join(" / ")}</TableCell></TableRow>
        <TableRow><TableCell className="font-medium">Memory</TableCell><TableCell>{sharedSpecs.memory}</TableCell></TableRow>
        <TableRow><TableCell className="font-medium">Storage</TableCell><TableCell>{sharedSpecs.storage}</TableCell></TableRow>
        <TableRow><TableCell className="font-medium">Cooling</TableCell><TableCell>{sharedSpecs.cooling}</TableCell></TableRow>
        <TableRow><TableCell className="font-medium">OS</TableCell><TableCell>{sharedSpecs.os}</TableCell></TableRow>
        <TableRow><TableCell className="font-medium">USB 2.0</TableCell><TableCell>{sharedSpecs.usb2}</TableCell></TableRow>
        <TableRow><TableCell className="font-medium">USB 3.0</TableCell><TableCell>{sharedSpecs.usb3}</TableCell></TableRow>
        <TableRow><TableCell className="font-medium">COM</TableCell><TableCell>{model.com}</TableCell></TableRow>
        <TableRow><TableCell className="font-medium">Display</TableCell><TableCell>{sharedSpecs.display}</TableCell></TableRow>
        <TableRow><TableCell className="font-medium">Audio</TableCell><TableCell>{sharedSpecs.audio}</TableCell></TableRow>
        <TableRow><TableCell className="font-medium">Expansion</TableCell><TableCell>{sharedSpecs.expansion}</TableCell></TableRow>
        <TableRow><TableCell className="font-medium">Ethernet</TableCell><TableCell>{sharedSpecs.ethernet}</TableCell></TableRow>
      </TableBody>
    </Table>
  </div>
);

/* ───── Model Card ───── */
const ModelCard = ({ model, onQuote, selected, onToggleSelect }: { model: typeof squareModels[0]; onQuote?: (name: string) => void; selected?: boolean; onToggleSelect?: (name: string) => void }) => (
  <div className={`card-surface overflow-hidden group transition-all ${selected ? "ring-2 ring-primary border-primary/50" : "hover:border-primary/30"}`}>

    <div className="relative bg-secondary/30 p-6 flex items-center justify-center">
      {onToggleSelect && (
        <button onClick={() => onToggleSelect(model.name)} className="absolute top-3 left-3 z-10">
          <Checkbox checked={selected} className="h-5 w-5" />
        </button>
      )}
      <img src={model.image} alt={model.name} className="max-h-44 object-contain group-hover:scale-105 transition-transform duration-300" loading="lazy" />
    </div>
    <div className="p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-foreground">{model.name}</h3>
        <Badge variant="secondary" className="text-xs">{model.size} ({model.ratio})</Badge>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild className="flex-1">
          <a href={model.datasheet} target="_blank" rel="noopener noreferrer">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Datasheet
          </a>
        </Button>
        <Button size="sm" className="flex-1" onClick={() => onQuote?.(model.name)}>
          <FileText className="w-3.5 h-3.5 mr-1.5" /> ขอใบเสนอราคา
        </Button>
      </div>
      <div className="mt-2">
        <AddToCartButton
          productModel={model.name}
          productName={`EPC ${model.name} — Panel PC ${model.size}`}
          productDescription={`EPC Series Panel PC ${model.size} (${model.ratio}) COM: ${model.com}`}
          size="sm"
          variant="outline"
          className="w-full justify-center"
        />
      </div>
    </div>
  </div>
);

const ITEMS_PER_PAGE = 10;

/* ───── Main Component ───── */
const EPCSeries = () => {
  const [activeCategory, setActiveCategory] = useState("overview");
  const [squarePage, setSquarePage] = useState(1);
  const [widePage, setWidePage] = useState(1);
  const [quoteProduct, setQuoteProduct] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const toggleSelect = (name: string) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };


  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="EPC Series — Industrial Panel PC จอสัมผัส" description="EPC Series Panel PC อุตสาหกรรม จอสัมผัส IP65 Fanless ขนาด 10-21 นิ้ว สำหรับโรงงาน POS SCADA และงานควบคุม" path="/epc-series" />
      <ProductJsonLd
        collectionName="EPC Series Industrial Panel PC"

        collectionDescription="Panel PC อุตสาหกรรม จอสัมผัส IP65 Fanless ขนาด 10-21 นิ้ว สำหรับโรงงาน POS SCADA"

        collectionUrl="/epc-series"

        products={priceListSquare.map(m => ({ name: m.model, price: m.price, description: m.config, category: "Industrial Panel PC" }))}      />

      <BreadcrumbJsonLd items={[{ name: "สินค้า", path: "/products" }, { name: "EPC Series", path: "/epc-series" }]} />
      {/* Hero */}
      <div className="relative overflow-hidden min-h-[480px] md:min-h-[520px]">
        {/* Background Image */}
        <img src={epcHeroFactory} alt="Industrial factory environment" className="absolute inset-0 w-full h-full object-cover" width={1920} height={768} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="container max-w-7xl mx-auto px-4 py-8 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> กลับหน้าหลัก
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Text Content */}
            <div className="md:w-3/5">
              <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm mb-4">CESIPC Industrial Panel PC</Badge>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-3 leading-tight">
                EPC <span className="text-primary">Panel PC</span> Series
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-medium mb-2">
                ถึก ทน แกร่ง — สร้างมาเพื่อโรงงานจริง
              </p>
              <p className="text-sm text-white/70 leading-relaxed mb-6 max-w-xl">
                โซลูชั่นที่ยืดหยุ่นเหมือน LEGO สำหรับโรงงานไทย — ทนประกายไฟ ฝุ่นโลหะ น้ำมันกระเด็น ด้วยหน้าจอ IP65 ขนาด 10"-24" นิ้ว พร้อม CPU ตั้งแต่ Celeron ถึง Core i7 Gen 12
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { icon: Volume2, value: "0 dB", label: "Fanless ไร้เสียง" },
                  { icon: Clock, value: "24/7", label: "ทำงานต่อเนื่อง" },
                  { icon: Thermometer, value: "-20~60°C", label: "ทนอุณหภูมิสุดขั้ว" },
                  { icon: Droplets, value: "IP65", label: "กันน้ำ-กันฝุ่น" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2.5 text-center">
                    <stat.icon size={16} className="mx-auto mb-1 text-primary" />
                    <p className="text-base font-bold text-white">{stat.value}</p>
                    <p className="text-[10px] text-white/60">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 flex-wrap items-center">
                <Button size="sm" className="bg-white text-black hover:bg-white/90 font-bold" asChild>
                  <a href="https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_2521046b3a214087a30e851159a6b428.pdf" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Product Overview
                  </a>
                </Button>
                <Button size="sm" onClick={() => setQuoteProduct("EPC Series")}>
                  <FileText className="w-3.5 h-3.5 mr-1.5" /> ขอใบเสนอราคา
                </Button>
                <CartBadge />
                <Button size="sm" className="bg-amber-500 text-black hover:bg-amber-400 font-bold" asChild>
                  <a href="#comparison">
                    <Zap className="w-3.5 h-3.5 mr-1.5" /> เปรียบเทียบรุ่น
                  </a>
                </Button>
              </div>
            </div>

            {/* Product Image */}
            <div className="md:w-2/5 flex justify-center">
              <img
                src={epcHeroPanelPC}
                alt="EPC Industrial Panel PC with Touchscreen"
                className="w-full max-w-md h-auto rounded-xl shadow-2xl border border-white/10"
                width={896}
                height={1024}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Compare Section */}
      <section className="section-padding bg-muted/30" id="comparison">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">Quick Compare</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              เปรียบเทียบ<span className="text-gradient">ทุกรุ่นทุกสเปก</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">เลือกมุมมอง สเปก / ราคา / ความคุ้มค่า พร้อมกรองตามประเภทจอและระดับ CPU</p>
          </div>
          <EPCSeriesCompare onQuote={(name) => { setQuoteProduct(name); }} />
        </div>
      </section>

      {/* Sticky Nav */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50 text-foreground/70 hover:bg-secondary"
                }`}>
                {cat.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-10 space-y-16">

        {/* Overview / Certifications */}
        <section id="overview">
          <div className="card-surface overflow-hidden">
            <img
              src="/images/wix/0597a3_7c3f2bd701f340ee993f725c168c1bec_e05257e7.png"
              alt="CESIPC Certifications"
              className="w-full h-auto p-6"
              loading="lazy"
            />
          </div>
          <p className="text-sm text-muted-foreground text-center mt-3">สินค้าของเราได้รับการยอมรับและติดตั้งใช้งานกับอุตสาหกรรมระดับโลก</p>
        </section>

        {/* Industrial Grade Section */}
        <section className="card-surface p-6 md:p-8">
          <h2 className="text-xl font-display font-bold text-foreground mb-4">
            อะไรทำให้คอมพิวเตอร์ของเราเป็น Industrial-Grade จริงๆ?
          </h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            CESIPC Industrial Panel PC ไม่ได้แค่ติดป้าย "มาตรฐานอุตสาหกรรม" แต่ถูกออกแบบและผลิตให้ตอบสนองความต้องการที่เข้มงวดของสภาพแวดล้อมโรงงานจริง ผ่านการทดสอบอย่างครอบคลุม และได้รับการรับรองสำหรับการทำงานที่เชื่อถือได้
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                Icon: Droplets,
                title: "มาตรฐานป้องกัน IP65",
                desc: "แผงหน้าระดับ IP65 ปกป้องชิ้นส่วนภายในจากฝุ่น เศษโลหะ สายน้ำแรงดันสูง และสารทำความสะอาด",
              },
              {
                Icon: Wrench,
                title: "ชิ้นส่วนระดับอุตสาหกรรมแท้",
                desc: "ทนทานต่ออุณหภูมิสุดขั้ว การสั่นสะเทือน ความชื้นสูง การทำงานต่อเนื่อง 24/7 ต่างจากชิ้นส่วนระดับผู้บริโภค",
              },
              {
                Icon: Sun,
                title: "หน้าจอคมชัด",
                desc: "ความสว่างสูง 1,000 nits เหมาะกลางแจ้ง เคลือบ Anti-glare ลดแสงสะท้อน เพิ่มการมองเห็นที่ชัดเจน",
              },
            ].map((item, i) => (
              <div key={i} className="card-surface p-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3"><item.Icon size={24} className="text-primary" /></div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust Badges */}
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { image: badgeMotherboard, label: "เมนบอร์ดอุตสาหกรรมแท้" },
              { image: badgeFactory, label: "ผลิตโดยตรงจากโรงงาน" },
              { image: badgeReliability, label: "ขัดข้อง 0.5%/ปี" },
              { image: badgeCustomize, label: "ปรับแต่งเฉพาะลูกค้า" },
              { image: badgeWarranty, label: "รับประกัน 1-3 ปี" },
              { image: badgeCertification, label: "มาตรฐานสากลครบ" },
            ].map((item) => (
              <div key={item.label} className="card-surface p-4 flex flex-col items-center text-center rounded-xl hover:shadow-md transition-shadow">
                <img src={item.image} alt={item.label} className="w-16 h-16 object-contain mb-3" loading="lazy" />
                <span className="text-xs font-semibold text-foreground leading-tight">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2 text-center">คุณสมบัติและประโยชน์เด่น</h2>
          <p className="text-muted-foreground text-center mb-8">LEGO Mode Architecture — ยืดหยุ่น ขยายได้ ปรับแต่งง่าย</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div key={i} className="card-surface p-5">
                <f.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Square Display Models */}
        <section id="square">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            หน้าจอแบบสี่เหลี่ยมจตุรัส <span className="text-gradient">Square Display</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            อัตราส่วน 4:3 — พื้นที่แนวตั้งมาก เหมาะกับ List, Portrait, ระบบ Legacy และ Industrial เสถียรในการแสดงผล
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {squareModels.map((model) => (
              <ModelCard key={model.id} model={model} onQuote={(name) => setQuoteProduct(name)} selected={selectedProducts.has(model.name)} onToggleSelect={toggleSelect} />
            ))}
          </div>
        </section>

        {/* Wide Display Models */}
        <section id="wide">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            หน้าจอแบบสี่เหลี่ยมผืนผ้า <span className="text-gradient">Wide Display</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            อัตราส่วน 16:9 — พื้นที่กว้างขวาง แสดงข้อมูลหลายชุดพร้อมกัน ลดการเปลี่ยนหน้าจอ รูปทรงทันสมัย
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wideModels.map((model) => (
              <ModelCard key={model.id} model={model} onQuote={(name) => setQuoteProduct(name)} selected={selectedProducts.has(model.name)} onToggleSelect={toggleSelect} />
            ))}
          </div>
        </section>

        {/* Specifications */}
        <section id="specs">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6 text-center">Specifications</h2>
          <Tabs defaultValue="epc-s10" className="w-full">
            <TabsList className="flex flex-wrap gap-1 h-auto bg-secondary/30 p-1.5 rounded-lg mb-6">
              {[...squareModels, ...wideModels].map((m) => (
                <TabsTrigger key={m.id} value={m.id} className="text-xs px-3 py-1.5">
                  {m.size} {m.ratio === "4:3" ? "□" : "▬"}
                </TabsTrigger>
              ))}
            </TabsList>
            {[...squareModels, ...wideModels].map((m) => (
              <TabsContent key={m.id} value={m.id}>

                <div className="card-surface overflow-hidden">
                  <SpecTable model={m} />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Price List */}
        <section id="pricelist">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6 text-center">
            Price List <span className="text-gradient">ราคาสินค้า</span>
          </h2>

          <Tabs defaultValue="square-price" className="w-full" onValueChange={() => { setSquarePage(1); setWidePage(1); }}>

            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="square-price">จอแบบสี่เหลี่ยมจตุรัส</TabsTrigger>
              <TabsTrigger value="wide-price">จอภาพแบบสี่เหลี่ยมผืนผ้า</TabsTrigger>
              <TabsTrigger value="options">Windows / Options</TabsTrigger>
            </TabsList>

            {["square-price", "wide-price"].map((tabValue) => {
              const data = tabValue === "square-price" ? priceListSquare : priceListWide;
              const page = tabValue === "square-price" ? squarePage : widePage;
              const setPage = tabValue === "square-price" ? setSquarePage : setWidePage;
              const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
              const paginatedData = data.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

              return (
                <TabsContent key={tabValue} value={tabValue}>

                  <div className="card-surface overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-primary/10">
                            <TableHead className="text-primary font-bold">Display Size</TableHead>
                            <TableHead className="text-primary font-bold">Resolution</TableHead>
                            <TableHead className="text-primary font-bold">Processor</TableHead>
                            <TableHead className="text-primary font-bold">Model</TableHead>
                            <TableHead className="text-primary font-bold">Configuration</TableHead>
                            <TableHead className="text-primary font-bold text-right">Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedData.map((row, i) => (
                            <TableRow key={i}>

                              <TableCell>{row.size}</TableCell>
                              <TableCell>{row.res}</TableCell>
                              <TableCell className="text-sm">{row.cpu}</TableCell>
                              <TableCell className="font-mono text-sm">{row.model}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{row.config}</TableCell>
                              <TableCell className="text-right font-bold text-primary">{row.price}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          แสดง {(page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(page * ITEMS_PER_PAGE, data.length)} จาก {data.length} รายการ
                        </p>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="h-8 w-8 p-0">
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <Button key={p} variant={p === page ? "default" : "outline"} size="sm" onClick={() => setPage(p)} className="h-8 w-8 p-0 text-xs">
                              {p}
                            </Button>
                          ))}
                          <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="h-8 w-8 p-0">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              );
            })}

            <TabsContent value="options">
              <div className="card-surface overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary/10">
                        <TableHead className="text-primary font-bold w-16">No.</TableHead>
                        <TableHead className="text-primary font-bold">Product</TableHead>
                        <TableHead className="text-primary font-bold text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {optionsList.map((row) => (
                        <TableRow key={row.no}>

                          <TableCell className="font-medium">{row.no}</TableCell>
                          <TableCell>{row.product}</TableCell>
                          <TableCell className="text-right font-bold text-primary">{row.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <PriceDisclaimer />
        </section>

        {/* Downloads */}
        <section id="downloads">
          <h2 className="text-lg font-display font-bold text-foreground mb-3 text-center">📥 Downloads</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { name: "CESIPC & ENTGROUP E-Catalog", url: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_9dad5caa6c4d4410a723cab33c3177bf.pdf" },
              ...squareModels.map((m) => ({ name: m.name, url: m.datasheet })),
              { name: "EPC-S17X2A", url: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_4aadb2eda8ae4dcdb9e1eab7d5ecf42e.pdf" },
              ...wideModels.map((m) => ({ name: m.name, url: m.datasheet })),
              { name: "EPC-W12X2A", url: "https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_06738f7618f84058a4f0c1d3cc9d8a95.pdf" },
            ].map((dl, i) => (
              <a key={i} href={dl.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group">
                <Download className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{dl.name}</span>
                <span className="text-[10px] text-muted-foreground ml-auto shrink-0">PDF</span>
              </a>
            ))}
          </div>
        </section>

        {/* Use Cases Section */}
        <section>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2 text-center">การนำไปใช้งานกิจกรรมต่างๆ</h2>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">สถานการณ์จริงที่พีซีทั่วไปไม่รอด — ต้อง EPC Panel PC เกรดอุตสาหกรรมเท่านั้น</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { image: epcUsecaseFactory, title: "โรงงานเชื่อมโลหะ", desc: "สะเก็ดไฟ ฝุ่นโลหะ ความร้อนสูง — IP65 กันได้หมด ใส่ถุงมือสัมผัสหน้าจอได้เลย", badge: "IP65 กันฝุ่น-น้ำ" },
              { image: epcUsecaseColdStorage, title: "ห้องเย็น & Cold Storage", desc: "อุณหภูมิติดลบ ความชื้นสูง — ทำงานได้ตั้งแต่ -20°C ไม่มีพัดลมไม่มีหยดน้ำ", badge: "-20°C ทนความเย็น" },
              { image: epcUsecaseConstruction, title: "ไซต์ก่อสร้าง", desc: "ฝุ่น แดดจัด ฝนตก สั่นสะเทือน — หน้าจอมองเห็นชัดกลางแดด ทนทุกสภาพอากาศ", badge: "MIL-STD ทนสั่นสะเทือน" },
              { image: epcUsecaseFood, title: "โรงงานอาหาร & เครื่องดื่ม", desc: "ล้างน้ำแรงดันสูงได้ สัมผัสจอด้วยถุงมือยาง ไม่มีซอกมุมสะสมเชื้อโรค", badge: "ล้างน้ำได้ IP65" },
              { image: epcUsecaseAutomotive, title: "สายการผลิตยานยนต์", desc: "ควบคุมหุ่นยนต์ ติดตาม OEE แบบ Real-time เชื่อมต่อ PLC/SCADA ผ่าน COM Port", badge: "24/7 ไม่หยุดพัก" },
              { image: epcUsecaseWarehouse, title: "คลังสินค้า & โลจิสติกส์", desc: "สแกนบาร์โค้ด จัดการ WMS ทนฝุ่น ทนกระแทก ติดตั้งบนสายพานลำเลียงได้", badge: "Fanless ไร้เสียง" },
            ].map((item) => (
              <div key={item.title} className="card-surface overflow-hidden rounded-xl group">
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width={768} height={512} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge className="absolute bottom-3 left-3 bg-primary/90 text-primary-foreground text-xs">{item.badge}</Badge>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-foreground mb-1.5">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ═══════════ YouTube & Podcast Section ═══════════ */}
        <section className="space-y-6">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-2 flex items-center justify-center gap-1"><Play size={14} /> Media Center</span>
            <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">
              วิดีโอ & พอดแคสต์ <span className="text-gradient">EPC Panel PC</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">ชมวิดีโอสาธิตการใช้งานจริง และฟังพอดแคสต์เจาะลึกข้อมูลก่อนตัดสินใจ</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="card-surface rounded-xl overflow-hidden">
              <div className="px-3 py-2 border-b border-border flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-500" />
                <span className="font-bold text-foreground text-xs">วิดีโอแนะนำ EPC Panel PC</span>
              </div>
              <div className="aspect-video">
                <iframe src="https://www.youtube.com/embed/mtamL6vkDv8" title="EPC Panel PC Introduction" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" loading="lazy"></iframe>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "Beaoeb0_Gwo", title: "ภาพรวมผลิตภัณฑ์" },
                { id: "whSUaZWJJCc", title: "การใช้งานในโรงงานจริง" },
                { id: "-OhWfiGEsJ4", title: "คุณสมบัติเด่น & สเปก" },
                { id: "mgTNbsmYias", title: "การติดตั้ง & เชื่อมต่อ" },
              ].map((v) => (
                <a key={v.id} href={`https://youtu.be/${v.id}`} target="_blank" rel="noopener noreferrer" className="card-surface rounded-lg overflow-hidden group">
                  <div className="relative">
                    <img src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`} alt={v.title} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-[11px] font-semibold text-foreground line-clamp-1">{v.title}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="card-surface rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
              <Headphones className="w-4 h-4 text-primary" />
              <span className="font-bold text-foreground text-xs">Podcast — เจาะลึก EPC Panel PC</span>
            </div>
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
              {[
                { title: "Intro: LEGO Modular Technology", desc: "นวัตกรรม LEGO Modular — ยืดหยุ่นเหมือนตัวต่อสำหรับโรงงาน", src: "/podcasts/epc-intro-lego.wav", duration: "2:46" },
                { title: "ทำไมต้องใช้ Industrial Panel PC?", desc: "เปรียบเทียบคอมธรรมดา vs คอมอุตสาหกรรม", src: "/podcasts/epc-benefit.wav", duration: "3:30" },
                { title: "วิธีเลือก EPC ให้เหมาะกับงาน", desc: "แนะนำการเลือกขนาดหน้าจอ 10–24 นิ้ว", src: "/podcasts/epc-how-to-choose.wav", duration: "2:39" },
                { title: "EPC-S10X2A — ตัวเล็ก สเปกไม่เล็ก", desc: "รีวิวเจาะลึก Panel PC 10 นิ้ว 9 รุ่นย่อย", src: "/podcasts/epc-s10x2a.wav", duration: "2:27" },
              ].map((pod, i) => (
                <div key={i} className={`p-3 hover:bg-muted/30 transition-colors ${i >= 2 ? "md:border-t-0" : ""}`}>

                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h4 className="text-xs font-bold text-foreground line-clamp-1">{pod.title}</h4>
                        <span className="text-[9px] text-muted-foreground bg-muted px-1 py-0.5 rounded-full shrink-0">{pod.duration}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mb-2 line-clamp-1">{pod.desc}</p>
                      <audio controls preload="none" className="w-full h-7 [&::-webkit-media-controls-panel]:bg-muted/50">
                        <source src={pod.src} type="audio/wav" />
                      </audio>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Testimonials */}
        <section className="space-y-6">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">Customer Reviews</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              เสียงจากลูกค้า<span className="text-gradient">ที่ใช้งานจริง</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">ความคิดเห็นจากผู้ใช้ EPC Panel PC ในอุตสาหกรรมต่างๆ ทั่วประเทศไทย</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { stars: 5, industry: "โรงงานประกอบชิ้นส่วนอิเล็กทรอนิกส์", text: "ใช้ EPC-S1522A ติดตั้งที่สายการผลิต SMT ทำงานต่อเนื่อง 24 ชม. ไม่เคยหยุด ฝุ่นเยอะมากแต่ IP65 กันได้หมด เปลี่ยนจากคอมตั้งโต๊ะมาใช้ Panel PC ลดดาวน์ไทม์ไปเกือบ 90%", role: "ผู้จัดการฝ่ายผลิต" },
              { stars: 5, industry: "โรงงานอาหารแปรรูป", text: "ล้างน้ำแรงดันสูงได้จริง ไม่ต้องกลัวเสีย ใส่ถุงมือยางสัมผัสจอได้เลย ติดตั้งระบบ QC ตรวจสอบคุณภาพอาหารแบบ Real-time ผ่าน 2 ปีไม่มีปัญหาอะไรเลย", role: "วิศวกรฝ่ายคุณภาพ" },
              { stars: 4, industry: "คลังสินค้าและโลจิสติกส์", text: "ติดตั้ง EPC-W1562A บนสายพานลำเลียง ใช้สแกนบาร์โค้ดจัดการ WMS จอ 15.6 นิ้วกว้างพอแสดงข้อมูลหลายช่องพร้อมกัน ทนฝุ่นและกระแทกได้ดี ราคาคุ้มค่ามาก", role: "หัวหน้าฝ่ายคลังสินค้า" },
              { stars: 5, industry: "ห้องเย็น Cold Storage", text: "ที่อื่นบอกคอมใช้ในห้องเย็นไม่ได้ แต่ EPC ทำงานที่ -20°C ได้จริง Fanless ไม่มีหยดน้ำ ไม่มีชิ้นส่วนที่เคลื่อนไหว ใช้มา 3 ปีไม่เคยเสีย ประทับใจมากครับ", role: "ผู้จัดการห้องเย็น" },
              { stars: 4, industry: "โรงงานยานยนต์", text: "ใช้ EPC Panel PC ควบคุมหุ่นยนต์เชื่อมผ่าน COM Port เชื่อมต่อ PLC/SCADA ได้ทันที ระบบ LEGO Mode ทำให้เวลา upgrade CPU ไม่ต้องเปลี่ยนทั้งเครื่อง ประหยัดงบได้เยอะ", role: "วิศวกร Automation" },
            ].map((review, i) => (
              <div key={i} className="card-surface p-5 rounded-xl space-y-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={14} className={s < review.stars ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"} />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed">"{review.text}"</p>
                <div className="pt-2 border-t border-border/50">
                  <p className="text-xs font-semibold text-foreground">{review.role}</p>
                  <p className="text-[11px] text-muted-foreground">{review.industry}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card-surface rounded-lg p-4 bg-muted/30 border-dashed">
            <p className="text-[11px] text-muted-foreground leading-relaxed text-center">
              <Shield size={14} className="inline mr-1" /> <strong>หมายเหตุตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA):</strong> เพื่อปกป้องสิทธิ์ของลูกค้า เราไม่สามารถเปิดเผยชื่อ-นามสกุล หรือชื่อบริษัทของผู้ให้รีวิวได้ ความคิดเห็นทั้งหมดเป็นคำชมจริงที่ได้รับจากการทำงานร่วมกับลูกค้าในอุตสาหกรรมต่างๆ ทั่วประเทศไทย
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="card-surface p-8 text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-3">สนใจ EPC Panel PC Series?</h2>
          <p className="text-muted-foreground mb-6">ปรึกษาผู้เชี่ยวชาญเพื่อเลือก Panel PC ที่เหมาะกับโรงงานของคุณ</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" asChild>
              <a href="https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_9dad5caa6c4d4410a723cab33c3177bf.pdf" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1.5" /> ดาวน์โหลด E-Catalog
              </a>
            </Button>
            <Button onClick={() => setQuoteProduct("EPC Series")}>
              <FileText className="w-3.5 h-3.5 mr-1.5" /> ขอใบเสนอราคา
            </Button>
          </div>
        </div>
      </div>
      <B2BCTABanner variant="compact" />
      <FooterCompact />
    </div>
  );
};


export default EPCSeries;

