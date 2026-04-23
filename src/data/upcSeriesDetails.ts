/**
 * Detail data for UPC Series products
 * Source: ENT Group product specifications
 */

export type SpecRow = { label: string; value: string };
export type SpecGroup = { title: string; rows: SpecRow[] };
export type SelectionRow = { partNumber: string; cpu: string; memory: string; storage: string };

export type ProductDetail = {
  id: string;
  intro: string;          // long description
  highlights: string[];   // bullet introduction
  specs: SpecGroup[];     // grouped specifications
  gallery: string[];      // gallery images
  selection?: SelectionRow[];
  applications?: string[];
};

const COMMON_INTRO_BULLETS = (extras: string[] = []): string[] => [
  ...extras,
  "Fanless design — ไม่มีพัดลม ลดเสียงและการสึกหรอ",
  "Wide-voltage 9–36V DC input",
  "Expansion: dual M.2 2280 NVMe + M.2 2230 Wi-Fi",
  "TPM 2.0 hardware security",
  "LEGO MODE™ modular design",
  "SafeCore™ power-loss protection + Auto power-on",
  "Industrial-grade 6061 aluminum alloy enclosure",
];

export const upcSeriesDetails: Record<string, ProductDetail> = {
  /* ───────────── EPC-102B ───────────── */
  "epc-102b": {
    id: "epc-102b",
    intro:
      "EPC-102B Industrial PC ใช้เทคโนโลยี BlockCore รองรับ Intel® 12th Gen Core™ i3/i5/i7 พร้อมพอร์ต LAN 4 ช่อง ออกแบบมาเพื่อความเสถียรในงาน Mission-critical Industrial",
    highlights: COMMON_INTRO_BULLETS([
      "Intel® Core™ 12th Gen i3 / i5 / i7 (รองรับ Celeron ถึง Core i7)",
      "4× Intel® I210 Gigabit Ethernet",
      "I/O: USB 2.0 ×2, USB 3.0 ×4, Audio, Mic, RS-232 ×3, HDMI, VGA",
      "Intelligent Thermal Control System (Smart Fan)",
    ]),
    specs: [
      {
        title: "System Core",
        rows: [
          { label: "CPU", value: "Intel® Core™ 12th Gen i3-1215U (1.2~4.4GHz) / i5-1235U (1.3~4.4GHz) / i7-1255U (1.7~4.7GHz)" },
          { label: "Memory", value: "8~32GB DDR5" },
          { label: "Storage", value: "1× mSATA SSD" },
          { label: "Cooling", value: "Smart fan with intelligent thermal control" },
          { label: "OS", value: "Windows 10/11, Linux Ubuntu" },
        ],
      },
      {
        title: "I/O Ports",
        rows: [
          { label: "USB 3.0", value: "4× USB 3.0" },
          { label: "Display", value: "1× HDMI" },
          { label: "Audio", value: "1× Audio" },
          { label: "Ethernet", value: "4× 10/100/1000M Intel I210 LAN" },
        ],
      },
      {
        title: "Wireless",
        rows: [
          { label: "4G", value: "Full Network Compatibility (Optional)" },
          { label: "Wi-Fi", value: "Wi-Fi / Bluetooth" },
        ],
      },
      {
        title: "Power",
        rows: [
          { label: "DC Input", value: "1× 3-pin Pluggable Terminal Block, 12V DC (9–36V optional)" },
          { label: "Booting", value: "AT / ATX" },
        ],
      },
      {
        title: "Environment",
        rows: [
          { label: "Operating Temp", value: "0~50°C (-40~70°C optional)" },
          { label: "Storage Temp", value: "-10~60°C" },
          { label: "Humidity", value: "10–90% non-condensing" },
        ],
      },
      {
        title: "Mechanical",
        rows: [
          { label: "Dimension", value: "229.0 × 160.0 × 64.5 mm" },
          { label: "Weight", value: "1.68 kg" },
          { label: "Material", value: "High-Strength Aluminum Alloy" },
          { label: "Mounting", value: "Wall-mount / VESA" },
        ],
      },
      {
        title: "Certifications",
        rows: [
          { label: "Certs", value: "CE / FCC / BIS (EN 55032, EN 55035)" },
          { label: "ODM", value: "BIOS / Boot LOGO / OEM" },
        ],
      },
    ],
    gallery: [
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_4684-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_4685-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_4690-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_4691-1024x683.jpg",
    ],
    selection: [
      { partNumber: "C10.01.04.001", cpu: "Intel® Core™ i3-1215U", memory: "8GB", storage: "mSATA SSD 256GB" },
      { partNumber: "C10.01.04.002", cpu: "Intel® Core™ i5-1235U", memory: "8GB", storage: "mSATA SSD 256GB" },
      { partNumber: "C10.01.04.004", cpu: "Intel® Core™ i7-1255U", memory: "8GB", storage: "mSATA SSD 256GB" },
    ],
  },

  /* ───────────── CTN-102C ───────────── */
  "ctn-102c": {
    id: "ctn-102c",
    intro:
      "CTN-102C Fanless Embedded PC ใช้ Intel® 12th Gen Core™ i3/i5/i7 พร้อม Dual HDMI Output ที่รองรับ EDID Function เหมาะกับงาน Digital Signage, Kiosk, POS และ Smart Manufacturing",
    highlights: COMMON_INTRO_BULLETS([
      "Intel® Core™ 12th Gen i3 / i5 / i7",
      "Dual Intel® I210 Gigabit Ethernet",
      "2× HDMI with EDID Function",
      "I/O: USB 3.0 ×4, Audio, Mic",
    ]),
    specs: [
      {
        title: "System Core",
        rows: [
          { label: "CPU", value: "Intel® Core™ 12th Gen i3-1215U / i5-1235U / i7-1255U" },
          { label: "Memory", value: "8~32GB DDR5" },
          { label: "Storage", value: "M.2 NVMe + mSATA SSD" },
          { label: "OS", value: "Windows 10/11, Linux" },
        ],
      },
      {
        title: "I/O Ports",
        rows: [
          { label: "USB", value: "4× USB 3.0" },
          { label: "Display", value: "2× HDMI with EDID" },
          { label: "Audio", value: "1× Audio + 1× Mic" },
          { label: "Ethernet", value: "2× Intel I210 Gigabit LAN" },
        ],
      },
      {
        title: "Power",
        rows: [
          { label: "DC Input", value: "9–36V DC wide-range" },
          { label: "Booting", value: "AT / ATX" },
        ],
      },
      {
        title: "Environment",
        rows: [
          { label: "Operating Temp", value: "0~50°C (-40~70°C optional)" },
          { label: "Humidity", value: "10–90% non-condensing" },
        ],
      },
      {
        title: "Certifications",
        rows: [{ label: "Certs", value: "CE / FCC" }],
      },
    ],
    gallery: [
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_9890-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_9891-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_9894-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_9895-1024x683.jpg",
    ],
  },

  /* ───────────── EPC-202B ───────────── */
  "epc-202b": {
    id: "epc-202b",
    intro:
      "EPC-202B Fanless Industrial PC ใช้ Intel® 12th Gen Core™ พร้อม COM Port จำนวนมาก (10× USB / 7× COM) เหมาะกับงาน Multi-device control, Smart Manufacturing และ Lab Automation",
    highlights: COMMON_INTRO_BULLETS([
      "Intel® Core™ 12th Gen i3 / i5 / i7",
      "Dual Intel® I210 Gigabit Ethernet",
      "I/O: USB 2.0 ×6, USB 3.0 ×4, RS-232 ×7, HDMI, VGA",
    ]),
    specs: [
      {
        title: "System Core",
        rows: [
          { label: "CPU", value: "Intel® Core™ 12th Gen i3 / i5 / i7" },
          { label: "Memory", value: "8~32GB DDR5" },
          { label: "Storage", value: "M.2 NVMe + mSATA" },
          { label: "OS", value: "Windows 10/11, Linux" },
        ],
      },
      {
        title: "I/O Ports",
        rows: [
          { label: "USB", value: "6× USB 2.0 + 4× USB 3.0" },
          { label: "Serial", value: "7× RS-232" },
          { label: "Display", value: "HDMI + VGA" },
          { label: "Ethernet", value: "2× Intel I210 Gigabit LAN" },
        ],
      },
      {
        title: "Power",
        rows: [{ label: "DC Input", value: "9–36V DC wide-range" }],
      },
      {
        title: "Environment",
        rows: [{ label: "Operating Temp", value: "0~50°C (extended optional)" }],
      },
    ],
    gallery: [
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_6388-1024x576.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_6390-1024x576.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_6389-1-1024x576.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_6391-1024x576.jpg",
    ],
  },

  /* ───────────── EPC-207B ───────────── */
  "epc-207b": {
    id: "epc-207b",
    intro:
      "EPC-207B Fanless Embedded PC ขับเคลื่อนด้วย Intel® Celeron® J6412 ให้ 4 RS-485 อิสระผ่าน DB37 — เหมาะกับงานที่ต้องควบคุมอุปกรณ์ Serial หลายตัวในพื้นที่จำกัด",
    highlights: COMMON_INTRO_BULLETS([
      "Intel® Celeron® J6412 (รองรับถึง Core i7)",
      "Dual Intel® I210 Gigabit Ethernet",
      "4× Independent RS-485 ผ่าน DB37",
      "I/O: USB 2.0 ×2, USB 3.0 ×4, RS-232 ×3, HDMI, VGA",
    ]),
    specs: [
      {
        title: "System Core",
        rows: [
          { label: "CPU", value: "Intel® Celeron® J6412 (รองรับ Core i3/i5/i7)" },
          { label: "Memory", value: "8~32GB DDR4" },
          { label: "Storage", value: "M.2 NVMe + mSATA" },
        ],
      },
      {
        title: "I/O Ports",
        rows: [
          { label: "USB", value: "2× USB 2.0 + 4× USB 3.0" },
          { label: "Serial", value: "3× RS-232 + 4× RS-485 (DB37)" },
          { label: "Display", value: "HDMI + VGA" },
          { label: "Ethernet", value: "2× Intel I210 Gigabit LAN" },
        ],
      },
      {
        title: "Power",
        rows: [{ label: "DC Input", value: "9–36V DC wide-range" }],
      },
      {
        title: "Environment",
        rows: [{ label: "Operating Temp", value: "0~50°C (extended optional)" }],
      },
    ],
    gallery: [
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_9449-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_9448-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_9443-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_9442-1024x683.jpg",
    ],
  },

  /* ───────────── EPC-309E ───────────── */
  "epc-309e": {
    id: "epc-309e",
    intro:
      "EPC-309E Fanless Industrial PC ใช้ Intel® 10th Gen Core™ พร้อม 4× Intel I210 Gigabit Ethernet เหมาะกับงาน Edge Computing, Firewall, Routing และ Network Appliance",
    highlights: COMMON_INTRO_BULLETS([
      "Intel® Core™ 10th Gen i3 / i5 / i7",
      "4× Intel® I210 Gigabit Ethernet",
      "I/O: USB 2.0 ×2, USB 3.0 ×4, RS-232 ×3, HDMI, VGA",
    ]),
    specs: [
      {
        title: "System Core",
        rows: [
          { label: "CPU", value: "Intel® Core™ 10th Gen i3-10110U / i5-10210U / i7-10510U" },
          { label: "Memory", value: "DDR4 SO-DIMM up to 16GB" },
          { label: "Storage", value: "M.2 NVMe + mSATA" },
        ],
      },
      {
        title: "I/O Ports",
        rows: [
          { label: "USB", value: "2× USB 2.0 + 4× USB 3.0" },
          { label: "Serial", value: "3× RS-232" },
          { label: "Display", value: "HDMI + VGA" },
          { label: "Ethernet", value: "4× Intel I210 Gigabit LAN" },
        ],
      },
      {
        title: "Power",
        rows: [{ label: "DC Input", value: "12V DC (9–36V optional)" }],
      },
      {
        title: "Environment",
        rows: [{ label: "Operating Temp", value: "0~50°C (extended optional)" }],
      },
    ],
    gallery: [
      "https://cesipc.com/wp-content/uploads/2025/08/EPC-309E-3-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/EPC-309E-4-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/EPC-309E-5-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/EPC-309E-6-1024x683.jpg",
    ],
  },

  /* ───────────── EPC-302B ───────────── */
  "epc-302b": {
    id: "epc-302b",
    intro:
      "EPC-302B Fanless Industrial PC ใช้ Intel® 12th Gen Core™ พร้อม 5× Gigabit LAN ออกแบบมาเพื่องาน Network-intensive และ Edge Server",
    highlights: COMMON_INTRO_BULLETS([
      "Intel® Core™ 12th Gen i3 / i5 / i7",
      "5× Intel® I210 Gigabit Ethernet",
      "Smart fan with intelligent thermal control",
      "I/O: USB 2.0 ×2, USB 3.0 ×4, RS-232 ×3, HDMI, VGA",
    ]),
    specs: [
      {
        title: "System Core",
        rows: [
          { label: "CPU", value: "Intel® Core™ 12th Gen i3 / i5 / i7" },
          { label: "Memory", value: "8~32GB DDR5" },
          { label: "Storage", value: "M.2 NVMe + mSATA" },
        ],
      },
      {
        title: "I/O Ports",
        rows: [
          { label: "USB", value: "2× USB 2.0 + 4× USB 3.0" },
          { label: "Serial", value: "3× RS-232" },
          { label: "Display", value: "HDMI + VGA" },
          { label: "Ethernet", value: "5× Intel I210 Gigabit LAN" },
        ],
      },
      {
        title: "Power",
        rows: [{ label: "DC Input", value: "9–36V DC wide-range" }],
      },
    ],
    gallery: [
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_5898-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_5901-1024x683.jpg",
    ],
  },

  /* ───────────── UPC-302D ───────────── */
  "upc-302d": {
    id: "upc-302d",
    intro:
      "UPC-302D Fanless Industrial PC ใช้ Intel® 12th Gen Core™ พร้อม 9 พอร์ต USB เหมาะกับงาน Airport, Kiosk, POS, Smart Manufacturing และ Lab Automation ที่ต้องเชื่อมต่อ Scanner / Camera / Touchscreen หลายตัว",
    highlights: COMMON_INTRO_BULLETS([
      "Intel® Core™ 12th Gen i3 / i5 / i7",
      "Dual Intel® I210 Gigabit Ethernet",
      "I/O: USB 2.0 ×5, USB 3.0 ×4, RS-232 ×5, HDMI, VGA",
    ]),
    specs: [
      {
        title: "System Core",
        rows: [
          { label: "CPU", value: "Intel® Core™ 12th Gen i3 / i5 / i7" },
          { label: "Memory", value: "8~32GB DDR5" },
          { label: "Storage", value: "M.2 NVMe + mSATA" },
        ],
      },
      {
        title: "I/O Ports",
        rows: [
          { label: "USB", value: "5× USB 2.0 + 4× USB 3.0 (รวม 9 ports)" },
          { label: "Serial", value: "5× RS-232" },
          { label: "Display", value: "HDMI + VGA" },
          { label: "Ethernet", value: "2× Intel I210 Gigabit LAN" },
        ],
      },
      {
        title: "Power",
        rows: [{ label: "DC Input", value: "9–36V DC wide-range" }],
      },
    ],
    gallery: [
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_6194-1024x576.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_6193-1024x576.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_6197-1024x576.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_6198-1024x576.jpg",
    ],
  },

  /* ───────────── UPC-108H ───────────── */
  "upc-108h": {
    id: "upc-108h",
    intro:
      "UPC-108H Fanless IPC ใช้ Intel® Core™ i5-7200U พร้อม Battery Backup 4000mAh ภายในเครื่อง — เหมาะกับงานที่ต้องการ UPS ฝังตัวเพื่อให้ทำงานต่อเมื่อไฟดับ",
    highlights: COMMON_INTRO_BULLETS([
      "Intel® Core™ 7th Gen i5-7200U (รองรับ i3/i5/i7)",
      "4000mAh Battery Backup ในตัวเครื่อง",
      "4× Intel® I210 Gigabit Ethernet",
      "I/O: USB 2.0 ×2, USB 3.0 ×4, RS-232 ×3, HDMI, VGA",
    ]),
    specs: [
      {
        title: "System Core",
        rows: [
          { label: "CPU", value: "Intel® Core™ 7th Gen i3 / i5-7200U / i7" },
          { label: "Memory", value: "DDR4 SO-DIMM up to 16GB" },
          { label: "Storage", value: "M.2 NVMe + mSATA" },
        ],
      },
      {
        title: "I/O Ports",
        rows: [
          { label: "USB", value: "2× USB 2.0 + 4× USB 3.0" },
          { label: "Serial", value: "3× RS-232" },
          { label: "Display", value: "HDMI + VGA" },
          { label: "Ethernet", value: "4× Intel I210 Gigabit LAN" },
        ],
      },
      {
        title: "Power & Battery",
        rows: [
          { label: "DC Input", value: "9–36V DC wide-range" },
          { label: "Battery", value: "Built-in 4000mAh Lithium Battery" },
        ],
      },
    ],
    gallery: [
      "https://cesipc.com/wp-content/uploads/2025/02/UPC-108H-5-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/02/UPC-108H-6-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/02/UPC-108H-1-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/02/UPC-108H-2-1024x683.jpg",
    ],
  },

  /* ───────────── UPC-206E ───────────── */
  "upc-206e": {
    id: "upc-206e",
    intro:
      "UPC-206E Fanless IPC ใช้ Intel® Celeron® J1900 พร้อมรองรับ CAN Bus — เหมาะกับงาน Automation, ระบบควบคุม, ยานยนต์ และเครื่องจักรอุตสาหกรรม",
    highlights: COMMON_INTRO_BULLETS([
      "Intel® Celeron® J1900",
      "CAN Bus support",
      "Dual Intel® Gigabit Ethernet",
    ]),
    specs: [
      {
        title: "System Core",
        rows: [
          { label: "CPU", value: "Intel® Celeron® J1900 Quad-Core" },
          { label: "Memory", value: "DDR3L SO-DIMM up to 8GB" },
          { label: "Storage", value: "mSATA SSD" },
        ],
      },
      {
        title: "I/O Ports",
        rows: [
          { label: "USB", value: "USB 2.0 + USB 3.0" },
          { label: "Serial", value: "RS-232 + RS-485" },
          { label: "CAN", value: "1× CAN Bus" },
          { label: "Display", value: "HDMI + VGA" },
          { label: "Ethernet", value: "2× Gigabit LAN" },
        ],
      },
      {
        title: "Power",
        rows: [{ label: "DC Input", value: "9–36V DC wide-range" }],
      },
    ],
    gallery: [
      "https://cesipc.com/wp-content/uploads/2025/02/UPC-206E%E5%B8%A61%E4%B8%AACAN-1-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/02/UPC-206E%E5%B8%A61%E4%B8%AACAN-2-1024x683.jpg",
    ],
  },

  /* ───────────── UPC-206F ───────────── */
  "upc-206f": {
    id: "upc-206f",
    intro:
      "UPC-206F Fanless IPC ใช้ Intel® Celeron® พร้อม 4G/5G LTE (SIM/TF) — เหมาะกับงาน Mobile, Remote Site, Telemetry และ IoT Gateway",
    highlights: COMMON_INTRO_BULLETS([
      "Intel® Celeron® (รองรับ Core i7)",
      "4G/5G LTE (SIM/TF Card)",
      "Dual Intel® I210 Gigabit Ethernet",
      "I/O: USB 2.0 ×3, USB 3.0 ×1, RS-232 ×3, RS-485 ×1, HDMI, VGA",
    ]),
    specs: [
      {
        title: "System Core",
        rows: [
          { label: "CPU", value: "Intel® Celeron® J1900 (รองรับถึง Core i7)" },
          { label: "Memory", value: "DDR3L/DDR4 SO-DIMM" },
          { label: "Storage", value: "M.2 NVMe + mSATA" },
        ],
      },
      {
        title: "Wireless / I/O",
        rows: [
          { label: "Cellular", value: "4G / 5G LTE (SIM + TF Card)" },
          { label: "USB", value: "3× USB 2.0 + 1× USB 3.0" },
          { label: "Serial", value: "3× RS-232 + 1× RS-485" },
          { label: "Display", value: "HDMI + VGA" },
          { label: "Ethernet", value: "2× Intel I210 Gigabit LAN" },
        ],
      },
      {
        title: "Power",
        rows: [{ label: "DC Input", value: "9–36V DC wide-range" }],
      },
    ],
    gallery: [
      "https://cesipc.com/wp-content/uploads/2025/04/IMG_9213-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/04/IMG_9214-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/04/IMG_9219-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/04/IMG_9220-1024x683.jpg",
    ],
  },

  /* ───────────── UPC-209B ───────────── */
  "upc-209b": {
    id: "upc-209b",
    intro:
      "UPC-209B Fanless Industrial PC ใช้ Intel® 10th Gen Core™ พร้อม 8DI / 8DO GPIO และ Modbus — เหมาะกับงาน Factory Automation, IoT และ Remote Monitoring",
    highlights: COMMON_INTRO_BULLETS([
      "Intel® Core™ 10th Gen i3 / i5 / i7",
      "8DI / 8DO GPIO + Modbus",
      "Dual Intel® I210 Gigabit Ethernet",
      "I/O: USB 2.0 ×2, USB 3.0 ×4, RS-232 ×3, HDMI",
    ]),
    specs: [
      {
        title: "System Core",
        rows: [
          { label: "CPU", value: "Intel® Core™ 10th Gen i3 / i5 / i7" },
          { label: "Memory", value: "DDR4 SO-DIMM up to 16GB" },
          { label: "Storage", value: "M.2 NVMe + mSATA" },
        ],
      },
      {
        title: "GPIO / I/O",
        rows: [
          { label: "GPIO", value: "8× DI / 8× DO + Modbus" },
          { label: "USB", value: "2× USB 2.0 + 4× USB 3.0" },
          { label: "Serial", value: "3× RS-232" },
          { label: "Ethernet", value: "2× Intel I210 Gigabit LAN" },
        ],
      },
      {
        title: "Power",
        rows: [{ label: "DC Input", value: "9–36V DC wide-range" }],
      },
    ],
    gallery: [
      "https://cesipc.com/wp-content/uploads/2025/02/UPC-209B%E8%83%8C%E9%9D%A2%E4%BE%A7%E9%9D%A2-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/02/UPC-209B%E8%83%8C%E9%9D%A2-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/02/UPC-209B%E6%AD%A3%E9%9D%A2-1024x683.jpg",
    ],
  },

  /* ───────────── UPC-309C ───────────── */
  "upc-309c": {
    id: "upc-309c",
    intro:
      "UPC-309C Fanless Industrial PC ใช้ Intel® 10th Gen Core™ พร้อม 4G/5G LTE (SIM/TF) — เหมาะกับงาน Outdoor, Telecom และ Remote Site ที่ต้อง Performance สูง",
    highlights: COMMON_INTRO_BULLETS([
      "Intel® Core™ 10th Gen i3 / i5 / i7",
      "4G/5G LTE (SIM/TF Card)",
      "Dual Intel® I210 Gigabit Ethernet",
      "I/O: USB 2.0 ×2, USB 3.0 ×4, RS-232 ×3, HDMI, VGA",
    ]),
    specs: [
      {
        title: "System Core",
        rows: [
          { label: "CPU", value: "Intel® Core™ 10th Gen i3 / i5 / i7" },
          { label: "Memory", value: "DDR4 SO-DIMM up to 16GB" },
          { label: "Storage", value: "M.2 NVMe + mSATA" },
        ],
      },
      {
        title: "Wireless / I/O",
        rows: [
          { label: "Cellular", value: "4G / 5G LTE (SIM + TF)" },
          { label: "USB", value: "2× USB 2.0 + 4× USB 3.0" },
          { label: "Serial", value: "3× RS-232" },
          { label: "Display", value: "HDMI + VGA" },
          { label: "Ethernet", value: "2× Intel I210 Gigabit LAN" },
        ],
      },
      {
        title: "Power",
        rows: [{ label: "DC Input", value: "9–36V DC wide-range" }],
      },
    ],
    gallery: [
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_9980-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_9978-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_9982-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_9984-1024x683.jpg",
    ],
  },

  /* ───────────── UPC-309R ───────────── */
  "upc-309r": {
    id: "upc-309r",
    intro:
      "UPC-309R LEGO Industrial PC ออกแบบมาเพื่องาน Mission-critical ที่ต้องการความเสถียรสูงสุด ใช้ Intel® 10th Gen Core™ พร้อม Redundant Power Supply with Warning Light — รับประกันการทำงานต่อเนื่องแม้เกิดไฟตก",
    highlights: COMMON_INTRO_BULLETS([
      "Intel® Core™ 10th Gen i3 / i5 / i7",
      "Redundant Power Supply (DC คู่) พร้อม Warning Light",
      "Dual Intel® I210 Gigabit Ethernet",
      "I/O: USB 2.0 ×2, USB 3.0 ×4, RS-232 ×3, HDMI, VGA",
    ]),
    specs: [
      {
        title: "Processor",
        rows: [
          { label: "CPU", value: "Intel® i3-10110U / i5-10210U / i7-10510U (TDP 15W)" },
          { label: "Cooling", value: "Fanless" },
          { label: "Memory", value: "1× DDR4 2133MHz SO-DIMM up to 16GB" },
          { label: "Storage", value: "M.2 NVMe SSD + mSATA SSD" },
        ],
      },
      {
        title: "I/O Ports",
        rows: [
          { label: "USB", value: "4× USB 3.0 + 2× USB 2.0 (Type-A)" },
          { label: "Serial", value: "6× RS-232 (2× RS-485 optional, DB9, 5V/12V)" },
          { label: "Display", value: "HDMI (3840×2160 @24Hz) + VGA (1920×1080 @60Hz)" },
          { label: "Audio", value: "1× Line-out" },
          { label: "Wi-Fi", value: "802.11 a/g/n, 2×2 antenna, 2.4/5 GHz, 300Mbps" },
          { label: "Ethernet", value: "2× Intel i211 10/100/1000Mbps" },
        ],
      },
      {
        title: "Power",
        rows: [
          { label: "Input", value: "12V DC (2-pin Phoenix), 9–36V DC optional" },
          { label: "Control", value: "Power SW, AT/ATX optional" },
          { label: "Redundant", value: "Redundant Power Supply with Warning Light" },
        ],
      },
      {
        title: "OS / Environment",
        rows: [
          { label: "OS", value: "Windows 7 / 10, Linux" },
          { label: "Operating Temp", value: "0~70°C (extended optional)" },
          { label: "Storage Temp", value: "-25~60°C" },
        ],
      },
      {
        title: "Mechanical",
        rows: [
          { label: "Dimension", value: "300 × 160 × 50 mm (with bracket: 337 × 160 × 53.2)" },
          { label: "Weight", value: "3.2 kg" },
          { label: "Material", value: "High-Strength Aluminum Alloy Front Panel" },
        ],
      },
      {
        title: "Certifications",
        rows: [
          { label: "Certs", value: "CE / RoHS" },
          { label: "Custom", value: "Custom BIOS / System Encryption / Custom LOGO" },
        ],
      },
    ],
    gallery: [
      "https://cesipc.com/wp-content/uploads/2025/02/IMG_9867-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/02/IMG_9857-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/02/IMG_9864-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/02/IMG_9866-1024x683.jpg",
    ],
  },

  /* ───────────── UPC-302F ───────────── */
  "upc-302f": {
    id: "upc-302f",
    intro:
      "UPC-302F Fanless Industrial PC ใช้ Intel® 12th Gen Core™ พร้อม 14× USB ports — สำหรับงาน Multi-device Hub, Airport, Kiosk, POS, Smart Manufacturing และ Lab Automation",
    highlights: COMMON_INTRO_BULLETS([
      "Intel® Core™ 12th Gen i3 / i5 / i7",
      "Dual Intel® I210 Gigabit Ethernet",
      "I/O: USB 2.0 ×10, USB 3.0 ×4, RS-232 ×3, RS-485, HDMI, VGA",
    ]),
    specs: [
      {
        title: "System Core",
        rows: [
          { label: "CPU", value: "Intel® Core™ 12th Gen i3 / i5 / i7" },
          { label: "Memory", value: "8~32GB DDR5" },
          { label: "Storage", value: "M.2 NVMe + mSATA" },
        ],
      },
      {
        title: "I/O Ports",
        rows: [
          { label: "USB", value: "10× USB 2.0 + 4× USB 3.0 (รวม 14 ports)" },
          { label: "Serial", value: "3× RS-232 + RS-485" },
          { label: "Display", value: "HDMI + VGA" },
          { label: "Ethernet", value: "2× Intel I210 Gigabit LAN" },
        ],
      },
      {
        title: "Power",
        rows: [{ label: "DC Input", value: "9–36V DC wide-range" }],
      },
    ],
    gallery: [
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_6685-2-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_6686-1-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_6692-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/IMG_6693-1024x683.jpg",
    ],
  },

  /* ───────────── EPC-302E ───────────── */
  "epc-302e": {
    id: "epc-302e",
    intro:
      "EPC-302E Fanless Industrial PC ใช้ Intel® 12th Gen Core™ พร้อม 5× Intel I210 Gigabit Ethernet — เหมาะกับงาน Network Appliance, Machine Vision, Edge Server",
    highlights: COMMON_INTRO_BULLETS([
      "Intel® Core™ 12th Gen i3 / i5 / i7",
      "5× Intel® I210 Gigabit Ethernet",
      "I/O: USB 2.0 ×2, USB 3.0 ×4, RS-232 ×6, HDMI, VGA",
    ]),
    specs: [
      {
        title: "System Core",
        rows: [
          { label: "CPU", value: "Intel® Core™ 12th Gen i3 / i5 / i7" },
          { label: "Memory", value: "8~32GB DDR5" },
          { label: "Storage", value: "M.2 NVMe + mSATA" },
        ],
      },
      {
        title: "I/O Ports",
        rows: [
          { label: "USB", value: "2× USB 2.0 + 4× USB 3.0" },
          { label: "Serial", value: "6× RS-232" },
          { label: "Display", value: "HDMI + VGA" },
          { label: "Ethernet", value: "5× Intel I210 Gigabit LAN" },
        ],
      },
      {
        title: "Power",
        rows: [{ label: "DC Input", value: "9–36V DC wide-range" }],
      },
    ],
    gallery: [
      "https://cesipc.com/wp-content/uploads/2025/09/IMG_6256-1-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/09/302e-1024x576.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/EPC-309E-4-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/08/EPC-309E-5-1024x683.jpg",
    ],
  },

  /* ───────────── EPC-302A ───────────── */
  "epc-302a": {
    id: "epc-302a",
    intro:
      "EPC-302A Fanless Industrial PC ใช้ Intel® 12th Gen Core™ พร้อม 8×8 Digital GPIO (12V/24V) — เหมาะกับงานควบคุม Sensor / Actuator แบบ Embedded",
    highlights: COMMON_INTRO_BULLETS([
      "Intel® Core™ 12th Gen i3 / i5 / i7",
      "8×8 Digital GPIO (12V/24V)",
      "Dual Intel® I210 Gigabit Ethernet",
      "I/O: USB 2.0 ×2, USB 3.0 ×4, RS-232 ×5, HDMI, VGA",
    ]),
    specs: [
      {
        title: "System Core",
        rows: [
          { label: "CPU", value: "Intel® Core™ 12th Gen i3 / i5 / i7" },
          { label: "Memory", value: "8~32GB DDR5" },
          { label: "Storage", value: "M.2 NVMe + mSATA" },
        ],
      },
      {
        title: "GPIO / I/O",
        rows: [
          { label: "GPIO", value: "8× DI / 8× DO Digital (12V/24V)" },
          { label: "USB", value: "2× USB 2.0 + 4× USB 3.0" },
          { label: "Serial", value: "5× RS-232" },
          { label: "Display", value: "HDMI + VGA" },
          { label: "Ethernet", value: "2× Intel I210 Gigabit LAN" },
        ],
      },
      {
        title: "Power",
        rows: [{ label: "DC Input", value: "9–36V DC wide-range" }],
      },
    ],
    gallery: [
      "https://cesipc.com/wp-content/uploads/2025/10/IMG_7514-1-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/10/IMG_7512-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/10/IMG_7513-1024x683.jpg",
      "https://cesipc.com/wp-content/uploads/2025/10/IMG_7515-1024x683.jpg",
    ],
  },
};
