/* ═══════ All-in-One PC Product Data ═══════ */

export type AIOCategory = "box-pc" | "aio-desktop" | "panel-pc";
export type AIOOS = "Windows" | "Android" | "Linux";

export interface AIOHighlight {
  titleTH: string;
  titleEN: string;
  descTH: string;
  descEN: string;
  image?: string;
}

export interface AIOSpecGroup {
  groupName: string;
  items: { label: string; value: string; note?: string }[];
}

export interface AIOProduct {
  id: string;
  model: string;
  title: string;
  titleTH: string;
  category: AIOCategory;
  os: AIOOS[];
  screenSize: string;
  cpu: string;
  ram: string;
  storage: string;
  mount: string;
  highlights: string[];
  image: string;
  gallery: string[];
  price?: string;
  productUrl?: string;
  keyFeatures: string[];
  overviewSections: AIOHighlight[];
  specGroups: AIOSpecGroup[];
  applications: { icon: string; titleTH: string; titleEN: string }[];
  certifications: string[];
  warranty: { standard: string; support: string; note: string };
}

export const aioProducts: AIOProduct[] = [
  /* ══════ BOX PC ══════ */
  {
    id: "h10pro",
    model: "H10PRO",
    title: "Box PC 10\" Windows 10 Industrial Computer",
    titleTH: "คอมพิวเตอร์อุตสาหกรรม Box PC 10 นิ้ว Windows",
    category: "box-pc",
    os: ["Windows"],
    screenSize: "10\"",
    cpu: "Intel J4125 Quad Core",
    ram: "8GB/16GB",
    storage: "64GB/128GB SSD",
    mount: "VESA / Desktop / Wall Mount",
    highlights: ["10\" 1920x1200 IPS Touchscreen", "10000mAh Battery", "Dual Speaker"],
    image: "/images/rugged/h10pro-8mKFXuc7.jpg",
    gallery: [
      "/images/rugged/h10pro-8mKFXuc7.jpg",
      "/images/rugged/h10pro-angle-DBGfA-VB.jpg",
      "/images/rugged/h10pro-side-DOubPEss.jpg",
      "/images/rugged/h10pro-back-Ce7rUvJW.jpg",
    ],
    productUrl: "/images/rugged/h10pro",
    keyFeatures: [
      "Intel J4125 Quad Core Processor",
      "RAM 8GB/16GB + SSD 64GB/128GB",
      "10\" Multi-Touch Display 1920x1200 IPS",
      "10000mAh Battery - 24Hr Operation",
      "Windows 10/11 Pro Compatible",
      "USB 3.0×4, HDMI, LAN, Serial Port",
      "Dual Speaker + Noise Reduction Mic",
      "Energy Efficient Design",
    ],
    overviewSections: [
      {
        titleTH: "จอทัชสกรีน IPS 10 นิ้ว กันรอยได้",
        titleEN: "10\" IPS Scratch Resistant Touch Screen",
        descTH: "ความละเอียดสูง 1920×1200 ภาพคมชัด จอ IPS กันรอย สัมผัสได้หลายจุดพร้อมกัน เหมาะสำหรับงานที่ต้องใช้จอทัชบ่อยๆ",
        descEN: "High resolution 1920×1200 display with scratch-resistant IPS multi-touch for industrial applications",
        image: "/images/rugged/h10pro-screen-promo-DU8ZUH_p.jpg",
      },
      {
        titleTH: "ประสิทธิภาพแรงจากหัวใจเครื่อง",
        titleEN: "Strong Performance from the Core",
        descTH: "Intel J4125 Quad Core โปรเซสเซอร์ 4 คอร์ ทำหลายงานพร้อมกัน สลับระหว่างโปรแกรมได้ลื่นไหล",
        descEN: "Intel J4125 Quad Core for smooth multitasking performance",
        image: "/images/rugged/h10pro-cpu-promo-BJBVK0fa.jpg",
      },
      {
        titleTH: "ประหยัดไฟ ใช้ได้นาน 24 ชั่วโมง",
        titleEN: "Energy Saving 24-Hour Operation",
        descTH: "แบตเตอรี่ 10000mAh ใช้งานได้เต็มวัน ประหยัดไฟสุดๆ ชาร์จพร้อมใช้งานได้ ระบบควบคุมพลังงานอัจฉริยะ",
        descEN: "10000mAh battery for 24-hour operation with intelligent power management",
        image: "/images/rugged/h10pro-battery-promo-B0M2VKbO.jpg",
      },
      {
        titleTH: "พอร์ตเชื่อมต่อครบครัน ใช้งานได้หลากหลาย",
        titleEN: "Rich Interfaces for All Scenarios",
        descTH: "พอร์ตครบเซ็ต LAN, หูฟัง, USB 3.0×4, HDMI, Serial Port ครบทุกการใช้งาน",
        descEN: "Full connectivity: LAN, USB 3.0×4, HDMI, Serial Port and more",
        image: "/images/rugged/h10pro-interface-promo-DeBATC4z.jpg",
      },
    ],
    specGroups: [
      {
        groupName: "ระบบประมวลผล",
        items: [
          { label: "CPU", value: "Intel Celeron J4125 Quad Core 2.0GHz (Burst 2.7GHz)" },
          { label: "RAM", value: "8GB / 16GB DDR4" },
          { label: "Storage", value: "64GB / 128GB eMMC SSD" },
          { label: "OS", value: "Windows 10/11 Pro" },
        ],
      },
      {
        groupName: "หน้าจอ",
        items: [
          { label: "ขนาด", value: "10.1 นิ้ว IPS" },
          { label: "ความละเอียด", value: "1920 × 1200" },
          { label: "ระบบสัมผัส", value: "Capacitive Multi-Touch 10 จุด" },
          { label: "ป้องกัน", value: "Scratch Resistant Glass" },
        ],
      },
      {
        groupName: "การเชื่อมต่อ",
        items: [
          { label: "USB", value: "USB 3.0 × 4" },
          { label: "Video", value: "HDMI × 1" },
          { label: "Network", value: "Gigabit LAN RJ45 × 1" },
          { label: "Serial", value: "RS232 × 1" },
          { label: "Audio", value: "3.5mm Headphone Jack, Dual Speaker" },
          { label: "Wireless", value: "WiFi 802.11ac + Bluetooth 4.2" },
        ],
      },
      {
        groupName: "พลังงานและขนาด",
        items: [
          { label: "แบตเตอรี่", value: "10000mAh Li-Polymer", note: "ใช้งานต่อเนื่อง 24 ชั่วโมง" },
          { label: "ขนาด", value: "260 × 172 × 22mm" },
          { label: "น้ำหนัก", value: "ประมาณ 800g" },
          { label: "การติดตั้ง", value: "VESA 75mm / Desktop / Wall Mount" },
        ],
      },
    ],
    applications: [
      { icon: "Factory", titleTH: "ระบบควบคุมอุตสาหกรรม", titleEN: "Industrial Control" },
      { icon: "Store", titleTH: "ระบบ POS ร้านค้า", titleEN: "POS System" },
      { icon: "Package", titleTH: "ระบบจัดการคลังสินค้า", titleEN: "Warehouse Management" },
      { icon: "Stethoscope", titleTH: "ระบบสาธารณสุข", titleEN: "Healthcare" },
    ],
    certifications: ["CE", "FCC"],
    warranty: { standard: "1 ปี", support: "บริการซ่อมและเปลี่ยนอะไหล่โดยทีมวิศวกรผู้เชี่ยวชาญ", note: "ราคาอาจมีการเปลี่ยนแปลงโดยไม่แจ้งล่วงหน้า กรุณาสอบถามราคาปัจจุบัน" },
  },

  {
    id: "h10f",
    model: "H10F",
    title: "Box PC 10\" Windows with 2D Scanner",
    titleTH: "คอมพิวเตอร์อุตสาหกรรม Box PC 10\" พร้อม 2D Scanner",
    category: "box-pc",
    os: ["Windows"],
    screenSize: "10.1\"",
    cpu: "Intel J4125 Quad Core",
    ram: "8GB/16GB",
    storage: "128GB SSD",
    mount: "Desktop / Wall Mount / Custom Made",
    highlights: ["10.1\" 10-Point Touch, Scratch-Resistant", "Built-in 2D Scanner", "Removable Battery"],
    image: "/images/rugged/h10f-BONJ3fIQ.jpg",
    gallery: [
      "/images/rugged/h10f-scanner-yMP8y8Le.jpg",
      "/images/rugged/h10f-BONJ3fIQ.jpg",
      "/images/rugged/h10f-angle-CpTd25UP.jpg",
      "/images/rugged/h10f-side-FMabuHPg.jpg",
      "/images/rugged/h10f-back-zgp9RG-G.jpg",
    ],
    productUrl: "/images/rugged/h10f",
    keyFeatures: [
      "Built-in 2D Barcode Scanner",
      "Intel J4125 Quad Core Processor",
      "RAM 8GB/16GB + SSD 128GB (Expandable)",
      "10.1\" 10-Point Touch Display",
      "5000mAh Removable Battery",
      "Windows 10/11 Pro",
      "Wet Hand Operation Support",
      "Custom Made Available",
    ],
    overviewSections: [
      {
        titleTH: "มี 2D Scanner ในตัว!",
        titleEN: "Built-in 2D Barcode Scanner",
        descTH: "สแกนบาร์โค้ดได้ทันที ไม่ต้องซื้ออุปกรณ์เพิ่ม เหมาะสำหรับร้านค้า คลังสินค้า รองรับทั้ง 1D และ 2D QR Code",
        descEN: "Instant barcode scanning without extra equipment. Supports 1D and 2D QR Codes",
        image: "/images/rugged/h10f-scanner-yMP8y8Le.jpg",
      },
      {
        titleTH: "ชิปประสิทธิภาพสูง + หน่วยความจำ",
        titleEN: "High-Performance Chip + Memory",
        descTH: "Intel J4125 Quad Core แรงเต็มที่ RAM 8GB/16GB + SSD 128GB ความจุเยอะ ขยายได้ตามต้องการ",
        descEN: "Intel J4125 Quad Core with expandable 8GB/16GB RAM + 128GB SSD",
        image: "/images/rugged/h10f-cpu-promo-uhxh46Ek.jpg",
      },
      {
        titleTH: "จอ HD 10.1 นิ้ว ทัชได้ 10 จุด ใช้มือเปียกได้",
        titleEN: "10.1-inch HD Touch Screen, Wet Hand Support",
        descTH: "จอ 10 จุดทัช กันรอย ทนทาน ใช้มือเปียกได้ เหมาะสำหรับสภาพแวดล้อมการทำงานหนัก",
        descEN: "10-point touch, scratch-resistant, supports wet hand operation",
        image: "/images/rugged/h10f-screen-promo-B5hOtNry.jpg",
      },
      {
        titleTH: "แบตถอดได้ ประหยัดไฟ",
        titleEN: "Removable Battery, Energy Saving",
        descTH: "แบตเตอรี่ 5000mAh ถอดเปลี่ยนได้ ใช้งานได้นาน 7 ชั่วโมง ประหยัดพลังงาน",
        descEN: "5000mAh removable battery, 7-hour operation",
        image: "/images/rugged/h10f-battery-promo-Ct9KbHqw.jpg",
      },
    ],
    specGroups: [
      {
        groupName: "ระบบประมวลผล",
        items: [
          { label: "CPU", value: "Intel Celeron J4125 Quad Core 2.0GHz (Burst 2.7GHz)" },
          { label: "RAM", value: "8GB / 16GB DDR4" },
          { label: "Storage", value: "128GB SSD (Expandable)" },
          { label: "OS", value: "Windows 10/11 Pro" },
        ],
      },
      {
        groupName: "หน้าจอ",
        items: [
          { label: "ขนาด", value: "10.1 นิ้ว" },
          { label: "ระบบสัมผัส", value: "Capacitive 10-Point Touch" },
          { label: "คุณสมบัติ", value: "Scratch Resistant, Wet Hand Support" },
        ],
      },
      {
        groupName: "Scanner & การเชื่อมต่อ",
        items: [
          { label: "2D Scanner", value: "Built-in 2D Barcode Scanner", note: "รองรับ 1D/2D/QR Code" },
          { label: "USB", value: "USB 3.0 × 4" },
          { label: "Network", value: "Gigabit LAN RJ45" },
          { label: "Wireless", value: "WiFi + Bluetooth" },
        ],
      },
      {
        groupName: "พลังงานและขนาด",
        items: [
          { label: "แบตเตอรี่", value: "5000mAh Removable Li-Polymer", note: "ใช้งานต่อเนื่อง 7 ชั่วโมง" },
          { label: "การติดตั้ง", value: "Desktop / Wall Mount / Custom Made" },
        ],
      },
    ],
    applications: [
      { icon: "Store", titleTH: "ร้านค้าปลีก", titleEN: "Retail Store" },
      { icon: "Package", titleTH: "คลังสินค้า", titleEN: "Warehouse" },
      { icon: "Factory", titleTH: "โรงงานผลิต", titleEN: "Manufacturing" },
      { icon: "Truck", titleTH: "โลจิสติกส์", titleEN: "Logistics" },
    ],
    certifications: ["CE", "FCC"],
    warranty: { standard: "1 ปี", support: "บริการซ่อมและเปลี่ยนอะไหล่โดยทีมวิศวกรผู้เชี่ยวชาญ", note: "ราคาอาจมีการเปลี่ยนแปลงโดยไม่แจ้งล่วงหน้า" },
  },

  {
    id: "h7a",
    model: "H7A",
    title: "Box PC 7\" Android/Linux Industrial Computer",
    titleTH: "คอมพิวเตอร์อุตสาหกรรม Box PC 7\" Android/Linux",
    category: "box-pc",
    os: ["Android", "Linux"],
    screenSize: "7\"",
    cpu: "Rockchip RK3288",
    ram: "2GB",
    storage: "32GB",
    mount: "Compact Box Mount",
    highlights: ["7\" HD IPS Touchscreen", "Android/Linux OS", "Compact Size"],
    image: "/images/rugged/h7a-4mgICCqU.jpg",
    gallery: [
      "/images/rugged/h7a-4mgICCqU.jpg",
      "/images/rugged/h7a-angle-D3tFRqAa.jpg",
      "/images/rugged/h7a-side-DNLq955t.jpg",
      "/images/rugged/h7a-back-jDIEYY-3.jpg",
    ],
    productUrl: "/images/rugged/h7a",
    keyFeatures: [
      "Rockchip RK3288 Quad Core",
      "RAM 2GB + Storage 32GB",
      "7\" Multi-Touch 1280x800 IPS",
      "Android 7.0 / Linux OS",
      "Dual Speaker System",
      "Fanless & Battery-Free Design",
      "24Hr Continuous Operation",
      "Compact Size 178x118x50mm",
    ],
    overviewSections: [
      {
        titleTH: "ระบบ Android เสถียรสูง",
        titleEN: "Android System, Very Stable",
        descTH: "Android 7.0 ระบบเสถียร รองรับซอฟต์แวร์ส่วนใหญ่ เหมาะสำหรับการศึกษา สาธารณสุข ขนส่งสาธารณะ",
        descEN: "Stable Android 7.0 system compatible with most software for education, healthcare, and public transport",
        image: "/images/rugged/h7a-android-promo-Od6-aD3M.jpg",
      },
      {
        titleTH: "โครงโลหะระบายความร้อน",
        titleEN: "Metal Body with Heat Dissipation",
        descTH: "โลหะคุณภาพสูง ระบายความร้อนได้ดี ออกแบบรูพรุนเพิ่มประสิทธิภาพการระบายอากาศ",
        descEN: "High-quality metal body with ventilation for efficient heat dissipation",
        image: "/images/rugged/h7a-metal-promo-BFLspdhv.jpg",
      },
      {
        titleTH: "จอ IPS ทัชสกรีน 7 นิ้ว",
        titleEN: "7-inch IPS Touch Screen",
        descTH: "ความละเอียด 1280x800 แสดงผลคมชัด กันรอย ทนทาน รองรับหลายจุดสัมผัส",
        descEN: "1280x800 IPS display with scratch-resistant multi-touch",
        image: "/images/rugged/h7a-screen-promo-BWriTK8o.jpg",
      },
      {
        titleTH: "ทำงานต่อเนื่อง 24 ชั่วโมง",
        titleEN: "24-Hour Continuous Operation",
        descTH: "Fanless Design ไม่มีพัดลม ไม่มีแบตเตอรี่ ประหยัดพลังงาน ทำงานต่อเนื่อง",
        descEN: "Fanless, battery-free design for 24/7 energy-efficient operation",
        image: "/images/rugged/h7a-power-promo-ErA7B9oQ.jpg",
      },
    ],
    specGroups: [
      {
        groupName: "ระบบประมวลผล",
        items: [
          { label: "CPU", value: "Rockchip RK3288 Quad Core Cortex-A17 1.8GHz" },
          { label: "GPU", value: "Mali-T764" },
          { label: "RAM", value: "2GB DDR3" },
          { label: "Storage", value: "32GB eMMC" },
          { label: "OS", value: "Android 7.0 / Linux" },
        ],
      },
      {
        groupName: "หน้าจอ",
        items: [
          { label: "ขนาด", value: "7 นิ้ว IPS" },
          { label: "ความละเอียด", value: "1280 × 800" },
          { label: "ระบบสัมผัส", value: "Capacitive Multi-Touch" },
        ],
      },
      {
        groupName: "การเชื่อมต่อ",
        items: [
          { label: "USB", value: "USB 2.0" },
          { label: "Network", value: "Ethernet RJ45" },
          { label: "Audio", value: "Dual Speaker" },
          { label: "Wireless", value: "WiFi + Bluetooth" },
        ],
      },
      {
        groupName: "ขนาดและคุณสมบัติ",
        items: [
          { label: "ขนาด", value: "178 × 118 × 50mm" },
          { label: "ระบายความร้อน", value: "Fanless Passive Cooling" },
          { label: "แบตเตอรี่", value: "ไม่มี (ใช้ไฟ DC โดยตรง)" },
          { label: "การทำงาน", value: "24/7 Continuous Operation" },
        ],
      },
    ],
    applications: [
      { icon: "GraduationCap", titleTH: "การศึกษา", titleEN: "Education" },
      { icon: "Stethoscope", titleTH: "สาธารณสุข", titleEN: "Healthcare" },
      { icon: "Bus", titleTH: "ขนส่งสาธารณะ", titleEN: "Public Transport" },
      { icon: "Home", titleTH: "Smart Home", titleEN: "Smart Home" },
    ],
    certifications: ["CE", "FCC"],
    warranty: { standard: "1 ปี", support: "บริการซ่อมและเปลี่ยนอะไหล่โดยทีมวิศวกรผู้เชี่ยวชาญ", note: "ราคาอาจมีการเปลี่ยนแปลงโดยไม่แจ้งล่วงหน้า" },
  },

  {
    id: "h108",
    model: "H108",
    title: "Box PC 10\" Windows 10 Industrial Computer",
    titleTH: "คอมพิวเตอร์อุตสาหกรรม Box PC 10\" Windows 10",
    category: "box-pc",
    os: ["Windows"],
    screenSize: "10\"",
    cpu: "Intel N4020",
    ram: "6GB",
    storage: "64GB",
    mount: "VESA Compatible",
    highlights: ["10\" HD IPS Touchscreen", "Windows 10", "Touchscreen"],
    image: "/images/rugged/h108-DM2Fe9sB.jpg",
    gallery: [
      "/images/rugged/h108-DM2Fe9sB.jpg",
      "/images/rugged/h108-angle-DZeFbW-y.jpg",
      "/images/rugged/h108-side-lD3OO5Bo.jpg",
      "/images/rugged/h108-back-Rjpnqktd.jpg",
    ],
    productUrl: "/images/rugged/h108",
    keyFeatures: [
      "Intel N4020 Dual Core",
      "RAM 6GB + Storage 64GB",
      "10.1\" 10-Point Touch 1920x1280",
      "Windows 10 Home/Pro/Enterprise",
      "10000mAh Battery",
      "Dual Speaker System",
      "WiFi + Bluetooth + Gigabit LAN",
      "USB 3.0 + HDMI + TF Card Slot",
    ],
    overviewSections: [
      {
        titleTH: "จอใหญ่ 10 นิ้ว คมชัดระดับ HD",
        titleEN: "10\" Large HD Display",
        descTH: "1920×1280 HD แสดงผลคมชัด IPS กันรอย จอใหญ่ทนทาน รองรับ 10 จุดสัมผัส",
        descEN: "1920×1280 HD IPS display with scratch-resistant 10-point touch",
        image: "/images/rugged/h108-screen-promo-C_MSLCJ7.jpg",
      },
      {
        titleTH: "Windows 10 ทุกเวอร์ชั่น",
        titleEN: "Windows 10 All Editions",
        descTH: "Home/Pro/Enterprise เลือกได้ตามความต้องการ ระบบเสถียร รองรับซอฟต์แวร์ครบถ้วน",
        descEN: "Home/Pro/Enterprise editions available with full software compatibility",
        image: "/images/rugged/h108-display-promo-WfIK11Z9.jpg",
      },
      {
        titleTH: "เชื่อมต่อครบ ทั้งสายและไร้สาย",
        titleEN: "Multiple Connectivity Options",
        descTH: "WiFi + Bluetooth ส่งข้อมูลไร้สาย พอร์ต USB 3.0, HDMI, LAN, TF Card ครบครัน",
        descEN: "WiFi + Bluetooth wireless, USB 3.0, HDMI, LAN, TF Card ports",
        image: "/images/rugged/h108-wireless-promo-ChWFwZbd.jpg",
      },
      {
        titleTH: "หน่วยความจำเยอะ ทำงานไม่สะดุด",
        titleEN: "Efficient Memory Performance",
        descTH: "6GB + 64GB แรมเยอะ พื้นที่เก็บข้อมูลพอใช้ ทำงานลื่นไหล",
        descEN: "6GB RAM + 64GB storage for smooth performance",
        image: "/images/rugged/h108-memory-promo-ByJMSxHB.jpg",
      },
    ],
    specGroups: [
      {
        groupName: "ระบบประมวลผล",
        items: [
          { label: "CPU", value: "Intel Celeron N4020 Dual Core 1.1GHz (Burst 2.8GHz)" },
          { label: "RAM", value: "6GB DDR4" },
          { label: "Storage", value: "64GB eMMC" },
          { label: "OS", value: "Windows 10 Home/Pro/Enterprise" },
        ],
      },
      {
        groupName: "หน้าจอ",
        items: [
          { label: "ขนาด", value: "10.1 นิ้ว IPS" },
          { label: "ความละเอียด", value: "1920 × 1280 HD" },
          { label: "ระบบสัมผัส", value: "Capacitive 10-Point Touch" },
        ],
      },
      {
        groupName: "การเชื่อมต่อ",
        items: [
          { label: "USB", value: "USB 3.0" },
          { label: "Video", value: "HDMI" },
          { label: "Network", value: "Gigabit LAN" },
          { label: "Card Slot", value: "TF Card" },
          { label: "Audio", value: "Dual Speaker" },
          { label: "Wireless", value: "WiFi + Bluetooth" },
        ],
      },
      {
        groupName: "พลังงาน",
        items: [
          { label: "แบตเตอรี่", value: "10000mAh" },
          { label: "การติดตั้ง", value: "VESA Compatible" },
        ],
      },
    ],
    applications: [
      { icon: "Store", titleTH: "ร้านค้า POS", titleEN: "POS System" },
      { icon: "Factory", titleTH: "อุตสาหกรรม", titleEN: "Industrial" },
      { icon: "BarChart3", titleTH: "ระบบข้อมูล", titleEN: "Data Systems" },
      { icon: "Stethoscope", titleTH: "สาธารณสุข", titleEN: "Healthcare" },
    ],
    certifications: ["CE", "FCC"],
    warranty: { standard: "1 ปี", support: "บริการซ่อมและเปลี่ยนอะไหล่", note: "ราคาอาจมีการเปลี่ยนแปลงโดยไม่แจ้งล่วงหน้า" },
  },

  /* ══════ AIO DESKTOP ══════ */
  {
    id: "f10",
    model: "F10",
    title: "All-in-One PC 10.1\" Touchscreen Windows 11 Pro",
    titleTH: "All-in-One Touch PC 10.1 นิ้ว Windows 11 Pro",
    category: "aio-desktop",
    os: ["Windows"],
    screenSize: "10.1\"",
    cpu: "Intel Celeron N5095",
    ram: "8GB",
    storage: "128GB",
    mount: "VESA Mount Compatible",
    highlights: ["10.1\" IPS Touchscreen 1200x1920", "Windows 11 Pro", "Touchscreen Display"],
    image: "/images/rugged/f10-C93ZGwZ7.jpg",
    gallery: [
      "/images/rugged/f10-C93ZGwZ7.jpg",
      "/images/rugged/f10-8McJcNcK.jpg",
    ],
    price: "฿17,990",
    productUrl: "/images/rugged/f10",
    keyFeatures: [
      "FHD Display 1200x1920 IPS",
      "Dual HDMI Output",
      "Quad USB Ports",
      "Dual RS232 Serial Port",
      "Desktop Ready Design",
      "Intel Celeron N5095 Quad Core",
    ],
    overviewSections: [
      {
        titleTH: "จอ FHD IPS 10.1 นิ้ว ทัชสกรีน",
        titleEN: "10.1\" FHD IPS Touchscreen",
        descTH: "ความละเอียด 1200×1920 ภาพคมชัด จอ IPS มุมมองกว้าง ทัชสกรีนตอบสนองเร็ว",
        descEN: "1200×1920 FHD IPS display with responsive touchscreen",
      },
      {
        titleTH: "ประสิทธิภาพสูงด้วย Intel N5095",
        titleEN: "High Performance Intel N5095",
        descTH: "Intel Celeron N5095 Quad Core พร้อม RAM 8GB + SSD 128GB ทำงานลื่นไหล",
        descEN: "Intel Celeron N5095 Quad Core with 8GB RAM + 128GB SSD",
      },
    ],
    specGroups: [
      {
        groupName: "ระบบประมวลผล",
        items: [
          { label: "CPU", value: "Intel Celeron N5095 Quad Core" },
          { label: "RAM", value: "8GB DDR4" },
          { label: "Storage", value: "128GB SSD" },
          { label: "OS", value: "Windows 11 Pro" },
        ],
      },
      {
        groupName: "หน้าจอ",
        items: [
          { label: "ขนาด", value: "10.1 นิ้ว IPS" },
          { label: "ความละเอียด", value: "1200 × 1920 FHD" },
          { label: "ระบบสัมผัส", value: "Capacitive Touchscreen" },
        ],
      },
      {
        groupName: "การเชื่อมต่อ",
        items: [
          { label: "USB", value: "USB × 4" },
          { label: "Video", value: "HDMI × 2" },
          { label: "Serial", value: "RS232 × 2" },
          { label: "การติดตั้ง", value: "VESA Mount / Desktop" },
        ],
      },
    ],
    applications: [
      { icon: "Monitor", titleTH: "สำนักงาน", titleEN: "Office" },
      { icon: "Store", titleTH: "ร้านค้า", titleEN: "Retail" },
      { icon: "Factory", titleTH: "อุตสาหกรรม", titleEN: "Industrial" },
      { icon: "BarChart3", titleTH: "ข้อมูล", titleEN: "Data" },
    ],
    certifications: ["CE", "FCC"],
    warranty: { standard: "1 ปี", support: "บริการซ่อมและเปลี่ยนอะไหล่", note: "ราคาอาจมีการเปลี่ยนแปลงโดยไม่แจ้งล่วงหน้า" },
  },

  {
    id: "f15",
    model: "F15",
    title: "All-in-One PC 15.6\" Industrial Tablet with Stand",
    titleTH: "All-in-One PC 15.6 นิ้ว จอสัมผัส พร้อมขาตั้ง",
    category: "aio-desktop",
    os: ["Windows"],
    screenSize: "15.6\"",
    cpu: "Intel Celeron N5095",
    ram: "8GB",
    storage: "128GB",
    mount: "Desktop Stand Included",
    highlights: ["15.6\" FHD IPS Touchscreen", "Windows 11 Pro", "Large 15.6\" Display"],
    image: "/images/rugged/f15-fmf9sjOL.jpg",
    gallery: ["/images/rugged/f15-fmf9sjOL.jpg"],
    productUrl: "/images/rugged/f15",
    keyFeatures: [
      "15.6\" FHD IPS Touchscreen 1920x1080",
      "Intel Celeron N5095 Quad Core",
      "8GB RAM + 128GB SSD",
      "Desktop Stand Included",
      "Windows 11 Pro",
      "Large Display for Industrial Use",
    ],
    overviewSections: [
      {
        titleTH: "จอ FHD 15.6 นิ้ว ใหญ่ชัดเจน",
        titleEN: "15.6\" FHD Large Display",
        descTH: "จอ FHD IPS ขนาด 15.6 นิ้ว แสดงผลคมชัด ทัชสกรีน พร้อมขาตั้งสำหรับโต๊ะทำงาน",
        descEN: "15.6\" FHD IPS touchscreen with included desktop stand",
      },
    ],
    specGroups: [
      {
        groupName: "ระบบประมวลผล",
        items: [
          { label: "CPU", value: "Intel Celeron N5095 Quad Core" },
          { label: "RAM", value: "8GB DDR4" },
          { label: "Storage", value: "128GB SSD" },
          { label: "OS", value: "Windows 11 Pro" },
        ],
      },
      {
        groupName: "หน้าจอ",
        items: [
          { label: "ขนาด", value: "15.6 นิ้ว FHD IPS" },
          { label: "ความละเอียด", value: "1920 × 1080" },
          { label: "ระบบสัมผัส", value: "Capacitive Touchscreen" },
        ],
      },
    ],
    applications: [
      { icon: "Store", titleTH: "ร้านค้า", titleEN: "Retail" },
      { icon: "Factory", titleTH: "อุตสาหกรรม", titleEN: "Industrial" },
      { icon: "Monitor", titleTH: "สำนักงาน", titleEN: "Office" },
    ],
    certifications: ["CE", "FCC"],
    warranty: { standard: "1 ปี", support: "บริการซ่อมและเปลี่ยนอะไหล่", note: "ราคาอาจมีการเปลี่ยนแปลงโดยไม่แจ้งล่วงหน้า" },
  },

  {
    id: "f3apl",
    model: "F3APL",
    title: "All-in-One PC 8\" Industrial Mini Tablet",
    titleTH: "All-in-One PC 8 นิ้ว Mini Tablet อุตสาหกรรม",
    category: "aio-desktop",
    os: ["Windows"],
    screenSize: "8\"",
    cpu: "Intel N4200",
    ram: "4GB",
    storage: "64GB",
    mount: "Wall Mount Option",
    highlights: ["8\" HD IPS Touchscreen", "Compact 8\" Design", "Industrial Grade"],
    image: "/images/rugged/f3apl-BmanKFN1.jpg",
    gallery: ["/images/rugged/f3apl-BmanKFN1.jpg"],
    productUrl: "/images/rugged/f3apl",
    keyFeatures: [
      "8\" HD IPS Touchscreen",
      "Intel N4200 Quad Core",
      "4GB RAM + 64GB Storage",
      "Wall Mount Option",
      "Compact 8\" Industrial Design",
      "Industrial Grade Build",
    ],
    overviewSections: [
      {
        titleTH: "ขนาดกะทัดรัด 8 นิ้ว เกรดอุตสาหกรรม",
        titleEN: "Compact 8\" Industrial Grade",
        descTH: "จอ HD IPS 8 นิ้ว ขนาดเล็กกะทัดรัด เหมาะสำหรับพื้นที่จำกัด ติดผนังได้",
        descEN: "Compact 8\" HD IPS display, wall-mountable for limited spaces",
      },
    ],
    specGroups: [
      {
        groupName: "ระบบประมวลผล",
        items: [
          { label: "CPU", value: "Intel Pentium N4200 Quad Core" },
          { label: "RAM", value: "4GB" },
          { label: "Storage", value: "64GB" },
          { label: "OS", value: "Windows" },
        ],
      },
      {
        groupName: "หน้าจอ",
        items: [
          { label: "ขนาด", value: "8 นิ้ว HD IPS" },
          { label: "ระบบสัมผัส", value: "Capacitive Touchscreen" },
        ],
      },
    ],
    applications: [
      { icon: "Factory", titleTH: "อุตสาหกรรม", titleEN: "Industrial" },
      { icon: "Home", titleTH: "Smart Home", titleEN: "Smart Home" },
      { icon: "Store", titleTH: "ร้านค้า", titleEN: "Retail" },
    ],
    certifications: ["CE"],
    warranty: { standard: "1 ปี", support: "บริการซ่อมและเปลี่ยนอะไหล่", note: "ราคาอาจมีการเปลี่ยนแปลงโดยไม่แจ้งล่วงหน้า" },
  },

  {
    id: "f11",
    model: "F11",
    title: "All-in-One PC 11.6\" Box-Type Industrial Touch",
    titleTH: "All-in-One PC 11.6 นิ้ว Box-Type จอสัมผัสอุตสาหกรรม",
    category: "aio-desktop",
    os: ["Windows"],
    screenSize: "11.6\"",
    cpu: "Intel Processor",
    ram: "8GB",
    storage: "128GB",
    mount: "Box-Type Mounting",
    highlights: ["11.6\" HD IPS Touchscreen", "Box-Type Design", "Industrial Touch"],
    image: "/images/rugged/f11-CcG1zQIK.jpg",
    gallery: ["/images/rugged/f11-CcG1zQIK.jpg"],
    productUrl: "/images/rugged/f11",
    keyFeatures: [
      "11.6\" HD IPS Touchscreen",
      "Intel Processor",
      "8GB RAM + 128GB Storage",
      "Box-Type Mounting Design",
      "Industrial Grade Touch",
    ],
    overviewSections: [
      {
        titleTH: "ดีไซน์ Box-Type จอ 11.6 นิ้ว",
        titleEN: "11.6\" Box-Type Design",
        descTH: "จอ HD IPS ขนาด 11.6 นิ้ว ออกแบบแบบ Box-Type เหมาะสำหรับงานอุตสาหกรรม",
        descEN: "11.6\" HD IPS display with box-type design for industrial applications",
      },
    ],
    specGroups: [
      {
        groupName: "ระบบประมวลผล",
        items: [
          { label: "CPU", value: "Intel Processor" },
          { label: "RAM", value: "8GB" },
          { label: "Storage", value: "128GB" },
          { label: "OS", value: "Windows" },
        ],
      },
      {
        groupName: "หน้าจอ",
        items: [
          { label: "ขนาด", value: "11.6 นิ้ว HD IPS" },
          { label: "ระบบสัมผัส", value: "Industrial Touchscreen" },
        ],
      },
    ],
    applications: [
      { icon: "Factory", titleTH: "อุตสาหกรรม", titleEN: "Industrial" },
      { icon: "BarChart3", titleTH: "ระบบข้อมูล", titleEN: "Data Systems" },
    ],
    certifications: ["CE"],
    warranty: { standard: "1 ปี", support: "บริการซ่อมและเปลี่ยนอะไหล่", note: "ราคาอาจมีการเปลี่ยนแปลงโดยไม่แจ้งล่วงหน้า" },
  },

  {
    id: "f6",
    model: "F6",
    title: "All-in-One PC 10.1\" Mini AIO Windows 11",
    titleTH: "All-in-One PC 10.1 นิ้ว Mini AIO Windows 11",
    category: "aio-desktop",
    os: ["Windows"],
    screenSize: "10.1\"",
    cpu: "Intel Processor",
    ram: "4GB",
    storage: "64GB",
    mount: "Desktop/Wall Mount",
    highlights: ["10.1\" HD IPS Touchscreen", "Windows 11", "Compact Design"],
    image: "/images/rugged/f6-CSMftW2a.jpg",
    gallery: ["/images/rugged/f6-CSMftW2a.jpg"],
    productUrl: "/images/rugged/f6",
    keyFeatures: [
      "10.1\" HD IPS Touchscreen",
      "Intel Processor",
      "4GB RAM + 64GB Storage",
      "Desktop/Wall Mount",
      "Windows 11 Compatible",
      "Compact Design",
    ],
    overviewSections: [
      {
        titleTH: "Mini AIO ขนาดกะทัดรัด",
        titleEN: "Compact Mini AIO Design",
        descTH: "จอ 10.1 นิ้ว ขนาดเล็กกะทัดรัด ติดตั้งได้ทั้งบนโต๊ะและติดผนัง",
        descEN: "Compact 10.1\" display, suitable for desktop and wall mount",
      },
    ],
    specGroups: [
      {
        groupName: "ระบบประมวลผล",
        items: [
          { label: "CPU", value: "Intel Processor" },
          { label: "RAM", value: "4GB" },
          { label: "Storage", value: "64GB" },
          { label: "OS", value: "Windows 11" },
        ],
      },
      {
        groupName: "หน้าจอ",
        items: [
          { label: "ขนาด", value: "10.1 นิ้ว HD IPS" },
          { label: "ระบบสัมผัส", value: "Capacitive Touchscreen" },
        ],
      },
    ],
    applications: [
      { icon: "Home", titleTH: "Smart Home", titleEN: "Smart Home" },
      { icon: "Monitor", titleTH: "สำนักงาน", titleEN: "Office" },
      { icon: "Store", titleTH: "ร้านค้า", titleEN: "Retail" },
    ],
    certifications: ["CE"],
    warranty: { standard: "1 ปี", support: "บริการซ่อมและเปลี่ยนอะไหล่", note: "ราคาอาจมีการเปลี่ยนแปลงโดยไม่แจ้งล่วงหน้า" },
  },

  /* ══════ PANEL PC ══════ */
  {
    id: "em-p18r",
    model: "EM-P18R",
    title: "Industrial Panel PC 18.5\" Android",
    titleTH: "อุตสาหกรรม Panel PC 18.5 นิ้ว Android",
    category: "panel-pc",
    os: ["Android"],
    screenSize: "18.5\"",
    cpu: "RK3568 Quad-core",
    ram: "4GB/8GB",
    storage: "64GB/128GB",
    mount: "Panel Mount / VESA",
    highlights: ["18.5\" HD+ Touchscreen", "Large Display", "Quad Core"],
    image: "/images/rugged/em-p18r-BXxSGPUz.jpg",
    gallery: [
      "/images/rugged/em-p18r-BXxSGPUz.jpg",
      "/images/rugged/em-p18r-main-aoEUlfKP.png",
    ],
    productUrl: "/images/rugged/em-p18r",
    keyFeatures: [
      "ชิป ARM ระดับอุตสาหกรรม RK3568 Quad-core",
      "Android 12 รองรับการปรับแต่งหลากหลาย",
      "หน้าจอ Full HD 18.5 นิ้ว 1920×1080",
      "สถาปัตยกรรม ARM ประหยัดพลังงาน",
      "อินเทอร์เฟซใช้งานง่าย",
      "ออกแบบสำหรับสภาพแวดล้อมอุตสาหกรรม",
    ],
    overviewSections: [
      {
        titleTH: "ชิป ARM ระดับอุตสาหกรรม",
        titleEN: "Industrial-grade ARM Chip",
        descTH: "ชิป RK3568 Quad-core ประสิทธิภาพสูงและประหยัดพลังงาน เหมาะสำหรับอุตสาหกรรมที่รุนแรง",
        descEN: "RK3568 Quad-core chip with high performance and energy efficiency for harsh industrial scenarios",
      },
      {
        titleTH: "Android 12 ปรับแต่งยืดหยุ่น",
        titleEN: "Android 12 Flexible Customization",
        descTH: "ระบบปฏิบัติการ Android 12 รองรับการปรับแต่งหลากหลาย ใช้งานง่าย เพิ่มประสิทธิภาพการทำงาน",
        descEN: "Android 12 OS with flexible customization and intuitive operation",
      },
    ],
    specGroups: [
      {
        groupName: "ระบบประมวลผล",
        items: [
          { label: "CPU", value: "Rockchip RK3568 Quad-core Cortex-A55 2.0GHz" },
          { label: "GPU", value: "Mali-G52-2EE" },
          { label: "RAM", value: "4GB / 8GB DDR4" },
          { label: "Storage", value: "64GB / 128GB eMMC" },
          { label: "OS", value: "Android 12" },
          { label: "Platform", value: "ARM" },
        ],
      },
      {
        groupName: "หน้าจอ",
        items: [
          { label: "ขนาด", value: "18.5 นิ้ว" },
          { label: "ความละเอียด", value: "1920 × 1080 Full HD" },
          { label: "ระบบสัมผัส", value: "Capacitive Touchscreen" },
        ],
      },
      {
        groupName: "การติดตั้ง",
        items: [
          { label: "รูปแบบ", value: "Panel Mount / VESA Mount" },
        ],
      },
    ],
    applications: [
      { icon: "Factory", titleTH: "ระบบควบคุมอุตสาหกรรม", titleEN: "Industrial Automation" },
      { icon: "Smartphone", titleTH: "แอพพลิเคชั่น", titleEN: "Custom Applications" },
      { icon: "Globe", titleTH: "ระบบเครือข่าย", titleEN: "Network Systems" },
      { icon: "Settings", titleTH: "ระบบควบคุม", titleEN: "Control Systems" },
    ],
    certifications: ["CE", "FCC"],
    warranty: { standard: "1 ปี", support: "บริการซ่อมและเปลี่ยนอะไหล่โดยทีมวิศวกรผู้เชี่ยวชาญ", note: "ราคาอาจมีการเปลี่ยนแปลงโดยไม่แจ้งล่วงหน้า" },
  },

  {
    id: "em-pt21",
    model: "EM-PT21",
    title: "Panel Touch Display 21.5\"",
    titleTH: "จอทัชสกรีน 21.5 นิ้ว ระดับอุตสาหกรรม",
    category: "panel-pc",
    os: ["Windows"],
    screenSize: "21.5\"",
    cpu: "RTD2513A",
    ram: "8GB",
    storage: "128GB",
    mount: "Panel/VESA Mount",
    highlights: ["21.5\" FHD 1920x1080 Touchscreen", "Large 21.5\" Display", "FHD Resolution"],
    image: "/images/rugged/em-pt21-Bb8yF9hD.png",
    gallery: ["/images/rugged/em-pt21-Bb8yF9hD.png"],
    productUrl: "/images/rugged/em-pt21",
    keyFeatures: [
      "หน้าจอระดับอุตสาหกรรม ทนทานต่อการใช้งานหนัก",
      "Full HD 1920×1080 ภาพคมชัดสมจริง",
      "มุมมอง 178 องศา มองเห็นได้ชัดจากทุกมุม",
      "ทัชสกรีน Capacitive ตอบสนองรวดเร็ว",
      "ขนาด 21.5 นิ้ว เหมาะกับการใช้งานหลากหลาย",
      "ติดตั้งง่าย รองรับหลายรูปแบบ",
    ],
    overviewSections: [
      {
        titleTH: "หน้าจอ Full HD 21.5 นิ้ว มุมมองกว้าง 178°",
        titleEN: "21.5\" Full HD Display with 178° Wide Viewing",
        descTH: "จอ FHD 1920×1080 ระดับอุตสาหกรรม มุมมอง 178 องศา มองเห็นได้ชัดจากทุกมุม ทัชสกรีน Capacitive ตอบสนองรวดเร็ว",
        descEN: "Industrial-grade FHD 1920×1080 display with 178° wide viewing angles and responsive capacitive touch",
      },
    ],
    specGroups: [
      {
        groupName: "หน้าจอ",
        items: [
          { label: "ขนาด", value: "21.5 นิ้ว" },
          { label: "ความละเอียด", value: "1920 × 1080 Full HD" },
          { label: "มุมมอง", value: "178° (H/V)" },
          { label: "ระบบสัมผัส", value: "Capacitive Touchscreen" },
          { label: "ชิปควบคุม", value: "RTD2513A" },
          { label: "ระดับ", value: "Industrial Grade" },
        ],
      },
      {
        groupName: "การติดตั้ง",
        items: [
          { label: "รูปแบบ", value: "Panel Mount / VESA Mount" },
        ],
      },
    ],
    applications: [
      { icon: "Monitor", titleTH: "จอแสดงผล", titleEN: "Display Monitor" },
      { icon: "Pointer", titleTH: "ระบบสัมผัส", titleEN: "Touch Interface" },
      { icon: "Factory", titleTH: "อุตสาหกรรม", titleEN: "Industrial Use" },
      { icon: "BarChart3", titleTH: "ระบบข้อมูล", titleEN: "Data Systems" },
    ],
    certifications: ["CE", "FCC"],
    warranty: { standard: "1 ปี", support: "บริการซ่อมและเปลี่ยนอะไหล่", note: "ราคาอาจมีการเปลี่ยนแปลงโดยไม่แจ้งล่วงหน้า" },
  },

  {
    id: "em-p21r",
    model: "EM-P21R",
    title: "Industrial Panel PC 21.5\" Android",
    titleTH: "อุตสาหกรรม Panel PC 21.5 นิ้ว Android",
    category: "panel-pc",
    os: ["Android"],
    screenSize: "21.5\"",
    cpu: "Rockchip RK3568",
    ram: "4GB/8GB",
    storage: "32GB/64GB",
    mount: "Embedded Panel",
    highlights: ["21.5\" FHD 1920x1080 Touchscreen", "Android 12", "Large Screen"],
    image: "/images/rugged/em-p21r-DY_u1Sch.png",
    gallery: ["/images/rugged/em-p21r-DY_u1Sch.png"],
    productUrl: "/images/rugged/em-p21r",
    keyFeatures: [
      "ชิป Rockchip RK3568 ประสิทธิภาพสูงและเสถียร",
      "Android 12 ทันสมัยและใช้งานง่าย",
      "ติดตั้งง่ายด้วยวิธีฝังตัว ติดผนัง และอื่นๆ",
      "หน้าจอ Full HD 21.5 นิ้ว 1920×1080",
      "ได้รับการรับรองมาตรฐาน CE และ FCC",
      "ใช้งานหลากหลาย อุตสาหกรรม สื่อสาร ระบบไฟฟ้า",
    ],
    overviewSections: [
      {
        titleTH: "RK3568 + Android 12 ติดตั้งง่าย",
        titleEN: "RK3568 + Android 12 Easy Installation",
        descTH: "ติดตั้งง่ายด้วยวิธีฝังตัว ติดผนัง สามารถติดตั้งได้ในตำแหน่งใดก็ได้ ใช้งานกว้างขวาง",
        descEN: "Easy installation via embedded, wall-mounted methods. Widely used in industrial control, communication, and automation fields",
      },
    ],
    specGroups: [
      {
        groupName: "ระบบประมวลผล",
        items: [
          { label: "CPU", value: "Rockchip RK3568 Quad-core Cortex-A55" },
          { label: "GPU", value: "Mali-G52-2EE" },
          { label: "RAM", value: "4GB / 8GB" },
          { label: "Storage", value: "32GB / 64GB eMMC" },
          { label: "OS", value: "Android 12" },
        ],
      },
      {
        groupName: "หน้าจอ",
        items: [
          { label: "ขนาด", value: "21.5 นิ้ว FHD" },
          { label: "ความละเอียด", value: "1920 × 1080" },
          { label: "ระบบสัมผัส", value: "Capacitive Touchscreen" },
        ],
      },
      {
        groupName: "การรับรอง",
        items: [
          { label: "มาตรฐาน", value: "CE, FCC" },
          { label: "การติดตั้ง", value: "Embedded Panel / Wall Mount" },
        ],
      },
    ],
    applications: [
      { icon: "Factory", titleTH: "ระบบควบคุมอุตสาหกรรม", titleEN: "Industrial Control" },
      { icon: "Radio", titleTH: "ระบบสื่อสาร", titleEN: "Communication" },
      { icon: "Zap", titleTH: "ระบบไฟฟ้า", titleEN: "Power Systems" },
      { icon: "Globe", titleTH: "ระบบเครือข่าย", titleEN: "Network Systems" },
    ],
    certifications: ["CE", "FCC"],
    warranty: { standard: "1 ปี", support: "บริการซ่อมและเปลี่ยนอะไหล่", note: "ราคาอาจมีการเปลี่ยนแปลงโดยไม่แจ้งล่วงหน้า" },
  },

  {
    id: "em-p21j",
    model: "EM-P21J",
    title: "Industrial PC 21.5\" Windows Intel",
    titleTH: "อุตสาหกรรม Panel PC 21.5 นิ้ว Windows Intel",
    category: "panel-pc",
    os: ["Windows"],
    screenSize: "21.5\"",
    cpu: "Intel Celeron N5100",
    ram: "8GB",
    storage: "128GB",
    mount: "Panel Mount / VESA",
    highlights: ["21.5\" FHD 1920x1080 Touchscreen", "Intel N5100", "Windows 10/11"],
    image: "/images/rugged/em-p21j-3-DzrN00FF.png",
    gallery: ["/images/rugged/em-p21j-3-DzrN00FF.png"],
    productUrl: "/images/rugged/em-p21j",
    keyFeatures: [
      "Intel Celeron N5100 ประสิทธิภาพสูง",
      "ระบายความร้อนไร้พัดลม Fanless Design",
      "มาตรฐาน IP65 ป้องกันฝุ่นและน้ำ",
      "Windows 10/11 รองรับทั้งสองรุ่น",
      "ต้านทาน EMI และไฟฟ้าสถิต",
      "ทำงานต่อเนื่อง 24/7",
    ],
    overviewSections: [
      {
        titleTH: "Intel N5100 Fanless IP65 ทำงาน 24/7",
        titleEN: "Intel N5100 Fanless IP65 24/7 Operation",
        descTH: "พลังแรงด้วย Intel Celeron N5100 ระบายความร้อนไร้พัดลม รองรับ 24/7 ทนทาน EMI มาตรฐาน IP65 ป้องกันฝุ่นและน้ำ",
        descEN: "Powered by Intel Celeron N5100 with fanless thermal design for 24/7 reliability. EMI resistant with IP65 rating",
      },
    ],
    specGroups: [
      {
        groupName: "ระบบประมวลผล",
        items: [
          { label: "CPU", value: "Intel Celeron N5100 Quad Core" },
          { label: "GPU", value: "Intel UHD Graphics" },
          { label: "RAM", value: "8GB DDR4" },
          { label: "Storage", value: "128GB SSD" },
          { label: "OS", value: "Windows 10/11" },
        ],
      },
      {
        groupName: "หน้าจอ",
        items: [
          { label: "ขนาด", value: "21.5 นิ้ว FHD" },
          { label: "ความละเอียด", value: "1920 × 1080" },
          { label: "ระบบสัมผัส", value: "Capacitive Touchscreen" },
        ],
      },
      {
        groupName: "ระดับการป้องกัน",
        items: [
          { label: "IP Rating", value: "IP65", note: "ป้องกันฝุ่นและน้ำ" },
          { label: "ระบายความร้อน", value: "Fanless Passive Cooling" },
          { label: "ทนทาน", value: "EMI & Static Resistant" },
          { label: "การทำงาน", value: "24/7 Continuous Operation" },
          { label: "การติดตั้ง", value: "Panel Mount / VESA" },
        ],
      },
    ],
    applications: [
      { icon: "Factory", titleTH: "ควบคุมอุตสาหกรรม", titleEN: "Industrial Control" },
      { icon: "Settings", titleTH: "ระบบอัตโนมัติ", titleEN: "Automation" },
      { icon: "BarChart3", titleTH: "ระบบข้อมูล", titleEN: "Data Systems" },
      { icon: "Globe", titleTH: "ระบบเครือข่าย", titleEN: "Network Systems" },
    ],
    certifications: ["CE", "FCC", "IP65"],
    warranty: { standard: "1 ปี", support: "บริการซ่อมและเปลี่ยนอะไหล่", note: "ราคาอาจมีการเปลี่ยนแปลงโดยไม่แจ้งล่วงหน้า" },
  },

  {
    id: "em-p21a",
    model: "EM-P21A",
    title: "Industrial Panel PC 21.5\" Windows",
    titleTH: "อุตสาหกรรม Panel PC 21.5 นิ้ว Windows i5",
    category: "panel-pc",
    os: ["Windows"],
    screenSize: "21.5\"",
    cpu: "Intel Core i5-1235U",
    ram: "8GB",
    storage: "128GB",
    mount: "Panel/VESA Mount",
    highlights: ["21.5\" FHD 1920x1080 Touchscreen", "Windows 10/11", "Large Display"],
    image: "/images/rugged/em-p21a-BOe3jDlu.png",
    gallery: ["/images/rugged/em-p21a-BOe3jDlu.png"],
    productUrl: "/images/rugged/em-p21a",
    keyFeatures: [
      "Intel Core i5-1235U รุ่นล่าสุด พร้อม Intel Iris Xe Graphics",
      "ระบายความร้อนแบบไร้พัดลม เงียบและเชื่อถือได้",
      "มาตรฐาน IP65 ป้องกันฝุ่นและน้ำ",
      "หน้าจอ 21.5 นิ้ว Full HD 1920×1080",
      "ต้านทานคลื่นแม่เหล็กไฟฟ้าและไฟฟ้าสถิต",
      "ทำงานต่อเนื่อง 24/7",
    ],
    overviewSections: [
      {
        titleTH: "Intel Core i5-1235U ประสิทธิภาพสูงสุด",
        titleEN: "Intel Core i5-1235U Top Performance",
        descTH: "พลังแรงด้วย Intel Core i5-1235U พร้อม Intel Iris Xe Graphics ไร้พัดลม IP65 รองรับ 24/7",
        descEN: "Powered by Intel Core i5-1235U with Intel Iris Xe Graphics. Fanless, IP65, 24/7 operation",
      },
    ],
    specGroups: [
      {
        groupName: "ระบบประมวลผล",
        items: [
          { label: "CPU", value: "Intel Core i5-1235U (10-core, 12-thread)", note: "ประสิทธิภาพสูงสุดในคลาส" },
          { label: "GPU", value: "Intel Iris Xe Graphics" },
          { label: "RAM", value: "8GB DDR4" },
          { label: "Storage", value: "128GB SSD" },
          { label: "OS", value: "Windows 11" },
        ],
      },
      {
        groupName: "หน้าจอ",
        items: [
          { label: "ขนาด", value: "21.5 นิ้ว FHD" },
          { label: "ความละเอียด", value: "1920 × 1080" },
          { label: "ระบบสัมผัส", value: "Capacitive Touchscreen" },
        ],
      },
      {
        groupName: "ระดับการป้องกัน",
        items: [
          { label: "IP Rating", value: "IP65" },
          { label: "ระบายความร้อน", value: "Fanless Passive Cooling" },
          { label: "ทนทาน", value: "EMI & Static Resistant" },
          { label: "การทำงาน", value: "24/7 Continuous Operation" },
          { label: "การติดตั้ง", value: "Panel / VESA Mount" },
        ],
      },
    ],
    applications: [
      { icon: "Factory", titleTH: "ระบบควบคุมอุตสาหกรรม", titleEN: "Industrial Control" },
      { icon: "Radio", titleTH: "ระบบสื่อสาร", titleEN: "Communication Systems" },
      { icon: "Zap", titleTH: "ระบบไฟฟ้า", titleEN: "Power Systems" },
      { icon: "Globe", titleTH: "ระบบเครือข่าย", titleEN: "Network Systems" },
    ],
    certifications: ["CE", "FCC", "IP65"],
    warranty: { standard: "1 ปี", support: "บริการซ่อมและเปลี่ยนอะไหล่", note: "ราคาอาจมีการเปลี่ยนแปลงโดยไม่แจ้งล่วงหน้า" },
  },

  {
    id: "em-p17r",
    model: "EM-P17R",
    title: "Industrial Panel PC 17\" Android 12",
    titleTH: "อุตสาหกรรม Panel PC 17 นิ้ว Android 12",
    category: "panel-pc",
    os: ["Android"],
    screenSize: "17\"",
    cpu: "RK3568 Quad-core",
    ram: "4GB/8GB",
    storage: "32GB/64GB",
    mount: "Panel Mount",
    highlights: ["17\" HD+ Touchscreen", "Android 12", "Quad Core"],
    image: "/images/rugged/em-p17r-CD1aCYOo.png",
    gallery: ["/images/rugged/em-p17r-CD1aCYOo.png"],
    productUrl: "/images/rugged/em-p17r",
    keyFeatures: [
      "ชิป RK3568 Quad-core ประสิทธิภาพสูง",
      "Android 12 ระบบทันสมัย",
      "ระบายความร้อนไร้พัดลม",
      "มาตรฐาน IP65 ป้องกันฝุ่นและน้ำ",
      "ขนาดกะทัดรัด 17 นิ้ว เหมาะสำหรับพื้นที่จำกัด",
      "ทำงานต่อเนื่อง 24/7",
    ],
    overviewSections: [
      {
        titleTH: "RK3568 Android 12 Fanless IP65",
        titleEN: "RK3568 Android 12 Fanless IP65",
        descTH: "Panel PC 17 นิ้ว พลังแรง RK3568 ระบบ Android 12 ไร้พัดลม IP65 ป้องกันฝุ่นและน้ำ รองรับ 24/7",
        descEN: "17\" Panel PC with RK3568, Android 12, fanless design, IP65 protection for 24/7 operation",
      },
    ],
    specGroups: [
      {
        groupName: "ระบบประมวลผล",
        items: [
          { label: "CPU", value: "Rockchip RK3568 Quad-core Cortex-A55 2.0GHz" },
          { label: "GPU", value: "Mali-G52-2EE" },
          { label: "RAM", value: "4GB / 8GB DDR4" },
          { label: "Storage", value: "32GB / 64GB eMMC" },
          { label: "OS", value: "Android 12" },
        ],
      },
      {
        groupName: "หน้าจอ",
        items: [
          { label: "ขนาด", value: "17 นิ้ว SXGA" },
          { label: "ความละเอียด", value: "1280 × 1024" },
          { label: "ระบบสัมผัส", value: "Capacitive Touchscreen" },
        ],
      },
      {
        groupName: "ระดับการป้องกัน",
        items: [
          { label: "IP Rating", value: "IP65" },
          { label: "ระบายความร้อน", value: "Fanless Passive Cooling" },
          { label: "การทำงาน", value: "24/7 Continuous Operation" },
          { label: "การติดตั้ง", value: "Panel Mount" },
        ],
      },
    ],
    applications: [
      { icon: "Factory", titleTH: "ควบคุมอุตสาหกรรม", titleEN: "Industrial Control" },
      { icon: "Settings", titleTH: "ระบบอัตโนมัติ", titleEN: "Automation Systems" },
      { icon: "Wrench", titleTH: "ระบบผลิต", titleEN: "Manufacturing" },
      { icon: "BarChart3", titleTH: "ระบบจัดการ", titleEN: "Management Systems" },
    ],
    certifications: ["CE", "FCC", "IP65"],
    warranty: { standard: "1 ปี", support: "บริการซ่อมและเปลี่ยนอะไหล่", note: "ราคาอาจมีการเปลี่ยนแปลงโดยไม่แจ้งล่วงหน้า" },
  },
];

export const categoryLabels: Record<AIOCategory, string> = {
  "box-pc": "Box PC",
  "aio-desktop": "AIO Desktop",
  "panel-pc": "Panel PC",
};

/* ── Helper functions ── */
export const getAIOProduct = (id: string): AIOProduct | undefined =>
  aioProducts.find((p) => p.id === id);

export const getRelatedAIO = (id: string, limit = 3): AIOProduct[] => {
  const current = getAIOProduct(id);
  if (!current) return [];
  return aioProducts
    .filter((p) => p.id !== id && p.category === current.category)
    .slice(0, limit);
};
