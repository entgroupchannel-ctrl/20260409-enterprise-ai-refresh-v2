import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Shield, Factory, Plane,
  HeartPulse, Building2, Sparkles, Server, GraduationCap, Handshake, Brain, Cpu,
} from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import JetsonCTABar from "@/components/JetsonCTABar";
import B2BWorkflowBanner from "@/components/B2BWorkflowBanner";
import LineQRButton from "@/components/LineQRButton";
import QuoteRequestButton from "@/components/QuoteRequestButton";
import { ShoppingBag } from "lucide-react";
import bGov from "@/assets/jetson/sol-government.jpg";
import bEdu from "@/assets/jetson/sol-education.jpg";
import bInteg from "@/assets/jetson/sol-integrator.jpg";
import bFac from "@/assets/jetson/sol-factory.jpg";
import bGen from "@/assets/jetson/sol-genai.jpg";
import gpuHero from "@/assets/jetson/gpu-server-hero.jpg";
import gpuGov from "@/assets/jetson/gpu-government.jpg";
import gpuUni from "@/assets/jetson/gpu-university.jpg";
import gpuFac from "@/assets/jetson/gpu-factory.jpg";
import gpuRob from "@/assets/jetson/gpu-robotics.jpg";
import gpuStart from "@/assets/jetson/gpu-startup.jpg";
import gpuMed from "@/assets/jetson/gpu-medical.jpg";
import { jetsonProducts } from "@/data/jetson-products";

const GPU_IMAGES: Record<string, string> = {
  "government-pdpa": gpuGov,
  "university-lab": gpuUni,
  "factory-ai": gpuFac,
  "robotics": gpuRob,
  "ai-startup": gpuStart,
  "medical-ai": gpuMed,
};

/* Map สินค้า (name) → รูป + id เพื่อ deep-link */
const PRODUCT_INDEX: Record<string, { id: string; image: string }> = jetsonProducts.reduce(
  (acc, p) => {
    acc[p.name.toLowerCase()] = { id: p.id, image: p.image };
    return acc;
  },
  {} as Record<string, { id: string; image: string }>
);

/** หา product info จากชื่อ — รองรับ alias เช่น "T201S 8GB", "DGX Spark", "AGX Thor" */
function findProduct(name: string): { id: string; image: string } | null {
  const key = name.toLowerCase().trim();
  if (PRODUCT_INDEX[key]) return PRODUCT_INDEX[key];

  // alias map
  const aliases: Record<string, string> = {
    "t201s 4gb": "orin nano super 4gb edge computer t201s",
    "t201s 8gb": "orin nano super 8gb edge computer t201s",
    "t201s": "orin nano super 8gb edge computer t201s",
    "orin nano 4gb": "jetson orin nano module",
    "orin nano 8gb": "jetson orin nano module",
    "orin nano super": "jetson orin nano super developer kit",
    "orin nx 16gb": "jetson orin nx module",
    "orin nx + y-c18": "jetson orin nx module",
    "agx thor": "jetson thor t5000",
    "agx thor dev kit": "jetson thor developer kit",
    "jetson agx thor": "jetson thor t5000",
    "jetson agx orin 64gb": "jetson agx orin module",
    "carrier y-c18": "carrier board y-c18",
    "carrier y-c17": "carrier board y-c17",
    "nx-sys-2006": "nx-sys-2006",
    "nx16-7f4": "nx-sys-2016",
    "dgx spark": "nvidia dgx spark",
    "ipc thor-28f1": "jetson thor ipc thor-28f1",
  };
  const aliased = aliases[key];
  if (aliased && PRODUCT_INDEX[aliased]) return PRODUCT_INDEX[aliased];

  // fuzzy: หาคำขึ้นต้น
  for (const [k, v] of Object.entries(PRODUCT_INDEX)) {
    if (k.includes(key) || key.includes(k)) return v;
  }
  return null;
}

const NV = "#76B900";

type Slide = {
  id: string; tag: string; tagIcon: typeof Shield;
  title: string; desc: string; chips: { label: string; sub: string }[];
  cta: string; image: string;
};

const slides: Slide[] = [
  {
    id: "gov", tag: "หน่วยงานราชการ", tagIcon: Shield,
    title: "AI Server สำหรับหน่วยงานราชการ",
    desc: "ประมวลผลในประเทศ ไม่ต้องส่งข้อมูลขึ้น Cloud — รองรับ พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (PDPA)",
    chips: [
      { label: "DGX Spark", sub: "1 PFLOP, 128 GB" },
      { label: "Jetson AGX Thor", sub: "2,070 TFLOPS" },
      { label: "Jetson AGX Orin 64GB", sub: "275 TOPS" },
      { label: "IPC 28F1E4", sub: "Rack-mount" },
    ],
    cta: "ขอใบเสนอราคา", image: bGov,
  },
  {
    id: "edu", tag: "การศึกษา", tagIcon: GraduationCap,
    title: "เริ่มต้นสอน AI ในห้องเรียน",
    desc: "Dev Kit พร้อมใช้ เปิดกล่องเขียน AI ได้เลย — เหมาะสำหรับโครงงาน, Senior Project, วิจัย",
    chips: [
      { label: "Orin Nano 4GB", sub: "฿22,900" },
      { label: "Orin Nano 8GB", sub: "฿25,900" },
      { label: "Y-C18-DEV", sub: "฿38,900" },
    ],
    cta: "สั่งซื้อสำหรับห้องเรียน", image: bEdu,
  },
  {
    id: "si", tag: "ผู้รับเหมาระบบ", tagIcon: Handshake,
    title: "เพิ่มมูลค่าโซลูชันของคุณ",
    desc: "ฝัง AI เข้าไปในผลิตภัณฑ์และโครงการของคุณ — ราคาพิเศษสำหรับ SI/Reseller สั่งซื้อจำนวนมาก",
    chips: [
      { label: "Orin NX 16GB", sub: "Module" },
      { label: "IPC 18F1E1", sub: "฿46,900" },
      { label: "Carrier Y-C18", sub: "Custom Design" },
      { label: "T201S", sub: "Edge AI" },
    ],
    cta: "สมัครเป็นพาร์ทเนอร์", image: bInteg,
  },
  {
    id: "factory", tag: "โรงงานอัจฉริยะ", tagIcon: Factory,
    title: "ตรวจสอบคุณภาพด้วย AI",
    desc: "AI Vision ตรวจจับชิ้นงานเสียบนสายพานได้ทันที — Fanless, ทนฝุ่น, ติดตั้งง่ายบน DIN Rail",
    chips: [
      { label: "IPC 18F1E1", sub: "฿46,900" },
      { label: "T201S 4GB", sub: "฿42,900" },
      { label: "Orin NX + Y-C18", sub: "Bundle" },
      { label: "IPC 17F1", sub: "Multi-cam" },
    ],
    cta: "ปรึกษาทีมวิศวกรฟรี", image: bFac,
  },
  {
    id: "genai", tag: "Generative AI", tagIcon: Sparkles,
    title: "รัน LLM บนโต๊ะทำงาน",
    desc: "Jetson AGX Thor รัน Qwen3 32B, Cosmos ได้บนเครื่องเดียว — 128 GB, 2,070 TFLOPS, Blackwell",
    chips: [
      { label: "DGX Spark", sub: "Desktop AI" },
      { label: "AGX Thor Dev Kit", sub: "Physical AI" },
      { label: "Orin Nano Super", sub: "GenAI Entry" },
    ],
    cta: "สั่งจอง", image: bGen,
  },
];

type Cat = "all" | "security" | "industrial" | "drone" | "medical" | "smartcity";
type Solution = {
  id: string; cat: Exclude<Cat, "all">;
  catLabel: string; icon: typeof Shield;
  title: string; desc: string; bullets: string[];
  products: { name: string; href: string }[];
};

const solutions: Solution[] = [
  { id: "security", cat: "security", catLabel: "ระบบรักษาความปลอดภัย", icon: Shield,
    title: "ระบบรักษาความปลอดภัยอัจฉริยะ",
    desc: "ระบบรักษาความปลอดภัยในปัจจุบัน ต้องการความเสถียรสูง ประสิทธิภาพการประมวลผลที่แรง พื้นที่จัดเก็บข้อมูลขนาดใหญ่ และอินเทอร์เฟซที่หลากหลาย",
    bullets: ["หุ่นยนต์ลาดตระเวนอัตโนมัติ", "ระบบตรวจจับใบหน้า", "กล้องวงจรปิดอัจฉริยะ", "ระบบเตือนภัยแบบ Real-time", "อุปกรณ์เหมืองแร่อัจฉริยะ"],
    products: [
      { name: "IPC 18F1E1", href: "/nvidia-jetson/products" },
      { name: "IPC 11F1E2", href: "/nvidia-jetson/products" },
      { name: "IPC 8F5E2", href: "/nvidia-jetson/products" },
    ]},
  { id: "forklift", cat: "industrial", catLabel: "ระบบอัตโนมัติอุตสาหกรรม", icon: Factory,
    title: "ระบบ AI สำหรับรถโฟล์คลิฟท์และเครน",
    desc: "รถโฟล์คลิฟท์มีข้อจำกัดด้านมุมบอด ทำให้ผู้ขับอาจเกิดอุบัติเหตุจากการขับที่ไม่ได้มาตรฐาน จึงจำเป็นต้องมีระบบเฝ้าระวังและเตือนภัยล่วงหน้า",
    bullets: ["ตรวจจับคนในจุดบอด 360°", "เตือนขับเร็วเกิน", "ตรวจสอบสถานะคนขับ", "บันทึกข้อมูลส่งคลาวด์"],
    products: [
      { name: "IPC 11F1E2", href: "/nvidia-jetson/products" },
      { name: "NX-SYS-2006", href: "/nvidia-jetson/products" },
    ]},
  { id: "factory-auto", cat: "industrial", catLabel: "ระบบอัตโนมัติอุตสาหกรรม", icon: Factory,
    title: "ระบบอัตโนมัติในโรงงาน",
    desc: "ระบบ AI สำหรับควบคุมกระบวนการผลิต ตรวจสอบคุณภาพสินค้าด้วย Machine Vision และจัดการสายการผลิตแบบอัตโนมัติ",
    bullets: ["ตรวจสอบคุณภาพ (QC) ด้วย Vision AI", "ควบคุมสายการผลิต", "นับจำนวนสินค้าอัตโนมัติ", "ตรวจจับของเสีย"],
    products: [
      { name: "IPC 18F1E1", href: "/nvidia-jetson/products" },
      { name: "IPC 11F1E2", href: "/nvidia-jetson/products" },
      { name: "T201S 8GB", href: "/nvidia-jetson/products" },
    ]},
  { id: "smart-park", cat: "industrial", catLabel: "ระบบอัตโนมัติอุตสาหกรรม", icon: Building2,
    title: "สวนอุตสาหกรรมอัจฉริยะ และระบบชุมชน",
    desc: "ระบบ AI สำหรับบริหารจัดการสวนอุตสาหกรรม ชุมชนอัจฉริยะ และระบบทดสอบสมรรถภาพร่างกาย ใช้ Edge AI ประมวลผลข้อมูลแบบ Real-time",
    bullets: ["ระบบเข้า-ออกอัตโนมัติ", "ตรวจจับบุคคล/ยานพาหนะ", "ระบบทดสอบสมรรถภาพ", "จัดการพลังงานอัจฉริยะ"],
    products: [
      { name: "IPC 18F1E1", href: "/nvidia-jetson/products" },
      { name: "T201S 4GB", href: "/nvidia-jetson/products" },
    ]},
  { id: "drone-power", cat: "drone", catLabel: "โดรนและ UAV", icon: Plane,
    title: "โดรนตรวจสอบสายไฟฟ้า",
    desc: "ใช้โดรนติดตั้ง AI ตรวจสอบสายส่งไฟฟ้าและเสาไฟ ตรวจจับความเสียหาย รอยร้าว จุดร้อน และสิ่งผิดปกติ แทนการส่งคนปีนเสาไฟ",
    bullets: ["ตรวจสอบสายส่งไฟฟ้า", "ตรวจจับจุดร้อน (Thermal)", "ถ่ายภาพ 3D เสาไฟ", "รายงานอัตโนมัติ"],
    products: [
      { name: "Carrier Y-C17", href: "/nvidia-jetson/products" },
      { name: "IPC 17F1", href: "/nvidia-jetson/products" },
    ]},
  { id: "drone-map", cat: "drone", catLabel: "โดรนและ UAV", icon: Plane,
    title: "โดรนทำแผนที่และวางแผนเส้นทาง",
    desc: "โดรน AI สำหรับทำแผนที่ภูมิประเทศ วางแผนเส้นทางบินอัตโนมัติ สำรวจพื้นที่เกษตรกรรม พื้นที่ก่อสร้าง และพื้นที่ประสบภัย",
    bullets: ["ทำแผนที่ภูมิประเทศ 3D", "วางแผนเส้นทางบินอัตโนมัติ", "สำรวจพื้นที่เกษตร", "สำรวจพื้นที่ก่อสร้าง"],
    products: [
      { name: "Carrier Y-C17", href: "/nvidia-jetson/products" },
      { name: "IPC 17F1", href: "/nvidia-jetson/products" },
    ]},
  { id: "drone-flight", cat: "drone", catLabel: "โดรนและ UAV", icon: Plane,
    title: "ระบบควบคุมการบินและนำทาง",
    desc: "ระบบควบคุมการบินและนำทางอัจฉริยะสำหรับโดรน ใช้ AI ประมวลผลข้อมูลจากเซ็นเซอร์หลายตัว เพื่อบินอัตโนมัติและหลบหลีกสิ่งกีดขวาง",
    bullets: ["บินอัตโนมัติ", "หลบหลีกสิ่งกีดขวาง", "ลงจอดแม่นยำ", "ติดตามเป้าหมาย"],
    products: [
      { name: "IPC 17F1", href: "/nvidia-jetson/products" },
      { name: "NX16-7F4", href: "/nvidia-jetson/products" },
    ]},
  { id: "drone-patrol", cat: "drone", catLabel: "โดรนและ UAV", icon: Plane,
    title: "โดรนตรวจตราและลาดตระเวน",
    desc: "โดรนตรวจตราอัตโนมัติสำหรับพื้นที่กว้าง ไร่นา ท่อส่ง ถนน และโครงสร้างพื้นฐาน ใช้ AI จดจำวัตถุและรายงานสิ่งผิดปกติ",
    bullets: ["ลาดตระเวนพื้นที่กว้าง", "ตรวจท่อส่ง", "ตรวจสอบโครงสร้าง", "รายงานอัตโนมัติ"],
    products: [{ name: "IPC 17F1", href: "/nvidia-jetson/products" }]},
  { id: "drone-env", cat: "drone", catLabel: "โดรนและ UAV", icon: Plane,
    title: "โดรนตรวจสอบสิ่งแวดล้อมและกู้ภัย",
    desc: "โดรนที่ติดตั้ง AI สำหรับติดตามสภาพแวดล้อม ตรวจวัดมลพิษ สำรวจพื้นที่ประสบภัย และตอบสนองเหตุฉุกเฉินได้รวดเร็ว",
    bullets: ["ตรวจวัดคุณภาพอากาศ", "สำรวจพื้นที่น้ำท่วม", "ค้นหาผู้ประสบภัย", "ติดตามไฟป่า"],
    products: [
      { name: "Carrier Y-C17", href: "/nvidia-jetson/products" },
      { name: "IPC 17F1", href: "/nvidia-jetson/products" },
    ]},
  { id: "med-endo", cat: "medical", catLabel: "การแพทย์", icon: HeartPulse,
    title: "กล้องส่องตรวจอัจฉริยะ (AI Endoscope)",
    desc: "ช่วยแพทย์วินิจฉัยโรคได้แม่นยำขึ้น โดยใช้ Deep Learning วิเคราะห์ภาพจากกล้องส่องตรวจแบบ Real-time ตรวจจับความผิดปกติ เนื้องอก และรอยโรคที่ตาเปล่าอาจมองไม่เห็น",
    bullets: ["วิเคราะห์ภาพ Endoscope แบบ Real-time", "ตรวจจับเนื้องอกอัตโนมัติ", "กล้องส่องตรวจแบบพกพา", "ส่งภาพทางไกล (Telemedicine)"],
    products: [{ name: "T201S 8GB", href: "/nvidia-jetson/products" }]},
  { id: "smart-boat", cat: "smartcity", catLabel: "เมืองอัจฉริยะ", icon: Building2,
    title: "เรือไร้คนขับ ตรวจคุณภาพน้ำและเก็บขยะ",
    desc: "เรือไร้คนขับที่ใช้ AI นำทางและควบคุม สำหรับตรวจวัดคุณภาพน้ำ เก็บขยะผิวน้ำ และสำรวจแหล่งน้ำ ทำงานอัตโนมัติตามเส้นทางที่กำหนด",
    bullets: ["ตรวจวัดคุณภาพน้ำ", "เก็บขยะผิวน้ำอัตโนมัติ", "สำรวจแหล่งน้ำ", "เฝ้าระวังมลพิษ"],
    products: [
      { name: "Carrier Y-C17", href: "/nvidia-jetson/products" },
      { name: "IPC 11F1E2", href: "/nvidia-jetson/products" },
    ]},
];

const catTabs: { id: Cat; label: string }[] = [
  { id: "all", label: "ทั้งหมด" },
  { id: "security", label: "ความปลอดภัย" },
  { id: "industrial", label: "อุตสาหกรรม" },
  { id: "drone", label: "โดรน & UAV" },
  { id: "medical", label: "การแพทย์" },
  { id: "smartcity", label: "เมืองอัจฉริยะ" },
];

const gpuSolutions = [
  { id: "government-pdpa", title: "หน่วยงานราชการ On-Premise (PDPA)", desc: "หน่วยงานราชการจัดการข้อมูลอ่อนไหวของประชาชน — บัตรประชาชน เวชระเบียน ข้อมูลการเงิน — ที่ต้องไม่หลุดออกนอกองค์กรตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)", products: ["DGX Spark", "AGX Thor", "DGX A100"], icon: Shield },
  { id: "university-lab", title: "ห้องเรียน/Lab มหาวิทยาลัย", desc: "มหาวิทยาลัยทั่วประเทศไทยกำลังเร่งเพิ่ม AI และ Deep Learning เข้าไปในหลักสูตร — แต่ห้อง Lab คอมพิวเตอร์ส่วนใหญ่ยังใช้ฮาร์ดแวร์ระดับ Consumer", products: ["W830", "WS1020"], icon: GraduationCap },
  { id: "factory-ai", title: "โรงงาน AI Inference + Vision", desc: "โรงงานสมัยใหม่สูญเสียเงินหลายล้านบาทต่อปีจากสินค้าบกพร่องที่หลุดรอดสายตาผู้ตรวจ QC ตามนุษย์ — รอยขีดข่วนเล็กๆ รอยร้าวระดับไมครอน", products: ["AGX Thor", "DGX Spark"], icon: Factory },
  { id: "robotics", title: "Robotics / Autonomous", desc: "คลื่นลูกถัดไปของหุ่นยนต์ไม่ใช่ Pick-and-place ที่โปรแกรมไว้ล่วงหน้า — แต่เป็นเครื่องจักรที่มองเห็น เข้าใจ และปรับตัวแบบ Real-time", products: ["AGX Thor"], icon: Cpu },
  { id: "ai-startup", title: "AI Startup / R&D Lab พัฒนา LLM", desc: "AI Startup เผชิญเศรษฐศาสตร์โหด: เช่า GPU บน Cloud สำหรับพัฒนา LLM เผาเงิน 350,000-1,750,000 บาท/เดือน — Spark/WS2030 ทำให้คุ้มในไม่กี่เดือน", products: ["DGX Spark", "WS2030"], icon: Brain },
  { id: "medical-ai", title: "การแพทย์ Medical AI Training", desc: "รังสีแพทย์อ่าน CT scan 50-100 ภาพต่อวัน — พอถึงภาพที่ 80 ความเหนื่อยล้าเข้ามา และนั่นคือตอนที่ก้อนในปอด 3 มม. ถูกมองข้าม", products: ["WS2030", "DGX A100"], icon: HeartPulse },
];

export default function JetsonSolutions() {
  const [slideIdx, setSlideIdx] = useState(0);
  const [cat, setCat] = useState<Cat>("all");

  const filtered = useMemo(
    () => (cat === "all" ? solutions : solutions.filter((s) => s.cat === cat)),
    [cat]
  );

  const slide = slides[slideIdx];
  const next = () => setSlideIdx((i) => (i + 1) % slides.length);
  const prev = () => setSlideIdx((i) => (i - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>โซลูชัน Edge AI — NVIDIA Jetson สำหรับทุกอุตสาหกรรม | ENT Group</title>
        <meta name="description" content="โซลูชัน Edge AI ที่ขับเคลื่อนด้วย NVIDIA Jetson สำหรับราชการ การศึกษา โรงงาน โดรน การแพทย์ เมืองอัจฉริยะ — ปรึกษาฟรี ขอ POC ได้" />
        <link rel="canonical" href="https://www.entgroup.co.th/nvidia-jetson/solutions" />
      </Helmet>

      <SiteNavbar />

      {/* Hero Carousel */}
      <section className="relative overflow-hidden bg-[#0a0e27] text-white">
        <div className="container max-w-7xl mx-auto px-6 pt-8 pb-3">
          <Link to="/nvidia-jetson" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> กลับ NVIDIA Jetson
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold mt-3 mb-2 flex items-center gap-2">
            <span className="w-1 h-7 rounded-full" style={{ background: NV }} />
            โซลูชันสำหรับธุรกิจของคุณ
          </h1>
        </div>

        <div className="relative h-[480px] md:h-[520px] overflow-hidden">
          {slides.map((s, i) => (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-700 ${i === slideIdx ? "opacity-100" : "opacity-0"}`}
              style={{ backgroundImage: `url(${s.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e27]/95 via-[#0a0e27]/70 to-[#0a0e27]/40" />

          <div className="relative container max-w-7xl mx-auto px-6 h-full flex items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
                    style={{ background: `${NV}25`, color: NV, border: `1px solid ${NV}60` }}>
                <slide.tagIcon className="w-3.5 h-3.5" /> {slide.tag}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{slide.title}</h2>
              <p className="text-base md:text-lg text-white/85 mb-5 max-w-xl leading-relaxed">{slide.desc}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {slide.chips.map((c) => (
                  <span key={c.label} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full backdrop-blur bg-white/10 border border-white/20">
                    <span className="font-semibold">{c.label}</span>
                    <span className="text-white/60">— {c.sub}</span>
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to="/shop?category=jetson" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all hover:opacity-90"
                      style={{ background: NV, color: "#0a0e27" }}>
                  <ShoppingBag className="w-4 h-4" /> เลือกสินค้าที่ Shop
                </Link>
                <QuoteRequestButton
                  productName={slide.title}
                  variant="outline"
                  size="default"
                  className="text-white hover:bg-white/10 hover:text-white border-secondary-foreground"
                />
              </div>
            </div>
          </div>

          <button onClick={prev} aria-label="prev"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur flex items-center justify-center">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} aria-label="next"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur flex items-center justify-center">
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setSlideIdx(i)} aria-label={`slide ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${i === slideIdx ? "w-8" : "w-2 bg-white/40"}`}
                      style={i === slideIdx ? { background: NV } : {}} />
            ))}
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="container max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="text-center mb-3">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">โซลูชันอุตสาหกรรม</h2>
          <p className="text-muted-foreground">โซลูชัน Edge AI ที่ขับเคลื่อนด้วย NVIDIA Jetson สำหรับทุกอุตสาหกรรม</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mt-6 mb-8">
          {catTabs.map((t) => {
            const active = cat === t.id;
            const count = t.id === "all" ? solutions.length : solutions.filter((s) => s.cat === t.id).length;
            return (
              <button key={t.id} onClick={() => setCat(t.id)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        active ? "border-transparent text-white shadow-md" : "border-border bg-background hover:border-primary/50 text-foreground"
                      }`}
                      style={active ? { background: NV, color: "#0a0e27" } : {}}>
                {t.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? "bg-black/20" : "bg-muted"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-5">
          {filtered.map((s) => (
            <article key={s.id} id={s.id} className="rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-all">
              <div className="grid md:grid-cols-[1fr_280px] gap-0">
                <div className="p-5 md:p-6">
                  <div className="flex items-center gap-2 mb-2 text-xs font-medium" style={{ color: NV }}>
                    <s.icon className="w-4 h-4" /> {s.catLabel}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.desc}</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">ฟีเจอร์หลัก</h4>
                      <ul className="space-y-1.5">
                        {s.bullets.map((b) => (
                          <li key={b} className="text-sm flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: NV }} />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">สินค้าแนะนำ</h4>
                      <div className="flex flex-wrap gap-2">
                        {s.products.map((p) => {
                          const prod = findProduct(p.name);
                          const href = prod ? `/nvidia-jetson/products?q=${encodeURIComponent(p.name)}` : p.href;
                          return (
                            <Link key={p.name} to={href}
                                  className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full border transition-all hover:opacity-80"
                                  style={{ borderColor: `${NV}50`, color: NV, background: `${NV}10` }}>
                              {p.name} <ArrowRight className="w-3 h-3" />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product image strip */}
                <div className="bg-gradient-to-br from-muted/40 to-muted/10 border-t md:border-t-0 md:border-l p-4 flex flex-col gap-2 justify-center">
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    ฮาร์ดแวร์ที่ใช้
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {s.products.slice(0, 4).map((p) => {
                      const prod = findProduct(p.name);
                      if (!prod) {
                        return (
                          <div key={p.name} className="aspect-square rounded-lg border bg-background/60 flex items-center justify-center p-1 text-[9px] text-center text-muted-foreground">
                            {p.name}
                          </div>
                        );
                      }
                      return (
                        <Link
                          key={p.name}
                          to={`/nvidia-jetson/products?q=${encodeURIComponent(p.name)}`}
                          className="group/img aspect-square rounded-lg border bg-background overflow-hidden flex flex-col hover:border-primary/50 hover:shadow-md transition-all"
                          title={p.name}
                        >
                          <div className="flex-1 bg-muted/30 flex items-center justify-center p-1.5">
                            <img
                              src={prod.image}
                              alt={p.name}
                              loading="lazy"
                              className="max-w-full max-h-full object-contain group-hover/img:scale-110 transition-transform duration-300"
                              onError={(e) => { (e.target as HTMLImageElement).src = "/product-placeholder.svg"; }}
                            />
                          </div>
                          <div className="text-[9px] font-semibold text-center px-1 py-1 truncate border-t bg-card">
                            {p.name}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* GPU Server Solutions */}
      <section className="bg-muted/30 border-y">
        <div className="container max-w-7xl mx-auto px-6 py-12 md:py-16">
          {/* Hero banner */}
          <div className="relative rounded-2xl overflow-hidden mb-10 border">
            <img
              src={gpuHero}
              alt="GPU Server Solutions"
              loading="lazy"
              width={1920}
              height={640}
              className="w-full h-[220px] md:h-[300px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e27]/90 via-[#0a0e27]/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 text-white max-w-2xl">
              <div className="inline-flex w-fit items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-3"
                   style={{ background: `${NV}25`, color: NV, border: `1px solid ${NV}60` }}>
                <Server className="w-3.5 h-3.5" /> Enterprise GPU
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">โซลูชัน GPU Server</h2>
              <p className="text-white/80 text-sm md:text-base max-w-xl">
                โครงสร้าง GPU ระดับองค์กร ออกแบบสำหรับทุกอุตสาหกรรม — ตั้งแต่ราชการ PDPA จนถึง Medical AI
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gpuSolutions.map((g) => (
              <Link key={g.id} to={`/nvidia-jetson/gpu-server#solution-${g.id}`}
                    className="group rounded-xl border bg-card overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all flex flex-col">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={GPU_IMAGES[g.id]}
                    alt={g.title}
                    loading="lazy"
                    width={768}
                    height={512}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
                  <div className="absolute top-3 left-3 w-9 h-9 rounded-lg flex items-center justify-center backdrop-blur-md"
                       style={{ background: `${NV}30`, color: NV, border: `1px solid ${NV}60` }}>
                    <g.icon className="w-4 h-4" />
                  </div>
                </div>
                {/* Body */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors">{g.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">{g.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {g.products.map((p) => (
                      <span key={p} className="text-[10px] font-semibold px-2 py-0.5 rounded border"
                            style={{ borderColor: `${NV}50`, color: NV, background: `${NV}10` }}>{p}</span>
                    ))}
                  </div>
                  <span className="text-xs font-semibold inline-flex items-center gap-1" style={{ color: NV }}>
                    ดูรายละเอียด <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Models */}
      <section className="container max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">AI Models พร้อมใช้งาน</h2>
          <p className="text-muted-foreground">AI Model สำเร็จรูปจาก NVIDIA NGC — ดาวน์โหลดฟรี รันบน Jetson ได้ทันที</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Computer Vision", items: ["TAO PeopleNet", "TAO TrafficCamNet", "TAO DashCamNet", "TAO LPRNet", "TAO BodyPoseNet"] },
            { title: "Speech AI", items: ["Riva ASR — แปลงเสียงเป็นข้อความ", "Riva TTS — แปลงข้อความเป็นเสียง"] },
            { title: "Robotics", items: ["Isaac ROS Perception", "Isaac ROS Navigation", "Isaac Manipulator", "GR00T (Humanoid)"] },
            { title: "Video Analytics", items: ["DeepStream SDK", "Metropolis (VSS Blueprint)"] },
            { title: "Generative AI", items: ["Cosmos Reason2-2B", "Nemotron (Chat/Instruct)", "OpenClaw (AI Assistant)"] },
            { title: "Tools & SDK", items: ["TAO Toolkit", "TensorRT", "JetPack SDK", "Triton Inference Server"] },
          ].map((c) => (
            <div key={c.title} className="rounded-xl border bg-card p-5 hover:shadow-md transition-all">
              <h3 className="font-bold text-base mb-3 pb-2 border-b" style={{ borderColor: `${NV}30` }}>{c.title}</h3>
              <ul className="space-y-1.5">
                {c.items.map((i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: NV }} />
                    <span className="text-muted-foreground">{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/nvidia-jetson/ai-ready" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all hover:opacity-90"
                style={{ background: NV, color: "#0a0e27" }}>
            ดู AI Model ทั้งหมด <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border font-semibold hover:bg-muted transition-all">
            ปรึกษาระบบ AI
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[#0a0e27] to-[#1a1e47] text-white">
        <div className="container max-w-7xl mx-auto px-6 py-12 text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4" style={{ color: NV }} />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">ไม่แน่ใจว่าโซลูชันไหนเหมาะกับธุรกิจของคุณ?</h2>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">ทีมวิศวกร ENT Group ให้คำปรึกษาฟรี ออกแบบโซลูชัน Edge AI พร้อมทดสอบ POC ก่อนตัดสินใจ</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                  style={{ background: NV, color: "#0a0e27" }}>
              ขอ POC / ทดสอบฟรี <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:020456104" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/5 font-semibold transition-all">
              02-045-6104
            </a>
            <LineQRButton className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/5 font-semibold transition-all">
              LINE @entgroup
            </LineQRButton>
          </div>
        </div>
      </section>

      <B2BWorkflowBanner showShopCta />
      <JetsonCTABar message="ปรึกษาโซลูชัน Jetson สำหรับอุตสาหกรรมของคุณ" />
      <Footer />
    </div>
  );
}
