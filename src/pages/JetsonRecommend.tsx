import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft, ArrowRight, Sparkles, Check, GitCompareArrows, X, Brain, Bot, Camera,
  Factory, Plane, HeartPulse, Car, ShoppingCart, Radio, FlaskConical, Phone, RotateCcw,
  CheckCircle2, Lightbulb, CircuitBoard, Cpu, Server, Monitor, FileText,
} from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import JetsonCTABar from "@/components/JetsonCTABar";
import B2BWorkflowBanner from "@/components/B2BWorkflowBanner";
import LineQRButton from "@/components/LineQRButton";
import { jetsonProducts, jetsonCategories, type JetsonProduct, type JetsonCategory } from "@/data/jetson-products";
import { gpuServers, type GpuServer } from "@/data/gpu-servers";
import { professionalGpus, proGpuFamilyLabel, type ProGpu } from "@/data/professional-gpus";

// NVIDIA & LINE brand colors — third-party brand identifiers, not theme tokens.
// Theme/UI surfaces use semantic tokens from index.css (bg-card, text-foreground, etc.)
const NV = "#76B900";       // NVIDIA brand green
const NV_NAVY = "#0a0e27";  // NVIDIA dark navy (logo background)
const LINE_GREEN = "#06C755"; // LINE brand green

/* ═══════════════════════════════════════════════════════════
   TABS
   ═══════════════════════════════════════════════════════════ */
type TabId = "recommend" | "compare" | "compatibility";
const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "recommend", label: "แนะนำสินค้า", icon: Sparkles },
  { id: "compare", label: "เปรียบเทียบ", icon: GitCompareArrows },
  { id: "compatibility", label: "ความเข้ากันได้", icon: CircuitBoard },
];

/* ═══════════════════════════════════════════════════════════
   PRODUCT LINES
   ═══════════════════════════════════════════════════════════ */
type ProductLine = "jetson" | "gpu-server" | "pro-gpu";
const PRODUCT_LINES: { id: ProductLine; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "jetson", label: "NVIDIA Jetson", icon: Cpu, desc: "โมดูล Edge AI, ชุดพัฒนา, Carrier Board, IPC" },
  { id: "gpu-server", label: "GPU Server & Workstation", icon: Server, desc: "DGX, Workstation, Desktop AI, Edge AI Server" },
  { id: "pro-gpu", label: "Professional GPU", icon: Monitor, desc: "RTX Ada, RTX A-Series, Quadro RTX, Legacy" },
];

/* ═══════════════════════════════════════════════════════════
   QUESTION SCHEMAS
   ═══════════════════════════════════════════════════════════ */
interface Question { id: string; question: string; multi?: boolean; options: { value: string; label: string }[]; }

const jetsonQuestions: Question[] = [
  { id: "useCase", question: "คุณต้องการใช้ AI ทำอะไร?", multi: true, options: [
    { value: "face", label: "จดจำใบหน้า" },
    { value: "inspection", label: "ตรวจสอบคุณภาพสินค้า" },
    { value: "robotics", label: "หุ่นยนต์" },
    { value: "drone", label: "โดรน / UAV" },
    { value: "driving", label: "รถอัตโนมัติ" },
    { value: "medical", label: "การแพทย์" },
    { value: "iot", label: "Smart City / IoT" },
    { value: "learning", label: "เรียนรู้ AI / Prototype" },
  ]},
  { id: "performance", question: "ต้องการประสิทธิภาพ AI ระดับไหน?", options: [
    { value: "entry", label: "เบื้องต้น (≤21 TOPS) — เรียนรู้, Prototype" },
    { value: "mid", label: "ปานกลาง (34-67 TOPS) — Edge AI ทั่วไป" },
    { value: "high", label: "สูง (100-275 TOPS) — Multi-model, Multi-camera" },
    { value: "ultra", label: "สูงสุด (1200+ TFLOPS) — Humanoid, Autonomous" },
  ]},
  { id: "formFactor", question: "ต้องการรูปแบบไหน?", options: [
    { value: "module", label: "โมดูล (SOM) — ออกแบบฮาร์ดแวร์เอง" },
    { value: "devkit", label: "ชุดพัฒนา (Dev Kit) — เริ่มต้นเรียนรู้" },
    { value: "ipc", label: "ระบบสำเร็จรูป (IPC) — ติดตั้งใช้งานทันที" },
    { value: "any", label: "ยังไม่แน่ใจ — แนะนำให้" },
  ]},
  { id: "environment", question: "สภาพแวดล้อมการใช้งาน?", options: [
    { value: "indoor", label: "ในร่ม / ห้องปกติ (0-50°C)" },
    { value: "industrial", label: "อุตสาหกรรม / กลางแจ้ง (-20 ถึง 65°C)" },
    { value: "extreme", label: "สุดขั้ว (-40 ถึง 85°C)" },
    { value: "drone-env", label: "ติดโดรน (เบา + กันน้ำ)" },
  ]},
];

const gpuServerQuestions: Question[] = [
  { id: "purpose", question: "ต้องการใช้งานหลักด้านใด?", options: [
    { value: "training", label: "AI Training ขนาดใหญ่" },
    { value: "inference", label: "AI Inference / พัฒนา" },
    { value: "rendering", label: "3D Rendering / Simulation" },
    { value: "llm", label: "พัฒนา LLM / Generative AI" },
    { value: "edge-robotics", label: "Edge AI / หุ่นยนต์" },
  ]},
  { id: "scale", question: "ต้องการขนาดเครื่องระดับไหน?", options: [
    { value: "desktop", label: "ตั้งโต๊ะ / ส่วนบุคคล" },
    { value: "workstation", label: "เวิร์กสเตชัน (Tower / 4U)" },
    { value: "datacenter", label: "Data Center (Rackmount)" },
    { value: "edge", label: "Edge / ขนาดกะทัดรัด" },
  ]},
  { id: "budget", question: "งบประมาณโดยประมาณ?", options: [
    { value: "under500k", label: "ต่ำกว่า 500,000 บาท" },
    { value: "500k-2m", label: "500,000 - 2,000,000 บาท" },
    { value: "over2m", label: "มากกว่า 2,000,000 บาท" },
    { value: "notsure", label: "ยังไม่แน่ใจ / ยืดหยุ่น" },
  ]},
];

const proGpuQuestions: Question[] = [
  { id: "workload", question: "งานหลักที่ต้องการใช้?", options: [
    { value: "ai-dl", label: "AI / Deep Learning" },
    { value: "cad", label: "CAD / BIM / วิศวกรรม" },
    { value: "3d-vfx", label: "3D Rendering / VFX" },
    { value: "video", label: "ตัดต่อวิดีโอ / Streaming" },
    { value: "vr", label: "VR / AR / Digital Twin" },
  ]},
  { id: "vram", question: "ต้องการ VRAM ขนาดเท่าไหร่?", options: [
    { value: "small", label: "≤8 GB (พื้นฐาน)" },
    { value: "mid", label: "12-16 GB (มาตรฐาน)" },
    { value: "large", label: "24 GB (มืออาชีพ)" },
    { value: "max", label: "48 GB (สูงสุด)" },
  ]},
  { id: "formfactor", question: "ขนาดการ์ดที่ต้องการ?", options: [
    { value: "single", label: "Single Slot (กะทัดรัด)" },
    { value: "dual", label: "Dual Slot (มาตรฐาน)" },
    { value: "any", label: "ไม่จำกัด / ไม่แน่ใจ" },
  ]},
];

/* ═══════════════════════════════════════════════════════════
   SCORING
   ═══════════════════════════════════════════════════════════ */
function scoreJetson(p: JetsonProduct, a: Record<string, string[]>): number {
  let s = 0;
  const perf = a.performance?.[0]; const form = a.formFactor?.[0]; const env = a.environment?.[0];
  const uses = a.useCase || [];
  const desc = (p.description + " " + p.specs.map(x => x.value).join(" ") + " " + p.name).toLowerCase();
  if (perf === "entry" && (desc.includes("nano") || desc.includes("21 tops"))) s += 3;
  if (perf === "mid" && (desc.includes("67 tops") || desc.includes("34 tops") || desc.includes("orin nano"))) s += 3;
  if (perf === "high" && (desc.includes("157 tops") || desc.includes("275 tops") || desc.includes("agx orin"))) s += 3;
  if (perf === "ultra" && (desc.includes("thor") || desc.includes("tflops") || desc.includes("blackwell"))) s += 3;
  if (form === "module" && p.category === "modules") s += 2;
  if (form === "devkit" && p.category === "devkits") s += 2;
  if (form === "ipc" && (p.category === "embedded-systems" || p.category === "taiwan-ipc" || p.category === "edge-computers")) s += 2;
  if (form === "any") s += 1;
  if (env === "extreme" && desc.includes("-40")) s += 2;
  if (env === "drone-env" && (desc.includes("drone") || desc.includes("ip65"))) s += 3;
  if (env === "industrial" && (desc.includes("industrial") || desc.includes("-20") || desc.includes("-25"))) s += 1;
  if (uses.includes("drone") && desc.includes("drone")) s += 2;
  if (uses.includes("medical") && (desc.includes("medical") || desc.includes("igx"))) s += 2;
  if (uses.includes("robotics") && (desc.includes("robot") || desc.includes("humanoid"))) s += 2;
  if (uses.includes("driving") && (desc.includes("autonomous") || desc.includes("can"))) s += 2;
  if (uses.includes("learning") && p.category === "devkits") s += 2;
  if (p.badge) s += 1;
  return s;
}

function scoreGpuServer(g: GpuServer, a: Record<string, string[]>): number {
  let s = 0;
  const purpose = a.purpose?.[0]; const scale = a.scale?.[0]; const budget = a.budget?.[0];
  const desc = (g.desc + " " + g.specs.map(x => x[1]).join(" ") + " " + g.type).toLowerCase();
  if (purpose === "training" && (desc.includes("training") || desc.includes("pflops") || desc.includes("a100"))) s += 3;
  if (purpose === "inference" && (desc.includes("inference") || desc.includes("mid-range"))) s += 3;
  if (purpose === "rendering" && (desc.includes("rendering") || desc.includes("3d"))) s += 2;
  if (purpose === "llm" && (desc.includes("llm") || desc.includes("generative") || desc.includes("blackwell"))) s += 3;
  if (purpose === "edge-robotics" && (desc.includes("edge") || desc.includes("robot") || desc.includes("jetson"))) s += 3;
  if (scale === "desktop" && (g.type.toLowerCase().includes("desktop") || desc.includes("1.2 kg"))) s += 3;
  if (scale === "workstation" && (g.type.toLowerCase().includes("workstation") || g.type.toLowerCase().includes("tower"))) s += 3;
  if (scale === "datacenter" && (g.type.toLowerCase().includes("data center") || g.type.toLowerCase().includes("rackmount"))) s += 3;
  if (scale === "edge" && (g.type.toLowerCase().includes("edge") || desc.includes("compact"))) s += 3;
  if (budget === "under500k" && (g.id === "dgx-spark" || g.id === "w830")) s += 2;
  if (budget === "500k-2m" && (g.id === "ws1020" || g.id === "ws2030" || g.id === "agx-thor")) s += 2;
  if (budget === "over2m" && g.id === "dgx-a100") s += 2;
  if (budget === "notsure") s += 1;
  if (g.badges?.length) s += 1;
  return s;
}

function scoreProGpu(g: ProGpu, a: Record<string, string[]>): number {
  let s = 0;
  const workload = a.workload?.[0]; const vram = a.vram?.[0]; const ff = a.formfactor?.[0];
  if (workload && g.workloads?.includes(workload as ProGpu["workloads"][number])) s += 3;
  const mem = g.memoryGb ?? 0;
  if (vram === "small" && mem > 0 && mem <= 8) s += 3;
  if (vram === "mid" && mem >= 12 && mem <= 16) s += 3;
  if (vram === "large" && mem === 24) s += 3;
  if (vram === "max" && mem >= 48) s += 3;
  if (ff === "single" && g.formFactor === "single") s += 2;
  if (ff === "dual" && g.formFactor === "dual") s += 2;
  if (ff === "any") s += 1;
  if (g.badges?.length) s += 1;
  return s;
}

/* ═══════════════════════════════════════════════════════════
   COMPATIBILITY DATA (Jetson Module ↔ Carrier)
   ═══════════════════════════════════════════════════════════ */
const CONNECTOR = { SODIMM_260: "260-pin SO-DIMM", AGX: "Board-to-Board (AGX)", THOR: "Board-to-Board (Thor)" };

const MODULES = [
  { id: "thor-t5000", name: "Jetson Thor T5000", series: "Thor", connector: CONNECTOR.THOR, tops: 1400, memory: "128 GB", power: "100-250W", tag: "NEW" as const },
  { id: "agx-orin-64", name: "Jetson AGX Orin 64GB", series: "AGX Orin", connector: CONNECTOR.AGX, tops: 275, memory: "64 GB", power: "15-60W" },
  { id: "agx-orin-32", name: "Jetson AGX Orin 32GB", series: "AGX Orin", connector: CONNECTOR.AGX, tops: 200, memory: "32 GB", power: "15-40W" },
  { id: "orin-nx-16", name: "Jetson Orin NX 16GB", series: "Orin NX", connector: CONNECTOR.SODIMM_260, tops: 100, memory: "16 GB", power: "10-25W" },
  { id: "orin-nx-8", name: "Jetson Orin NX 8GB", series: "Orin NX", connector: CONNECTOR.SODIMM_260, tops: 70, memory: "8 GB", power: "10-20W" },
  { id: "orin-nano-8", name: "Jetson Orin Nano 8GB", series: "Orin Nano", connector: CONNECTOR.SODIMM_260, tops: 40, memory: "8 GB", power: "7-15W", price: 25900 },
  { id: "orin-nano-4", name: "Jetson Orin Nano 4GB", series: "Orin Nano", connector: CONNECTOR.SODIMM_260, tops: 20, memory: "4 GB", power: "5-10W", price: 22900 },
  { id: "xavier-nx", name: "Jetson Xavier NX", series: "Xavier NX", connector: CONNECTOR.SODIMM_260, tops: 21, memory: "8 GB", power: "10-20W", tag: "Legacy" as const },
  { id: "agx-xavier", name: "Jetson AGX Xavier", series: "AGX Xavier", connector: CONNECTOR.AGX, tops: 32, memory: "32 GB", power: "10-30W", tag: "Legacy" as const },
];

const CARRIERS = [
  { id: "y-c28", name: "Y-C28", full: "Jetson Thor Carrier Board Y-C28", series: ["Thor"], size: "Standard", io: "8× USB 3.2 · 2× 10GbE · 8× CSI · PCIe x16", tag: "NEW" as const },
  { id: "y-c13", name: "Y-C13", full: "AGX Orin/Xavier Carrier Board Y-C13", series: ["AGX Orin", "AGX Xavier"], size: "Standard", io: "4× USB 3.2 · 2× GbE · 6× CSI · PCIe x8" },
  { id: "y-c8", name: "Y-C8", full: "AGX Orin/Xavier Carrier Board Y-C8", series: ["AGX Orin", "AGX Xavier"], size: "Compact", io: "2× USB 3.2 · 1× GbE · 4× CSI · PCIe x4" },
  { id: "y-c9", name: "Y-C9", full: "AGX Xavier Carrier Board Y-C9", series: ["AGX Xavier"], size: "Standard", io: "4× USB 3.0 · 2× GbE · 6× CSI · PCIe x8", tag: "Legacy" as const },
  { id: "y-c18", name: "Y-C18", full: "Orin NX/Nano Carrier Board Y-C18", series: ["Orin NX", "Orin Nano"], size: "Standard", io: "4× USB 3.2 · 1× GbE · 2× CSI · M.2 · HDMI + DP", popular: true },
  { id: "y-c17", name: "Y-C17", full: "Orin NX/Nano/Xavier NX Carrier Board Y-C17", series: ["Orin NX", "Orin Nano", "Xavier NX"], size: "Compact", io: "2× USB 3.2 · 1× GbE · 2× CSI · M.2 · HDMI" },
  { id: "y-c11", name: "Y-C11", full: "Orin NX/Nano Carrier Board Y-C11", series: ["Orin NX", "Orin Nano"], size: "Mini", io: "1× USB 3.2 · 1× GbE · 1× CSI · M.2 Key E · HDMI" },
  { id: "y-c7", name: "Y-C7", full: "Xavier NX Carrier Board Y-C7", series: ["Xavier NX"], size: "Standard", io: "4× USB 3.0 · 1× GbE · 4× CSI · HDMI + DP", tag: "Legacy" as const },
  { id: "y-c6", name: "Y-C6", full: "Xavier NX Carrier Board Y-C6", series: ["Xavier NX"], size: "Compact", io: "2× USB 3.0 · 1× GbE · 2× CSI · HDMI", tag: "Legacy" as const },
  { id: "orin-super", name: "Orin Super Carrier", full: "Orin NX Super/Nano Super Carrier Board", series: ["Orin NX", "Orin Nano"], size: "Standard", io: "4× USB 3.2 · 1× GbE · 2× CSI · M.2 · HDMI + DP", tag: "NEW" as const },
];

const USE_CASES = [
  { id: "edge-ai", icon: Brain, label: "Edge AI", labelTh: "ประมวลผล AI ที่ Edge", modules: ["orin-nx-16", "orin-nx-8", "orin-nano-8", "agx-orin-64", "agx-orin-32"] },
  { id: "robotics", icon: Bot, label: "Robotics", labelTh: "หุ่นยนต์อัตโนมัติ", modules: ["agx-orin-64", "agx-orin-32", "orin-nx-16", "thor-t5000"] },
  { id: "camera", icon: Camera, label: "Smart Camera", labelTh: "กล้อง AI", modules: ["orin-nano-8", "orin-nano-4", "orin-nx-8", "orin-nx-16"] },
  { id: "industrial", icon: Factory, label: "Industrial", labelTh: "โรงงาน QC", modules: ["orin-nx-16", "orin-nx-8", "orin-nano-8", "agx-orin-32"] },
  { id: "drone", icon: Plane, label: "Drone / UAV", labelTh: "โดรนสำรวจ", modules: ["orin-nano-4", "orin-nano-8", "orin-nx-8"] },
  { id: "medical", icon: HeartPulse, label: "Medical", labelTh: "การแพทย์", modules: ["agx-orin-64", "agx-orin-32", "orin-nx-16"] },
  { id: "vehicle", icon: Car, label: "Autonomous Vehicle", labelTh: "ยานยนต์อัตโนมัติ", modules: ["agx-orin-64", "thor-t5000", "orin-nx-16"] },
  { id: "retail", icon: ShoppingCart, label: "Smart Retail", labelTh: "ค้าปลีก", modules: ["orin-nano-4", "orin-nano-8", "orin-nx-8"] },
  { id: "iot", icon: Radio, label: "IoT Gateway", labelTh: "เกตเวย์ IoT", modules: ["orin-nano-4", "orin-nano-8"] },
  { id: "prototype", icon: FlaskConical, label: "Prototyping", labelTh: "พัฒนาต้นแบบ", modules: ["orin-nano-4", "orin-nano-8", "orin-nx-8"] },
] as const;

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function JetsonRecommend() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabId) || "recommend";
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  useEffect(() => {
    const t = searchParams.get("tab") as TabId;
    if (t && TABS.some(x => x.id === t)) setActiveTab(t);
  }, [searchParams]);
  const switchTab = (t: TabId) => {
    setActiveTab(t);
    setSearchParams(t === "recommend" ? {} : { tab: t });
  };

  /* ───── RECOMMEND state ───── */
  const [productLine, setProductLine] = useState<ProductLine | null>(null);
  const [recStep, setRecStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const currentQuestions = productLine === "jetson" ? jetsonQuestions : productLine === "gpu-server" ? gpuServerQuestions : productLine === "pro-gpu" ? proGpuQuestions : [];
  const currentQ = currentQuestions[recStep];
  const toggleAnswer = (v: string) => {
    if (!currentQ) return;
    const cur = answers[currentQ.id] || [];
    if (currentQ.multi) setAnswers({ ...answers, [currentQ.id]: cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v] });
    else setAnswers({ ...answers, [currentQ.id]: [v] });
  };
  const recNext = () => { if (recStep < currentQuestions.length - 1) setRecStep(recStep + 1); else setShowResults(true); };
  const recPrev = () => {
    if (showResults) setShowResults(false);
    else if (recStep > 0) setRecStep(recStep - 1);
    else { setProductLine(null); setAnswers({}); }
  };
  const recReset = () => { setRecStep(0); setAnswers({}); setShowResults(false); setProductLine(null); };
  const hasAnswer = currentQ ? (answers[currentQ.id] || []).length > 0 : false;

  type RecResult =
    | { id: string; name: string; score: number; type: "jetson"; data: JetsonProduct }
    | { id: string; name: string; score: number; type: "gpu-server"; data: GpuServer }
    | { id: string; name: string; score: number; type: "pro-gpu"; data: ProGpu };

  const recommended: RecResult[] = useMemo(() => {
    if (!showResults || !productLine) return [];
    if (productLine === "jetson")
      return jetsonProducts.map(p => ({ id: p.id, name: p.nameTH, score: scoreJetson(p, answers), type: "jetson" as const, data: p }))
        .filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 6);
    if (productLine === "gpu-server")
      return gpuServers.map(g => ({ id: g.id, name: g.name, score: scoreGpuServer(g, answers), type: "gpu-server" as const, data: g }))
        .filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 6);
    return professionalGpus.map(g => ({ id: g.id, name: g.name, score: scoreProGpu(g, answers), type: "pro-gpu" as const, data: g }))
      .filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 6);
  }, [showResults, productLine, answers]);

  /* ───── COMPARE state ───── */
  const [compareCategory, setCompareCategory] = useState<ProductLine>("jetson");
  const [selectedJetsonCat, setSelectedJetsonCat] = useState<JetsonCategory | "">("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  useEffect(() => { setSelectedIds([]); setSelectedJetsonCat(""); }, [compareCategory]);

  type CompareItem = { id: string; name: string; image: string; badge?: string; specs: { label: string; value: string }[]; link: string };
  const compareProducts: CompareItem[] = useMemo(() => {
    if (compareCategory === "jetson") {
      const filtered = selectedJetsonCat ? jetsonProducts.filter(p => p.category === selectedJetsonCat) : jetsonProducts;
      return filtered.map(p => ({ id: p.id, name: p.nameTH, image: p.image, badge: p.badgeTH, specs: p.specs.map(s => ({ label: s.labelTH, value: s.value })), link: `/nvidia-jetson/products?id=${p.id}` }));
    }
    if (compareCategory === "gpu-server")
      return gpuServers.map(g => ({ id: g.id, name: g.name, image: g.image, badge: g.badges?.[0]?.label, specs: g.specs.map(s => ({ label: s[0], value: s[1] })), link: `/nvidia-jetson/gpu-server` }));
    return professionalGpus.map(g => ({ id: g.id, name: g.name, image: g.image, badge: g.badges?.[0]?.label, specs: g.specs, link: `/nvidia-jetson/professional-gpu` }));
  }, [compareCategory, selectedJetsonCat]);

  const selectedCompare = selectedIds.map(id => compareProducts.find(p => p.id === id)).filter(Boolean) as CompareItem[];
  const compareSpecLabels = useMemo(() => {
    const out: string[] = []; const seen = new Set<string>();
    selectedCompare.forEach(p => p.specs.forEach(s => { if (!seen.has(s.label)) { seen.add(s.label); out.push(s.label); } }));
    return out;
  }, [selectedCompare]);
  const addProduct = (id: string) => { if (selectedIds.length < 4 && !selectedIds.includes(id)) setSelectedIds([...selectedIds, id]); };
  const removeProduct = (id: string) => setSelectedIds(selectedIds.filter(x => x !== id));

  /* ───── COMPATIBILITY state ───── */
  const [compatView, setCompatView] = useState<"wizard" | "matrix">("wizard");
  const [compatStep, setCompatStep] = useState(0);
  const [useCase, setUseCase] = useState<string | null>(null);
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [carrierId, setCarrierId] = useState<string | null>(null);
  const selectedModule = MODULES.find(m => m.id === moduleId);
  const selectedCarrier = CARRIERS.find(c => c.id === carrierId);
  const filteredModules = useMemo(() => {
    if (!useCase) return MODULES;
    const uc = USE_CASES.find(u => u.id === useCase);
    return uc ? MODULES.filter(m => (uc.modules as readonly string[]).includes(m.id)) : MODULES;
  }, [useCase]);
  const compatCarriers = useMemo(() => selectedModule ? CARRIERS.filter(c => c.series.includes(selectedModule.series)) : [], [selectedModule]);
  const compatReset = () => { setCompatStep(0); setUseCase(null); setModuleId(null); setCarrierId(null); };

  /* ═══════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>ตัวช่วยเลือกสินค้า — NVIDIA Jetson, GPU Server, Pro GPU | ENT Group</title>
        <meta name="description" content="เครื่องมือแนะนำสินค้า เปรียบเทียบสเปก และตรวจสอบความเข้ากันได้ของ NVIDIA Jetson, GPU Server, Workstation, Professional GPU — สำหรับ AI, Robotics, 3D Rendering, Edge AI" />
        <link rel="canonical" href="https://www.entgroup.co.th/nvidia-jetson/recommend" />
      </Helmet>

      <SiteNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden text-white" style={{ background: NV_NAVY }}>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${NV_NAVY}cc, ${NV_NAVY}b3, ${NV_NAVY})` }} />
        <div className="relative container max-w-7xl mx-auto px-6 py-14 md:py-20">
          <Link to="/nvidia-jetson" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" /> กลับ NVIDIA Jetson
          </Link>
          <span className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full mb-3" style={{ background: `${NV}20`, color: NV, border: `1px solid ${NV}50` }}>
            <Sparkles className="w-4 h-4" /> Product Selector
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">ตัวช่วยเลือกสินค้า</h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
            ค้นหาสินค้าที่เหมาะสม — แนะนำ, เปรียบเทียบ, หรือตรวจสอบความเข้ากันได้ของ NVIDIA Jetson, GPU Server และ Professional GPU
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b bg-card/50 sticky top-0 z-30 backdrop-blur">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map(tab => {
              const Icon = tab.icon; const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => switchTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${isActive ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}`}>
                  <Icon size={16} /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section className="container max-w-7xl mx-auto px-6 py-10 md:py-14">
        {/* ════════ RECOMMEND TAB ════════ */}
        {activeTab === "recommend" && (
          <div className="max-w-3xl mx-auto">
            {!productLine ? (
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">คุณสนใจสินค้าหมวดไหน?</h2>
                <p className="text-sm text-muted-foreground mb-6">เลือกหมวดสินค้าเพื่อเริ่มต้นคำแนะนำ</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {PRODUCT_LINES.map(pl => {
                    const Icon = pl.icon;
                    return (
                      <button key={pl.id} onClick={() => setProductLine(pl.id)}
                        className="group text-left p-6 rounded-xl border-2 bg-card hover:shadow-lg transition-all" style={{ borderColor: "hsl(var(--border))" }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = NV)}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "hsl(var(--border))")}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${NV}20`, color: NV }}>
                          <Icon size={24} />
                        </div>
                        <h3 className="font-bold mb-1">{pl.label}</h3>
                        <p className="text-xs text-muted-foreground">{pl.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <>
                <div className="flex gap-2 mb-8">
                  {currentQuestions.map((_, i) => (
                    <div key={i} className="h-1.5 flex-1 rounded-full transition-colors" style={{ background: i < recStep || showResults ? NV : i === recStep && !showResults ? `${NV}80` : "hsl(var(--border))" }} />
                  ))}
                </div>

                {!showResults ? (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: `${NV}15`, color: NV }}>
                        {PRODUCT_LINES.find(pl => pl.id === productLine)?.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      คำถามที่ {recStep + 1} จาก {currentQuestions.length}
                      {currentQ?.multi && <span className="ml-1" style={{ color: NV }}>(เลือกได้หลายข้อ)</span>}
                    </p>
                    <h2 className="text-xl font-bold mb-6">{currentQ?.question}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentQ?.options.map(opt => {
                        const sel = (answers[currentQ.id] || []).includes(opt.value);
                        return (
                          <button key={opt.value} onClick={() => toggleAnswer(opt.value)}
                            className="text-left p-4 rounded-xl border-2 transition-all"
                            style={{ borderColor: sel ? NV : "hsl(var(--border))", background: sel ? `${NV}10` : "hsl(var(--card))" }}>
                            <div className="flex items-center gap-2">
                              {sel && <Check size={16} className="shrink-0" style={{ color: NV }} />}
                              <span className="text-sm font-medium">{opt.label}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-between mt-8">
                      <button onClick={recPrev} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft size={14} /> ย้อนกลับ
                      </button>
                      <button onClick={recNext} disabled={!hasAnswer}
                        className="flex items-center gap-1 px-6 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-30 hover:opacity-90 transition"
                        style={{ background: NV, color: NV_NAVY }}>
                        {recStep === currentQuestions.length - 1 ? "ดูผลลัพธ์" : "ถัดไป"} <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">
                        <Sparkles size={20} className="inline mr-2" style={{ color: NV }} /> สินค้าแนะนำสำหรับคุณ
                      </h2>
                      <button onClick={recReset} className="text-xs hover:underline" style={{ color: NV }}>เริ่มใหม่</button>
                    </div>
                    {recommended.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {recommended.map(item => <RecCard key={item.id} item={item} />)}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-12">ไม่พบสินค้าที่ตรงกัน กรุณาติดต่อเราเพื่อรับคำแนะนำ</p>
                    )}
                    <div className="text-center mt-8">
                      <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition"
                        style={{ background: NV, color: NV_NAVY }}>
                        <FileText size={16} /> ขอใบเสนอราคา
                      </Link>
                    </div>
                    <button onClick={recPrev} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mt-4">
                      <ArrowLeft size={14} /> ย้อนกลับ
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ════════ COMPARE TAB ════════ */}
        {activeTab === "compare" && (
          <div>
            <div className="flex gap-1 p-1 rounded-lg bg-muted mb-6 w-fit">
              {PRODUCT_LINES.map(pl => (
                <button key={pl.id} onClick={() => setCompareCategory(pl.id)}
                  className={`px-4 py-2 rounded-md text-xs font-medium transition ${compareCategory === pl.id ? "text-white" : "text-muted-foreground hover:text-foreground"}`}
                  style={compareCategory === pl.id ? { background: NV, color: NV_NAVY } : {}}>
                  {pl.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {compareCategory === "jetson" && (
                <select value={selectedJetsonCat} onChange={e => setSelectedJetsonCat(e.target.value as JetsonCategory | "")}
                  className="border rounded-lg px-4 py-2.5 text-sm bg-card">
                  <option value="">ทุกหมวดหมู่</option>
                  {(Object.entries(jetsonCategories) as [JetsonCategory, typeof jetsonCategories[JetsonCategory]][]).map(([k, c]) => (
                    <option key={k} value={k}>{c.nameTH}</option>
                  ))}
                </select>
              )}
              <select onChange={e => { if (e.target.value) addProduct(e.target.value); e.target.value = ""; }}
                className="border rounded-lg px-4 py-2.5 text-sm bg-card flex-1" disabled={selectedIds.length >= 4}>
                <option value="">{selectedIds.length >= 4 ? "เลือกได้สูงสุด 4 สินค้า" : "+ เพิ่มสินค้าเปรียบเทียบ..."}</option>
                {compareProducts.filter(p => !selectedIds.includes(p.id)).map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {selectedIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCompare.map(p => (
                  <span key={p.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: `${NV}15`, color: NV }}>
                    {p.name}
                    <button onClick={() => removeProduct(p.id)} className="hover:text-destructive"><X size={12} /></button>
                  </span>
                ))}
              </div>
            )}

            {selectedCompare.length >= 2 ? (
              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-card">
                      <th className="text-left p-4 font-medium text-muted-foreground min-w-[140px] border-b">สเปค</th>
                      {selectedCompare.map(p => (
                        <th key={p.id} className="p-4 border-b min-w-[180px]">
                          <div className="flex flex-col items-center gap-2">
                            <img src={p.image} alt={p.name} className="w-16 h-16 object-contain" onError={e => { (e.target as HTMLImageElement).src = "/product-placeholder.svg"; }} />
                            <Link to={p.link} className="font-semibold hover:opacity-80 text-xs text-center" style={{ color: NV }}>{p.name}</Link>
                            {p.badge && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase" style={{ background: NV, color: NV_NAVY }}>{p.badge}</span>}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compareSpecLabels.map((label, i) => (
                      <tr key={label} className={i % 2 === 0 ? "bg-background" : "bg-card/50"}>
                        <td className="p-3 font-medium text-muted-foreground text-xs border-r">{label}</td>
                        {selectedCompare.map(p => {
                          const v = p.specs.find(s => s.label === label)?.value || "—";
                          return <td key={p.id} className="p-3 text-xs text-center">{v}</td>;
                        })}
                      </tr>
                    ))}
                    <tr className="bg-card">
                      <td className="p-3 border-r"></td>
                      {selectedCompare.map(p => (
                        <td key={p.id} className="p-3 text-center">
                          <Link to="/contact" className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition"
                            style={{ background: NV, color: NV_NAVY }}>
                            ขอใบเสนอราคา <ArrowRight size={12} />
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <GitCompareArrows size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-sm">เลือกอย่างน้อย 2 สินค้าเพื่อเริ่มเปรียบเทียบ</p>
              </div>
            )}
          </div>
        )}

        {/* ════════ COMPATIBILITY TAB ════════ */}
        {activeTab === "compatibility" && (
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h2 className="text-xl font-bold">Module ↔ Carrier Board</h2>
                <p className="text-sm text-muted-foreground">ค้นหา Carrier Board ที่เข้ากันกับ Module ของคุณ</p>
              </div>
              <div className="flex gap-1 p-1 rounded-lg bg-muted">
                <button onClick={() => { setCompatView("wizard"); compatReset(); }}
                  className="px-3 py-1.5 rounded-md text-xs font-medium transition"
                  style={compatView === "wizard" ? { background: NV, color: NV_NAVY } : { color: "hsl(var(--muted-foreground))" }}>
                  Wizard
                </button>
                <button onClick={() => setCompatView("matrix")}
                  className="px-3 py-1.5 rounded-md text-xs font-medium transition"
                  style={compatView === "matrix" ? { background: NV, color: NV_NAVY } : { color: "hsl(var(--muted-foreground))" }}>
                  ตาราง Matrix
                </button>
              </div>
            </div>

            {compatView === "wizard" ? (
              <div>
                <div className="flex items-center gap-1.5 mb-6">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                        style={{
                          background: i < compatStep ? NV : i === compatStep ? "transparent" : "hsl(var(--muted))",
                          color: i < compatStep ? NV_NAVY : i === compatStep ? NV : "hsl(var(--muted-foreground))",
                          boxShadow: i === compatStep ? `0 0 0 2px ${NV}` : "none",
                        }}>
                        {i < compatStep ? "✓" : i + 1}
                      </div>
                      {i < 3 && <div className="w-6 h-0.5" style={{ background: i < compatStep ? NV : "hsl(var(--border))" }} />}
                    </div>
                  ))}
                </div>

                {compatStep === 0 && (
                  <div>
                    <h3 className="text-base font-semibold mb-1">คุณจะใช้ทำอะไร?</h3>
                    <p className="text-sm text-muted-foreground mb-4">เลือก use case เพื่อให้ระบบแนะนำ Module ที่เหมาะสม</p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {USE_CASES.map(uc => {
                        const Icon = uc.icon;
                        return (
                          <button key={uc.id} onClick={() => { setUseCase(uc.id); setCompatStep(1); }}
                            className="group p-3 rounded-lg border bg-card hover:border-primary hover:bg-primary/5 transition text-left">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2" style={{ background: `${NV}15`, color: NV }}>
                              <Icon size={18} />
                            </div>
                            <div className="text-xs font-semibold">{uc.label}</div>
                            <div className="text-[10px] text-muted-foreground">{uc.labelTh}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {compatStep === 1 && (
                  <div>
                    <h3 className="text-base font-semibold mb-1">เลือก Module</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      แนะนำสำหรับ <span className="font-medium" style={{ color: NV }}>{USE_CASES.find(u => u.id === useCase)?.label}</span>
                    </p>
                    <div className="space-y-2">
                      {filteredModules.map(mod => (
                        <button key={mod.id} onClick={() => { setModuleId(mod.id); setCompatStep(2); }}
                          className="w-full p-3 rounded-lg border bg-card hover:border-primary transition text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm">{mod.name}</span>
                            {mod.tag && <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={mod.tag === "NEW" ? { background: `${NV}20`, color: NV } : { background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>{mod.tag}</span>}
                            <span className="text-xs font-mono ml-auto" style={{ color: NV }}>{mod.tops} TOPS</span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-[11px] text-muted-foreground">
                            <span>RAM {mod.memory}</span>
                            <span>Power {mod.power}</span>
                            <span>Connector: {mod.connector}</span>
                            {mod.price ? <span className="font-semibold" style={{ color: NV }}>฿{mod.price.toLocaleString()}</span> : <span>สอบถามราคา</span>}
                          </div>
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setCompatStep(0)} className="inline-flex items-center gap-1 mt-3 text-xs text-muted-foreground hover:text-primary"><ArrowLeft size={12} /> ย้อนกลับ</button>
                  </div>
                )}

                {compatStep === 2 && selectedModule && (
                  <div>
                    <h3 className="text-base font-semibold mb-1">Carrier Board ที่เข้ากันได้</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      สำหรับ <span className="font-semibold text-foreground">{selectedModule.name}</span> ({selectedModule.connector})
                    </p>
                    {compatCarriers.length === 0 ? (
                      <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5 text-sm text-center">
                        ไม่พบ Carrier Board ที่เข้ากัน — กรุณาติดต่อทีมขาย
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {compatCarriers.map(cb => (
                          <button key={cb.id} onClick={() => { setCarrierId(cb.id); setCompatStep(3); }}
                            className="w-full p-3 rounded-lg border bg-card hover:border-primary transition text-left">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm">{cb.full}</span>
                              {cb.tag && <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={cb.tag === "NEW" ? { background: `${NV}20`, color: NV } : { background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>{cb.tag}</span>}
                              {cb.popular && <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-accent/20 text-accent-foreground border border-accent/30">⭐ ยอดนิยม</span>}
                            </div>
                            <div className="text-[11px] text-muted-foreground mt-1">{cb.io}</div>
                            <div className="text-[10px] text-muted-foreground mt-1">Form Factor: {cb.size}</div>
                          </button>
                        ))}
                      </div>
                    )}
                    <button onClick={() => setCompatStep(1)} className="inline-flex items-center gap-1 mt-3 text-xs text-muted-foreground hover:text-primary"><ArrowLeft size={12} /> ย้อนกลับ</button>
                  </div>
                )}

                {compatStep === 3 && selectedModule && selectedCarrier && (
                  <div>
                    <h3 className="text-base font-semibold mb-4"><CheckCircle2 size={18} className="inline mr-1" style={{ color: NV }} /> สรุปการเลือก</h3>
                    <div className="grid sm:grid-cols-2 gap-3 mb-4">
                      <div className="p-4 rounded-lg border bg-card">
                        <div className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: NV }}>Module</div>
                        <div className="font-bold mb-2">{selectedModule.name}</div>
                        <div className="space-y-0.5 text-xs text-muted-foreground">
                          <div>AI: {selectedModule.tops} TOPS</div>
                          <div>RAM: {selectedModule.memory}</div>
                          <div>Power: {selectedModule.power}</div>
                          <div>Connector: {selectedModule.connector}</div>
                          {selectedModule.price ? <div className="font-semibold pt-1" style={{ color: NV }}>฿{selectedModule.price.toLocaleString()} (รวม VAT)</div> : <div className="pt-1">สอบถามราคา</div>}
                        </div>
                      </div>
                      <div className="p-4 rounded-lg border bg-card">
                        <div className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: NV }}>Carrier Board</div>
                        <div className="font-bold mb-2">{selectedCarrier.full}</div>
                        <div className="space-y-0.5 text-xs text-muted-foreground">
                          <div>I/O: {selectedCarrier.io}</div>
                          <div>Form Factor: {selectedCarrier.size}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border mb-4" style={{ borderColor: `${NV}50`, background: `${NV}10` }}>
                      <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: NV }}>
                        <CheckCircle2 size={16} /> Connector เข้ากันได้ — {selectedModule.connector}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">Module และ Carrier Board ใช้ connector เดียวกัน ใช้งานร่วมกันได้ทันที</div>
                    </div>
                    <div className="p-3 rounded-lg border bg-card text-xs text-muted-foreground space-y-1 mb-4">
                      <div className="flex items-center gap-1.5 font-semibold text-foreground text-sm mb-1">
                        <Lightbulb size={14} style={{ color: NV }} /> คำแนะนำ
                      </div>
                      <div>• สต็อกไทยจัดส่ง 3-5 วันทำการ / สั่งโรงงาน 15-30 วัน</div>
                      <div>• ประกัน 1 ปีฟรี + ปีที่ 2-3 option เสริม</div>
                      <div>• หากต้องการ IPC สำเร็จรูป (Module + Carrier + เคส) แนะนำดูหมวด Embedded Systems</div>
                      <div>• ยังไม่แน่ใจ? เริ่มจาก Dev Kit ทดสอบก่อน แล้วค่อยสั่ง Module + Carrier แยก</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link to="/contact" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition" style={{ background: NV, color: NV_NAVY }}>
                        <FileText size={14} /> ขอใบเสนอราคา
                      </Link>
                      <a href="tel:020456104" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm hover:border-primary transition"><Phone size={14} /> 02-045-6104</a>
                      <LineQRButton className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition bg-[hsl(var(--line-green))]">LINE @entgroup</LineQRButton>
                      <button onClick={compatReset} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm text-muted-foreground hover:text-primary hover:border-primary transition"><RotateCcw size={14} /> เริ่มใหม่</button>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2">จ-ศ 8.30-17.30 น. | ราคาอาจเปลี่ยนแปลง กรุณาสอบถามก่อนสั่งซื้อ</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-3">เลื่อนซ้าย-ขวาเพื่อดูทั้งหมด</p>
                <div className="overflow-x-auto -mx-4 px-4">
                  <table className="w-full text-xs border-collapse min-w-[700px]">
                    <thead>
                      <tr>
                        <th className="sticky left-0 z-10 bg-background p-2 text-left text-muted-foreground border-b min-w-[140px]">Module ↓ / Board →</th>
                        {CARRIERS.map(cb => (
                          <th key={cb.id} className="p-2 text-center border-b min-w-[70px]">
                            <div className="font-semibold text-[10px]">{cb.name}</div>
                            <div className="text-[9px] text-muted-foreground">{cb.size}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MODULES.map(mod => (
                        <tr key={mod.id} className="hover:bg-muted/30">
                          <td className="sticky left-0 z-10 bg-background p-2 border-b border-border/50">
                            <div className="font-semibold text-[11px]">{mod.name}</div>
                            <div className="text-[9px] text-muted-foreground">{mod.connector}</div>
                          </td>
                          {CARRIERS.map(cb => {
                            const ok = cb.series.includes(mod.series);
                            return (
                              <td key={cb.id} className="p-2 text-center border-b border-border/50" style={ok ? { background: `${NV}08` } : {}}>
                                {ok ? <span className="font-bold" style={{ color: NV }}>✅</span> : <span className="text-muted-foreground/40">—</span>}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-3 rounded-lg border bg-card text-xs text-muted-foreground space-y-1">
                  <div className="font-semibold text-foreground text-sm mb-1">หลักการจับคู่ Connector</div>
                  <div><span className="font-semibold" style={{ color: NV }}>Orin NX / Orin Nano</span> — 260-pin SO-DIMM → Y-C18, Y-C17, Y-C11, Orin Super Carrier</div>
                  <div><span className="font-semibold" style={{ color: NV }}>AGX Orin / AGX Xavier</span> — Board-to-Board (AGX) → Y-C13, Y-C8</div>
                  <div><span className="font-semibold" style={{ color: NV }}>Thor T5000</span> — Board-to-Board (Thor) → เฉพาะ Y-C28 เท่านั้น</div>
                  <div><span className="font-semibold" style={{ color: NV }}>Xavier NX</span> — 260-pin (เหมือน Orin แต่ต้องตรวจสอบ BSP) → Y-C17, Y-C7, Y-C6</div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <B2BWorkflowBanner showShopCta />
      <JetsonCTABar message="ได้ตัวเลือกที่ใช่แล้ว? ขอใบเสนอราคาเลย" />
      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RESULT CARD
   ═══════════════════════════════════════════════════════════ */
function RecCard({ item }: { item:
  | { id: string; name: string; type: "jetson"; data: JetsonProduct }
  | { id: string; name: string; type: "gpu-server"; data: GpuServer }
  | { id: string; name: string; type: "pro-gpu"; data: ProGpu }
}) {
  let image = ""; let desc = ""; let badges: string[] = []; let link = "";
  if (item.type === "jetson") {
    image = item.data.image; desc = item.data.descriptionTH;
    if (item.data.badgeTH) badges = [item.data.badgeTH];
    link = `/nvidia-jetson/products?id=${item.id}`;
  } else if (item.type === "gpu-server") {
    image = item.data.image; desc = item.data.desc;
    badges = item.data.badges?.map(b => b.label) || [];
    link = `/nvidia-jetson/gpu-server`;
  } else {
    image = item.data.image; desc = `${proGpuFamilyLabel[item.data.family]} · ${item.data.arch}`;
    badges = item.data.badges?.map(b => b.label) || [];
    link = `/nvidia-jetson/professional-gpu`;
  }
  return (
    <div className="rounded-xl border bg-card overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all flex flex-col">
      <Link to={link} className="block">
        <div className="aspect-video bg-muted/30 flex items-center justify-center overflow-hidden p-4">
          <img src={image} alt={item.name} loading="lazy" className="max-h-full max-w-full object-contain hover:scale-105 transition-transform"
            onError={e => { (e.target as HTMLImageElement).src = "/product-placeholder.svg"; }} />
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1 mb-2">
          {badges.map(b => <span key={b} className="text-[9px] font-bold px-2 py-0.5 rounded uppercase" style={{ background: `${NV}15`, color: NV }}>{b}</span>)}
        </div>
        <Link to={link}>
          <h3 className="font-bold text-sm mb-1 hover:opacity-80 transition-colors">{item.name}</h3>
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">{desc}</p>
        <Link to="/contact" className="inline-flex w-fit items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition"
          style={{ background: `${NV}15`, color: NV }}>
          <FileText size={12} /> ขอใบเสนอราคา
        </Link>
      </div>
    </div>
  );
}
