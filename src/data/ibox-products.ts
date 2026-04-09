// AI Edge Computing / GPU Products
// Embedded Box PC Products
import ibox601GtProMain from "@/assets/products/ibox-601-gt-pro-main.png";
import ibox601GtProAngle2 from "@/assets/products/ibox-601-gt-pro-angle2.png";
import ibox601GtProAngle3 from "@/assets/products/ibox-601-gt-pro-angle3.png";
import ibox601GtProDimension from "@/assets/products/ibox-601-gt-pro-dimension.png";

import ibox602GtProMain from "@/assets/products/ibox-602-gt-pro-main.png";
import ibox602GtProAngle2 from "@/assets/products/ibox-602-gt-pro-angle2.png";
import ibox602GtProAngle3 from "@/assets/products/ibox-602-gt-pro-angle3.png";
import ibox602GtProAngle4 from "@/assets/products/ibox-602-gt-pro-angle4.png";
import ibox602GtProDimension from "@/assets/products/ibox-602-gt-pro-dimension.png";

import ibox602Gt2pDimension from "@/assets/products/ibox-602-gt-2p-dimension.png";
import ibox602GtPro from "@/assets/products/ibox-602-gt-pro.png";
import ibox007pro from "@/assets/products/ibox-007pro.png";
import ibox007 from "@/assets/products/ibox-007.png";
import ibox601Gt2p from "@/assets/products/ibox-601-gt-2p.png";
import ibox601_9l2c4p from "@/assets/products/ibox-601-9l2c4p.png";

// Embedded Box PC imports
import ibox007Main from "@/assets/products/ibox-007-main.png";
import ibox007Angle2 from "@/assets/products/ibox-007-angle2.png";
import ibox007Angle3 from "@/assets/products/ibox-007-angle3.png";
import ibox007Angle4 from "@/assets/products/ibox-007-angle4.png";
import ibox007Angle5 from "@/assets/products/ibox-007-angle5.png";
import ibox007Angle6 from "@/assets/products/ibox-007-angle6.png";
import ibox007Dimension from "@/assets/products/ibox-007-dimension.png";
import ibox103 from "@/assets/products/ibox-103.png";
import ibox103Mini from "@/assets/products/ibox-103-mini.png";
import ibox103_2l2c from "@/assets/products/ibox-103-2l2c.png";
import ibox103_2l2cJ4125 from "@/assets/products/ibox-103-2l2c-j4125.png";
import ibox103_2l3c from "@/assets/products/ibox-103-2l3c.png";
import ibox104v2 from "@/assets/products/ibox-104v2.png";
import ibox104v2Ns from "@/assets/products/ibox-104v2-ns.png";
import ibox603_2l4c from "@/assets/products/ibox-603-2l4c-1p.png";
import ibox205sbc12th from "@/assets/products/ibox-205sbc-12th.png";
import ibox103_4l2cJ4125Dim from "@/assets/products/ibox-103-4l2c-j4125-dim.png";
import ibox604_5l2c2p from "@/assets/products/ibox-604-5l2c2p.png";
import ibox604Main from "@/assets/products/ibox-604-main.png";
import ibox205_4l2c2p from "@/assets/products/ibox-205-4l2c2p.png";
import vbox105_2l6c from "@/assets/products/vbox-105-2l6c.png";

// AEOLUS / Machine Vision imports
import aeolusTl9Main from "@/assets/products/aeolus-tl9-6l2c4p-main.png";
import aeolusTl9Angle2 from "@/assets/products/aeolus-tl9-6l2c4p-angle2.png";
import aeolusTl9Angle3 from "@/assets/products/aeolus-tl9-6l2c4p-angle3.png";
import aeolusTl9Angle4 from "@/assets/products/aeolus-tl9-6l2c4p-angle4.png";
import aeolusTl9Dimension from "@/assets/products/aeolus-tl9-6l2c4p-dimension.png";
import aeolusSv9_1pMain from "@/assets/products/aeolus-sv9-6l2c-1p-main.png";
import aeolusSv9_1pAngle2 from "@/assets/products/aeolus-sv9-6l2c-1p-angle2.png";
import aeolusSv9_1pDimension from "@/assets/products/aeolus-sv9-6l2c-1p-dimension.png";
import aeolusSv9 from "@/assets/products/aeolus-sv9-6l2c.png";
import aeolusVision from "@/assets/products/aeolus-sv9-vision.png";
import aeolusSv9Dimension from "@/assets/products/aeolus-sv9-6l2c-dimension.png";
import aeolusSva35Main from "@/assets/products/aeolus-sva35-2l10c-main.png";
import aeolusSva35Angle2 from "@/assets/products/aeolus-sva35-2l10c-angle2.png";
import aeolusSva35Angle3 from "@/assets/products/aeolus-sva35-2l10c-angle3.png";
import aeolusSva35Angle4 from "@/assets/products/aeolus-sva35-2l10c-angle4.png";
import aeolusSva35Dimension from "@/assets/products/aeolus-sva35-2l10c-dimension.png";
import aeolusTl9_2l2c from "@/assets/products/aeolus-tl9-2l2c.png";

export interface IBoxProduct {
  id: string;
  name: string;
  nameTH: string;
  category: string;
  subcategory: string;
  formFactor: "fanless" | "mini" | "compact" | "embedded";
  performance: "entry" | "mid" | "high";
  image: string;
  dimensionImage?: string;
  gallery?: string[];
  specs: {
    cpu: string;
    cpuGen?: string;
    ram: string;
    storage: string;
    display?: string;
    io: string;
    comPorts?: number;
    lanPorts?: number;
    usbPorts?: number;
    poe?: boolean;
    pcie?: boolean;
    temp: string;
  };
  features: string[];
  applications: string[];
  priceRange?: string;
  isNew?: boolean;
  isHot?: boolean;
}

export const iboxProducts: IBoxProduct[] = [
  // ═══════ AI Edge Computing / GPU ═══════
  {
    id: "IBOX-601-GT-PRO",
    name: "Edge AI Industrial PC with GPU Support",
    nameTH: "คอมพิวเตอร์อุตสาหกรรม Edge AI พร้อมรองรับ GPU",
    category: "AI Edge Computing",
    subcategory: "GPU Box PC",
    formFactor: "embedded",
    performance: "high",
    image: ibox601GtProMain,
    gallery: [ibox601GtProAngle2, ibox601GtProAngle3],
    dimensionImage: ibox601GtProDimension,
    specs: {
      cpu: "Intel Core i9/i7/i5/i3 (12th/13th/14th Gen)",
      cpuGen: "12th-14th Gen",
      ram: "Up to 128GB DDR4 3200MHz (Dual Channel SO-DIMM)",
      storage: "2x M.2 NVMe + 4x SATA RAID 0/1/5/10 + mSATA",
      io: "8x USB (4x USB3.2 Gen2 + 4x USB3.0), 2x COM, 9x LAN",
      comPorts: 2,
      lanPorts: 9,
      usbPorts: 8,
      poe: true,
      pcie: true,
      temp: "-20°C ~ 55°C",
    },
    features: [
      "Intel 12th/13th/14th Gen Core Desktop CPU (LGA1700)",
      "Intel H770 Chipset",
      "PCIe 4.0 x16 สำหรับ GPU Discrete (หรือ 2x PCIe 4.0 x8)",
      "9x GbE LAN (Intel i210/i219/i226) รองรับ PoE",
      "Dual M.2 NVMe + 4x SATA RAID Support",
      "M.2 B-key สำหรับ 4G/5G Module",
      "Wide DC 19-36V Input",
      "Fanless Rugged Aluminum Chassis",
    ],
    applications: ["AI Inference", "Deep Learning", "Edge AI", "Machine Vision", "Autonomous Systems"],
    isHot: true,
    isNew: true,
  },
  {
    id: "IBOX-602-GT-PRO",
    name: "GPU Industrial PC for Edge AI with RTX Support",
    nameTH: "คอมพิวเตอร์อุตสาหกรรม GPU สำหรับ Edge AI รองรับ RTX 3090/4090",
    category: "AI Edge Computing",
    subcategory: "GPU Box PC",
    formFactor: "embedded",
    performance: "high",
    image: ibox602GtProMain,
    gallery: [ibox602GtProAngle2, ibox602GtProAngle3, ibox602GtProAngle4],
    dimensionImage: ibox602GtProDimension,
    specs: {
      cpu: "Intel Core i9/i7/i5/i3 (12th/13th/14th Gen)",
      cpuGen: "12th-14th Gen",
      ram: "Up to 128GB DDR4 3200MHz (Dual Channel SO-DIMM)",
      storage: "2x M.2 NVMe + 4x SATA RAID 0/1/5/10 + mSATA",
      io: "8x USB (4x USB3.2 Gen2 + 4x USB3.0), 6x COM, 3x LAN",
      comPorts: 6,
      lanPorts: 3,
      usbPorts: 8,
      poe: false,
      pcie: true,
      temp: "-10°C ~ 60°C",
    },
    features: [
      "Intel 12th/13th/14th Gen Core Desktop CPU (LGA1700)",
      "Intel H770 Chipset",
      "PCIe 4.0 x16 รองรับ NVIDIA RTX 3090/4090",
      "3x GbE LAN (Intel i210/i219)",
      "4x Isolated COM + 2x RS232",
      "Dual M.2 NVMe + 4x SATA RAID Support",
      "DP 8K + HDMI 4K Display Output",
      "Wide DC 19-36V Input",
      "8-bit GPIO + Dual SIM สำหรับ 4G/5G",
    ],
    applications: ["AI Training", "Deep Learning", "3D Rendering", "Edge AI", "Computer Vision"],
    isHot: true,
    isNew: true,
  },
  {
    id: "IBOX-601-GT-2P",
    name: "GPU Industrial PC for Machine Vision",
    nameTH: "คอมพิวเตอร์อุตสาหกรรม GPU สำหรับ Machine Vision",
    category: "AI Edge Computing",
    subcategory: "GPU Box PC",
    formFactor: "embedded",
    performance: "high",
    image: ibox007pro,
    gallery: [ibox602GtPro, ibox007, ibox601_9l2c4p],
    dimensionImage: ibox601Gt2p,
    specs: {
      cpu: "Intel Core i3/i5/i7/i9 (12th-14th Gen LGA1700)",
      cpuGen: "14th Gen",
      ram: "Up to 128GB DDR4 (2x SO-DIMM)",
      storage: "2.5\" SATA + 4x SATA RAID + mSATA + M.2 NVMe",
      io: "8x USB, 2x COM, 9x LAN (6x PoE)",
      comPorts: 2,
      lanPorts: 9,
      usbPorts: 8,
      poe: true,
      pcie: true,
      temp: "-10°C ~ 55°C",
    },
    features: [
      "PCIe 4.0 x16 GPU Expansion",
      "6x PoE GbE LAN (Intel i226)",
      "Intel H770 Chipset",
      "RAID 0/1/5/10 Support",
      "Triple Display Support",
    ],
    applications: ["Multi-camera Inspection", "AI Inference", "Smart Manufacturing", "Deep Learning"],
    isNew: true,
  },
  {
    id: "IBOX-602-GT-2P",
    name: "AI Edge Computing Industrial PC with Dual PCIe GPU",
    nameTH: "คอมพิวเตอร์อุตสาหกรรม AI Edge พร้อม GPU คู่",
    category: "AI Edge Computing",
    subcategory: "GPU Box PC",
    formFactor: "embedded",
    performance: "high",
    image: ibox007pro,
    gallery: [ibox602GtPro, ibox007, ibox601Gt2p],
    dimensionImage: ibox602Gt2pDimension,
    specs: {
      cpu: "Intel Core i3/i5/i7/i9 (12th-14th Gen LGA1700)",
      cpuGen: "14th Gen",
      ram: "Up to 128GB DDR4 (2x SO-DIMM)",
      storage: "M.2 NVMe Gen4 + 4x SATA RAID + mSATA",
      io: "11x USB, 6x COM, 3x LAN",
      comPorts: 6,
      lanPorts: 3,
      usbPorts: 11,
      poe: false,
      pcie: true,
      temp: "-10°C ~ 55°C",
    },
    features: [
      "Dual PCIe Expansion (x16 + x4 หรือ 2x8)",
      "Intel UHD Graphics 770 (Xe Architecture)",
      "4x Isolated RS232/485 with ESD Protection",
      "Support RAID 0/1/5/10",
      "Wide 9-36V DC Input",
      "Hybrid Active + Passive Cooling",
    ],
    applications: ["AI Vision", "Deep Learning", "Machine Vision", "Video Analytics", "Edge Computing"],
    isNew: true,
  },

  // ═══════ Embedded Box PC ═══════
  {
    id: "IBOX-007",
    name: "High Performance Fanless Industrial PC with 10x LAN & PoE",
    nameTH: "คอมพิวเตอร์อุตสาหกรรม Fanless ประสิทธิภาพสูง 10 LAN รองรับ PoE",
    category: "Embedded Box PC",
    subcategory: "Embedded Box PC",
    formFactor: "embedded",
    performance: "high",
    image: ibox007Main,
    gallery: [ibox007Angle2, ibox007Angle3, ibox007Angle4, ibox007Angle5, ibox007Angle6],
    dimensionImage: ibox007Dimension,
    specs: {
      cpu: "Intel Core i9/i7/i5/i3 (12th Gen Alder Lake-S)",
      cpuGen: "12th Gen",
      ram: "Up to 64GB DDR4 3200MHz (Dual Channel)",
      storage: "M.2 NVMe + 4x SATA RAID 0/1/5/10",
      io: "8x USB (4x USB3.0 + 4x USB2.0), 4x COM, 10x LAN (8x PoE)",
      comPorts: 4,
      lanPorts: 10,
      usbPorts: 8,
      poe: true,
      pcie: true,
      temp: "-20°C ~ 55°C",
    },
    features: [
      "Intel 12th Gen Core i9/i7/i5/i3 Desktop CPU (LGA1700)",
      "Intel Q670 Chipset พร้อม vPRO Support",
      "10x GbE LAN (8x PoE รองรับ Machine Vision)",
      "4x Swappable 2.5\" SSD พร้อม RAID 0/1/5/10",
      "Dual HDMI 4K@60Hz Display Output",
      "Fanless Aluminum Enclosure for Harsh Environment",
      "Wide DC 9-36V Input",
      "16-bit GPIO + Mini-PCIe สำหรับ WiFi/4G",
    ],
    applications: ["AI Inference", "Edge Computing", "Machine Vision", "Industrial Server", "Intelligent Control"],
    isHot: true,
  },
  {
    id: "IBOX-103-2L2C",
    name: "Embedded Industrial PC (6th-10th Gen)",
    nameTH: "คอมพิวเตอร์ฝังตัวอุตสาหกรรม",
    category: "Embedded Box PC",
    subcategory: "Embedded Box PC",
    formFactor: "fanless",
    performance: "mid",
    image: ibox103,
    gallery: [ibox103Mini, ibox104v2],
    dimensionImage: ibox103_2l2c,
    specs: {
      cpu: "Intel Core i5 (6th-10th Gen)",
      cpuGen: "10th Gen",
      ram: "Up to 64GB DDR4 (2x SO-DIMM)",
      storage: "2.5\" SATA + M.2 2280",
      io: "8x USB, 2x COM, 2x LAN",
      comPorts: 2,
      lanPorts: 2,
      usbPorts: 8,
      poe: false,
      pcie: false,
      temp: "-10°C ~ 55°C",
    },
    features: [
      "Fanless Enclosed Design",
      "Dual Display (DP + HDMI)",
      "RS232/485 Switchable",
      "Full Aluminum Anti-EMI",
    ],
    applications: ["Factory Automation", "Edge Control", "PLC Replacement", "SCADA"],
    isNew: true,
  },
  {
    id: "IBOX-103-2L2C-J4125",
    name: "Fanless Industrial Control PC",
    nameTH: "คอมพิวเตอร์ควบคุมอุตสาหกรรม Fanless",
    category: "Embedded Box PC",
    subcategory: "Embedded Box PC",
    formFactor: "mini",
    performance: "entry",
    image: ibox103Mini,
    gallery: [ibox103, ibox007],
    dimensionImage: ibox103_2l2cJ4125,
    specs: {
      cpu: "Intel Celeron J4125 (4 Cores, 2.70 GHz)",
      cpuGen: "Gemini Lake",
      ram: "Up to 8GB DDR4",
      storage: "M.2 2280 SATA + mSATA",
      io: "8x USB, 2x COM, 2x LAN",
      comPorts: 2,
      lanPorts: 2,
      usbPorts: 8,
      poe: false,
      pcie: false,
      temp: "-10°C ~ 55°C",
    },
    features: [
      "Dual Display (HDMI + VGA)",
      "Lightweight & Compact",
      "Fanless Aluminum Design",
      "Low Power Consumption",
    ],
    applications: ["Industrial Control", "Automation", "Kiosk", "Digital Signage"],
    isNew: true,
  },
  {
    id: "IBOX-103-2L3C",
    name: "Embedded Industrial Control PC (3 COM)",
    nameTH: "คอมพิวเตอร์ควบคุมอุตสาหกรรม 3 COM",
    category: "Embedded Box PC",
    subcategory: "Embedded Box PC",
    formFactor: "compact",
    performance: "mid",
    image: ibox103,
    gallery: [ibox103Mini, ibox104v2],
    dimensionImage: ibox103_2l3c,
    specs: {
      cpu: "Intel Core i7-1165G7 (8th-11th Gen)",
      cpuGen: "11th Gen",
      ram: "Up to 32GB DDR4",
      storage: "M.2 2242 SATA",
      io: "4x USB, 3x COM, 2x LAN",
      comPorts: 3,
      lanPorts: 2,
      usbPorts: 4,
      poe: false,
      pcie: false,
      temp: "-10°C ~ 55°C",
    },
    features: [
      "Slim Chassis (141x62x97.5mm)",
      "Wide DC 12-28V Input",
      "8-bit GPIO",
      "3x COM (2x DB9 + Terminal)",
    ],
    applications: ["Distributed Control", "Factory Automation", "Industrial Gateway", "PLC Replacement"],
    isNew: true,
  },
  {
    id: "IBOX-603-2L4C-1P",
    name: "Multi COM LAN Embedded PC",
    nameTH: "คอมพิวเตอร์ฝังตัว Multi COM LAN",
    category: "Embedded Box PC",
    subcategory: "Embedded Box PC",
    formFactor: "fanless",
    performance: "mid",
    image: ibox104v2,
    gallery: [ibox103, ibox104v2Ns],
    dimensionImage: ibox603_2l4c,
    specs: {
      cpu: "Intel Core i3/i5/i7/i9 (10th-11th Gen)",
      cpuGen: "11th Gen",
      ram: "Up to 64GB DDR4",
      storage: "M.2 NVMe + SATA SSD",
      io: "8x USB, 4x COM, 2x LAN",
      comPorts: 4,
      lanPorts: 2,
      usbPorts: 8,
      poe: false,
      pcie: true,
      temp: "-10°C ~ 60°C",
    },
    features: [
      "Fanless Enclosed Chassis",
      "Triple Independent Displays",
      "2.5GbE + GbE LAN",
      "Wide Voltage 12-28V DC",
    ],
    applications: ["Factory Automation", "Industrial Gateway", "SCADA"],
    isNew: true,
  },
  {
    id: "IBOX-205SBC-12TH",
    name: "12th Gen Embedded Industrial PC",
    nameTH: "คอมพิวเตอร์ฝังตัวอุตสาหกรรม Gen 12",
    category: "Embedded Box PC",
    subcategory: "Embedded Box PC",
    formFactor: "embedded",
    performance: "mid",
    image: ibox007pro,
    gallery: [ibox007, ibox104v2],
    dimensionImage: ibox205sbc12th,
    specs: {
      cpu: "Intel Core i3/i5/i7 (12th Gen Alder Lake-U)",
      cpuGen: "12th Gen",
      ram: "Up to 32GB DDR4",
      storage: "SATA + M.2 NVMe",
      io: "6x USB 3.0, 6x COM, 2x LAN",
      comPorts: 6,
      lanPorts: 2,
      usbPorts: 6,
      poe: false,
      pcie: false,
      temp: "0°C ~ 60°C",
    },
    features: [
      "Intel Iris Xe Graphics",
      "6x COM (RS232/485/TTL)",
      "Dual Display (HDMI + DP++)",
      "Support WiFi/4G/5G",
    ],
    applications: ["Edge Gateway", "Industrial HMI", "Intelligent Control", "Automation"],
    isNew: true,
  },

  // ═══════ Gateway / DIN Rail ═══════
  {
    id: "IBOX-103-4L2C-J4125",
    name: "Industrial Gateway PC with 2.5G LAN",
    nameTH: "เกตเวย์อุตสาหกรรม 2.5G LAN",
    category: "Gateway",
    subcategory: "Gateway PC",
    formFactor: "mini",
    performance: "entry",
    image: ibox103Mini,
    gallery: [ibox103, ibox007Main],
    dimensionImage: ibox103_4l2cJ4125Dim,
    specs: {
      cpu: "Intel Celeron J4125 (4 Cores, 2.70 GHz)",
      cpuGen: "Gemini Lake",
      ram: "Up to 8GB DDR4",
      storage: "2.5\" SATA + mSATA",
      io: "4x USB 3.0, 2x COM, 4x 2.5G LAN",
      comPorts: 2,
      lanPorts: 4,
      usbPorts: 4,
      poe: false,
      pcie: false,
      temp: "-10°C ~ 55°C",
    },
    features: [
      "4x Intel I225V 2.5G LAN",
      "Fanless Aluminum Chassis",
      "4-bit GPIO",
      "Compact 141x62x127.5mm",
    ],
    applications: ["Industrial Gateway", "Network Edge", "IoT Gateway", "Firewall"],
    isNew: true,
  },
  {
    id: "ATLAS-DR-ARM",
    name: "DIN Rail ARM Gateway",
    nameTH: "เกตเวย์ ARM สำหรับราง DIN",
    category: "Gateway",
    subcategory: "DIN Rail PC",
    formFactor: "compact",
    performance: "entry",
    image: ibox103Mini,
    gallery: [ibox103, ibox007Main],
    specs: {
      cpu: "NXP i.MX8M Plus",
      cpuGen: "ARM Cortex-A53",
      ram: "4GB LPDDR4",
      storage: "32GB eMMC",
      io: "2x USB, 2x COM, 2x LAN, CAN Bus",
      comPorts: 2,
      lanPorts: 2,
      usbPorts: 2,
      poe: false,
      pcie: false,
      temp: "-40°C ~ 70°C",
    },
    features: [
      "Ultra Low Power <5W",
      "NPU for AI Inference",
      "Industrial Protocols (CAN Bus)",
      "Linux/Android Support",
    ],
    applications: ["IoT Gateway", "Building Automation", "Energy Management"],
  },

  // ═══════ PoE & Multi-LAN ═══════
  {
    id: "IBOX-604-5L2C2P",
    name: "Industrial PC with PoE LAN",
    nameTH: "คอมพิวเตอร์อุตสาหกรรม PoE LAN",
    category: "PoE & Multi-LAN",
    subcategory: "PoE Box PC",
    formFactor: "embedded",
    performance: "mid",
    image: ibox103,
    gallery: [ibox604Main, ibox104v2],
    dimensionImage: ibox604_5l2c2p,
    specs: {
      cpu: "Intel Core i3/i5/i7/i9 (6th-9th Gen)",
      cpuGen: "9th Gen",
      ram: "Up to 32GB DDR4",
      storage: "4x SATA (RAID 0/1/5) + M.2 NVMe",
      io: "8x USB 3.0, 4x COM, 5x LAN (2x PoE)",
      comPorts: 4,
      lanPorts: 5,
      usbPorts: 8,
      poe: true,
      pcie: true,
      temp: "-10°C ~ 55°C",
    },
    features: [
      "5x GbE LAN (2x IEEE 802.3af PoE)",
      "RAID 0/1/5 Support",
      "4x Front-access SSD Trays",
      "Wide 9-36V DC with Surge Protection",
    ],
    applications: ["Network Automation", "Edge Computing", "Surveillance"],
  },
  {
    id: "IBOX-601-9L2C4P",
    name: "Multi LAN PoE Industrial PC",
    nameTH: "คอมพิวเตอร์อุตสาหกรรม Multi LAN PoE",
    category: "PoE & Multi-LAN",
    subcategory: "PoE Box PC",
    formFactor: "embedded",
    performance: "high",
    image: ibox103,
    gallery: [ibox104v2, ibox601Gt2p],
    dimensionImage: ibox601_9l2c4p,
    specs: {
      cpu: "Intel Core i3/i5/i7/i9 (6th-9th Gen)",
      cpuGen: "9th Gen",
      ram: "Up to 32GB DDR4",
      storage: "2.5\" SATA + 3x SATA RAID + mSATA + M.2",
      io: "11x USB, 2x COM, 9x LAN (4x PoE)",
      comPorts: 2,
      lanPorts: 9,
      usbPorts: 11,
      poe: true,
      pcie: false,
      temp: "-10°C ~ 55°C",
    },
    features: [
      "9x GbE LAN (4x PoE)",
      "RAID 0/1/5 Support",
      "8-bit GPIO",
      "Wide 9-36V DC Input",
    ],
    applications: ["Automation Control", "Surveillance", "Industrial Networking", "Edge Computing"],
    isNew: true,
  },
  {
    id: "IBOX-205-4L2C2P",
    name: "Multi LAN Fanless Industrial PC with PoE",
    nameTH: "คอมพิวเตอร์อุตสาหกรรม Multi LAN พร้อม PoE",
    category: "PoE & Multi-LAN",
    subcategory: "Embedded Box PC",
    formFactor: "fanless",
    performance: "mid",
    image: ibox104v2,
    gallery: [ibox104v2Ns, ibox103],
    dimensionImage: ibox205_4l2c2p,
    specs: {
      cpu: "Intel Core & Celeron 6305E (11th Gen)",
      cpuGen: "11th Gen",
      ram: "Up to 64GB DDR4 (2x SO-DIMM)",
      storage: "2.5\" SATA + mSATA",
      io: "4x USB, 2x COM, 4x LAN (2x PoE)",
      comPorts: 2,
      lanPorts: 4,
      usbPorts: 4,
      poe: true,
      pcie: false,
      temp: "-10°C ~ 55°C",
    },
    features: [
      "2x 2.5G LAN + 2x 1G PoE LAN",
      "Fanless Aluminum Chassis",
      "Wide 9-36V DC Input",
      "8-bit GPIO",
    ],
    applications: ["Edge Networking", "Machine Vision", "Industrial Gateway", "Surveillance"],
    isNew: true,
  },

  // ═══════ Vehicle & Special ═══════
  {
    id: "VBOX-105-2L6C",
    name: "Vehicle Industrial PC",
    nameTH: "คอมพิวเตอร์อุตสาหกรรมติดรถยนต์",
    category: "Vehicle & Special",
    subcategory: "Vehicle Mount PC",
    formFactor: "compact",
    performance: "entry",
    image: ibox103Mini,
    gallery: [ibox103, ibox007Main],
    dimensionImage: vbox105_2l6c,
    specs: {
      cpu: "Intel Celeron J6412",
      cpuGen: "Elkhart Lake",
      ram: "Up to 32GB DDR4",
      storage: "M.2 NVMe + SATA + mSATA",
      io: "10x USB, 6x COM, 2x LAN",
      comPorts: 6,
      lanPorts: 2,
      usbPorts: 10,
      poe: false,
      pcie: false,
      temp: "-20°C ~ 65°C",
    },
    features: [
      "Wide 6-42V DC with Ignition Control",
      "80V Surge Protection",
      "Fanless Aluminum Chassis",
      "Triple Display Support",
    ],
    applications: ["Fleet Management", "Mobile Surveillance", "Intelligent Transportation"],
    isNew: true,
  },

  // ═══════ Machine Vision (AEOLUS) ═══════
  {
    id: "AEOLUS-TL9-6L2C4P",
    name: "Machine Vision Industrial PC with PoE & Light Controller",
    nameTH: "คอมพิวเตอร์อุตสาหกรรม Machine Vision พร้อม PoE และควบคุมแสง",
    category: "Machine Vision",
    subcategory: "Machine Vision",
    formFactor: "fanless",
    performance: "high",
    image: aeolusTl9Main,
    gallery: [aeolusTl9Angle2, aeolusTl9Angle3, aeolusTl9Angle4],
    dimensionImage: aeolusTl9Dimension,
    specs: {
      cpu: "Intel Core i7/i5/i3 (8th/9th Gen)",
      cpuGen: "8th-9th Gen",
      ram: "Up to 32GB DDR4 2666MHz",
      storage: "2x M.2 2280 (NVMe/SATA)",
      io: "6x USB (4x USB3.0 + 2x USB2.0), 2x Isolated COM, 6x LAN",
      comPorts: 2,
      lanPorts: 6,
      usbPorts: 6,
      poe: true,
      pcie: false,
      temp: "-10°C ~ 60°C",
    },
    features: [
      "Intel 8th/9th Gen Core i7/i5/i3 (LGA1151)",
      "6x GbE LAN (4x PoE IEEE 802.3af 15W/port)",
      "4-Channel Light Source Controller (12V/24V)",
      "4-Channel External Trigger Signal",
      "2x Isolated COM (RS232/485) + ESD Protection",
      "16-bit GPIO (8-in/8-out, 5-24V)",
      "HDMI 4K + DP 4K Display Output",
    ],
    applications: ["Machine Vision", "AOI Inspection", "Robotics Vision", "Industrial Automation", "Quality Control"],
    isHot: true,
    isNew: true,
  },
  {
    id: "AEOLUS-SV9-6L2C-1P",
    name: "Industrial Edge Controller with 6x LAN & PCIe Expansion",
    nameTH: "คอมพิวเตอร์อุตสาหกรรม Edge Controller 6 LAN พร้อม PCIe",
    category: "Machine Vision",
    subcategory: "Edge Controller",
    formFactor: "compact",
    performance: "high",
    image: aeolusSv9_1pMain,
    gallery: [aeolusSv9_1pAngle2],
    dimensionImage: aeolusSv9_1pDimension,
    specs: {
      cpu: "Intel Core i7/i5/i3 (6th-9th Gen)",
      cpuGen: "6th-9th Gen",
      ram: "Up to 64GB DDR4 2666MHz (Dual SO-DIMM)",
      storage: "M.2 2280 (NVMe/SATA PCIe 3.0 x4)",
      io: "4x USB 3.0, 1x USB 2.0, 2x COM, 6x LAN",
      comPorts: 2,
      lanPorts: 6,
      usbPorts: 5,
      poe: false,
      pcie: true,
      temp: "-10°C ~ 60°C",
    },
    features: [
      "Intel 6th-9th Gen Core i7/i5/i3 (LGA1151) up to 65W",
      "6x GbE LAN (5x Intel i210 + 1x i219) WoL/PXE",
      "1x PCIe x8 Expansion Slot",
      "2x RS232/RS485 Switchable via BIOS",
      "Mini-PCIe + Nano SIM สำหรับ 4G LTE",
      "Fan-assisted Copper Heat Pipe Cooling",
    ],
    applications: ["Industrial Gateway", "Edge Computing", "Network Appliance", "Automation Control", "Transportation"],
    isHot: true,
    isNew: true,
  },
  {
    id: "AEOLUS-SV9-6L2C",
    name: "Machine Vision Industrial PC",
    nameTH: "คอมพิวเตอร์อุตสาหกรรมสำหรับ Machine Vision",
    category: "Machine Vision",
    subcategory: "Embedded Box PC",
    formFactor: "fanless",
    performance: "high",
    image: aeolusSv9,
    gallery: [aeolusVision],
    dimensionImage: aeolusSv9Dimension,
    specs: {
      cpu: "Intel Core i7-1365URE",
      cpuGen: "13th Gen",
      ram: "Up to 64GB DDR5",
      storage: "M.2 NVMe SSD",
      io: "6x USB 3.2, 2x COM, 6x LAN",
      comPorts: 2,
      lanPorts: 6,
      usbPorts: 6,
      poe: true,
      pcie: true,
      temp: "-20°C ~ 60°C",
    },
    features: [
      "Intel 13th Gen Raptor Lake",
      "6x PoE+ GbE LAN",
      "Fanless Design",
      "Wide Temperature Range",
      "TPM 2.0 Support",
    ],
    applications: ["Machine Vision", "AI Edge Computing", "AOI Inspection"],
    isNew: true,
  },
  {
    id: "AEOLUS-SVA35-2L10C",
    name: "ARM Industrial Edge Controller with 10x RS485 & AI NPU",
    nameTH: "คอมพิวเตอร์อุตสาหกรรม ARM Edge Controller 10 RS485 พร้อม AI NPU",
    category: "Machine Vision",
    subcategory: "ARM Controller",
    formFactor: "compact",
    performance: "mid",
    image: aeolusSva35Main,
    gallery: [aeolusSva35Angle2, aeolusSva35Angle3, aeolusSva35Angle4],
    dimensionImage: aeolusSva35Dimension,
    specs: {
      cpu: "Rockchip RK3568 Quad-Core ARM Cortex-A55 2.0GHz",
      cpuGen: "ARM",
      ram: "4GB/8GB LPDDR4X-3200MHz (Onboard)",
      storage: "64GB eMMC + M.2 2280 (NVMe/SATA)",
      io: "2x USB 3.0, 1x USB 2.0, 10x RS485, 2x CAN, 2x LAN",
      comPorts: 10,
      lanPorts: 2,
      usbPorts: 3,
      poe: false,
      pcie: false,
      temp: "-10°C ~ 60°C",
    },
    features: [
      "Rockchip RK3568 Quad-core ARM Cortex-A55 @ 2.0GHz",
      "1T NPU สำหรับ AI Acceleration",
      "10x RS485 (2 ช่องรองรับ RS232/RS485)",
      "2x Isolated CAN Bus",
      "8-bit Isolated GPIO (4 DI + 4 DO)",
      "2x GbE LAN + M.2 B-Key สำหรับ 4G/5G",
      "Fanless Enclosed Design",
    ],
    applications: ["IoT Gateway", "Industrial Automation", "Building Automation", "Energy Monitoring", "Transportation"],
    isHot: true,
    isNew: true,
  },
  {
    id: "KRONOS-SV6-4L8C",
    name: "Multi-LAN Industrial PC",
    nameTH: "คอมพิวเตอร์อุตสาหกรรม 6 LAN",
    category: "Machine Vision",
    subcategory: "Embedded Box PC",
    formFactor: "fanless",
    performance: "mid",
    image: aeolusSv9,
    gallery: [aeolusVision],
    dimensionImage: aeolusSv9Dimension,
    specs: {
      cpu: "Intel Core i7/i5/i3 (LGA1151)",
      cpuGen: "6th-9th Gen",
      ram: "Up to 64GB DDR4",
      storage: "M.2 NVMe + SATA 3.0",
      io: "4x USB 3.0, 2x COM, 6x LAN",
      comPorts: 2,
      lanPorts: 6,
      usbPorts: 4,
      poe: false,
      pcie: true,
      temp: "-20°C ~ 60°C",
    },
    features: [
      "Intel 6th-9th Gen Core",
      "6x Intel Gigabit LAN",
      "Active Cooling Design",
      "Wide DC 12V/19V/24V Input",
      "Mini-PCIe + Nano SIM",
    ],
    applications: ["Network Appliance", "Edge Gateway", "Industrial IoT"],
  },
  {
    id: "APOLLO-SV12-8P",
    name: "8-Port PoE Vision Controller",
    nameTH: "คอนโทรลเลอร์ Vision 8 พอร์ต PoE",
    category: "Machine Vision",
    subcategory: "Vision Controller",
    formFactor: "fanless",
    performance: "high",
    image: aeolusVision,
    gallery: [aeolusSv9, aeolusTl9_2l2c],
    specs: {
      cpu: "Intel Core i7-1185G7E",
      cpuGen: "11th Gen",
      ram: "Up to 64GB DDR4",
      storage: "2x M.2 NVMe",
      io: "4x USB 3.2, 2x COM, 8x PoE LAN",
      comPorts: 2,
      lanPorts: 8,
      usbPorts: 4,
      poe: true,
      pcie: true,
      temp: "-20°C ~ 70°C",
    },
    features: [
      "8x PoE+ Gigabit Ports",
      "Intel Iris Xe Graphics",
      "Fanless Operation",
      "MXM GPU Option",
    ],
    applications: ["AOI", "Machine Vision", "Deep Learning"],
    isNew: true,
  },
];

// Helper: get product by id
export const getIBoxProduct = (id: string) => iboxProducts.find((p) => p.id === id);

// Helper: get related products
export const getRelatedProducts = (id: string, limit = 3) =>
  iboxProducts.filter((p) => p.id !== id && p.category === iboxProducts.find((x) => x.id === id)?.category).slice(0, limit);
