export interface NotebookConfig {
  label: string;
  cpu: string;
  ram: string;
  price: string;
}

export interface NotebookHighlight {
  titleTH: string;
  titleEN: string;
  descTH: string;
  descEN: string;
  image?: string;
}

export interface NotebookSpecGroup {
  groupName: string;
  items: { label: string; value: string; note?: string }[];
}

export interface RuggedNotebook {
  id: string;
  model: string;
  title: string;
  titleTH: string;
  subtitle: string;
  screenSize: string;
  cpu: string;
  memory: string;
  protection: string;
  os: "Windows" | "Linux";
  image: string;
  gallery: string[];
  badges: string[];
  configs: NotebookConfig[];
  priceStart?: string;
  keyFeatures: string[];
  highlights: NotebookHighlight[];
  specGroups: NotebookSpecGroup[];
  certifications: string[];
  warranty: {
    standard: string;
    support: string;
    note: string;
  };
}

export const ruggedNotebooks: RuggedNotebook[] = [
  /* ─── 1. EM-X15M ─── */
  {
    id: "em-x15m",
    model: "EM-X15M",
    title: '15.6" Rugged AI PC Intel Windows+AI',
    titleTH: "Rugged AI PC EM-X15M ขนาด 15.6 นิ้ว",
    subtitle: "พร้อม Intel Core Ultra (Meteor Lake-H) และ NPU สำหรับ AI",
    screenSize: '15.6"',
    cpu: "Intel Core Ultra 5 125H / Ultra 7 155H (Meteor Lake-H)",
    memory: "32GB / 64GB DDR5 / 256GB / 512GB / 1TB PCIe Gen4 SSD",
    protection: "MIL-STD-810H, IP65",
    os: "Windows",
    image: "/images/rugged/em-x15a-V7O0Cy_Y.png",
    gallery: [
      "/images/rugged/em-x15a-V7O0Cy_Y.png",
      "/images/rugged/em-x15a-angle-DpV_jkj6.png",
      "/images/rugged/em-x15a-side-CDpJyA2o.png",
      "/images/rugged/em-x15a-ports-DnrCdCrW.png",
      "/images/rugged/em-x15a-display-Cuf94Gih.png",
      "/images/rugged/em-x15a-keyboard-B9Jy07IF.png",
    ],
    badges: ["AI Enhanced", "Large Display", "MIL-STD-810H"],
    configs: [
      { label: "Ultra 5/7+32+256", cpu: "Intel Meteor Lake-H Ultra5 125H / Ultra7 155H", ram: "32GB DDR5 + 256GB SSD", price: "฿83,900" },
      { label: "Ultra 5/7+64+512", cpu: "Intel Meteor Lake-H Ultra5 125H / Ultra7 155H", ram: "64GB DDR5 + 512GB SSD", price: "฿89,600" },
    ],
    priceStart: "฿83,900",
    keyFeatures: [
      "AI PC พร้อม NPU สำหรับประมวลผล AI แบบ Real-time",
      "Intel Core Ultra รุ่นที่ 1 (Meteor Lake-H) - 16 cores, 22 threads",
      "Intel Arc Graphics พร้อมความสามารถด้าน AI",
      "ผ่านมาตรฐาน MIL-STD-810H และ IP65 ทนทานสูงสุด",
      "หน้าจอสว่างสูง 1000 nits มองเห็นชัดแม้ในที่แจ้ง",
      "แบตเตอรี่ Hot-swappable ใช้งานต่อเนื่อง",
      "รองรับ 5G/4G, WiFi 6E, Bluetooth 5.3",
      "จอสัมผัส 10 จุด Corning Gorilla Glass",
      "พอร์ต RJ45 2 พอร์ต สำหรับเครือข่ายซ้ำซ้อน",
      "รองรับ Thunderbolt 4 ความเร็วสูง",
    ],
    highlights: [
      { titleTH: "AI PC พร้อม NPU", titleEN: "Intelligence for Tomorrow's World", descTH: "ประมวลผล AI แบบ Real-time ด้วย Intel Core Ultra และ NPU", descEN: "AI-powered processing with Intel Core Ultra and dedicated NPU", image: "/images/rugged/hero-banner-DoXNoow2.webp" },
      { titleTH: "Intel Arc Graphics", titleEN: "Next-Level Performance", descTH: "กราฟิกขั้นสูงรองรับงาน AI และ Machine Learning", descEN: "Advanced graphics for AI and Machine Learning workloads", image: "/images/rugged/arc-graphics-BAd3rO8b.webp" },
      { titleTH: "ตัวเครื่องทนทาน", titleEN: "Durable Body - For All-Scenario Use", descTH: "ผ่านมาตรฐาน MIL-STD-810H ทนต่อการตกกระแทก สภาพแวดล้อมรุนแรง", descEN: "MIL-STD-810H certified to withstand drops and harsh environments", image: "/images/rugged/durable-body-aGKb24V2.webp" },
      { titleTH: "จอสว่างสูง 1000 nits", titleEN: "HD & HB Display", descTH: "มองเห็นชัดเจนในที่แสงแดดจ้า รองรับ Multi-touch", descEN: "Crisp visuals with 1000 nits brightness, sunlight-readable", image: "/images/rugged/hd-display-M_pxQj7l.webp" },
      { titleTH: "Thunderbolt 4", titleEN: "Limitless Functional Expansion", descTH: "ขยายฟังก์ชันได้ไม่จำกัดด้วย Thunderbolt 4", descEN: "Limitless expansion with Thunderbolt 4 interface", image: "/images/rugged/thunderbolt-B0kMghmj.webp" },
      { titleTH: "แบตเตอรี่คู่", titleEN: "High-Capacity Dual-Battery", descTH: "ระบบแบตเตอรี่คู่ Hot-swappable 4850mAh + 1300mAh", descEN: "Dual-battery system optimized for longer-lasting power", image: "/images/rugged/dual-battery-6ldt_B1H.webp" },
    ],
    specGroups: [
      { groupName: "หน่วยประมวลผล", items: [
        { label: "CPU", value: "Intel Core Ultra 5 125H / Ultra 7 155H (Meteor Lake-H)" },
        { label: "GPU", value: "Intel Arc Graphics + NPU สำหรับ AI" },
        { label: "ระบบปฏิบัติการ", value: "Windows 11 Pro / IoT Enterprise" },
      ]},
      { groupName: "หน่วยความจำ", items: [
        { label: "RAM", value: "32GB / 64GB DDR5" },
        { label: "Storage", value: "256GB / 512GB / 1TB PCIe Gen4 SSD" },
      ]},
      { groupName: "จอแสดงผล", items: [
        { label: "หน้าจอ", value: '15.6" FHD 1920×1080, IPS Touch', note: "สว่างสุด 1000 nits" },
      ]},
      { groupName: "แบตเตอรี่", items: [
        { label: "แบตเตอรี่", value: "Hot-swappable dual battery (4850mAh + 1300mAh)" },
      ]},
      { groupName: "ขนาดและน้ำหนัก", items: [
        { label: "ขนาด", value: "395×320×48mm" },
        { label: "น้ำหนัก", value: "3.2kg" },
      ]},
      { groupName: "กล้อง", items: [
        { label: "กล้องหน้า", value: "5.0MP พร้อม IR (Windows Hello)" },
      ]},
      { groupName: "พอร์ตเชื่อมต่อ", items: [
        { label: "พอร์ต", value: "USB 3.2, USB 3.0, Type-C (Thunderbolt 4), HDMI 2.0, RS232, RJ45×2, Audio" },
      ]},
    ],
    certifications: ["MIL-STD-810H", "IP65", "CE", "UN38.3"],
    warranty: { standard: "1 ปี", support: "บริการหลังการขายและซ่อมบำรุง", note: "ราคายังไม่รวม VAT 7%" },
  },

  /* ─── 2. EM-X15A ─── */
  {
    id: "em-x15a",
    model: "EM-X15A",
    title: '15.6" Rugged Notebook Intel Core i5/i7',
    titleTH: "Rugged Notebook EM-X15A ขนาด 15.6 นิ้ว",
    subtitle: "CPU Intel รุ่นที่ 12 และหน้าจอสว่าง 1000 nits",
    screenSize: '15.6"',
    cpu: "Intel Core i5-1235U / i7-1255U (12th Gen)",
    memory: "8GB / 16GB / 32GB DDR4 / 256GB / 512GB / 1TB PCIe SSD",
    protection: "MIL-STD-810H, IP65",
    os: "Windows",
    image: "/images/rugged/em-x15a-V7O0Cy_Y.png",
    gallery: [
      "/images/rugged/em-x15a-V7O0Cy_Y.png",
      "/images/rugged/em-x15a-side-CDpJyA2o.png",
      "/images/rugged/em-x15a-angle-DpV_jkj6.png",
      "/images/rugged/em-x15a-ports-DnrCdCrW.png",
      "/images/rugged/em-x15a-display-Cuf94Gih.png",
      "/images/rugged/em-x15a-keyboard-B9Jy07IF.png",
    ],
    badges: ["Powerful Performance", "Rugged Build", "MIL-STD-810H"],
    configs: [
      { label: "Ultra 7+32+256", cpu: "Intel Meteor Lake-H Ultra 7 155H", ram: "32GB + 256GB SSD", price: "฿83,900" },
      { label: "Ultra 7+64+512", cpu: "Intel Meteor Lake-H Ultra 7 155H", ram: "64GB + 512GB SSD", price: "฿89,500" },
    ],
    priceStart: "฿83,900",
    keyFeatures: [
      "ผ่านมาตรฐาน MIL-STD-810H และ IP65 ทนทานสูงสุด",
      "หน้าจอสว่างสูง 1000 nits มองเห็นชัดแม้ในที่แจ้ง",
      "CPU Intel Core i5/i7 รุ่นที่ 12 ประสิทธิภาพสูง",
      "Intel Iris Xe Graphics สำหรับงานกราฟิก",
      "แบตเตอรี่ Hot-swappable ใช้งานต่อเนื่อง",
      "รองรับ 5G/4G, WiFi 6, Bluetooth 5.1",
      "จอสัมผัส 10 จุด Corning Gorilla Glass",
      "พอร์ต RJ45 2 พอร์ต สำหรับเครือข่ายซ้ำซ้อน",
      "รองรับ Thunderbolt 4 ความเร็วสูง",
    ],
    highlights: [
      { titleTH: "Intel Core รุ่นที่ 12", titleEN: "12th Gen Intel Core", descTH: "ขับเคลื่อนด้วย Intel Core i7-1255U พร้อมสถาปัตยกรรม Hybrid และ Intel Iris Xe Graphics", descEN: "Powered by 12th Gen Intel Core with hybrid architecture and Iris Xe Graphics", image: "/images/rugged/overview-cpu-Df4bSfK5.jpg" },
      { titleTH: "ตัวเครื่องทนทาน", titleEN: "Durable Body", descTH: "ผ่าน MIL-STD-810H ทนต่อการกระแทก ฝุ่น น้ำ และอุณหภูมิสูงต่ำ", descEN: "MIL-STD-810H and IP65 certified for extreme conditions", image: "/images/rugged/overview-durable-EqaGUeCQ.jpg" },
      { titleTH: "จอ 15.6\" ความละเอียดสูง", titleEN: "Sunlight-Readable Display", descTH: "Full HD 1000 nits Anti-glare รองรับ 10-point Glove Touch", descEN: "15.6\" FHD with 1000 nits, anti-glare, 10-point glove touch", image: "/images/rugged/overview-display-452K8dl8.jpg" },
      { titleTH: "Thunderbolt 4 ความเร็วสูง", titleEN: "Thunderbolt 4 40Gbps", descTH: "รองรับ Dual 4K/8K Display พร้อมฝาปิดพอร์ตกันฝุ่นน้ำ", descEN: "40Gbps speed, Dual 4K/8K display support with port covers", image: "/images/rugged/overview-thunderbolt-DKt5Dn8O.jpg" },
      { titleTH: "แบตเตอรี่คู่ความจุสูง", titleEN: "Dual Battery System", descTH: "Hot-swappable เปลี่ยนแบตได้ระหว่างใช้งาน ใช้งานต่อเนื่องยาวนาน", descEN: "Hot-swappable dual battery for continuous all-day operation" },
    ],
    specGroups: [
      { groupName: "หน่วยประมวลผล", items: [
        { label: "CPU", value: "Intel Core i5-1235U / i7-1255U (12th Gen)" },
        { label: "GPU", value: "Intel Iris Xe Graphics" },
        { label: "ระบบปฏิบัติการ", value: "Windows 11 Pro / Windows 10" },
      ]},
      { groupName: "หน่วยความจำ", items: [
        { label: "RAM", value: "8GB / 16GB / 32GB DDR4" },
        { label: "Storage", value: "256GB / 512GB / 1TB PCIe SSD" },
      ]},
      { groupName: "จอแสดงผล", items: [
        { label: "หน้าจอ", value: '15.6" FHD 1920×1080, IPS Touch', note: "สว่างสุด 1000 nits" },
      ]},
      { groupName: "แบตเตอรี่", items: [
        { label: "แบตเตอรี่", value: "4850mAh + 1300mAh (Hot-swappable)" },
      ]},
      { groupName: "ขนาดและน้ำหนัก", items: [
        { label: "ขนาด", value: "395×320×48mm" },
        { label: "น้ำหนัก", value: "3.0kg" },
      ]},
      { groupName: "กล้อง", items: [
        { label: "กล้องหน้า", value: "5.0MP พร้อม IR (Windows Hello)" },
      ]},
      { groupName: "พอร์ตเชื่อมต่อ", items: [
        { label: "พอร์ต", value: "USB 3.2, USB 3.0, USB 2.0, Type-C (Thunderbolt 4), HDMI 2.0a mini, RS232, RJ45×2, Audio" },
      ]},
    ],
    certifications: ["MIL-STD-810H", "IP65", "CE", "UN38.3"],
    warranty: { standard: "1 ปี", support: "บริการหลังการขายและซ่อมบำรุง", note: "ราคายังไม่รวม VAT 7%" },
  },

  /* ─── 3. EM-X14A ─── */
  {
    id: "em-x14a",
    model: "EM-X14A",
    title: '14" Rugged Notebook Intel Core i5/i7',
    titleTH: "Rugged Notebook EM-X14A ขนาด 14 นิ้ว",
    subtitle: "ระดับทหาร พร้อม CPU Intel รุ่นที่ 12 และหน้าจอสว่าง 1000 nits",
    screenSize: '14"',
    cpu: "Intel Core i5-1235U / i7-1255U (12th Gen)",
    memory: "8GB / 16GB / 32GB DDR4 / 256GB / 512GB / 1TB PCIe SSD",
    protection: "MIL-STD-810H, IP65",
    os: "Windows",
    image: "/images/rugged/em-x14a-CeYNitLa.png",
    gallery: [
      "/images/rugged/em-x14a-CeYNitLa.png",
      "/images/rugged/em-x14a-angle-DuwbSaw1.png",
      "/images/rugged/em-x14a-side-C00hbObt.png",
      "/images/rugged/em-x14a-ports-CIgJ8Ke2.png",
      "/images/rugged/em-x14a-display-MoKsXzpi.png",
      "/images/rugged/em-x14a-keyboard-CvqOhDXc.png",
    ],
    badges: ["Compact Size", "High Performance", "MIL-STD-810H"],
    configs: [
      { label: "i5+16+256", cpu: "Intel Core i5-1235U", ram: "16GB + 256GB SSD", price: "฿62,900" },
      { label: "i7+32+256", cpu: "Intel Core i7-1255U", ram: "32GB + 256GB SSD", price: "฿75,900" },
    ],
    priceStart: "฿62,900",
    keyFeatures: [
      "ผ่านมาตรฐาน MIL-STD-810H และ IP65 ทนทานสูงสุด",
      "หน้าจอสว่างสูง 1000 nits มองเห็นชัดแม้ในที่แจ้ง",
      "CPU Intel Core i5/i7 รุ่นที่ 12 ประสิทธิภาพสูง",
      "Intel Iris Xe Graphics สำหรับงานกราฟิก",
      "แบตเตอรี่ถอดเปลี่ยนได้ขณะใช้งาน (Hot-swappable)",
      "จอสัมผัส 10 จุด Corning Gorilla Glass (ตัวเลือกเสริม)",
      "พอร์ต RJ45 2 พอร์ต สำหรับเครือข่ายซ้ำซ้อน",
      "รองรับ Thunderbolt 4 ความเร็วสูง",
    ],
    highlights: [
      { titleTH: "Intel Core รุ่นที่ 12", titleEN: "12th Gen Intel Core", descTH: "ขับเคลื่อนด้วย Intel Core i7-1255U สถาปัตยกรรม Hybrid ที่มีประสิทธิภาพสูง", descEN: "Powered by 12th Gen Intel Core i7-1255U with efficient hybrid architecture", image: "/images/rugged/processor-tHqUFVtP.jpg" },
      { titleTH: "ทนทานระดับทหาร", titleEN: "Military-Grade Durability", descTH: "ผ่านมาตรฐาน MIL-STD-810H ทนต่อการตกกระแทก สภาพแวดล้อมที่รุนแรง", descEN: "MIL-STD-810H certified to withstand drops and harsh environments", image: "/images/rugged/rugged-DPnIJtu8.jpg" },
      { titleTH: "หน้าจอสว่างสูง 1000 nits", titleEN: "Sunlight-Readable Display", descTH: "14 นิ้ว ความสว่าง 1000 nits รองรับ Multi-touch และ Glove touch", descEN: "14-inch display with 1000 nits, supports multi-touch and glove touch", image: "/images/rugged/display-CBmmTlqt.jpg" },
      { titleTH: "พอร์ตเชื่อมต่อครบครัน", titleEN: "Extensive Connectivity", descTH: "Thunderbolt 4, HDMI, USB และ Legacy COM ports ครบครัน", descEN: "Thunderbolt 4, HDMI, USB, and legacy COM ports for limitless expansion", image: "/images/rugged/connectivity-COO04sRS.jpg" },
      { titleTH: "แบตเตอรี่คู่ถอดเปลี่ยนได้", titleEN: "Dual Battery System", descTH: "ระบบแบตเตอรี่คู่ความจุสูง Hot-swappable ใช้งานได้ทั้งวัน", descEN: "Dual-battery system with hot-swappable capability for all-day operation", image: "/images/rugged/battery-nvKvW2E0.jpg" },
    ],
    specGroups: [
      { groupName: "หน่วยประมวลผล", items: [
        { label: "CPU", value: "Intel Core i5-1235U / i7-1255U (12th Gen)" },
        { label: "GPU", value: "Intel Iris Xe Graphics" },
        { label: "ระบบปฏิบัติการ", value: "Windows 11 Pro" },
      ]},
      { groupName: "หน่วยความจำ", items: [
        { label: "RAM", value: "8GB / 16GB / 32GB DDR5" },
        { label: "Storage", value: "256GB / 512GB / 1TB SSD" },
      ]},
      { groupName: "จอแสดงผล", items: [
        { label: "หน้าจอ", value: '14" FHD 1920×1080, 1000 nits', note: "สว่างสุดในตลาด 1000 nits" },
      ]},
      { groupName: "แบตเตอรี่", items: [
        { label: "แบตเตอรี่", value: "4850mAh + 1300mAh (Hot-swappable)", note: "เปลี่ยนได้ขณะใช้งาน" },
      ]},
      { groupName: "ขนาดและน้ำหนัก", items: [
        { label: "ขนาด", value: "363.2×287.4×42.1mm" },
        { label: "น้ำหนัก", value: "2.97kg" },
      ]},
      { groupName: "พอร์ตเชื่อมต่อ", items: [
        { label: "พอร์ต", value: "USB 3.2, USB 3.0, Type-C (Thunderbolt 4), HDMI, RS232, RJ45×2, Audio" },
      ]},
    ],
    certifications: ["MIL-STD-810H", "IP65", "CE", "FCC"],
    warranty: { standard: "1 ปี", support: "บริการหลังการขายและซ่อมบำรุง", note: "ราคายังไม่รวม VAT 7%" },
  },

  /* ─── 4. EM-X14M ─── */
  {
    id: "em-x14m",
    model: "EM-X14M",
    title: '14" Rugged AI Tablet PC Windows 11',
    titleTH: "Rugged AI PC EM-X14M ขนาด 14 นิ้ว",
    subtitle: "AI PC กะทัดรัด 14 นิ้ว พร้อม Intel Core Ultra 5 และ NPU",
    screenSize: '14"',
    cpu: "Intel Core Ultra 5 125H / Ultra 7 155H",
    memory: "16GB / 32GB DDR5 / 256GB / 512GB / 1TB SSD",
    protection: "MIL-STD-810H, IP65",
    os: "Windows",
    image: "/images/rugged/em-x14m-DwyheEo6.png",
    gallery: [
      "/images/rugged/em-x14m-DwyheEo6.png",
      "/images/rugged/em-x14m-angle-DbawXU37.png",
      "/images/rugged/em-x14m-side-ezSxo8Ss.png",
      "/images/rugged/em-x14m-ports-2PQkGKE4.png",
      "/images/rugged/em-x14m-display-Cm8nqLb2.png",
      "/images/rugged/em-x14m-back-CjpohXh1.png",
    ],
    badges: ["AI PC with NPU", "Tablet Mode", "MIL-STD-810H"],
    configs: [
      { label: "Ultra 5+16+256", cpu: "Intel Meteor Lake-H Ultra5 125H", ram: "16GB DDR5 + 256GB SSD", price: "฿69,900" },
      { label: "Ultra 7+32+256", cpu: "Intel Meteor Lake-H Ultra7 155H", ram: "32GB DDR5 + 256GB SSD", price: "฿83,900" },
    ],
    priceStart: "฿69,900",
    keyFeatures: [
      "Intel Core Ultra 5 125H (Meteor Lake-H) พร้อม NPU",
      "Intel Xe LPG Graphics + NPU สำหรับ AI",
      "หน้าจอ 14\" FHD 1000 nits IPS Touch",
      "กล้องหน้า 5.0MP + หลัง 13.0MP",
      "ผ่านมาตรฐาน MIL-STD-810H และ IP65",
    ],
    highlights: [
      { titleTH: "Intel Arc Graphics", titleEN: "Next-Level Performance", descTH: "กราฟิกขั้นสูงสำหรับงาน AI และ Machine Learning", descEN: "Advanced graphics for AI and ML workloads", image: "/images/rugged/overview-arc-performance-BC429eUV.webp" },
      { titleTH: "ตัวเครื่องทนทาน", titleEN: "Durable Body", descTH: "ใช้งานได้ทุกสถานการณ์ กันน้ำ กันฝุ่น กันกระแทก", descEN: "All-scenario use with water, dust, and impact protection", image: "/images/rugged/overview-durable-body-BfIvrPcG.webp" },
      { titleTH: "จอสว่างสูง 1000 nits", titleEN: "HD & HB Display", descTH: "ภาพคมชัด ใช้งานสัมผัสได้ง่าย", descEN: "Crisp visuals with effortless interaction", image: "/images/rugged/overview-display-full-C7Y3Mjtw.webp" },
      { titleTH: "Thunderbolt 4", titleEN: "Limitless Expansion", descTH: "ขยายฟังก์ชันได้ไม่จำกัด", descEN: "Limitless functional expansion via Thunderbolt 4", image: "/images/rugged/overview-thunderbolt-Cxna7xzk.webp" },
    ],
    specGroups: [
      { groupName: "หน่วยประมวลผล", items: [
        { label: "CPU", value: "Intel Core Ultra 5 125H (Meteor Lake-H)" },
        { label: "GPU", value: "Intel Xe LPG Graphics + NPU" },
        { label: "ระบบปฏิบัติการ", value: "Windows 11 Pro" },
      ]},
      { groupName: "หน่วยความจำ", items: [
        { label: "RAM", value: "32GB / 64GB DDR5" },
        { label: "Storage", value: "256GB / 512GB / 1TB PCIe Gen4 SSD" },
      ]},
      { groupName: "จอแสดงผล", items: [
        { label: "หน้าจอ", value: '14" FHD 1920×1080, 1000 nits, IPS Touch' },
      ]},
      { groupName: "ขนาดและน้ำหนัก", items: [
        { label: "ขนาด", value: "366.2×246.9×24.8mm" },
      ]},
      { groupName: "กล้อง", items: [
        { label: "กล้อง", value: "หน้า 5.0MP + หลัง 13.0MP" },
      ]},
      { groupName: "พอร์ตเชื่อมต่อ", items: [
        { label: "พอร์ต", value: "USB 3.2, USB 2.0×2, Type-C (Thunderbolt 4), HDMI 2.0, RS232, RJ45×2, Audio" },
      ]},
    ],
    certifications: ["MIL-STD-810H", "IP65", "CE", "UN38.3"],
    warranty: { standard: "1 ปี", support: "บริการหลังการขายและซ่อมบำรุง", note: "ราคายังไม่รวม VAT 7%" },
  },

  /* ─── 5. EM-I22J ─── */
  {
    id: "em-i22j",
    model: "EM-I22J",
    title: '12.2" Windows 11 Rugged 2-in-1 Notebook',
    titleTH: "Rugged 2-in-1 Notebook EM-I22J ขนาด 12.2 นิ้ว",
    subtitle: "คีย์บอร์ดถอดได้ เปลี่ยนเป็นแท็บเล็ตได้ทันที",
    screenSize: '12.2"',
    cpu: "Intel Jasper Lake N5100",
    memory: "8GB / 16GB LPDDR4 / 128GB / 256GB / 512GB SSD",
    protection: "MIL-STD-810G, IP65",
    os: "Windows",
    image: "/images/rugged/em-i22j-BG1wttE6.png",
    gallery: [
      "/images/rugged/em-i22j-BG1wttE6.png",
      "/images/rugged/em-i22j-tablet-CGC2CzK4.png",
      "/images/rugged/em-i22j-side-D-RkhFmI.png",
      "/images/rugged/em-i22j-ports-DFK1SU5r.png",
      "/images/rugged/em-i22j-back-CuZiE7z6.png",
      "/images/rugged/em-i22j-keyboard-DlzhE4jG.png",
    ],
    badges: ["2-in-1 Design", "Detachable Keyboard", "Hot-swap Battery"],
    configs: [
      { label: "N5100+8+128", cpu: "Intel Jasper Lake N5100", ram: "8GB + 128GB SSD", price: "฿39,900" },
    ],
    priceStart: "฿39,900",
    keyFeatures: [
      "2-in-1 Design คีย์บอร์ดถอดได้ ใช้เป็นแท็บเล็ตได้",
      "ผ่านมาตรฐาน MIL-STD-810G และ IP65",
      "แบตเตอรี่ Hot-swappable ใช้งานต่อเนื่อง 8.5 ชั่วโมง",
      "หน้าจอ 12.2\" อัตราส่วน 16:10 เหมาะกับการทำงาน",
      "น้ำหนักเบา 1.8kg พกพาสะดวก",
      "รองรับ 4G LTE, WiFi 6, Bluetooth 5.0, GPS",
      "ตัวเลือกเสริม: Barcode Scanner, NFC Reader",
      "กล้องหลังพร้อม Flash สำหรับถ่ายภาพในที่มืด",
      "Windows Hello Face Recognition",
    ],
    highlights: [
      { titleTH: "ประสิทธิภาพสูง", titleEN: "High Performance", descTH: "Intel Celeron N5100 Quad-Core สูงสุด 2.80 GHz พร้อม RAM 8GB และ SSD 128GB", descEN: "Intel Celeron N5100 Quad-Core up to 2.80 GHz with 8GB RAM and 128GB SSD", image: "/images/rugged/performance-C3TBb4Ln.jpg" },
      { titleTH: "หน้าจอคมชัด", titleEN: "Crystal Clear Display", descTH: "IPS 12.2\" ความสว่าง 650 nits รองรับสัมผัส 10 จุด", descEN: "12.2\" IPS with 650 nits, 10-point multi-touch", image: "/images/rugged/display-DsAD7ctv.jpg" },
      { titleTH: "ออกแบบ 2-in-1", titleEN: "2-in-1 Design", descTH: "คีย์บอร์ดถอดได้ เปลี่ยนจากโน้ตบุ๊คเป็นแท็บเล็ตได้ทันที", descEN: "Detachable keyboard converts from notebook to tablet instantly", image: "/images/rugged/2in1-feature-iKcgdAZr.jpg" },
      { titleTH: "การเชื่อมต่อครบครัน", titleEN: "Complete Connectivity", descTH: "5G, WiFi Dual-band, 4G, Bluetooth 5.0 และ GPS", descEN: "5G, dual-band WiFi, 4G, Bluetooth 5.0, GPS", image: "/images/rugged/connectivity-D9e9xoFW.jpg" },
      { titleTH: "สแกนบาร์โค้ดมืออาชีพ", titleEN: "Professional Barcode Scanner", descTH: "1D/2D ความละเอียด 5 mil ความเร็ว 50 ครั้ง/วินาที", descEN: "Professional 1D/2D scanner with 5 mil and 50 scans/sec", image: "/images/rugged/barcode-D75SW-Y3.jpg" },
      { titleTH: "แบตเตอรี่คู่", titleEN: "Dual Battery System", descTH: "Hot-swappable ใช้งาน 8.5 ชม. ชาร์จเร็ว 65W", descEN: "Hot-swappable dual battery, 8.5 hours, 65W fast charging", image: "/images/rugged/battery-CqRs_p4h.jpg" },
    ],
    specGroups: [
      { groupName: "หน่วยประมวลผล", items: [
        { label: "CPU", value: "Intel Jasper Lake N5100" },
        { label: "GPU", value: "Intel HD Graphics Gen 11 LP" },
        { label: "ระบบปฏิบัติการ", value: "Windows 11 IoT" },
      ]},
      { groupName: "หน่วยความจำ", items: [
        { label: "RAM", value: "8GB / 16GB LPDDR4" },
        { label: "Storage", value: "128GB / 256GB / 512GB SSD" },
      ]},
      { groupName: "จอแสดงผล", items: [
        { label: "หน้าจอ", value: '12.2" FHD 1920×1200, IPS Touch', note: "650 cd/㎡, อัตราส่วน 16:10" },
        { label: "Touch", value: "10-point capacitive touch" },
      ]},
      { groupName: "แบตเตอรี่", items: [
        { label: "แบตเตอรี่", value: "7.4V/6300mAh (หลัก) + 7.4V/1000mAh (สำรอง)", note: "Hot-swappable, 8.5 ชั่วโมง, 65W fast charging" },
      ]},
      { groupName: "ขนาดและน้ำหนัก", items: [
        { label: "ขนาด", value: "316×210×24mm" },
        { label: "น้ำหนัก", value: "1.8kg" },
      ]},
      { groupName: "กล้อง", items: [
        { label: "กล้อง", value: "หน้า 5.0MP + หลัง 8.0MP" },
      ]},
      { groupName: "พอร์ตเชื่อมต่อ", items: [
        { label: "พอร์ต", value: "USB 2.0, USB 3.0×2, Type-C, HDMI mini, RS232, RS485, RJ45, 12PIN Pogo Pin" },
      ]},
      { groupName: "สภาพแวดล้อม", items: [
        { label: "อุณหภูมิ", value: "-20°C ถึง 60°C" },
        { label: "ความชื้น", value: "95% (ไม่มีการควบแน่น)" },
      ]},
    ],
    certifications: ["MIL-STD-810G", "IP65", "CE", "FCC"],
    warranty: { standard: "1 ปี", support: "บริการหลังการขายและซ่อมบำรุง", note: "ราคายังไม่รวม VAT 7%" },
  },

  /* ─── 6. EM-I22J Linux ─── */
  {
    id: "em-i22j-linux",
    model: "EM-I22J Linux",
    title: '12.2" Intel Linux Ubuntu 22.04.4 Notebook',
    titleTH: "โน้ตบุ๊ค 2-in-1 อุตสาหกรรม Linux Ubuntu 12.2\"",
    subtitle: "Linux Ubuntu 22.04.4 IP65 คีย์บอร์ดถอดได้ Hot-swappable battery",
    screenSize: '12.2"',
    cpu: "Intel Celeron N5100",
    memory: "8GB DDR4 / 128GB SSD",
    protection: "IP65, -20°C to 60°C",
    os: "Linux",
    image: "/images/rugged/em-i22j-BG1wttE6.png",
    gallery: [
      "/images/rugged/em-i22j-BG1wttE6.png",
      "/images/rugged/em-i22j-tablet-CGC2CzK4.png",
      "/images/rugged/em-i22j-side-D-RkhFmI.png",
      "/images/rugged/em-i22j-ports-DFK1SU5r.png",
      "/images/rugged/em-i22j-back-CuZiE7z6.png",
      "/images/rugged/em-i22j-keyboard-DlzhE4jG.png",
    ],
    badges: ["Linux Ubuntu 22.04.4", "Open Source OS", "2-in-1"],
    configs: [],
    priceStart: undefined,
    keyFeatures: [
      "Linux Ubuntu 22.04.4 — Open Source & Developer Friendly",
      "2-in-1 Convertible Design คีย์บอร์ดถอดได้",
      "Hot-swappable Battery เปลี่ยนแบตขณะใช้งาน",
      "IP65 Protection กันน้ำกันฝุ่น",
      "ช่วงอุณหภูมิกว้าง -20°C ถึง 60°C",
      "รองรับ Barcode Scanner (ตัวเลือกเสริม)",
      "GPS & GLONASS Support",
    ],
    highlights: [
      { titleTH: "ประสิทธิภาพการประมวลผล", titleEN: "High Performance Processing", descTH: "Intel Celeron N5100 Quad-Core สูงสุด 2.80 GHz", descEN: "Intel Celeron N5100 Quad-Core up to 2.80 GHz", image: "/images/rugged/performance-C3TBb4Ln.jpg" },
      { titleTH: "จอแสดงผลสว่างชัด", titleEN: "Bright IPS Display", descTH: "12.2\" IPS FHD 1920×1200 ความสว่าง 650 cd/㎡", descEN: "12.2\" IPS FHD 1920×1200 with 650 cd/㎡ brightness", image: "/images/rugged/display-DsAD7ctv.jpg" },
      { titleTH: "ออกแบบ 2-in-1 แปลงได้", titleEN: "2-in-1 Convertible Design", descTH: "คีย์บอร์ดถอดได้ด้วย Pogo Pin แปลงจากโน้ตบุ๊คเป็นแท็บเล็ต", descEN: "Detachable keyboard with Pogo Pin connection", image: "/images/rugged/2in1-design-Cb5bE2qz.jpg" },
      { titleTH: "เชื่อมต่อความเร็วสูง", titleEN: "High-Speed Connectivity", descTH: "5G (เสริม), Wi-Fi Dual-band, 4G, Bluetooth 5.0, GPS", descEN: "Optional 5G, dual-band Wi-Fi, 4G, Bluetooth 5.0, GPS", image: "/images/rugged/connectivity-D9e9xoFW.jpg" },
    ],
    specGroups: [
      { groupName: "หน่วยประมวลผล", items: [
        { label: "CPU", value: "Intel Celeron N5100" },
        { label: "GPU", value: "Intel HD Graphics Gen 11 LP" },
        { label: "ระบบปฏิบัติการ", value: "Ubuntu 22.04.4" },
      ]},
      { groupName: "หน่วยความจำ", items: [
        { label: "RAM", value: "8GB DDR4" },
        { label: "Storage", value: "128GB SSD" },
      ]},
      { groupName: "จอแสดงผล", items: [
        { label: "หน้าจอ", value: '12.2" FHD 1920×1200 IPS', note: "650 cd/㎡" },
        { label: "Touch", value: "10-point capacitive touch" },
      ]},
      { groupName: "แบตเตอรี่", items: [
        { label: "แบตเตอรี่", value: "7.4V/6300mAh (หลัก) + 7.4V/1000mAh (สำรอง)", note: "Hot-swappable" },
      ]},
      { groupName: "ขนาดและน้ำหนัก", items: [
        { label: "ขนาด", value: "319.6×216×24.3mm" },
        { label: "น้ำหนัก", value: "1.5kg" },
      ]},
      { groupName: "พอร์ตเชื่อมต่อ", items: [
        { label: "พอร์ต", value: "USB 2.0×1, USB 3.0×2, Type-C×1, HDMI mini, RS232, RS485, RJ45, 12PIN Pogo Pin" },
      ]},
      { groupName: "สภาพแวดล้อม", items: [
        { label: "อุณหภูมิ", value: "-20°C ถึง 60°C" },
        { label: "ความชื้น", value: "95% (ไม่มีการควบแน่น)" },
      ]},
    ],
    certifications: ["IP65", "CE", "CCC", "FCC"],
    warranty: { standard: "1 ปี", support: "บริการหลังการขายและซ่อมบำรุง", note: "สอบถามราคา" },
  },

  /* ─── 7. W14U-A ─── */
  {
    id: "w14u-a",
    model: "W14U-A",
    title: '14" Windows Rugged Laptop Intel i5/i7',
    titleTH: "โน้ตบุ๊คอุตสาหกรรม 14\" Windows 10",
    subtitle: "IP65 เสริมความแข็งแกร่งพร้อมความสามารถป้องกัน 3 ระดับ",
    screenSize: '14"',
    cpu: "Intel Core i5-1135G7 / i7-1165G7 (11th Gen)",
    memory: "8GB / 16GB DDR4 / 256GB / 512GB / 1TB SSD",
    protection: "IP65, -20°C to 60°C",
    os: "Windows",
    image: "/images/rugged/w14u-t-CnIhYdCX.jpg",
    gallery: [
      "/images/rugged/w14u-t-CnIhYdCX.jpg",
      "/images/rugged/w14u-t-angle-BZOXjXTB.jpg",
      "/images/rugged/w14u-t-side-DHI9GEWG.jpg",
      "/images/rugged/w14u-t-keyboard-DVG4jiDI.jpg",
      "/images/rugged/w14u-t-ports-BJ6hvASF.jpg",
      "/images/rugged/w14u-t-specs-BTIKMjZ0.png",
    ],
    badges: ["Intel 11th Gen i5/i7", "IP65 Protection", "Fingerprint"],
    configs: [
      { label: "i5 16+256GB", cpu: "Intel Core i5-1135G7", ram: "16GB DDR4 + 256GB SSD", price: "฿65,900" },
      { label: "i7 16+256GB", cpu: "Intel Core i7-1165G7", ram: "16GB DDR4 + 256GB SSD", price: "฿72,900" },
    ],
    priceStart: "฿65,900",
    keyFeatures: [
      "การรับรองมาตรฐาน IP65",
      "Intel Core i5/i7 รุ่นที่ 11",
      "หน้าจอความสว่างสูง 700 cd/㎡",
      "ระบบแบตเตอรี่คู่ถอดเปลี่ยนได้",
      "สแกนลายนิ้วมือ",
      "รองรับ NFC (ตัวเลือก)",
      "รองรับ GPS+Beidou (ตัวเลือก)",
      "คีย์บอร์ด 78 คีย์",
      "ลำโพงคู่คุณภาพเสียงดี",
    ],
    highlights: [
      { titleTH: "แบตเตอรี่คู่พลังสูง", titleEN: "High-Capacity Dual Battery", descTH: "แบตเตอรี่แบบถอดได้ 1750mAh+6300mAh ความจุสูง อายุการใช้งานยาวนาน", descEN: "Removable dual battery 1750mAh+6300mAh for extended use", image: "/images/rugged/feature-battery-C-iMToVt.jpg" },
      { titleTH: "Intel รุ่นที่ 11 พลังแรง", titleEN: "11th Gen Intel", descTH: "Intel Core i5-1135G7/i7-1165G7 รุ่นที่ 11 แกนประมวลผลแรงสูง", descEN: "Intel Core i5/i7 11th Gen high-performance processor", image: "/images/rugged/feature-cpu-Bl8y6OCb.jpg" },
      { titleTH: "การออกแบบที่แข็งแกร่ง", titleEN: "Fully Rugged Design", descTH: "IP65 ทนทานต่อการสึกหรอ อุณหภูมิ -20°C ถึง 60°C", descEN: "IP65 protection, -20°C to 60°C operating temperature", image: "/images/rugged/feature-protection-BOXNyyMn.jpg" },
      { titleTH: "การรับรองลายนิ้วมือ", titleEN: "Fingerprint Recognition", descTH: "ปลดล็อคคอมพิวเตอร์ด้วยนิ้วเดียว ความเร็วสูง", descEN: "Fast fingerprint unlock for secure access", image: "/images/rugged/feature-fingerprint-DQ6FXJUN.jpg" },
      { titleTH: "ระบบนำทาง", titleEN: "GPS + Beidou Navigation", descTH: "GPS+Beidou โมดูลระบุตำแหน่งหลายระบบ ครอบคลุมทั่วโลก", descEN: "Multi-system GPS+Beidou positioning for global coverage", image: "/images/rugged/feature-gps-DfwKECBh.jpg" },
    ],
    specGroups: [
      { groupName: "หน่วยประมวลผล", items: [
        { label: "CPU", value: "Intel Core i5-1135G7 / i7-1165G7 (11th Gen)" },
        { label: "ระบบปฏิบัติการ", value: "Windows 10" },
      ]},
      { groupName: "หน่วยความจำ", items: [
        { label: "RAM", value: "8GB / 16GB DDR4" },
        { label: "Storage", value: "256GB / 512GB / 1TB SSD" },
      ]},
      { groupName: "จอแสดงผล", items: [
        { label: "หน้าจอ", value: '14.0" FHD 1920×1080 IPS Multi-point Touch', note: "700 cd/㎡" },
      ]},
      { groupName: "แบตเตอรี่", items: [
        { label: "แบตเตอรี่", value: "1750mAh + 6300mAh (7.4V, ถอดเปลี่ยนได้)" },
      ]},
      { groupName: "ขนาดและน้ำหนัก", items: [
        { label: "ขนาด", value: "363.2×287.4×42.1mm" },
        { label: "น้ำหนัก", value: "2.85kg" },
      ]},
      { groupName: "กล้อง", items: [
        { label: "กล้องหน้า", value: "2.0MP" },
      ]},
      { groupName: "พอร์ตเชื่อมต่อ", items: [
        { label: "พอร์ต", value: "HDMI, Serial, Type-C, USB 3.0, USB 2.0, RJ45, Left docking (ตัวเลือก)" },
        { label: "ช่องการ์ด", value: "SIM / TF (128GB)" },
      ]},
      { groupName: "สภาพแวดล้อม", items: [
        { label: "อุณหภูมิ", value: "-20°C ถึง 60°C (ใช้งาน) / -30°C ถึง 70°C (เก็บรักษา)" },
        { label: "ความชื้น", value: "5%~95% (ไม่มีการควบแน่น)" },
      ]},
    ],
    certifications: ["IP65", "CE", "FCC"],
    warranty: { standard: "1 ปี", support: "บริการหลังการขายและซ่อมบำรุง", note: "ราคายังไม่รวม VAT 7%" },
  },

  /* ─── 8. W15U-T ─── */
  {
    id: "w15u-t",
    model: "W15U-T",
    title: '15.6" Windows Rugged Laptop Intel i5/i7',
    titleTH: "โน้ตบุ๊คอุตสาหกรรม 15.6\" Windows Rugged",
    subtitle: "หน้าจอขนาดใหญ่ 15.6 นิ้ว ทนทานต่อสภาพแวดล้อมที่ซับซ้อน",
    screenSize: '15.6"',
    cpu: "Intel Core i5-1135G7 / i7-1165G7 (11th Gen)",
    memory: "8GB / 16GB DDR4 / 256GB / 512GB / 1TB SSD",
    protection: "IP65, -20°C to 60°C",
    os: "Windows",
    image: "/images/rugged/w15u-t-kYBGsKO4.jpg",
    gallery: [
      "/images/rugged/w15u-t-kYBGsKO4.jpg",
      "/images/rugged/w15u-t-angle-BWE6yBVg.jpg",
      "/images/rugged/w15u-t-side-BZA2_kWZ.jpg",
      "/images/rugged/w15u-t-keyboard-CY8V7494.jpg",
      "/images/rugged/w15u-t-ports-U4cv81p4.jpg",
      "/images/rugged/w15u-t-display-Ck90SYCf.jpg",
    ],
    badges: ["Intel 11th Gen i5/i7", "IP65 Protection", "Large Display"],
    configs: [],
    priceStart: undefined,
    keyFeatures: [
      "IP65 Certified Protection",
      "Intel 11th Gen i5/i7 Processor",
      "750 cd/㎡ High Brightness Display",
      "Large 15.6\" Screen",
      "Dual Removable Battery System",
      "Fingerprint Recognition Module",
      "Optional NFC Reading and Writing",
      "Operating Temperature -20°C to 60°C",
    ],
    highlights: [],
    specGroups: [
      { groupName: "หน่วยประมวลผล", items: [
        { label: "CPU", value: "Intel Core i5-1135G7 / i7-1165G7 (11th Gen)" },
        { label: "ระบบปฏิบัติการ", value: "Windows 10" },
      ]},
      { groupName: "หน่วยความจำ", items: [
        { label: "RAM", value: "8GB / 16GB DDR4" },
        { label: "Storage", value: "256GB / 512GB / 1TB SSD" },
      ]},
      { groupName: "จอแสดงผล", items: [
        { label: "หน้าจอ", value: '15.6" FHD 1920×1080 IPS Multi-point Capacitive Touch', note: "750 cd/㎡" },
      ]},
      { groupName: "แบตเตอรี่", items: [
        { label: "แบตเตอรี่", value: "1750mAh + 6300mAh (7.4V, Removable)", note: "แบตเตอรี่คู่ถอดเปลี่ยนได้" },
      ]},
      { groupName: "ขนาดและน้ำหนัก", items: [
        { label: "ขนาด", value: "363.2×287.4×42.1mm" },
        { label: "น้ำหนัก", value: "2.85kg" },
      ]},
      { groupName: "พอร์ตเชื่อมต่อ", items: [
        { label: "พอร์ต", value: "HDMI, Serial, Type-C, USB 3.0, USB 2.0, RJ45, Left docking (optional)" },
        { label: "ช่องการ์ด", value: "SIM / TF (128GB)" },
      ]},
      { groupName: "สภาพแวดล้อม", items: [
        { label: "อุณหภูมิ", value: "-20°C to 60°C (operating) / -30°C to 70°C (storage)" },
      ]},
    ],
    certifications: ["IP65", "CE"],
    warranty: { standard: "1 ปี", support: "บริการหลังการขายและซ่อมบำรุง", note: "สอบถามราคา" },
  },

  /* ─── 9. W14U-S ─── */
  {
    id: "w14u-s",
    model: "W14U-S",
    title: '14" Windows Rugged Laptop Multi-Gen Intel',
    titleTH: "โน้ตบุ๊คอุตสาหกรรม 14\" Multi-Gen Intel",
    subtitle: "รองรับ CPU Intel รุ่นที่ 6, 8, 11 พร้อมการ์ดจอแยก GTX 1050",
    screenSize: '14"',
    cpu: "Intel i5/i7 (6th, 8th, 11th Gen)",
    memory: "8GB / 16GB / 32GB DDR4 / 256GB ~ 8TB SSD",
    protection: "IP53, -35°C to +50°C",
    os: "Windows",
    image: "/images/rugged/w14u-s-BaC3G990.jpg",
    gallery: [
      "/images/rugged/w14u-s-BaC3G990.jpg",
      "/images/rugged/gallery-2-B3fzcDod.jpg",
      "/images/rugged/gallery-3-Du3TNVoH.jpg",
      "/images/rugged/gallery-4-DGmIErDI.jpg",
      "/images/rugged/gallery-5-BvkR4j9o.jpg",
      "/images/rugged/gallery-6-BsmFAYaY.jpg",
    ],
    badges: ["Multi-Gen Intel CPUs", "Optional GTX 1050 GPU", "IP53"],
    configs: [],
    priceStart: undefined,
    keyFeatures: [
      "IP53 Protection Rating",
      "Multi-Generation Intel CPUs (6th, 8th, 11th Gen)",
      "Optional CFG 1050 4GB Discrete Graphics",
      "Optional 1000 nits Touch Screen",
      "High Capacity Removable Battery (10.8V 4700mAh)",
      "Operating Temperature -35°C to +50°C",
      "Side Expansion: Optical Drive/Battery/HDD",
    ],
    highlights: [
      { titleTH: "จอแสดงผลคมชัดขนาดใหญ่", titleEN: "HD Display", descTH: "14 นิ้ว 1920×1080 ตัวเลือกหน้าจอสัมผัส 1000 nits", descEN: "14-inch 1920×1080 with optional 1000 nits touchscreen", image: "/images/rugged/feature-display-O9H0bEuD.jpg" },
      { titleTH: "ตัวประมวลผลหลายรุ่น", titleEN: "Multi-Gen CPUs", descTH: "รองรับ CPU Intel รุ่นที่ 6, 8, 11 ทั้ง i5 และ i7", descEN: "Intel 6th, 8th, 11th Gen i5 and i7 options", image: "/images/rugged/feature-processor-pituqRdV.jpg" },
      { titleTH: "การ์ดจอเฉพาะ", titleEN: "Discrete GPU", descTH: "CFG 1050 4GB หน่วยความจำกราฟิกขนาดใหญ่ แสดงผลหลายหน้าจอ", descEN: "CFG 1050 4GB dedicated graphics for multi-display", image: "/images/rugged/feature-graphics-Dk4XvbdQ.jpg" },
      { titleTH: "แบตเตอรี่ความจุสูง", titleEN: "High Capacity Battery", descTH: "ลิเธียม 10.8V 4700mAh แบบถอดได้ พร้อมระบบจ่ายไฟอัจฉริยะ", descEN: "10.8V 4700mAh removable lithium battery with smart power", image: "/images/rugged/feature-battery-D1U1-CMK.jpg" },
    ],
    specGroups: [
      { groupName: "หน่วยประมวลผล", items: [
        { label: "CPU", value: "i5-6200U / i5-8250U / i5-1135G7 / i7-6500U / i7-8550U / i7-1165G7 / i7-1185G7" },
        { label: "GPU", value: "Optional CFG 1050 4GB Discrete Graphics" },
        { label: "ระบบปฏิบัติการ", value: "Windows 10 / Windows 7" },
      ]},
      { groupName: "หน่วยความจำ", items: [
        { label: "RAM", value: "8GB / 16GB / 32GB DDR4" },
        { label: "Storage", value: "256GB / 512GB / 1TB / 2TB / 8TB SSD" },
      ]},
      { groupName: "จอแสดงผล", items: [
        { label: "หน้าจอ", value: '14.0" FHD 1920×1080', note: "Optional 1000 nits touch screen" },
      ]},
      { groupName: "แบตเตอรี่", items: [
        { label: "แบตเตอรี่", value: "10.8V 4700mAh Lithium (Removable)" },
      ]},
      { groupName: "ขนาดและน้ำหนัก", items: [
        { label: "ขนาด", value: "350×285×38mm" },
        { label: "น้ำหนัก", value: "2.5kg" },
      ]},
      { groupName: "พอร์ตเชื่อมต่อ", items: [
        { label: "พอร์ต", value: "RS232, 85SATA, USB, HDMI, VGA, Gigabit Ethernet" },
        { label: "Expansion", value: "PCIE 4, PCIE 1 (Optional), Optical drive/Battery/HDD docking" },
      ]},
      { groupName: "สภาพแวดล้อม", items: [
        { label: "อุณหภูมิ", value: "-35°C to +50°C (operating) / -40°C to +70°C (storage)" },
      ]},
    ],
    certifications: ["IP53", "CE"],
    warranty: { standard: "1 ปี", support: "บริการหลังการขายและซ่อมบำรุง", note: "สอบถามราคา" },
  },

  /* ─── 10. W33U ─── */
  {
    id: "w33u",
    model: "W33U",
    title: '13.3" Rugged Laptop',
    titleTH: "โน้ตบุ๊คอุตสาหกรรม 13.3\" IP67",
    subtitle: "High-performance 13.3\" reinforced industrial laptop with IP67 protection",
    screenSize: '13.3"',
    cpu: "Intel Core i5-1135G7 (11th Gen)",
    memory: "8GB / 16GB DDR4 / 256GB / 512GB SSD",
    protection: "IP67, MIL-STD-810G",
    os: "Windows",
    image: "/images/rugged/w33u-DjSixhuc.jpg",
    gallery: [
      "/images/rugged/w33u-DjSixhuc.jpg",
      "/images/rugged/w33u-angle-wd-L3f6I.jpg",
      "/images/rugged/w33u-side-Ct4hwKwu.jpg",
      "/images/rugged/w33u-keyboard-CdyJNCst.jpg",
      "/images/rugged/w33u-ports-DGW8O2zV.jpg",
      "/images/rugged/w33u-display-CF5AIBAk.jpg",
    ],
    badges: ["IP67", "Fingerprint", "TPM 2.0 Security"],
    configs: [],
    priceStart: undefined,
    keyFeatures: [
      "IP67 Certified — กันน้ำกันฝุ่นระดับสูงสุด",
      "MIL-STD-810G Drop Tested",
      "Fingerprint recognition",
      "TPM 2.0 security chip",
      "Dual hot-swappable batteries — 8-10 hours",
      "USB Type-C PD fast charging (3 hours)",
      "Corning Gorilla Glass",
      "LED backlit keyboard (78 keys)",
    ],
    highlights: [],
    specGroups: [
      { groupName: "หน่วยประมวลผล", items: [
        { label: "CPU", value: "Intel Core i5-1135G7 (11th Gen)" },
        { label: "ระบบปฏิบัติการ", value: "Windows 10" },
      ]},
      { groupName: "หน่วยความจำ", items: [
        { label: "RAM", value: "8GB / 16GB DDR4" },
        { label: "Storage", value: "256GB / 512GB SSD" },
      ]},
      { groupName: "จอแสดงผล", items: [
        { label: "หน้าจอ", value: '13.3" FHD 1920×1080 IPS Capacitive Touch' },
        { label: "Touch", value: "10-point capacitive, glove touch support" },
      ]},
      { groupName: "แบตเตอรี่", items: [
        { label: "แบตเตอรี่", value: "Dual: 5600mAh or 2800mAh×2 (11.1V) Hot-swappable" },
        { label: "ใช้งาน", value: "8-10 ชั่วโมง" },
        { label: "ชาร์จเร็ว", value: "USB Type-C PD (3 hours)" },
      ]},
      { groupName: "ขนาดและน้ำหนัก", items: [
        { label: "ขนาด", value: "322×233×26mm" },
        { label: "น้ำหนัก", value: "2,100g" },
      ]},
      { groupName: "พอร์ตเชื่อมต่อ", items: [
        { label: "Wireless", value: "4G LTE, GPS, WiFi, Bluetooth" },
        { label: "I/O", value: "HDMI, Serial, USB Type-C, USB 3.0, RJ45 Ethernet" },
      ]},
      { groupName: "ความปลอดภัย", items: [
        { label: "Fingerprint", value: "Fingerprint recognition" },
        { label: "TPM", value: "TPM 2.0 security chip" },
      ]},
      { groupName: "สภาพแวดล้อม", items: [
        { label: "อุณหภูมิ", value: "-20°C to 60°C (operating) / -30°C to 70°C (storage)" },
        { label: "ความชื้น", value: "5%~95% (ไม่มีการควบแน่น)" },
      ]},
    ],
    certifications: ["IP67", "MIL-STD-810G"],
    warranty: { standard: "1 ปี", support: "บริการหลังการขายและซ่อมบำรุง", note: "สอบถามราคา" },
  },
];

/* ───── Lookup helpers ───── */
export const getNotebook = (id: string) => ruggedNotebooks.find((n) => n.id === id);
export const getRelatedNotebooks = (id: string) => ruggedNotebooks.filter((n) => n.id !== id).slice(0, 3);
